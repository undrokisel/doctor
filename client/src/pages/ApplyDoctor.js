import React from 'react'
import { Layout } from '../components/Layout'
import { useDispatch, useSelector } from 'react-redux'

import { hideLoading, showLoading } from '../redux/alertReducer'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { DoctorForm } from '../components/DoctorForm'
import moment from 'moment'

export const ApplyDoctor = () => {

    const dispatch = useDispatch()
    const { user } = useSelector(state => state.user)
    const navigate = useNavigate()

    const onFinish = async (values) => {
        try {
            dispatch(showLoading())
            const res = await axios.post('/api/user/apply-doctor-account', {
                ...values,
                // id юзера, с аккаунта которого сделана заявка на создание доктора
                userId: user._id, 
                timings: [
                    moment(values.timings[0].$d).format("HH:mm" ),
                    moment(values.timings[1].$d).format("HH:mm"),
                ]
            }, {
                headers: {
                    Authorisation: 'Bearer ' + localStorage.getItem('token')
                },
            })
            dispatch(hideLoading())
            if (res.data.success) {
                dispatch(hideLoading())
                toast.success(res.data.message)
                navigate('/')
            } else {
                toast.error(res.data.message)
            }
        } catch (e) {
            dispatch(hideLoading())
            toast.error("Что-то пошло не так", e)
        }
    }


    return (
        <Layout>
            <div className="ps-3">

                <h1 className='page-title mb-3'>Для врачей: cтать партнером</h1>

                <DoctorForm
                    onFinish={onFinish}
                    initialValues={null}
                />
            </div>
        </Layout>
    )
}
