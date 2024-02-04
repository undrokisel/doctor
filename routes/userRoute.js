const express = require('express');
const router = express.Router();
const User = require('../models/userModel')
const Doctor = require('../models/doctorModel')
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

router.post('/get-user-info-by-id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })
        user.password = undefined;
        if (!user) {
            return res.status(200).send({ message: "User does not exist", success: false })
        } else {
            res.status(200).send({
                success: true,
                data: { ...user._doc }
            })
        }
    } catch (e) {
        res.status(500).send({ message: "Error getting user info", success: false, error })
    }
})

router.post('/apply-doctor-account', authMiddleware, async (req, res) => {
    try {

        // создаем и сохраняем в базу новый экземпляр доктора
        const newDoctor = new Doctor({ ...req.body, status: 'pending' })
        await newDoctor.save()

        // получаем из базы нашего админа, его уведомления и обновляем их сообщением о новой заявке от доктора
        const adminUser = await User.findOne({ isAdmin: true })
        const unseenNotifications = adminUser.unseenNotifications
        unseenNotifications.push({
            type: 'new-doctor-request',
            message: `${newDoctor.firstName} ${newDoctor.lastName} просит подтвердить аккаунт врача`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName
            },
            onClickPath: '/admin/doctors-list'
        })
        await User.findByIdAndUpdate(adminUser._id, { unseenNotifications })

        res.status(200).send({ message: "Doctor account applied successfully", success: true })

    } catch (error) {
        console.log(error)
        res
            .status(500)
            .send({
                message: "Error applying doctor account",
                success: false, error
            })
    }
})

router.post('/mark-all-notifications-as-seen', authMiddleware, async (req, res) => {

    try {
        const user = await User.findOne({ _id: req.body.userId })
        if (user) {
            const seenNotifications = [...user.seenNotifications, ...user.unseenNotifications]
            const unseenNotifications = []
            const updatedUser = await User.findByIdAndUpdate(user._id, {
                seenNotifications,
                unseenNotifications
            }, {
                new: true
            })
            if (updatedUser) {
                updatedUser.password = undefined
                res
                    .status(200)
                    .send({
                        message: "unseen notifications moved to seen successfylly ",
                        success: true,
                        data: updatedUser,
                    })
            }
        } else {
            res
                .status(200)
                .send({
                    message: "user does not exist",
                    success: false,
                })
        }
    } catch (error) {
        console.log(error)
        res
            .status(500)
            .send({
                message: "Error moving unseen notifications to seen ",
                success: false, error
            })
    }
})

router.post('/delete-all-notifications', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })
        if (user) {
            const seenNotifications = [];
            const unseenNotifications = [];
            const updatedUser = await User.findByIdAndUpdate(user._id, {
                seenNotifications, unseenNotifications
            }, {
                new: true
            }
            );
            if (updatedUser) {
                updatedUser.password = undefined
                res
                    .status(200)
                    .send({
                        message: "notifications deleted successfully",
                        success: true,
                        updatedUser
                    })
            }
        } else {
            res
                .status(200)
                .send({ message: "user does not exist", success: false })
        }
    } catch (error) {
        console.log(error)
        res
            .status(500)
            .send({
                message: "Error with deleting all notifications",
                success: false,
                error
            })
    }
})

router.get('/get-all-approved-doctors', authMiddleware, async (req, res) => {
    
    try {
        const approvedDoctors = await Doctor.find({ status: 'approved' })
        res.status(200).send({
            message: "getting all approved doctors successfully",
            data: approvedDoctors,
            success: true
        })
    } catch (error) {
        res.status(500).send({
            error,
            message: "Error with getting all approved doctors",
            success: false
        })
    }
})



module.exports = router

