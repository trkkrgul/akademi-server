import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import bistRoutes from "./routes/bist.js";
import liveRoutes from "./routes/live.js";
import articleRoutes from "./routes/articles.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";
import { s3getv3, s3Uploadv2, s3Uploadv3 } from "./lib/s3Service.js";
import {
  createArticle,
  getArticlesId,
  getTrendingArticles,
} from "./controllers/article.js";
import sharp from "sharp";
import awssdk from "aws-sdk";
import { v4 as uuid } from "uuid";
import fs from "fs";
const S3 = awssdk.S3;
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { createLive } from "./controllers/live.js";

/* CONFIGURATIONS */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

app.use(bodyParser.json({ limit: "100mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    parameterLimit: 50000,
    limit: "100mb",
    extended: true,
  })
);
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.post("/upload-image", upload.single("image"), async (req, res) => {
  const fileSize = req.headers["content-length"];
  console.log(`File size: ${fileSize}`);
  const uniquePath = `uploads/${uuid()}`;
  const imageOriginalNameSplitter = req.file.originalname.split(".");
  const deleteImage = (filepath) => {
    fs.unlink(filepath, (err) => {
      if (err) throw err;
      console.log(`${filepath} was deleted`);
    });
  };
  try {
    sharp(req.file.path)
      .resize({ width: 720 })
      .toFile(uniquePath, async (err, info) => {
        const s3 = new S3();

        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `${uniquePath}`,
          Body: fs.createReadStream(uniquePath),
          ContentType: imageOriginalNameSplitter[-1],
        };
        const results = await s3.upload(params).promise();
        console.log(results);
        deleteImage(req.file.path);
        deleteImage(uniquePath);
        res.json({ status: "success", results });
      });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post("/uploadv3", upload.array("file"), async (req, res) => {
  try {
    const results = await s3Uploadv3(req.files);
    console.log(results);
    return res.json({ status: "success", results });
  } catch (err) {
    console.log(err);
  }
});

app.get("/uploads/:id", async (req, res) => {
  try {
    const imageLink = req.params.id;
    const results = await s3getv3(imageLink);
    const filetype = imageLink.slice(
      imageLink.lastIndexOf(".") + 1,
      imageLink.length
    );
    console.log(results);
    res.writeHead(200, {
      "Content-Type": `image/${filetype}`,
      "Content-Length": results.length,
    });
    res.end(results);
  } catch (err) {
    res.status(404).json({ message: "Image doesnt exists" });
  }
});

/* ROUTES WITH FILES */
app.post("/auth/register", upload.array("picture"), register);
app.post("/posts", verifyToken, upload.array("picture"), createPost);
app.post("/articles", verifyToken, createArticle);
app.post("/create-live", createLive);

app.get("/getArticles/id", getArticlesId);

app.get("/getTrendingArticles/id", getTrendingArticles);
/* ROUTES */
app.get("/", (req, res) => {
  res.send("connection is success");
});
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/bist", bistRoutes);
app.use("/articles", articleRoutes);
app.use("/live", liveRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
