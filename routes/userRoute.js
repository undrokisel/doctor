const express = require('express');
const router = express.Router();
const User = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/register', async (req, res) => {
    try {
        const userExist = await User.findOne({ email: req.body.email }) ?? null
        if (userExist) {
            return res.status(200).send({ message: "user already created", success: false })
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt)
        req.body.password = hashedPass;
        const newUser = new User(req.body)

        await newUser.save();
        res.status(200).send({ message: "user created succesfully", success: true })
    } catch (error) {
        res.status(500).send({ message: "Error with creating user", success: false, error })
    }
}

)
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(200).send({ message: `user with email ${res.body.email} not found`, success: false })
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(200).send({ message: "user password is incorrect", success: false })
        } else {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            })
            return res.status(200).send({ message: "user logged in succesfully", success: true, data: token })
        }
    } catch (error) {
        res.status(500).send({ message: "Error with login user", success: false, error })
    }
})

router.post('/get-user-info-by-id', authMiddleware, async(req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })
        if (!user) {
            return res.status(200).send({ message: "User does not exist", success: false })
        } else {
            res.status(200).send({
                success: true, data: {
                    name: user.name,
                    email: user.email
                }
            })
        }
    } catch (e) {
        res.status(500).send({ message: "Error getting user info", success: false, error })
    }
})


module.exports = router

