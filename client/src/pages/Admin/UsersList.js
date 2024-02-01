import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Layout } from '../../components/Layout'
import { useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../../redux/alertReducer'
import { Table } from 'antd'

export const UsersList = () => {

    const dispatch = useDispatch()

    const [users, setUsers] = useState([])

    const getAllUsers = async () => {

        try {
            dispatch(showLoading())
            const response = await axios.get('api/admin/get-all-users', {
                headers: {
                    Authorisation: 'Bearer ' + localStorage.getItem('token'),
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                setUsers(response.data.users)
            }
        } catch (error) {
            dispatch(hideLoading())
            toast.error('Ошибка при получении данных всех пациентов')
        }
    }

    useEffect(() => {
        getAllUsers()
    }, [])

    const columns = [
        {
            title: 'Логин',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Почта',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Действия',
            dataIndex: 'actions',
            render: (text, record) => (
                <div className='d-flex'>
                    <h1 className='link'>Заблокировать</h1>
                </div>
            )
        },
    ];



    return (

        <Layout>
            <div style={{ 'overflowX': 'scroll' }}>
                <h1 className='ms-3'>Пользователи сервиса</h1>
                <Table dataSource={users} columns={columns} />
            </div>
        </Layout>
    )
}
