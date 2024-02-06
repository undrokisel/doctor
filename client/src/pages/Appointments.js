import React, { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { hideLoading, showLoading } from '../redux/alertReducer'
import toast from 'react-hot-toast'
import { Flex, Table } from 'antd'
import moment from 'moment'

export const Appointments = () => {

    const [appointments, setAppointments] = useState()
    const dispatch = useDispatch()

    const getAppointmentsData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.get('/api/user/get-appointments-by-user-id',
                {
                    headers: {
                        Authorisation: 'Bearer ' + localStorage.getItem('token')
                    }
                }
            )
            dispatch(hideLoading())
            if (response.data.success) {
                setAppointments(response.data.data)
            }
        } catch (error) {
            dispatch(hideLoading())
            toast.error('Ошибка при получении текущих записей')
        }
    }

    useEffect(() => {
        getAppointmentsData()
    }, [])


    const APPROVED = 'approved';
    const DECLINED = 'declined';
    const PENDING = 'pending';

    const xsFlexProps = {
        justify: "space-between", gap: "small",
        className: "p-2",
    }

    const columns = [

        // on xsmall screens
        {
            title: 'Текущие записи',
            render: (_, record) => (
                <>
                    <Flex {...xsFlexProps}><div>Врач: </div><div>{record.doctorInfo.firstName} {record.doctorInfo.lastName}</div></Flex>
                    <Flex {...xsFlexProps}><div>Телефон: </div><div>{record.doctorInfo.phoneNumber}</div></Flex>

                    <Flex {...xsFlexProps}><div>Дата: </div><div>{moment(record.date).format("DD-MM-YYYY")}</div></Flex>
                    <Flex {...xsFlexProps}><div>Время: </div><div>{moment(record.time).format("HH:mm")}</div></Flex>
                    <Flex {...xsFlexProps}><div>Стоимость: </div> <div>{record.doctorInfo.feePerConsultation}</div></Flex>
                    <Flex {...xsFlexProps}><div>Статус: </div><div>{
                        record.status === PENDING
                            ? "Ожидает подтверждения"
                            : record.status === APPROVED
                                ? "Подтвержден"
                                : record.status === DECLINED && "Отклонен"
                    }</div></Flex>
                    <hr />

                </>
            ),
            responsive: ['xs']
        },
        {
            title: 'Врач',
            dataIndex: 'name',
            render: (_, record) => (
                <div className='card-text'>
                    {record.doctorInfo.firstName} {record.doctorInfo.lastName}
                </div>
            ),
            responsive: ['sm']
        },
        {
            title: 'Телефон',
            dataIndex: 'phoneNumber',
            render: (_, record) => (
                <div>{record.doctorInfo.phoneNumber}</div>
            ),
            responsive: ['sm']
        },

        {
            title: 'Дата',
            render: (_, record) => (
                <div>{moment(record.date).format("DD-MM-YYYY")}</div>
            ),
            responsive: ['sm']
        },
        {
            title: 'Время',
            render: (_, record) => (
                <div>{moment(record.time).format("HH:mm")}</div>
            ),
            responsive: ['sm']
        },

        {
            title: 'Статус',
            render: (_, record) => (
                record.status === PENDING
                    ? "Ожидает подтверждения"
                    : record.status === APPROVED
                        ? "Подтвержден"
                        : record.status === DECLINED && "Отклонен"
            ),
            responsive: ['sm']
        },
        {
            title: 'Стоимость консультации',
            render: (_, record) => (
                <div>{record.doctorInfo.feePerConsultation}</div>
            ),
            responsive: ['sm']
        },

    ]


    return (
        <Layout>
            <h1 className='ms-3'>Текущие записи</h1>
            <div style={{ 'overflowX': 'scroll' }}>
                <Table columns={columns} dataSource={appointments} />
            </div>
        </Layout>
    )
}
