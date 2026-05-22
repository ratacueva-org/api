# RataCueva API — Gaming Ecommerce Backend

<p align="center">
  <img src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/MongoDB-8.x-47A248?logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/License-GPL_v3-0298c3?logo=gnu&logoColor=white" alt="GPL v3">
</p>

<p align="center">
  <em>RESTful backend API for managing products, users, orders, and payments</em>
</p>

<p align="center">
  <a href="https://github.com/ratacueva-org/ratacueva-api/issues">Report Bug</a>
  ·
  <a href="https://ratacueva.netlify.app/home">Visit Website</a>
</p>

<p align="center">
  <a href="README.md">🇬🇧 English</a> · <a href="README.es.md">🇪🇸 Español</a>
</p>

---

## About RataCueva API

Core REST API for the RataCueva gaming ecommerce platform. Handles product CRUD, user authentication, order processing, payment integration, and image management via Cloudinary.

### Ecosystem

| Component | Repository | Stack |
|-----------|-----------|-------|
| Backend API (this) | [ratacueva-org/ratacueva-api](https://github.com/ratacueva-org/ratacueva-api) | Express, TypeScript, MongoDB |
| Web App | [ratacueva-org/ratacueva-web](https://github.com/ratacueva-org/ratacueva-web) | Next.js, TypeScript, TailwindCSS |

## Features

- Product CRUD with categories and inventory management
- User authentication with JWT (JSON Web Tokens)
- Order processing and payment integration
- Image upload and management with Cloudinary
- Input validation with Zod
- Security headers with Helmet
- Rate limiting for API endpoints
- Swagger API documentation

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB instance (local or Atlas)

### Setup

```bash
git clone https://github.com/ratacueva-org/ratacueva-api.git
cd ratacueva-api
npm install
```

### Environment Variables

Create a `.env` file:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run

```bash
# Development
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:3000`

## Architecture

```
├── config/           # Configuration files
├── core/             # Core application logic
├── modules/          # Feature modules
│   ├── products/     # Product management
│   ├── users/        # User management
│   ├── orders/       # Order processing
│   └── auth/         # Authentication
├── services/         # External services
├── docs/             # Documentation
└── index.ts          # Entry point
```

## API Documentation

Swagger documentation is available at `/api-docs` when the server is running.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming, commit conventions, and PR workflow.

## License

This project is licensed under the GPL v3 — see the [LICENSE](LICENSE) file for details.

## Acknowledgments

**Authors:**

- Serrano Puertos Jorge Christian
- Chavez Moreno Jose Eduardo
- Lopez Valdes Erick Ernesto
- Florentino Altamirano Misrael
