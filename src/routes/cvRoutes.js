import express from 'express';
import { upload } from '../middleware/upload.js';
import { extractText } from '../textExtraction.js';
import { processWithLLM } from '../llmProcessor.js';
import { uploadToSupabase } from '../storage.js';
import { insertCVData, getAllCVData, getCVDataById } from '../database.js';

const router = express.Router();

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

// Get all processed CVs
router.get('/cv-data', async (req, res) => {
  try {
    const results = await getAllCVData();

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve CV data',
      details: error.message 
    });
  }
});

// Get specific CV data by ID
router.get('/cv-data/:id', async (req, res) => {
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
