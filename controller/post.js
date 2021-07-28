const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

module.exports = {
  async getAllPost(req, res) {
    try {
      const post = await Post.find({}).populate("user", { name: 1 });
      res.status(200).send(post);
    } catch (err) {
      res.status(500).send("Internal Server Error");
    }
  },
  async getPersonalPost(req, res) {
    try {
      const post = await Post.find({user: req.user._id}).populate("user", { name: 1 });
      res.status(200).send(post);
    } catch (err) {
      res.status(500).send("Internal Server Error");
    }
  },
  async getParticularUserFollow(req, res) {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);
      const following = user.following;
      const allpost = [];
      following.forEach((element) => {
        const post = Post.find({ user: element.user });
        allpost.push(post);
      });
      const result = await Promise.all(allpost);
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
    }
  },
  async getParticularPost(req, res) {
    try {
      const post = await Post.findById(req.params.postId).populate("user", {
        name: 1,
      });
      res.status(200).send(post);
    } catch (err) {
      res.status(500).send("Internal Server Error");
    }
  },
  async getUserPost(req, res) {
    try {
      const post = await Post.find({ user: req.params.userId }).populate("user", { name: 1 });
      res.status(200).send(post);
    } catch (err) {
      res.status(500).send("Internal Server Error");
    }
  },
  async addPost(req, res) {
    try {
      const post = new Post({ ...req.body, user: req.user._id });
      newPost = await post.save();
      res.status(201).send(newPost);
    } catch {
      res.status(500).send("Internal Server Error");
    }
  },
  async deletePost(req, res) {
    try {
      const { postId } = req.params;
      await Post.findByIdAndDelete(postId);
      await Comment.findOneAndDelete(postId)
      res.status(200).json({ msg: `Post ${postId} deleted` });
    } catch (err) {
      res.status(500).send("Internal Server Error");
    }
  },
  async editPost(req, res) {
    try {
      const { postId } = req.params;
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        {
          $set: { ...req.body },
        },
        { new: true }
      );
      res.status(200).json({ post });
    } catch (err) {
      res.status(500).send("Internal Server Error");
    }
  },
  async likePost(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(req.user._id)) {
        await post.updateOne({ $push: { likes: req.user._id } });
        res.status(200).send(post);
      } else {
        await post.updateOne({ $pull: { likes: req.user._id } });
        res.status(200).send(post);
      }
    } catch (err) {
      console.log(err);
    }
  },
  async getAllLikes(req, res) {
    try {
      const post = await Post.findById(req.params.postId);
      res.status(200).send(post.likes);
    } catch (err) {
      console.log(err);
    }
  },
};
