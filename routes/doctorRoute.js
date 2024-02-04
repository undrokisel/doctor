const express = require('express');
const router = express.Router();

const Doctor = require('../models/doctorModel')

const authMiddleware = require('../middleware/authMiddleware')

router.post('/get-doctor-info-by-user-id', authMiddleware, async (req, res) => {
    console.log('asd')
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

module.exports = router

