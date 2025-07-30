import Together from 'together-ai';
import { config, CV_EXTRACTION_PROMPT } from './config.js';


const together = new Together({ apiKey: config.togetherAI.apiKey });

// Function to process text with LLM
export async function processWithLLM(text) {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('No text provided for processing');
    }

    const response = await together.chat.completions.create({
      model: config.togetherAI.model,
      messages: [
        { role: "system", content: CV_EXTRACTION_PROMPT },
        { role: "user", content: `Please extract structured data from this CV:\n\n${text}` }
      ],
      temperature: 0.1,
      top_p: 0.9,
      max_tokens: 2000
    });

    const extractedData = response.choices[0].message.content;
    
    // Parse JSON response
    try {
      return JSON.parse(extractedData);
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = extractedData.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Failed to parse LLM response as JSON');
    }
  } catch (error) {
    console.error('LLM processing error:', error);
    throw new Error(`LLM processing failed: ${error.message}`);
  }
}
