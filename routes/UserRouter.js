

const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

// GET /api/user/list
router.get("/list", async (req, res) => {
    try {
        const users = await User.find({}, "_id first_name last_name").exec();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send({ error: "Error fetching user list." });
    }
});

// GET /api/user/:id
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).exec();
        if (!user) {
            return res.status(400).send({ error: "User not found." });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(400).send({ error: "Invalid user ID format." });
    }
});

router.post("/checkLogin_name", async (req, res) => {
    try {
        const user = await User.find({login_name : req.body.login_name}).exec();
        if (user.length > 0) {
            console.log("Login name exists");
            return res.send({ status: true });
        }
        return res.send({ status: false });
    } catch (err) {
        console.log(err);
    }

});

router.post("/addUser", async (req, res) => {
    try {
        const newUser = new User({
            login_name: req.body.login_name,
            password: req.body.password,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            location: req.body.location,
            description: req.body.description,
            occupation: req.body.occupation
        });
        await newUser.save();
        return res.send({ status: true});
        // console.log(newUser);
    } catch (err) {
        res.send({ status: false });
    }
});

module.exports = router;
