import React from 'react'
import { Layout } from '../components/Layout'
import { Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setUser } from '../redux/userReducer';
import { hideLoading, showLoading } from '../redux/alertReducer';
import toast from 'react-hot-toast';
import axios from 'axios';

export const Notifications = () => {

    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const markNotesToSeen = async () => {

        try {
            dispatch(showLoading())
            const response = await axios.post('/api/user/mark-all-notifications-as-seen', {
                userId: user._id
            }, {
                headers: {
                    Authorisation: 'Bearer ' + localStorage.getItem('token')
                },
            })
            dispatch(hideLoading())
            if (response.data.success) {
                dispatch(setUser(response.data.data));
                toast.success("Уведомления отмечены прочитанными")
            } else {
                toast.success("Ошибка при отметке уведомлений прочитанными")
            }
        } catch (error) {
            dispatch(hideLoading())
            toast.error("Ошибка при отметке уведомлений прочитанными")
        }
    }

    const deleteAllNotes = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post('api/user/delete-all-notifications', { userId: user._id }, {
                headers: {
                    Authorisation: 'Bearer ' + localStorage.getItem('token')
                }
            })
            dispatch(hideLoading());
            if (response.data.success) {
                dispatch(setUser({
                    ...user,
                    seenNotifications: [],
                }))
                toast.success("Все прочитанные уведомления успешно удалены")
            } else {
                toast.error("Ошибка при удалении прочитанных уведомлений 1")
            }
        } catch (error) {
            toast.error("Ошибка при удалении прочитанных уведомлений 2")
        }
    }


    const expandNotes = (type, notes = []) => {
        return notes.length
            ? (<div className="">
                <div onClick={type === "seen" ? deleteAllNotes : markNotesToSeen}
                    className="link text-end p-2"
                >{type === "seen" ? "Удалить все" : "Отметить все прочитанными"}
                </div>
                {
                    notes.map((note, index) => (
                        <div onClick={() => navigate(note.onClickPath)}
                            key={index}
                            className='card m-2 p-2'>
                            <div className='card-text text-danger'>{note.type}</div>
                            <Link className="link"
                                to={note.onClickPath}>{note.message}</Link>
                        </div>
                    ))
                }
            </div>
            )
            : ('нет уведомлений')
    }

    const items = [
        {
            key: '1',
            label: 'непрочитанные',
            children: expandNotes("unseen", user?.unseenNotifications),
        },
        {
            key: '2',
            label: 'прочитанные',
            children: expandNotes("seen", user?.seenNotifications),
        },
    ];


    return (
        <Layout>
            <h1 className='ps-3'>Уведомления</h1>
            <Tabs className='ps-3' defaultActiveKey="1" items={items} />
        </Layout>
    )
}

