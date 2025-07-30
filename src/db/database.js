import sql from './db.js';

let isInitialized = false;

// Create database table if not exists
export async function initializeDatabase() {
  if (isInitialized) {
    console.log('Database already initialized, skipping...');
    return;
  }

  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create cv_data table
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
    
    isInitialized = true;
    console.log('Database tables initialized successfully');
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

// Get CV data with filtering and pagination
export async function getFilteredCVData(filters = {}, pagination = {}) {
  try {
    const { full_name, skill, date_from, date_to } = filters;
    const { page = 1, pageSize = 10 } = pagination;
    const offset = (page - 1) * pageSize;
    
    let whereConditions = [];
    let params = [];
    
    // Build WHERE conditions based on filters
    if (full_name) {
      whereConditions.push(`full_name ILIKE $${params.length + 1}`);
      params.push(`%${full_name}%`);
    }
    
    if (skill) {
      whereConditions.push(`skills::text ILIKE $${params.length + 1}`);
      params.push(`%${skill}%`);
    }
    
    if (date_from) {
      whereConditions.push(`processed_at >= $${params.length + 1}`);
      params.push(date_from);
    }
    
    if (date_to) {
      whereConditions.push(`processed_at <= $${params.length + 1}`);
      params.push(date_to);
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) FROM cv_data ${whereClause}`;
    const countResult = await sql.unsafe(countQuery, params);
    const totalCount = parseInt(countResult[0].count);
    
    // Get paginated results
    const dataQuery = `
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
      ${whereClause}
      ORDER BY processed_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    
    params.push(pageSize, offset);
    const results = await sql.unsafe(dataQuery, params);
    
    return {
      data: results,
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize)
      }
    };
  } catch (error) {
    console.error('Database filtered query error:', error);
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

// User management functions
export async function createUser(userData) {
  try {
    const result = await sql`
      INSERT INTO users (email, password, name)
      VALUES (${userData.email}, ${userData.password}, ${userData.name})
      RETURNING id, email, name, created_at
    `;
    return result[0];
  } catch (error) {
    console.error('Database user creation error:', error);
    throw error;
  }
}

export async function getUserByEmail(email) {
  try {
    const results = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Database user query error:', error);
    throw error;
  }
}

export async function getUserById(id) {
  try {
    const results = await sql`
      SELECT id, email, name, created_at FROM users WHERE id = ${id}
    `;
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Database user query error:', error);
    throw error;
  }
}
