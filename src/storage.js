import { createClient } from '@supabase/supabase-js';
import { config } from './config.js';


const supabase = config.supabase.url && config.supabase.key 
  ? createClient(config.supabase.url, config.supabase.key) 
  : null;

if (!supabase) {
  console.warn('Supabase storage not configured - files will be saved locally');
} else {
  console.log('Supabase configured successfully');
}

//upload Supabase 
export async function uploadToSupabase(file, fileName) {
  try {
    if (!supabase) {
      console.log('Supabase not configured, saving file locally...');
      return await saveFileLocally(file, fileName);
    }

    console.log('Attempting file upload to Supabase...');
    

    const { data, error } = await supabase.storage
      .from('cv-uploads')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      // If storage upload fails, fall back to local storage
      console.log('Falling back to local storage...');
      return await saveFileLocally(file, fileName);
    }

    console.log('File uploaded successfully to Supabase');

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('cv-uploads')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Supabase storage error:', error);
    // Fall back to local file storage
    console.log('Falling back to local storage...');
    return await saveFileLocally(file, fileName);
  }
}

// Fallback function to save files locally
export async function saveFileLocally(file, fileName) {
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save file locally
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, file.buffer);
    
    console.log(`File saved locally: ${fileName}`);
    
    // Return local file URL
    return `http://localhost:${config.port}/uploads/${fileName}`;
  } catch (error) {
    console.error('Local file save error:', error);
    throw new Error(`Failed to save file: ${error.message}`);
  }
}

// Test Supabase connection
export async function testSupabaseConnection() {
  try {
    if (!supabase) {
      return { 
        status: 'Not configured', 
        message: 'Supabase client not initialized' 
      };
    }

    // Test storage connection by listing buckets
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      return { 
        status: 'Error', 
        message: 'Failed to connect to Supabase Storage',
        error: error.message 
      };
    }

    const buckets = data || [];
    const cvUploadsBucket = buckets.find(bucket => bucket.name === 'cv-uploads');

    return {
      status: 'Connected',
      message: 'Supabase Storage is accessible',
      bucketsCount: buckets.length,
      buckets: buckets.map(b => b.name),
      cvUploadsBucketExists: !!cvUploadsBucket
    };
  } catch (error) {
    return {
      status: 'Error',
      message: 'Supabase connection test failed',
      error: error.message
    };
  }
}
