import React, { useState } from 'react'
import './Layout.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

export const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate();
    const location = useLocation();
    const userMenu = [
        {
            name: "Главная",
            path: '/',
            icon: 'ri-home-4-line'
        },
        {
            name: "Активные записи",
            path: '/appointments',
            icon: 'ri-nurse-line'
        },
        {
            name: "Выбрать доктора",
            path: '/apply-doctor',
            icon: 'ri-hospital-line'
        },
        {
            name: "Профиль",
            path: '/profile',
            icon: 'ri-user-line'
        },
    ]


    const adminMenu = [
        {
            name: "Главная",
            path: '/',
            icon: 'ri-home-4-line'
        },
        {
            name: "Пациенты",
            path: '/appointments',
            icon: 'ri-nurse-line'
        },
        {
            name: "Врачи",
            path: '/apply-doctor',
            icon: 'ri-hospital-line'
        },
        {
            name: "Профиль",
            path: '/profile',
            icon: 'ri-user-line'
        },
    ]


    const doctorMenu = [
        {
            name: "Главная",
            path: '/',
            icon: 'ri-home-4-line'
        },
        {
            name: "Мои часы работы",
            path: '/',
            icon: 'ri-nurse-line'
        },
        {
            name: "Подтвержденные записи",
            path: '/apply-doctor',
            icon: 'ri-hospital-line'
        },
        {
            name: "Неподтвержденные записи",
            path: '/apply-doctor',
            icon: 'ri-hospital-line'
        },
        {
            name: "Профиль",
            path: '/profile',
            icon: 'ri-user-line'
        },
    ]

    const menuToBeRendered = user?.isAdmin
        ? adminMenu
        : user?.isDoctor
            ? doctorMenu
            : userMenu

    return (
        <div className="main">
            <div className="d-flex layout">
                <aside className='sidebar'>
                    <div className="sidebar__header">
                        {!collapsed && <h1 className='logo'>Мой доктор</h1>}
                    </div>
                    <menu className="menu">
                        {
                            menuToBeRendered.map((item, index) => {
                                const isActive = location.pathname === item.path
                                return (
                                    <div key={index} className={`menu-item  ${isActive && 'active-menu-item'}`}>
                                        <i className={item.icon}></i>
                                        {
                                            !collapsed && <Link to={item.path} className="">{item.name}</Link>
                                        }
                                    </div>
                                )
                            })
                        }
                        <div
                            onClick={() => { 
                                localStorage.clear() 
                                navigate('/login')
                            }}
                            className={`menu-item`}>
                            <i className='ri-logout-box-r-line'></i>
                            {
                                !collapsed && <Link to='/login' >Выйти</Link>
                            }
                        </div>
                    </menu>
                </aside>


                <main className='content'>
                    <header className="header">
                        {
                            !collapsed
                                ? <i onClick={() => setCollapsed(true)} className='ri-close-fill header-action-icon'></i>
                                : <i onClick={() => setCollapsed(false)} className="ri-menu-3-line header-action-icon"></i>
                        }

                        <div className="d-flex align-items-center gap-2 m-4">
                            <i className="ri-notification-line  header-action-icon"></i>
                            <Link
                                className='link'
                                to="/profile">
                                {user?.name}
                            </Link>
                        </div>


                    </header>

                    <div className="body">
                        {children}
                    </div>
                </main>
            </div>
        </div>

    )
}
