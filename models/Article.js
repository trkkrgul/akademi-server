import mongoose from "mongoose";
const articleSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },

    header: {
      type: String,
    },
    subheader: {
      type: String,
    },
    text: {
      type: String,
    },
    comments: [
      {
        userName: {
          type: String,
        },
        comment: {
          type: String,
        },
      },
    ],
    likes: [
      {
        userName: {
          type: String,
        },
        like: {
          type: Boolean,
        },
      },
    ],
    readingTime: {
      type: String,
    },
    views: {
      type: [String],
    },
    category: {
      type: [String],
    },
    tags: {
      type: [String],
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model("Article", articleSchema);

export default Article;
