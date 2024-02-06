const express = require('express');
const router = express.Router();

const Doctor = require('../models/doctorModel')
const User = require('../models/userModel')
const Appointments = require('../models/appointmentModel')

const authMiddleware = require('../middleware/authMiddleware')

router.post('/get-doctor-info-by-user-id', authMiddleware, async (req, res) => {
    try {


        const doctor = await Doctor.findOne({ userId: req.body.userId })

        res.status(200).send({
            message: "success fetching doctor profile",
            success: true,
            data: doctor
        })

    } catch (error) {
        res.status(500).send({
            error,
            message: "Error with fetching doctor profile",
            success: false
        })
    }
})

router.put('/update-doctor-profile', authMiddleware, async (req, res) => {
    try {

        const doctor = await Doctor.findOneAndUpdate(
            { userId: req.body.userId },
            req.body
        )

        res.status(200).send({
            message: "doctor profile updated successfully",
            success: true,
            data: doctor
        })

    } catch (error) {
        res.status(500).send({
            error,
            message: "Error with update doctor profile",
            success: false
        })
    }
})

router.post('/get-all-appointments-by-doctor-id', authMiddleware, async (req, res) => {
    try {

        // получаем объект доктора по id его (самого) пользователя
        const doctor = await Doctor.findOne({ userId: req.body.userId })

        // получаем все заявки на него
        const doctorAppointments = await Appointments.find({ doctorId: doctor._id })

        res.status(200)
            .send({
                success: true,
                message: "all appointments fetched successfully",
                data: doctorAppointments
            })
    } catch (error) {
        res.status(500)
            .send({
                success: false,
                error,
                message: "Fetching all appointments failed"
            })
    }
})



router.post('/change-status-appointment', authMiddleware, async (req, res) => {
    try {

        // получаем все заявки на доктора
        const {appointment, status} = req.body
        const updatedAppointment = await Appointments.findByIdAndUpdate(appointment._id, {
            status
        }, { new: true })

        // создаем и записываем новое уведомление в базу для пациента
        const user = await User.findOne({_id: appointment.userId})
        const unseenNotifications = user.unseenNotifications
        unseenNotifications.push({
            type: `новость по записи к доктору`,
            message: `стaтус вашей заявки изменен на ${status}`,
            onClickPath: '/appointments'
        })
        await user.save();


        res.status(200)
            .send({
                success: true,
                message: "appointment status changed successfully",
                data: updatedAppointment
            })
    } catch (error) {
        res.status(500)
            .send({
                success: false,
                error,
                message: "changing appointment status failed"
            })
    }
})


module.exports = router

