import React, { useEffect, useState } from 'react'
import { Layout } from '../../components/Layout'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { hideLoading, showLoading } from '../../redux/alertReducer'
import axios from 'axios'
import { Flex, Table } from 'antd'
import moment from 'moment/moment'

export const DoctorAppointments = () => {

    const [appointments, setAppointments] = useState(null)
    const dispatch = useDispatch()

    const getAppointments = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.post('/api/doctor/get-all-appointments-by-doctor-id',
                {},
                {
                    headers: {
                        Authorisation: 'Bearer ' + localStorage.getItem('token')
                    }
                }
            )
            dispatch(hideLoading())
            if (response.data.success) {
                setAppointments(response.data.data)
                toast.success("Данные о записях пациентов получены успешно")
            }
        } catch (error) {
            dispatch(hideLoading())
            toast.error("Ошибка при получении записей пациентов")
        }
    }

    useEffect(() => {
        getAppointments()
    }, [])


    const handleChangeAppointmentStatus = async (appointment, status) => {
        try {
            dispatch(showLoading())
            const response = await axios.post('/api/doctor/change-status-appointment', {
                appointment,
                status,
            },
                {
                    headers: {
                        Authorisation: 'Bearer ' + localStorage.getItem('token')
                    }
                })
            dispatch(hideLoading())
            if (response.data.success) {
                toast.success("Статус записи успешно изменен")
                // Находим индекс объекта, который нужно обновить в массиве
                const index = appointments.findIndex(appointment => {
                    return appointment._id === response.data.data._id
                });
                setAppointments([
                    ...appointments.slice(0, index),
                    response.data.data,
                    ...appointments.slice(index + 1),
                ])




            } else {
                toast.error("Ошибка при изменении статуса врача")
            }
        } catch (error) {
            dispatch(hideLoading())
            toast.error("Ошибка при изменении статуса записи")
        }
    }

    const APPROVED = 'approved';
    const DECLINED = 'declined';
    const PENDING = 'pending';


    const appointmentStatusAction = (record) => (
        record.status === PENDING
            ? <Flex className='flex-column'>
                <h1 onClick={() => handleChangeAppointmentStatus(record, APPROVED)} className="link">Подтвердить</h1>
                <h1 onClick={() => handleChangeAppointmentStatus(record, DECLINED)} className="link">Отклонить</h1>
            </Flex>
            : record.status === APPROVED
            &&
            <h1 onClick={() => handleChangeAppointmentStatus(record, DECLINED)} className="link">Отменить</h1>

    )

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
                    <Flex {...xsFlexProps}><div>Пациент: </div><div>{record.userInfo.name}</div></Flex>
                    <Flex {...xsFlexProps}><div>Почта: </div><div>{record.userInfo.email}</div></Flex>

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
                    <Flex {...xsFlexProps}>{appointmentStatusAction(record)}</Flex>
                    <hr />

                </>
            ),
            responsive: ['xs']
        },
        {
            title: 'Пациент',
            dataIndex: 'name',
            render: (_, record) => (
                <div className='card-text'>{record.userInfo.name}</div>
            ),
            responsive: ['sm']
        },
        {
            title: 'Почта',
            dataIndex: 'phoneNumber',
            render: (_, record) => (
                <div>{record.userInfo.email}</div>
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

        {
            title: 'Действия',
            responsive: ['sm'],
            render: (text, record) => (

                <Flex gap="middle">
                    {
                        appointmentStatusAction(record)
                    }
                </Flex>
            )

        },
    ]

    return (
        <Layout>
            <h1 className='ms-3'>Заявки пациентов на запись</h1>
            <div style={{ 'overflowX': 'scroll' }}>
                <Table columns={columns} dataSource={appointments} />
            </div>
        </Layout>

    )
}
