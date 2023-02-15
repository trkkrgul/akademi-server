import awssdk from "aws-sdk";
import { v4 as uuid } from "uuid";
const S3 = awssdk.S3;
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
export const s3Uploadv2 = async (files) => {
  const s3 = new S3();

  const params = files.map((file) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${uuid()}`,
      Body: file.buffer,
    };
  });
  return await Promise.all(params.map((param) => s3.upload(param).promise()));
};

export const s3Uploadv3 = async (files) => {
  const s3client = new S3Client({ region: process.env.BUCKET_REGION });

  const params = files.map((file) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${uuid()}-${file.originalname
        .replaceAll(" ", "-")
        .toLowerCase()}`,
      Body: file.buffer,
    };
  });
  const fileKeys = params.map((param) => param.Key);
  console.log(fileKeys);
  return await Promise.all(
    params.map((param) => s3client.send(new PutObjectCommand(param)))
  );
};

export const s3getv3 = async (filePath) => {
  const s3 = new S3();

  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${filePath}`,
  };
  const BufferedImage = (await s3.getObject(param).promise()).Body;

  return BufferedImage;
};
