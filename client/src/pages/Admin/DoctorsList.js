import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Layout } from '../../components/Layout'
import { useDispatch } from 'react-redux'
import { showLoading, hideLoading } from '../../redux/alertReducer'
import { Flex, Table } from 'antd'



export const DoctorsList = () => {

    const [doctors, setDoctors] = useState([])
    const dispatch = useDispatch()

    const getAllDoctors = async () => {

        try {
            dispatch(showLoading())
            const response = await axios.get('api/admin/get-all-doctors', {
                headers: {
                    Authorisation: 'Bearer ' + localStorage.getItem('token'),
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                setDoctors(response.data.doctors)
            }
        } catch (error) {
            dispatch(hideLoading())
            toast.error('Ошибка при получении данных всех врачей')
        }
    }

    useEffect(() => {
        getAllDoctors()
    }, [])

    const APPROVED = 'approved';
    const BLOCKED = 'blocked';
    const PENDING = 'pending';

    const handleChangeDoctorStatus = async ({ _id, userId }, status) => {
        try {
            dispatch(showLoading)

            const data = {
                doctorId: _id,
                reqUserId: userId,
                status,
            }
            const response = await axios.post('api/admin/change-status-doctor', {
                ...data
            }, {
                headers: {
                    Authorisation: 'Bearer ' + localStorage.getItem('token')
                }
            })
            dispatch(hideLoading)
            if (response.data.success) {
                toast.success("Статус врача успешно изменен")
                getAllDoctors()
            } else {
                toast.error("Ошибка при изменении статуса врача")
            }
        } catch (error) {
            dispatch(hideLoading)
            toast.error("Ошибка при изменении статуса врача")
        }
    }

    const doctorStatusAction = (record) => (
        record.status === 'pending'
            ? <Flex className='flex-column'>
                <h1 onClick={() => handleChangeDoctorStatus(record, APPROVED)} className="link">Подтвердить</h1>
                <h1 onClick={() => handleChangeDoctorStatus(record, BLOCKED)} className="link">Блокировать</h1>
            </Flex>
            : record.status === 'approved'
            &&
            <h1 onClick={() => handleChangeDoctorStatus(record, BLOCKED)} className="link">Блокировать</h1>

    )

    const xsFlexProps = {
        justify: "space-between", gap: "small",
        className: "p-2",
    }

    const columns = [

        // on xsmall screens
        {
            title: 'Доктор',
            render: (_, record) => (
                <>
                    <Flex {...xsFlexProps}><h4>Имя: </h4><h4>{record.firstName} {record.lastName}</h4></Flex>
                    <Flex {...xsFlexProps}><span>Специализация: </span><span>{record.specialisation}</span></Flex>
                    <Flex {...xsFlexProps}><span>Стаж: </span><div>{record.experience}</div></Flex>
                    <Flex {...xsFlexProps}><span>Адрес: </span><div>{record.address}</div></Flex>
                    <Flex {...xsFlexProps}><div>Почта: </div><div>{record.email}</div></Flex>
                    <Flex {...xsFlexProps}><div>Телефон: </div><div>{record.phoneNumber}</div></Flex>
                    <Flex {...xsFlexProps}><div>Сайт: </div><div>{record.webSite}</div></Flex>
                    <Flex {...xsFlexProps}><div>Стоимость: </div><div>{record.feePerConsultation}</div></Flex>
                    <Flex {...xsFlexProps}><div>Статус: </div><div>{
                        record.status === "pending"
                            ? "Ожидает подтверждения"
                            : record.status === "approved" && "Подтвержден"
                    }</div></Flex>
                    <Flex {...xsFlexProps}>{doctorStatusAction(record)}</Flex>
                    <hr />

                </>
            ),
            responsive: ['xs']
        },

        {
            title: 'Имя',
            dataIndex: 'name',
            render: (_, record) => <div className='card-text'>{record.firstName} {record.lastName}</div>,
            responsive: ['sm']
        },
        {
            title: 'Специализация',
            key: 'specialisation',
            dataIndex: 'specialisation',
            responsive: ['sm']
        },
        {
            title: 'Стаж',
            key: 'experience',
            dataIndex: 'experience',
            responsive: ['sm']
        },
        {
            title: 'Адрес',
            key: 'address',
            dataIndex: 'address',
            responsive: ['sm']
        },
        {
            title: 'Почта',
            key: 'email',
            dataIndex: 'email',
            responsive: ['sm']
        },
        {
            title: 'Телефон',
            key: 'phoneNumber',
            dataIndex: 'phoneNumber',
            responsive: ['sm']
        },
        {
            title: 'Сайт',
            key: 'webSite',
            dataIndex: 'webSite',
            responsive: ['sm']
        },
        {
            title: 'Стоимость консультации',
            key: 'feePerConsultation',
            dataIndex: 'feePerConsultation',
            responsive: ['sm']
        },
        {
            title: 'Статус',
            key: 'status',
            dataIndex: 'status',
            responsive: ['sm']
        },
        {
            title: 'Действия',
            responsive: ['sm'],
            render: (text, record) => (

                <Flex gap="middle">
                    {
                        doctorStatusAction(record)
                        //         record.status === 'pending' && <h1 className="link">Подтвердить</h1>
                    }
                </Flex>
            )

        },
    ]
    return (

        <Layout>
            <h1 className='ms-3'>Все врачи сервиса</h1>
            <div style={{ 'overflowX': 'scroll' }}>
                <Table columns={columns} dataSource={doctors} />
            </div>
        </Layout>
    )

}
