import express from "express";
import Article from "../models/Article.js";
import User from "../models/User.js";

export const createArticle = async (req, res) => {
  try {
    const {
      userId,
      header,
      subheader,
      text,
      comments,
      likes,
      readingTime,
      category,
      tags,
      image,
    } = req.body;
    const newArticle = new Article({
      userId,
      header,
      subheader,
      text,
      comments,
      likes,
      readingTime,
      views: [],
      category,
      tags,
      image,
    });
    await newArticle.save();
    console.log(newArticle);
    const user = await User.findById(userId);
    console.log(user);
    const result = await Article.findOne(newArticle).lean();
    const article = {
      ...result,
    };
    res.status(201).json(article);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getArticlesById = async (req, res) => {
  try {
    const { articleId } = req.params;

    const result = await Article.findById(articleId);

    const user = await User.findById(result.userId);
    console.log(result);

    const article = {
      ...result._doc,
      firstname: user.firstName,
      lastname: user.lastName,
      userAvatar: user.picturePath,
    };
    res.status(201).json(article);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getArticlesId = async (req, res) => {
  try {
    const articles = await Article.find({}).sort({ createdAt: -1 }).lean();
    const result = articles.map((e) => ({
      _id: e._id,
      category: e.category,
    }));
    res.status(201).json(result);
    console.log(result);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getTrendingArticles = async (req, res) => {
  try {
    const articles = await Article.find({}).lean();
    const sortedResult = articles
      .map((e) => ({
        _id: e._id,
        category: e.category,
        views: views.length,
      }))
      .sort((a, b) => (a.views > b.views ? -1 : b.views > a.views ? 1 : 0));

    res.status(201).json(sortedResult);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const countviews = async (req, res) => {
  const { articleId } = req.params;
  const { ip } = req.body;
  try {
    const result = await Article.findOne({ _id: articleId }).lean();
    await Article.findByIdAndUpdate(articleId, {
      views: result.views.includes(ip)
        ? [...result.views]
        : [...result.views, ip],
    }).then((response) => res.status(201).json({ message: response }));
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const likeArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { userId, like } = req.body;
    const article = await Article.findOneAndUpdate(
      { articleId },
      { $push: { likes: { userName: userId, like } } }
    );
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json({ message: "Article liked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await Article.findOneAndDelete({ _id: articleId });
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { userId, ...rest } = req.body;
    const article = await Article.findOneAndUpdate(
      { articleId },
      { ...rest, articleId: userId },
      { new: true }
    );
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json({ message: "Article updated successfully", article });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
