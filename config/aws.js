import express from "express";
import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";

dotenv.config();

 
const s3Client = new S3Client({
    region: process.env.AWS_REGION,  
    credentials: {
      accessKeyId: process.env.AWS_ACCESSKEY_ID,  
      secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,   
    },
  });
  
   
  export const upload = multer({
    storage: multerS3({
      s3: s3Client,
      bucket: process.env.AWS_BUCKET_NAME,  
      acl: "public-read",  
      key: (req, file, cb) => {
        const subjectName = req.body.subject_name || "unknown_subject";    
        cb(null, `uploads/${subjectName}_${file.originalname}`);
      },
    }),
  });
  
