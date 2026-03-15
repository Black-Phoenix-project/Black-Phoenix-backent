const Product = require('../models/Product');
const SearchLog = require('../models/Search');

const VALID_SORTS = ['default', 'price-asc', 'price-desc', 'newest'];
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

// ─── Filter builder ────────────────────────────────────────────────────────────

function buildFilter({ query, inStock, minPrice, maxPrice, useTextSearch }) {
  const conditions = [];

  if (query) {
    if (useTextSearch) {
      conditions.push({ $text: { $search: query } });
    } else {
      conditions.push({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ],
      });
    }
  }

  if (inStock === '1') {
    conditions.push({ status: { $ne: 'out_of_stock' } });
  }

  const priceFilter = {};
  if (minPrice) priceFilter.$gte = Number(minPrice);
  if (maxPrice) priceFilter.$lte = Number(maxPrice);
  if (Object.keys(priceFilter).length > 0) {
    conditions.push({ price: priceFilter });
  }

  return conditions.length > 0 ? { $and: conditions } : {};
}

// ─── Sort builder ──────────────────────────────────────────────────────────────

function buildSort(sort, isTextSearch) {
  switch (sort) {
    case 'price-asc':  return { price: 1 };
    case 'price-desc': return { price: -1 };
    case 'newest':     return { createdAt: -1 };
    default:
      return isTextSearch
        ? { score: { $meta: 'textScore' }, createdAt: -1 }
        : { createdAt: -1 };
  }
}

// ─── Log search (fire-and-forget) ─────────────────────────────────────────────

function logSearch(query, resultsCount, filters) {
  SearchLog.create({ query: query.toLowerCase(), resultsCount, filters }).catch(() => {});
}

// ─── Core search (text index) ─────────────────────────────────────────────────

async function runTextSearch({ filter, sort, projection, skip, limit }) {
  const [results, total] = await Promise.all([
    Product.find(filter, projection).sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  return { results, total };
}

// ─── Fallback search (regex) ──────────────────────────────────────────────────

async function runRegexSearch({ query, inStock, minPrice, maxPrice, sort, skip, limit }) {
  const filter = buildFilter({ query, inStock, minPrice, maxPrice, useTextSearch: false });
  const sortOption = buildSort(sort, false);

  const [results, total] = await Promise.all([
    Product.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  return { results, total };
}

// ─── Main handler ──────────────────────────────────────────────────────────────

exports.search = async (req, res) => {
  try {
    const {
      q = '',
      sort = 'default',
      inStock,
      minPrice,
      maxPrice,
      page = '1',
      limit = String(DEFAULT_LIMIT),
    } = req.query;

    const query = q.trim();
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(MAX_LIMIT, Math.max(1, parseInt(limit) || DEFAULT_LIMIT));
    const skip = (pageNum - 1) * limitNum;
    const validSort = VALID_SORTS.includes(sort) ? sort : 'default';

    const isTextSearch = Boolean(query);
    const filter = buildFilter({ query, inStock, minPrice, maxPrice, useTextSearch: isTextSearch });
    const projection = isTextSearch && validSort === 'default'
      ? { score: { $meta: 'textScore' } }
      : {};
    const sortOption = buildSort(validSort, isTextSearch && validSort === 'default');

    let results, total;

    try {
      ({ results, total } = await runTextSearch({ filter, sort: sortOption, projection, skip, limit: limitNum }));
    } catch (err) {
      // Text index not yet available — fall back to regex
      if (err.code === 27 || (err.message && err.message.includes('text index'))) {
        ({ results, total } = await runRegexSearch({
          query, inStock, minPrice, maxPrice, sort: validSort, skip, limit: limitNum,
        }));
      } else {
        throw err;
      }
    }

    if (query) {
      logSearch(query, total, {
        sort: validSort,
        inStock: inStock === '1',
        minPrice: minPrice ? Number(minPrice) : null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
      });
    }

    return res.status(200).json({
      success: true,
      query,
      results,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
