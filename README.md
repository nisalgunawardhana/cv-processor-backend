# CV Processor Backend

This project is a backend service for processing CVs (resumes), extracting text, and leveraging LLMs for further analysis. It is built with Node.js and Express, and supports PDF uploads, authentication, and integration with LLM providers.

## Features
- Upload and process CVs in PDF format
- Extract text from uploaded documents
- LLM-based processing (e.g., summarization, information extraction)
- User authentication
- RESTful API endpoints
- Redis and database integration

---

## Setup and Installation

1. **Clone the repository:**
   ```sh
git clone https://github.com/nisalgunawardhana/cv-processor-backend.git
cd cv-processor-backend
```

2. **Install dependencies:**
   ```sh
npm install
```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values.
   ```sh
cp .env.example .env
```

4. **Start the server:**
   ```sh
npm start
```
   The server will run on the port specified in your `.env` file (default: 3000).

---

## API Endpoint Documentation


### Authentication
- `POST /api/v1/auth/login` — User login
- `POST /api/v1/auth/register` — User registration

### CV Processing
- `POST /api/v1/cv/upload` — Upload a CV (PDF)
- `GET /api/v1/cv/:id` — Get processed CV data by ID

### Health Check
- `GET /api/v1/health` — Check server status

> **Note:** For detailed request/response formats, see the route files in `src/routes/`.

---

## .env.example

Below is a sample environment configuration. Copy this to `.env` and fill in your actual values.

```
# Server
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# LLM Provider
LLM_API_KEY=your_llm_api_key
LLM_PROVIDER_URL=https://api.llmprovider.com

# JWT Secret
JWT_SECRET=your_jwt_secret
```

---

## License

MIT License
