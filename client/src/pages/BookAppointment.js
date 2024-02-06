import { Button, Col, DatePicker, Row, TimePicker } from 'antd'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoading, showLoading } from '../redux/alertReducer'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import moment from 'moment'

export const BookAppointment = () => {
    const [isAvailable, setIsAvailable] = useState(true)
    const [date, setDate] = useState()
    const [time, setTime] = useState()
    const navigate = useNavigate()

    const { user } = useSelector(state => state.user)
    const params = useParams()
    const [doctor, setDoctor] = useState(null)
    const dispatch = useDispatch()


    const getDoctorData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.get(`/api/user/get-doctor-info-by-id/${params.doctorId}`, {
                headers: {
                    Authorisation: 'Bearer ' + localStorage.getItem('token')
                }
            })
            dispatch(hideLoading())

            if (response.data.success) {
                setDoctor(response.data.data)
            }
        } catch (error) {
            dispatch(hideLoading())
            toast.error("Ошибка при получении данных доктора")
        }
    }


    const validateIsTimingsInRange = () => {
        const HoursToNumber = (str) => {
            return Number(str.split(':').join(""))
        }
        console.log(HoursToNumber)
        if (HoursToNumber(time) < HoursToNumber(doctor.timings[0])
            || (HoursToNumber(time) > HoursToNumber(doctor.timings[1]))
        ) return false
        return true
    }



    const checkAvailability = async () => {
        const isInRange = validateIsTimingsInRange()
        const isUserAndDoctorSame = user._id === doctor.userId

        if (isUserAndDoctorSame) {
            toast.error("Вы пытаетесь записаться на прием сами к себе")
            setTimeout(() => {
                navigate('/')
            }, 1000)
        }
        else if (!isInRange) {
            toast.error("В этом отрезке у врача нет приема")
        } else {
            try {
                dispatch(showLoading())
                const response = await axios.post('/api/user/check-booking-availability', {
                    doctorId: params.doctorId,
                    time: time,
                    date: date,
                }, {
                    headers: {
                        Authorisation: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                dispatch(hideLoading())
                if (response.data.success) {
                    setIsAvailable(true)
                    toast.success("Запись к доктору на это время пока свободна")
                    console.log(isAvailable)
                } else {
                    toast.error("К сожалению запись на это время занята. Попробуйте другое время")
                }
            } catch (error) {
                dispatch(hideLoading())
                toast.error("Ошибка при проверке доступности времени записи к врачу")
            }
        }
    }



    const bookNow = async () => {
        const isInRange = validateIsTimingsInRange()
        if (!isInRange) {
            toast.error("В этом отрезке у врача нет приема")
        } else {
            try {
                dispatch(showLoading())
                const response = await axios.post('/api/user/book-appointment', {
                    doctorId: params.doctorId,
                    userId: user._id,
                    time: time,
                    date: date,
                    doctorInfo: doctor,
                    userInfo: user,
                }, {
                    headers: {
                        Authorisation: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                dispatch(hideLoading())
                if (response.data.success) {
                    toast.success("Заявка на запись к врачу отправлена успешно")
                    setIsAvailable(false)
                    setTimeout(() => {
                        navigate('/appointments')
                    }, 1000)
                }
            } catch (error) {
                dispatch(hideLoading())
                toast.error("Ошибка при формировании заявки на запись к врачу")
            }
        }

    }

    useEffect(() => {
        getDoctorData()
    }, [])

    return (
        <Layout>
            <h1 className='ps-4'>Записаться к врачу</h1>
            {
                doctor && (
                    <div className='m-4'>
                        <h2>{doctor.firstName} {doctor.lastName}</h2>
                        <hr />

                        <Row gutter={40}>
                            <Col span={8} xs={24} sm={24} lg={8} gutter={100}>
                                <p>
                                    <h5>Часы приема:</h5>
                                    <span className=''>{doctor.timings[0]}-{doctor.timings[1]}</span>
                                </p>
                                <div className="d-flex flex-column pt-2 pb-4">
                                    <DatePicker
                                        format="DD-MM-YYYY"
                                        onChange={(value) => {
                                            setIsAvailable(false)
                                            setDate(moment(value.$d).format("DD-MM-YYYY"))
                                        }}
                                    />
                                    <TimePicker
                                        format="HH:mm"
                                        className='mt-3'
                                        onChange={(value) => {
                                            setIsAvailable(false)
                                            setTime(moment(value.$d).format("HH:mm"))
                                        }}
                                    />
                                    {time && date && (
                                        <Button
                                            onClick={checkAvailability}
                                            className='primary-button mt-3 text-white '>
                                            <div>Проверить</div>
                                        </Button>
                                    )
                                    }

                                    {
                                        isAvailable && time && date && (
                                            <Button
                                                className='primary-button mt-3 text-white'
                                                onClick={() => bookNow()}
                                            >
                                                Записаться
                                            </Button>
                                        )
                                    }
                                </div>
                            </Col>
                            <Col span={8} xs={24} sm={24} lg={8}>
                                <p>
                                    <b>Телефон: </b>
                                    <span>{doctor.phoneNumber}</span>
                                </p>
                                <p>
                                    <b>Стоимость консультации: </b>
                                    <span>{doctor.feePerConsultation}</span>
                                </p>
                                <p>
                                    <b>Адрес приема: </b>
                                    <span>{doctor.address}</span>
                                </p>
                            </Col>
                        </Row>

                    </div>
                )

            }
        </Layout>
    )
}
