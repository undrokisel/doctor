const express = require('express');
const router = express.Router();

const User = require('../models/userModel')
const Doctor = require('../models/doctorModel')

const authMiddleware = require('../middleware/authMiddleware')

router.get('/get-all-users', authMiddleware, async (req, res) => {
    try {
        const users = await User.find({})
        if (users) {
            res
                .status(200)
                .send({
                    message: "Users fetched successfully",
                    success: true,
                    users
                })
        } else {
            res
                .status(200)
                .send({
                    message: "users is empty",
                    success: false,
                    users: [],
                })
        }
    } catch (error) {
        res
            .status(500)
            .send({
                message: "Error with fetching all users",
                error,
                success: false,
            })
    }
})


router.get('/get-all-doctors', authMiddleware, async (req, res) => {
    try {
        const doctors = await Doctor.find({})
        if (doctors) {
            res
                .status(200)
                .send({
                    message: "Doctors fetched successfully",
                    success: true,
                    doctors
                })
        } else {
            res
                .status(200)
                .send({
                    message: "doctors is empty",
                    success: false,
                    doctors: [],
                })
        }
    } catch (error) {
        res
            .status(500)
            .send({
                message: "Error with fetching all doctors",
                error,
                success: false,
            })
    }
})

router.post('/change-status-doctor', authMiddleware, async (req, res) => {
    try {
        // находим и обновляем статус доктора
        const { doctorId, reqUserId, status } = req.body
        const doctor = await Doctor
            .findByIdAndUpdate(doctorId, { status }, { new: true })
        // находим юзера, который подал заявку стать доктором
        // и добавляем ему уведомление о результатах рассмотрения заявки
        const user = await User.findById(reqUserId)
        const unseenNotifications = user.unseenNotifications
        unseenNotifications.push({
            type: 'new-doctor-request-changed',
            message: `Your doctor account has been ${status}`,
            onClickPath: '/notifications'
        })
        user.isDoctor = status === "approved" ? true: false;
        const updatedUser = await user.save()
        
        if (updatedUser) {
            res
                .status(200)
                .send({
                    message: "Doctor approved successfully",
                    success: true,
                })
        } else {
            res
                .status(200)
                .send({
                    message: "doctor not found",
                    success: false,
                })
        }
    } catch (error) {
        res
            .status(500)
            .send({
                message: "Error with approved doctor status",
                error,
                success: false,
            })
    }
})




module.exports = router

