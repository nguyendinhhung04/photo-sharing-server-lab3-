const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const path = require("path"); // Add path module to handle file paths
const router = express.Router();

// GET /photosOfUser/:id
router.get("/photosOfUser/:id", async (req, res) => {
    try {
        const photos = await Photo.find({ user_id: req.params.id }).sort({ date_time: -1 }).lean().exec();

        if (!photos.length) {
            return res
                .status(400)
                .send({ error: "No photos found or invalid user ID." });
        }

        for (let photo of photos) {
            for (let comment of photo.comments) {
                const user = await User.findById(
                    comment.user_id,
                    "_id first_name last_name"
                )
                    .lean()
                    .exec();
                comment.user = user || null;
                delete comment.user_id;
            }
        }

        res.status(200).json(photos);
    } catch (err) {
        res.status(400).send({ error: "Invalid user ID format." });
    }
});

// GET /image/:file_name
router.get("/image/:file_name", (req, res) => {
    const fileName = req.params.file_name;

    // Trả ảnh từ thư mục public/images với tên file_name
    const imagePath = path.join(__dirname, "../public/images", fileName);

    res.sendFile(imagePath, (err) => {
        if (err) {
            res.status(404).send({ error: "Image not found" });
        }
    });
});

router.post(`/:id/addComment`, async (req, res) => {
    try{
        const photo = await Photo.findById(req.params.id).exec();
        if (!photo) {
            return res.status(404).send({ error: "Photo not found" });
        }

        const newComment = {
            date_time: new Date().toISOString(),
            comment: req.body.comment,
            user_id: req.body.user_id
        };

        photo.comments.push(newComment);

        await photo.save();

        res.status(200).json(photo);
    }
    catch(error) {
        console.error("Error adding comment:", error);
        res.status(500).send({ error: "Error adding comment" });
    }

})

module.exports = router;

