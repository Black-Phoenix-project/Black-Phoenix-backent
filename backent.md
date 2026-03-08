# Backend Handoff (for Claude)

This document defines the current backend structure and strict contracts that must not be broken.

## 1) Tech Stack
- Node.js + Express (`commonjs`)
- MongoDB + Mongoose
- Swagger: `/api-docs`
- Env-based config with `dotenv`

## 2) Required Environment Variables
- `PORT` (default `5000`)
- `MONGODB_URL`
- `JWT_SECRET`
- `BACKEND_URL` (optional for swagger server listing)
- `BACKEND_PUBLIC_URL` (optional for swagger server listing)

## 3) Entry Point and Route Mounts
File: `backent/src/index.js`

Mounted base routes:
- `/api/auth`
- `/api/swiper`
- `/api/product`
- `/api/workers`
- `/api/orders`
- `/api/likes`

## 4) Folder Structure
```txt
backent/
  src/
    config/
      database.js
      payment.js
      swagger.js
    controllers/
      authController.js
      productController.js
      swiperController.js
      workersController.js
      orderController.js
      likeController.js
    models/
      User.js
      Product.js
      Swiper.js
      Workers.js
      Order.js
      Cart.js        (currently unused/incomplete)
      likeModel.js
    routes/
      authRoutes.js
      productRoutes.js
      swiperRoutes.js
      workersRoute.js
      orderRoutes.js
      likeRoutes.js
      cartRoutes.js   (currently incomplete)
      reviewRoutes.js (currently incomplete)
      userRoutes.js   (currently incomplete)
    utils/
      generateToken.js
      sendEmail.js
      apiFeatures.js
```

## 5) API Contracts (Current)

### Auth
Base: `/api/auth`
- `POST /register`
  body:
  - `phoneNumber` required
  - `password` required
  - `fullName` optional
- `POST /login`
  body:
  - `phoneNumber` required
  - `password` required
- `GET /users/all`

Auth success response shape:
```json
{
  "message": "Login successful",
  "token": "jwt",
  "user": {
    "id": "string",
    "phoneNumber": "string|number",
    "fullName": "string|null",
    "image": "string|null"
  }
}
```

### Products
Base: `/api/product`
- `GET /` list products
- `GET /:id` product by id
- `POST /` create
- `PUT /:id` full update
- `PATCH /:id` partial update
- `DELETE /:id` delete

Important model rule:
- `image` is array of strings, min 1, max 3.

### Swiper
Base: `/api/swiper`
- `GET /`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

### Orders
Base: `/api/orders`
- `POST /` create order
- `GET /` list orders with filters (`status`, `paymentStatus`, `page`, `limit`)
- `GET /stats`
- `GET /:id`
- `GET /username/:username`
- `PUT /:id`
- `PATCH /:id/status`
- `PATCH /:id/payment`
- `DELETE /:id`

### Workers
Base: `/api/workers`
- `GET /`
- `GET /:id`
- `GET /department/:department`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

### Likes (newly completed)
Base: `/api/likes`
- `GET /?userId=<id>` list user likes
- `GET /user/:userId` list user likes
- `GET /check?userId=<id>&productId=<id>` like status
- `GET /product/:productId/count` likes count by product
- `POST /` add like
  body: `{ "userId": "...", "productId": "..." }`
- `POST /toggle` toggle like
  body: `{ "userId": "...", "productId": "..." }`
- `DELETE /` remove like
  body or query: `userId`, `productId`

Like response baseline:
```json
{
  "success": true,
  "liked": true,
  "message": "Product liked successfully",
  "data": {}
}
```

## 6) Data Models Notes

### User
- `phoneNumber` is `Number` in model.
- contains role array with admin/moderator keys.

### Product
- `name`, `description`, `price`, `image[]`
- timestamps enabled

### Order
- stores embedded product snapshot:
  - `productId`, `productName`, `price`, `quantity`, `image`
- has `status` and `paymentStatus` enums

### Like
- fields:
  - `userId` ref User
  - `productId` ref Product
- unique compound index `{ userId, productId }`

## 7) Known Incomplete Areas
- `cartRoutes.js`, `reviewRoutes.js`, `userRoutes.js` are not production-ready now.
- `Cart.js` is empty and not integrated.
- `payment.js` exists but not integrated into order payment flow.

## 8) Non-Breaking Rules for Claude
1. Do not rename existing mounted base routes currently used by admin/client.
2. Keep response shape backward-compatible for:
   - `/api/auth/login`
   - `/api/product`
   - `/api/orders`
   - `/api/swiper`
3. If adding middleware/auth, keep legacy routes working.
4. Keep product `image` array behavior (1..3).
5. Avoid destructive schema changes in `User`, `Product`, `Order`.

## 9) Safe Next Backend Tasks (if needed)
1. Implement full cart API with dedicated model and ownership checks.
2. Add JWT auth middleware and optional protected variants for likes/cart/orders.
3. Add validation middleware per route (`express-validator`).
4. Add centralized error handler middleware.
5. Add rate limit and request logging.
