import sql from './db.js';

// Create database table if not exists
export async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS cv_data (
        id SERIAL PRIMARY KEY,
        full_name TEXT,
        email TEXT,
        phone_number TEXT,
        education_history JSONB,
        work_experience JSONB,
        skills JSONB,
        certifications JSONB,
        file_url TEXT,
        original_filename TEXT,
        processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Database table initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Insert CV data into database
export async function insertCVData(structuredData, fileUrl, originalFilename) {
  try {
    const result = await sql`
      INSERT INTO cv_data (
        full_name, 
        email, 
        phone_number, 
        education_history, 
        work_experience, 
        skills, 
        certifications, 
        file_url, 
        original_filename
      ) VALUES (
        ${structuredData.fullName},
        ${structuredData.email},
        ${structuredData.phoneNumber},
        ${JSON.stringify(structuredData.educationHistory)},
        ${JSON.stringify(structuredData.workExperience)},
        ${JSON.stringify(structuredData.skills)},
        ${JSON.stringify(structuredData.certifications)},
        ${fileUrl},
        ${originalFilename}
      )
      RETURNING id
    `;
    return result[0];
  } catch (error) {
    console.error('Database insert error:', error);
    throw error;
  }
}

// Get all CV data
export async function getAllCVData() {
  try {
    const results = await sql`
      SELECT 
        id,
        full_name,
        email,
        phone_number,
        education_history,
        work_experience,
        skills,
        certifications,
        file_url,
        original_filename,
        processed_at
      FROM cv_data 
      ORDER BY processed_at DESC
    `;
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Get CV data by ID
export async function getCVDataById(id) {
  try {
    const results = await sql`
      SELECT * FROM cv_data WHERE id = ${id}
    `;
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}
