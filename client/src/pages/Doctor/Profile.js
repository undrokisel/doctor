import React, { useEffect, useState } from 'react'
import { Layout } from '../../components/Layout'
import { DoctorForm } from '../../components/DoctorForm'
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/alertReducer';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';


export const Profile = () => {
    const { user } = useSelector(state => state.user)
    // const [initialValues, setInitialValues] = useState()
    const params = useParams()
    const [doctor, setDoctor] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const getDoctorData = async () => {
        try {
            dispatch(showLoading)
            const response = await axios.post('/api/doctor/get-doctor-info-by-user-id',
                {
                    userId: params.userId,
                },
                {
                    headers: {
                        Authorisation: 'Bearer ' + localStorage.getItem('token')
                    },
                }

            )
            console.log(response)
            dispatch(hideLoading)
            if (response.data.success) {
                toast.success("данныe врача получены успешно. Статус 200")
                // setInitialValues({ ...response.data.doctor })
                setDoctor(response.data.data)
            } else {
                toast.error("Ошибка при получении данных врача. Статус 200")
            }
        }
        catch (error) {
            dispatch(hideLoading)
            toast.error("Ошибка при получении данных врача. Статус 500")
        }
    }
    useEffect(() => {
        getDoctorData()
    }, [])


    const onFinish = async (values) => {
        try {
            dispatch(showLoading)
            const response = await axios.put('/api/doctor/update-doctor-profile', {
                ...values,
                userId: user._id,
                timings: [
                    moment(values.timings[0].format("HH:mm")),
                    moment(values.timings[1].format("HH:mm")),
                ]
            }, {
                headers: {
                    Authorisation: 'Bearer ' + localStorage.getItem('token')
                }
            })
            dispatch(hideLoading)
            if (response.data.success) {
                toast.success("Данные успешно обновлены")
            } else {
                toast.error("Ошибка при обновлении данных врача. Статус 200")
            }
        } catch (error) {
            dispatch(hideLoading)
            toast.error("Ошибка при обновлении данных врача. Статус 500")
        }
    }


    return (
        <Layout >
            <h1 className="ms-3">Профиль врача</h1>
            {
                doctor && <DoctorForm
                    onFinish={onFinish}
                    // initialValues={initialValues}
                    initialValues={doctor}
                />
            }
        </Layout>
    )
}
