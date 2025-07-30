import 'dotenv/config';

export const config = {
  port: process.env.PORT || 3000,
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY
  },
  togetherAI: {
    apiKey: process.env.TOGETHER_API_KEY,
    model: "meta-llama/Llama-3.2-3B-Instruct-Turbo"
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  }
};

export const CV_EXTRACTION_PROMPT = `You are an expert CV/Resume parser. Extract structured data from the provided CV text and return ONLY a valid JSON object with the following exact structure:

{
  "fullName": "string - The person's full name",
  "email": "string - Email address or null if not found",
  "phoneNumber": "string - Phone number or null if not found", 
  "educationHistory": [
    {
      "degree": "string - Degree/qualification name",
      "institution": "string - School/university name",
      "year": "string - Graduation year or period",
      "field": "string - Field of study"
    }
  ],
  "workExperience": [
    {
      "position": "string - Job title",
      "company": "string - Company name",
      "duration": "string - Employment period",
      "description": "string - Brief job description"
    }
  ],
  "skills": ["string - List of technical and soft skills"],
  "certifications": [
    {
      "name": "string - Certification name",
      "issuer": "string - Issuing organization",
      "year": "string - Year obtained"
    }
  ]
}

Rules:
- Return ONLY the JSON object, no additional text
- Use null for missing information
- Extract all relevant information from the CV text
- Be precise and consistent with data formatting
- If a section is empty, use an empty array []
- Ensure all strings are properly escaped for valid JSON`;
