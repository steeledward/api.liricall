# Liricall API

A Node.js RESTful API for managing packages, customers, sales, and charges, built with Express and MongoDB.

## Features

- CRUD operations for Packages, Customers, Sales, and Charges
- Input validation and sanitization with express-validator
- MongoDB models with Mongoose
- CORS and security best practices
- Environment variable configuration
- Ready for deployment on cloud platforms

## Project Structure

```
.
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── .env
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- npm

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/api.liricall.git
    cd api.liricall
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file based on the example below:

    ```
    PORT=3003
    MONGO_URI=mongodb://localhost:27017/liricall
    CORS_ORIGIN=http://localhost:3000
    OPENPAY_ID=your_openpay_id
    OPENPAY_PRIVATE_KEY=your_openpay_private_key
    ```

4. Start the development server:
    ```sh
    npm run dev
    ```

## Scripts

- `npm run dev` — Start server with nodemon (auto-restart on changes)
- `npm start` — Start server in production mode
- `npm run buidl` — Fun script for builders

## API Endpoints

- `GET /api/packages` — List all active packages
- `POST /api/packages` — Create a new package
- `GET /api/customers` — List all customers
- `POST /api/customers` — Create a new customer
- `GET /api/sales` — List all sales
- `POST /api/sales` — Create a new sale (auto-creates customer if needed)
- ...and more

## Deployment

- Configure your environment variables for production.
- Deploy to your preferred platform (Render, Heroku, Railway, etc.).
- Use a managed MongoDB service like MongoDB Atlas.

## Security

- Input validation with express-validator
- CORS configuration
- Sensitive data in `.env` (never commit this file)

## License

MIT

---
Happy BUIDLing!