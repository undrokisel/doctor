const express = require('express');
const router = express.Router();
const User = require('../models/userModel')
const Doctor = require('../models/doctorModel')
const Appointment = require('../models/appointmentModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/authMiddleware')
const moment = require('moment')

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
            type: 'Новая партнерская заявка',
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

router.get('/get-doctor-info-by-id/:id', authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ _id: req.params.id })

        res.status(200).send({
            message: "getting doctor info successfully",
            data: doctor,
            success: true
        })
    } catch (error) {
        res.status(500).send({
            error,
            message: "Error with getting doctor",
            success: false
        })
    }
})


router.post('/book-appointment', authMiddleware, async (req, res) => {

    try {
        // создаем экземпляр Записи
        req.body.status = 'pending';
        const date = moment(req.body.date, "DD-MM-YYYY").toISOString()

        const time = moment(req.body.time, "HH:mm").toISOString()
        const data = {
            ...req.body, date, time
        }

        const newAppointment = new Appointment(data)
        await newAppointment.save();

        // создаем уведомление для доктора
        const doctorAsUser = await User.findOne({ _id: req.body.doctorInfo.userId })
        doctorAsUser.unseenNotifications.push({
            type: "новый запрос от пациента",
            message: `Запрос на запись от пациента ${req.body.userInfo.name}`,
            onClickPath: '/doctor/appointments'
        })
        await doctorAsUser.save()

        res.status(200).send({
            success: true,
            message: `appointment to doctor ${req.body.doctorInfo.firstName} ${req.body.doctorInfo.lastName} created successfully`
        })

    } catch (error) {
        res.status(500).send({
            error,
            succes: false,
            message: "Error with booking boctor"
        })
    }
})


router.post('/check-booking-availability', authMiddleware, async (req, res) => {
    try {
        // получаем из запроса дату
        const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        // получаем из запроса время за час до начала консультации
        const fromTime = moment(req.body.time, "HH:mm")
            .subtract(59, "minutes")
            .toISOString();
        // получаем ожидаемое время конца запрашиваемой консультации 
        const toTime = moment(req.body.time, "HH:mm")
            .add(59, 'minutes')
            .toISOString();


        const doctorAppointments = await Appointment.find({
            doctorId: req.body.doctorId,
            date: { $gte: date, $lte: date },
            time: { $gte: fromTime, $lte: toTime },
            status: "approved"
        })


        if (doctorAppointments.length > 0) {
            res.status(200).send({
                success: false,
                message: `appointment is not available`
            })
        } else {
            res.status(200).send({
                success: true,
                message: `appointment is available`
            })
        }

    } catch (error) {
        res.status(500).send({
            error,
            success: false,
            message: "Error with checking boctor time availability"
        })
    }
})


router.get('/get-appointments-by-user-id', authMiddleware, async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.body.userId })
        if (appointments) {
            res
                .status(200)
                .send({
                    success: true,
                    message: "appointments fetched successfully",
                    data: appointments
                })
        } else {
            res
                .status(200)
                .send({
                    success: false,
                    message: "appointments not found"
                })
        }
    } catch (error) {
        res
            .status(500)
            .send({
                error,
                success: false,
                message: "Error with fetching appointments"
            })
    }
})

module.exports = router

