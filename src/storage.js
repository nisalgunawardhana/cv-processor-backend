import { S3Client, PutObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from './config/config.js';
import 'dotenv/config';

// Create S3 client for Supabase
const s3Client = process.env.SUPABASE_ENDPOINT && 
                 process.env.SUPABASE_ACCESS_KEY_ID && 
                 process.env.SUPABASE_SECRET_ACCESS_KEY && 
                 process.env.SUPABASE_REGION
  ? new S3Client({
      forcePathStyle: true,
      region: process.env.SUPABASE_REGION,
      endpoint: process.env.SUPABASE_ENDPOINT,
      credentials: {
        accessKeyId: process.env.SUPABASE_ACCESS_KEY_ID,
        secretAccessKey: process.env.SUPABASE_SECRET_ACCESS_KEY,
      }
    })
  : null;

if (!s3Client) {
  console.warn('Supabase S3 storage not configured - files will be saved locally');
} else {
  console.log('Supabase S3 client configured successfully');
}

//upload Supabase 
export async function uploadToSupabase(file, fileName) {
  try {
    if (!s3Client) {
      console.log('Supabase S3 not configured, saving file locally...');
      return await saveFileLocally(file, fileName);
    }

    console.log('Attempting file upload to Supabase S3...');
    
    const bucketName = process.env.SUPABASE_BUCKET || 'cv-uploads';
    const putParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    const command = new PutObjectCommand(putParams);
    const response = await s3Client.send(command);

    if (!response) {
      console.error('Supabase S3 upload error: No response');
      // If storage upload fails, fall back to local storage
      console.log('Falling back to local storage...');
      return await saveFileLocally(file, fileName);
    }

    console.log('File uploaded successfully to Supabase S3');

    // Create a URL for the uploaded file
    // Format: https://{endpoint}/{bucket}/{filename}
    const baseEndpoint = process.env.SUPABASE_ENDPOINT.split('/storage/v1/s3')[0];
    const publicUrl = `${baseEndpoint}/storage/v1/object/public/${bucketName}/${fileName}`;
    
    return publicUrl;

    return publicUrl;
  } catch (error) {
    console.error('Supabase S3 storage error:', error);
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
    if (!s3Client) {
      return { 
        status: 'Not configured', 
        message: 'Supabase S3 client not initialized' 
      };
    }

    // Test storage connection by listing buckets
    const command = new ListBucketsCommand({});
    const { Buckets } = await s3Client.send(command);
    
    if (!Buckets) {
      return { 
        status: 'Error', 
        message: 'Failed to connect to Supabase S3 Storage',
        error: 'No buckets returned' 
      };
    }

    const buckets = Buckets || [];
    const bucketName = process.env.SUPABASE_BUCKET || 'cv-uploads';
    const cvUploadsBucket = buckets.find(bucket => bucket.Name === bucketName);

    return {
      status: 'Connected',
      message: 'Supabase S3 Storage is accessible',
      bucketsCount: buckets.length,
      buckets: buckets.map(b => b.Name),
      cvUploadsBucketExists: !!cvUploadsBucket,
      configuredBucket: bucketName
    };
  } catch (error) {
    return {
      status: 'Error',
      message: 'Supabase S3 connection test failed',
      error: error.message
    };
  }
}
