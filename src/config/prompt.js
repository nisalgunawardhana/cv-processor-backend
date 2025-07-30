// prompt for cv extraction and rules for the CV parser, its send to the LLM


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
