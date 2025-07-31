import express from 'express';
import { testSupabaseConnection } from '../storage.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'CV Processor API is running' });
});

// Test Supabase connection endpoint
router.get('/test-supabase', async (req, res) => {
  try {
    const result = await testSupabaseConnection();
    
    if (result.status === 'Error') {
      return res.status(500).json(result);
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Supabase connection test failed',
      error: error.message
    });
  }
});

export default router;
