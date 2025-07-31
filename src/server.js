import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import { initializeDatabase } from './db/database.js';
import { handleUploadError } from './middleware/upload.js';
import cvRoutes from './routes/cvRoutes.js';
import authRoutes from './routes/authRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { connectRedis } from './config/redis.js';

const app = express();


// Use CORS middleware
app.use(cors());


// app.use((req, res, next) => {
//   // Allow application/json and multipart/form-data for POST/PUT
//   if (req.method === 'POST' || req.method === 'PUT') {
//     const contentType = req.headers['content-type'] || '';
//     if (
//       !contentType.startsWith('application/json') &&
//       !contentType.startsWith('multipart/form-data')
//     ) {
//       return res.status(400).json({ error: 'Content-Type must be application/json or multipart/form-data' });
//     }
//   }
//   next();
// });
app.use(express.json());

app.use('/uploads', express.static('uploads'));

// Route group with versioning
const v1Router = express.Router();

v1Router.use('/', cvRoutes);
v1Router.use('/auth', authRoutes);
v1Router.use('/', healthRoutes);

app.use('/api/v1', v1Router);

// Error handling middleware
app.use(handleUploadError);

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    // Connect to Redis 
    await connectRedis();
    
    app.listen(config.port, () => {
      console.log(`CV Processor API running on port ${config.port}`);
      console.log(`Health check: http://localhost:${config.port}/api/v1/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
