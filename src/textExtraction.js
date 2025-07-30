import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import mammoth from 'mammoth';

// Function to extract text from PDF
export async function extractTextFromPDF(buffer) {
  try {
    // Load PDF document
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(buffer),
      verbosity: 0 // Suppress console output
    });
    
    const pdf = await loadingTask.promise;
    let fullText = '';

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text items into a single string
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Function to extract text from DOCX
export async function extractTextFromDOCX(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from DOCX');
  }
}

// Main function to extract text based on file type
export async function extractText(file) {
  if (!file || !file.buffer) {
    throw new Error('Invalid file provided');
  }

  if (file.mimetype === 'application/pdf') {
    return await extractTextFromPDF(file.buffer);
  } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return await extractTextFromDOCX(file.buffer);
  } else {
    throw new Error('Unsupported file type');
  }
}
