import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const Bucket = process.env.AWS_S3_BUCKET_NAME;

const s3 = new AWS.S3();

export const uploadDataToS3 = async (file) => {
  const params = {
    Bucket,
    Key: `${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const stored = await s3.upload(params).promise();
    console.log('File uploaded successfully at', stored.Location);
    return stored;
  } catch (error) {
    console.log('Error uploading data: ', error);
  }
};

// Upload multiple files to S3
export const uploadToBucket = async (files) => {
  return Promise.all(files.map((file) => uploadDataToS3(file)));
};
