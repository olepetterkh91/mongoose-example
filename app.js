const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

const MONGOOSE_URL = process.env.CONNECTION_STRING;

app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});

mongoose.connect(MONGOOSE_URL, { useNewUrlParser: true });

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
});

app.get("/", (req, res) => {
    res.json([]);
});

app.get("/posts", (req, res) => {
    Post.find((err, posts) => {
        if (err) {
            res.status(500).json("No posts found");
        } else {
            res.status(401).json(posts);
        }
    });
});

app.post("/post", (req, res) => {
    const title = req.body.title;
    const content = req.body.content;

    try {
        Post.create({ title: title, content: content });
    } catch (error) {
        console.log(error);
    }
});

app.put("post/:id", (req, res) => {
    const _id = req.params.id;
    const title = req.body.title;
    const content = req.body.content;
    try {
        Post.updateOne(
            { _id: _id },
            { title: title, content: content },
            (err) => console.log(err)
        );
    } catch (error) {
        console.log(error);
    }
});

const Post = new mongoose.model("Post", postSchema);

const post1 = new Post({
    title: "First post",
    content: "Content of my first post",
});

//post1.save();

app.listen(process.env.port || 4000, () =>
    console.log("App running on port 4000")
);
