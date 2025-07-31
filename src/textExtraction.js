import pdfParser from 'pdf-parser';
import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import mammoth from 'mammoth';

// Function to extract text from PDF using pdf-parser
export async function extractTextFromPDF(buffer) {
  const tempPath = join(tmpdir(), `pdfparser_${Date.now()}.pdf`);
  try {
    await fs.writeFile(tempPath, buffer);
    return new Promise((resolve, reject) => {
      pdfParser.pdf2json(tempPath, function (error, pdf) {
        // Clean up temp 
        fs.unlink(tempPath).catch(() => {});
        if (error != null) {
          console.error('PDF extraction error:', error);
          reject(new Error('Failed to extract text from PDF'));
        } else {
          // Extract all text from all pages
          let text = '';
          if (pdf && pdf.pages) {
            text = pdf.pages.map(page =>
              (page.texts || []).map(t => t.text).join(' ')
            ).join('\n');
          }
          resolve(text.trim());
        }
      });
    });
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
