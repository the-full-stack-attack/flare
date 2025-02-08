import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

// These credentials will not be in EC2 .env file
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, NODE_ENV } =
  process.env;

let s3Client: S3Client = new S3Client({ region: AWS_REGION });

// Because I setup an IAM Role for the EC2 Instance, the deployed site does not need the credentials
if (NODE_ENV === 'development') {
  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    console.error('AWS Credentials not provided from .env');
  } else {
    // Use explicit credentials in development
    s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });
  }
}
export default s3Client;
