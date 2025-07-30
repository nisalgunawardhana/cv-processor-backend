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

