import { Button, Col, Form, Input, Row, TimePicker } from 'antd';
import React from 'react'
import moment from 'moment'

export const DoctorForm = ({ onFinish, initialValues }) => {

    return (
        <Form
            className='p-2'
            onFinish={onFinish}
            initialValues={{
                ...initialValues,
                ...(initialValues && {
                        timings: [
                            moment(initialValues?.timings[0], "HH:mm"),
                            moment(initialValues?.timings[1], "HH:mm"),
                        ]
                    }
                )
            }}
            layout='vertical' >
            <hr />
            <h1 className='card-title mb-3'>Личные данные</h1>
            <Row gutter={20} >
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item required label="Имя"
                        name="firstName"
                        rules={[{ required: true }]}>
                        <Input type="text" placeholder={initialValues?.firstName ?? 'Имя'} />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item required label="Фамилия"
                        name="lastName"
                        rules={[{ required: true }]}>
                        <Input type="text" placeholder={initialValues?.lastName ?? 'Фамилия'} />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item required label="Почта"
                        name="email" rules={[{ required: true }]}>
                        <Input type="email" placeholder={initialValues?.email ?? 'abc@ya.ru'} />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item required label="Номер телефона"
                        name="phoneNumber" rules={[{ required: true }]}>
                        <Input type="phone" placeholder={initialValues?.phoneNumber ?? '+7999999999'} />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item required label="Web сайт"
                        name='webSite' rules={[{ required: true }]}>
                        <Input type="text" placeholder={initialValues?.webSite ?? 'www.leningrad.ru'} />
                    </Form.Item>
                </Col>
            </Row>
            <hr />
            <h1 className='card-title mb-3'>Профессиональные данные</h1>

            <Row gutter={20}>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item required label="Адрес приема"
                        name='address' rules={[{ required: true }]}>
                        <Input type="text" placeholder={initialValues?.address ?? 'город, улица, здание, номер помещения'} />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item required label="Специализация"
                        name='specialisation' rules={[{ required: true }]}>
                        <Input type="text" placeholder={initialValues?.specialisation ?? 'Терапевт'} />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item required label="Стаж медицинской деятельности (в годах)"
                        name='experience'
                        rules={[{ required: true }]}>
                        <Input type="number" placeholder={initialValues?.experience ?? 1} />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item required label="Стоимость консультации (руб)"
                        name='feePerConsultation'
                        rules={[{ required: true }]}>
                        <Input type="number" placeholder={initialValues?.feePerConsultation ?? 1000} />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item required label="Часы работы"
                        name='timings'
                        rules={[{ required: true }]}>
                        <TimePicker.RangePicker format='HH:mm' />
                    </Form.Item>
                </Col>
            </Row>

            <div className="d-flex justify-content-end">
                <Button
                    htmlType='submit'
                    className='primary-button text-light'>ПОДТВЕРДИТЬ</Button>
            </div>

        </Form >

    )
}
