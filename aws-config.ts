import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// These credetials will not be in EC2 .env file
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, NODE_ENV, } = process.env

let s3: AWS.S3;

// Because I setup an IAM Role for the EC2 Instance, the deployed site does not need the credentials
if (NODE_ENV === 'production') {
  // Use IAM Role in production
  s3 = new AWS.S3();
} else {
  // Use explicit credentials in development
  s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION,
  });
}

export default s3;