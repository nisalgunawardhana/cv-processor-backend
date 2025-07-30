import express from 'express';
import { upload } from '../middleware/upload.js';
import { authenticateToken } from '../middleware/auth.js';
import { extractText } from '../textExtraction.js';
import { processWithLLM } from '../llmProcessor.js';
import { uploadToSupabase } from '../storage.js';
import { insertCVData, getFilteredCVData, getCVDataById } from '../db/database.js';

const router = express.Router();

// POST /upload-cv - Public endpoint (no authentication)
router.post('/upload-cv', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.originalname}`;
    const extractedText = await extractText(file);

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: 'No text could be extracted from the file' });
    }

    const fileUrl = await uploadToSupabase(file, fileName);
    const structuredData = await processWithLLM(extractedText);
    const result = await insertCVData(structuredData, fileUrl, file.originalname);

    res.status(200).json({
      success: true,
      message: 'CV processed successfully',
      data: {
        id: result.id,
        extractedData: structuredData,
        fileUrl: fileUrl,
        originalFilename: file.originalname
      }
    });

  } catch (error) {
    console.error('CV processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process CV', 
      details: error.message 
    });
  }
});

// GET /resumes - Returns a list of all structured resume records
// Supports query parameters: full_name, skill, date_from, date_to, page, pageSize
// Requires authentication (JWT-based)
router.get('/resumes', authenticateToken, async (req, res) => {
  try {
    const { full_name, skill, date_from, date_to, page, pageSize } = req.query;
    
    const filters = {};
    if (full_name) filters.full_name = full_name;
    if (skill) filters.skill = skill;
    if (date_from) filters.date_from = date_from;
    if (date_to) filters.date_to = date_to;
    
    const pagination = {};
    if (page) pagination.page = parseInt(page);
    if (pageSize) pagination.pageSize = parseInt(pageSize);
    
    const result = await getFilteredCVData(filters, pagination);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve resume data',
      details: error.message 
    });
  }
});

// GET /resumes/:id - Returns the structured data for a specific resume by ID
// Includes the public URL of the original CV
// Requires authentication (JWT-based)
router.get('/resumes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getCVDataById(id);

    if (!result) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve resume data',
      details: error.message 
    });
  }
});

// Legacy endpoints for backward compatibility
router.get('/cv-data', authenticateToken, async (req, res) => {
  try {
    const result = await getFilteredCVData({}, {});

    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve CV data',
      details: error.message 
    });
  }
});

router.get('/cv-data/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getCVDataById(id);

    if (!result) {
      return res.status(404).json({ error: 'CV data not found' });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve CV data',
      details: error.message 
    });
  }
});

export default router;
