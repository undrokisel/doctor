import React, { useEffect, useState } from 'react'
import './Layout.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { HeaderBar } from '../HeaderBar/HeaderBar';
import { Flex } from 'antd';

export const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [smallScreen, setSmallScreen] = useState(false);


    const [screenWidth, setScreenWidth] = useState(window.innerWidth)

    useEffect(() => {
        (screenWidth < 500)
            ? setSmallScreen(true)
            : setSmallScreen(false)
    }, [screenWidth, collapsed, smallScreen])

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
            name: "Врачам-партнерам",
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
            name: "Все пациенты",
            path: '/admin/users-list',
            icon: 'ri-nurse-line'
        },
        {
            name: "Все врачи",
            path: '/admin/doctors-list',
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
            name: "Назначенные приемы",
            path: '/appoinments',
            icon: 'ri-hospital-line'
        },
        {
            name: "Профиль",
            path: `/doctor/profile/${user?._id}`,
            icon: 'ri-user-line'
        },
    ]

    const menuToBeRendered = user?.isAdmin
        ? adminMenu
        : user?.isDoctor
            ? doctorMenu
            : userMenu


    // определяем ширину экрана
    const handleResize = () => {
        setScreenWidth(window.innerWidth);
    };
    
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="main">
            <div className="d-flex layout">


                {/* боковая панель */}
                {/* на малых экранах становится по горизонтали на больших по вертикали, в любом случае fixed */}
                <aside className={`sidebar fixed ${smallScreen && `sidebar-xs`}`}

                >
                    {/* лого, только на развернутой панели */}
                    {/* и статус пациента */}
                    <div className="sidebar__header d-flex justify-content-between align-items-center">
                        {!collapsed
                            && (
                                <Flex className="flex-column">
                                    <h1 className='logo'>Мой доктор</h1>
                                    <h6 className='text-white'>
                                        Статус: {
                                            user?.isAdmin
                                                ? "админ"
                                                : user?.isDoctor
                                                    ? "доктор"
                                                    : "пациент"
                                        }
                                    </h6>
                                </Flex>
                            )
                        }


                    </div>

                    {/* хедер переносится в сайд бар на малых экранах */}
                    {smallScreen &&
                        <div className='d-flex flex-row-reverse align-items-center justify-content-between'>
                            <HeaderBar
                                screenWidth={screenWidth}
                                collapsed={collapsed}
                                setCollapsed={setCollapsed}
                                user={user} />

                        </div>
                    }

                    {/* меню в ряд на малых экранах, на больших в колонку */}
                    <menu className={`menu ${smallScreen && 'menu-xs'}`}>


                        {
                            // кнопки боковой панели
                            menuToBeRendered.map((item, index) => {
                                const isActive = location.pathname === item.path
                                return (
                                    <div key={index} className={`menu-item  ${isActive && 'active-menu-item'}`}>
                                        {
                                            <Link to={item.path} className="d-flex justify-content-between">
                                                <i className={`${item.icon} ${!collapsed && 'me-3'}`}></i>
                                                <span>{!collapsed && item.name}</span>
                                            </Link>
                                        }
                                    </div>
                                )
                            })
                        }


                        {/* кнопка логаут */}
                        <div
                            onClick={() => {
                                localStorage.clear()
                                navigate('/login')
                            }}
                            className={`menu-item`}>

                            {/* logout button link */}
                            <Link to='/login' className="d-flex justify-content-between">
                                <i className={`ri-logout-box-r-line ${!collapsed && 'me-3'}`}></i>
                                <span>{!collapsed && 'Выйти'}</span>
                            </Link>
                        </div>

                    </menu>
                </aside>

                {/* правая часть страницы с хередом и контентом */}
                <main
                    style={!smallScreen ? (!collapsed ? { "paddingLeft": '250px' } : {}) : {}}
                    className={`content ${!smallScreen && (collapsed && 'ps-5')}`}
                >
                    {screenWidth > 500 &&
                        <header className="header">
                            <HeaderBar
                                collapsed={collapsed}
                                setCollapsed={setCollapsed}
                                user={user}
                                screenWidth={screenWidth}
                            />
                        </header>
                    }

                    <div className={`body ${smallScreen && (collapsed ? 'mt150' : 'mt350')}`}>
                        {children}
                    </div>
                </main>
            </div>
        </div >

    )
}
