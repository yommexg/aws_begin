require("dotenv").config();

const express = require("express");
const multer = require("multer");
const { s3UploadV2, s3UploadV3 } = require("./s3service");
const uuid = require("uuid").v4;

const app = express();

// const upload = multer({ dest: "uploads/" });

// single file upload
// app.post("/upload", upload.single("file"), (req, res) => {
//   res.json({ status: "success" });
// });

//multiple file uploads
// app.post("/upload", upload.array("file", 2), (req, res) => {
//   res.json({ status: "success" });
// });

// const multiUpload = upload.fields([
//   { name: "avatar", maxCount: 1 },
//   { name: "resume", maxCount: 1 },
// ]);

// app.post("/upload", multiUpload, (req, res) => {
//   console.log(req.files);
//   res.json({ status: "success" });
// });

//custom file name

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const { originalname } = file;
//     cb(null, `${uuid()} - ${originalname}`);
//   },
// });

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file?.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100000000,
    files: 2,
  },
});

app.post("/upload", upload.array("file"), async (req, res) => {
  const file = req.files[0];

  try {
    // const results = await s3UploadV2(req.files);
    const results = await s3UploadV3(req.files);

    console.log(results);
    // const locations = results.map((result) => result.Location);
    // console.log(locations);
    return res.json({ status: "success", results });
  } catch (error) {
    console.log(error);
  }
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.json({
        message: "file is too large",
      });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.json({
        message: "file limit reached",
      });
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.json({
        message: "file must be an image",
      });
    }
  }
});

app.listen(4000, () => console.log("listening on port 4000"));
