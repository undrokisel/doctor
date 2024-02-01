import React from 'react'
import { Layout } from '../components/Layout'
import { Button, Col, Form, Input, Row, TimePicker } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { hideLoading, showLoading } from '../redux/alertReducer'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

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
                userId: user._id
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

                <Form
                    onFinish={onFinish}
                    layout='vertical'>
                    <hr />
                    <h1 className='card-title mb-3'>Личные данные</h1>
                    <Row gutter={20} >
                        <Col span={8} xs={24} sm={24} lg={8}>
                            <Form.Item required label="Имя"
                                name="firstName"
                                rules={[{ required: true }]}>
                                <Input type="text" placeholder='Имя' />
                            </Form.Item>
                        </Col>
                        <Col span={8} xs={24} sm={24} lg={8}>
                            <Form.Item required label="Фамилия"
                                name="lastName"
                                rules={[{ required: true }]}>
                                <Input type="text" placeholder='Фамилия' />
                            </Form.Item>
                        </Col>
                        <Col span={8} xs={24} sm={24} lg={8}>
                            <Form.Item required label="Почта"
                                name="email" rules={[{ required: true }]}>
                                <Input type="email" placeholder='email' />
                            </Form.Item>
                        </Col>
                        <Col span={8} xs={24} sm={24} lg={8}>
                            <Form.Item required label="Номер телефона"
                                name="phoneNumber" rules={[{ required: true }]}>
                                <Input type="phone" placeholder='+7999999999' />
                            </Form.Item>
                        </Col>
                        <Col span={8} xs={24} sm={24} lg={8}>
                            <Form.Item required label="Web сайт"
                                name='webSite' rules={[{ required: true }]}>
                                <Input type="text" placeholder='www.site.health' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <hr />
                    <h1 className='card-title mb-3'>Профессиональные данные</h1>

                    <Row gutter={20}>
                        <Col span={8} xs={24} sm={24} lg={8}>
                            <Form.Item required label="Адрес приема"
                                name='address' rules={[{ required: true }]}>
                                <Input type="text" placeholder='субъект, населенный пункт, улица, дом, номер помещения' />
                            </Form.Item>
                        </Col>
                        <Col span={8} xs={24} sm={24} lg={8}>
                            <Form.Item required label="Специализация"
                                name='specialisation' rules={[{ required: true }]}>
                                <Input type="text" placeholder='терапевт' />
                            </Form.Item>
                        </Col>
                        <Col span={8} xs={24} sm={24} lg={8}>
                            <Form.Item required label="Стаж медицинской деятельности (в годах)"
                                name='experience'
                                rules={[{ required: true }]}>
                                <Input type="number" placeholder='2' />
                            </Form.Item>
                        </Col>
                        <Col span={8} xs={24} sm={24} lg={8}>
                            <Form.Item required label="Стоимость консультации (руб)"
                                name='feePerConsultation'
                                rules={[{ required: true }]}>
                                <Input type="number" placeholder='1000' />
                            </Form.Item>
                        </Col>
                        <Col span={8} xs={24} sm={24} lg={8}>
                            <Form.Item required label="Часы работы"
                                name='timings'
                                rules={[{ required: true }]}>
                                <TimePicker.RangePicker />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end">
                        <Button
                            htmlType='submit'
                            className='primary-button text-light'>ПОДТВЕРДИТЬ</Button>
                    </div>

                </Form>
            </div>
        </Layout>
    )
}
