import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import { initializeDatabase } from './database.js';
import { handleUploadError } from './middleware/upload.js';
import cvRoutes from './routes/cvRoutes.js';
import authRoutes from './routes/authRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

const app = express();


app.use(cors());
app.use(express.json());


app.use('/uploads', express.static('uploads'));

// Routes
app.use('/', cvRoutes);
app.use('/', authRoutes);
app.use('/', healthRoutes);

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
    
    app.listen(config.port, () => {
      console.log(`CV Processor API running on port ${config.port}`);
      console.log(`Health check: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
