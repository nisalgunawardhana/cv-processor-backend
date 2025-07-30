# CV Processor Backend

<div align="center">
  
![CV Processor](https://img.shields.io/badge/CV%20Processor-v1.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green)
![Express](https://img.shields.io/badge/Express-v4.18-lightgrey)
![License](https://img.shields.io/badge/License-MIT-yellow)

</div>

A powerful backend service for processing, analyzing, and storing CV/resume data using AI and modern cloud technologies. This system extracts text from PDF resumes, processes the content with advanced Language Learning Models (LLMs), and provides a RESTful API for integrating with frontend applications.

## 🚀 Features

- **CV Processing Pipeline**
  - Upload and process CVs in PDF format
  - Extract text from documents with high accuracy
  - LLM-powered analysis for information extraction
  - Structured data output for easy integration

- **Advanced Search & Filtering**
  - Filter candidates by skills, experience, and more
  - Full-text search capabilities
  - Pagination support for large datasets

- **Security & Performance**
  - JWT-based authentication system
  - Redis caching for optimized performance
  - Supabase integration for file storage
  - PostgreSQL database for data persistence

- **Developer-Friendly**
  - RESTful API design
  - Comprehensive error handling
  - Extensive logging
  - Modular architecture

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Architecture](#-architecture)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🏁 Quick Start

```bash
# Clone the repository
git clone https://github.com/nisalgunawardhana/cv-processor-backend.git

# Navigate to project directory
cd cv-processor-backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start the server
npm start
```

---

## 🔧 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Redis server
- LLM API access (supported: OpenAI, model-together)
- Supabase account (for file storage)

---

## 📥 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/nisalgunawardhana/cv-processor-backend.git
   cd cv-processor-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Initialize the database**

   ```bash
   # Run database setup script (if provided)
   npm run db:setup
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   For production:
   ```bash
   npm start
   ```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory based on the `.env.example` template:

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

# Supabase (for file storage)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_BUCKET=your_bucket_name
```

---

## 📚 API Documentation

### Base URL

All API endpoints are prefixed with: `/api/v1`

### Authentication Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Login and get JWT token | No |
| `GET`  | `/auth/profile` | Get user profile | Yes (JWT) |

**Example Request: User Login**
```json
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "123",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2025-07-01T12:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
  }
}
```

### CV Processing Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `POST` | `/cv/upload-cv` | Upload and process a CV | No |
| `GET`  | `/cv/resumes` | Get filtered resume data | Yes (JWT) |
| `GET`  | `/cv/resumes/:id` | Get specific resume by ID | Yes (JWT) |

**Example Request: Upload CV**
```
POST /api/v1/cv/upload-cv
Content-Type: multipart/form-data

Form Data:
- cv: [PDF file]
```

**Example Response:**
```json
{
  "success": true,
  "message": "CV processed successfully",
  "data": {
    "id": "resume_123",
    "extractedData": {
      "full_name": "John Smith",
      "email": "john@example.com",
      "skills": ["JavaScript", "Node.js", "Express"],
      "experience": [
        {
          "title": "Software Engineer",
          "company": "Tech Co",
          "dates": "2020-2023"
        }
      ],
      "education": [
        {
          "degree": "B.Sc Computer Science",
          "institution": "University of Technology",
          "year": "2020"
        }
      ]
    },
    "fileUrl": "https://storage.example.com/resumes/john-smith-cv.pdf",
    "originalFilename": "john-smith-cv.pdf"
  }
}
```

### Health Check Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET`  | `/health` | Check API status | No |
| `GET`  | `/health/test-supabase` | Test Supabase connection | No |

**Example Response:**
```json
{
  "status": "OK",
  "message": "CV Processor API is running"
}
```

---

## 🏗️ Architecture

The CV Processor Backend is built with a modular architecture:

```
cv-processor-backend/
├── src/
│   ├── config/             # Configuration files
│   ├── db/                 # Database connection and models
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   ├── llmProcessor.js     # LLM integration for CV analysis
│   ├── model-together.js   # Model-Together LLM provider integration
│   ├── server.js           # Express application setup
│   ├── storage.js          # Supabase storage integration
│   └── textExtraction.js   # PDF text extraction utilities
├── uploads/                # Temporary storage for uploaded files
├── .env.example            # Environment variables template
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

### Key Components

1. **Express Server**: Handles HTTP requests, routing, and middleware
2. **Authentication**: JWT-based authentication system
3. **Database Layer**: PostgreSQL database integration
4. **Redis Cache**: Performance optimization for frequent queries
5. **LLM Processing**: Integration with AI models for CV analysis
6. **File Storage**: Supabase integration for storing uploaded files

---

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  <p>Developed by Nisal Gunawardhana</p>
</div>
