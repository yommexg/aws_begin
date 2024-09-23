const { S3 } = require("aws-sdk");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const uuid = require("uuid").v4;

// single file version2
// exports.s3UploadV2 = async (file) => {
//   const s3 = new S3();

//   const param = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: `uploads/${uuid()}-${file?.originalname}`,
//     Body: file?.buffer,
//   };

//   return s3.upload(param).promise();
// };

// multiple files version2
exports.s3UploadV2 = async (files) => {
  const s3 = new S3();

  const params = files.map((file) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${uuid()}-${file?.originalname}`,
      Body: file?.buffer,
    };
  });

  return Promise.all(params.map((param) => s3.upload(param).promise()));
};

// single file version3
exports.s3UploadV3 = async (file) => {
  const s3Client = new S3Client();

  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${uuid()}-${file?.originalname}`,
    Body: file?.buffer,
  };

  return s3Client.send(new PutObjectCommand(param));
};

//multiple file version3
exports.s3UploadV3 = async (files) => {
  const s3Client = new S3Client();

  const params = files.map((file) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${uuid()}-${file?.originalname}`,
      Body: file?.buffer,
    };
  });

  return Promise.all(
    params.map((param) => s3Client.send(new PutObjectCommand(param)))
  );
};

//https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteAccessPermissionsReqd.html
