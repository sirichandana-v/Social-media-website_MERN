const Post = require('../models/post');




exports.createPost = async(req, res) => {
    try {
        const newPostData = {
            caption: req.body.caption,
            image: {
                public_id: "req.file.public_id",
                url: "req.file.url"
            },
            owner: req.user._id
        }

        const newPost = new Post(newPostData);
        res.status(201).json({
            success: true,
            data: newPost
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
}