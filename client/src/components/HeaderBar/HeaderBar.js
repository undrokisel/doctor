import { Badge } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const HeaderBar = ({ collapsed, setCollapsed, user, screenWidth }) => {

    const [isSmall, setIsSmall] = useState(false)

    useEffect(() => {
        screenWidth < 500 && setIsSmall(true)
    }, [])

    return (
        <>
            {
                !collapsed
                    ? <i
                        onClick={() => setCollapsed(true)}
                        className={`ri-close-fill header-action-icon ms-4 ${isSmall && 'text-white'}`}
                    >
                    </i>
                    : <i
                        onClick={() => setCollapsed(false)}
                        className={`ri-menu-3-line header-action-icon ms-4 ${isSmall && 'text-white'}`}>
                    </i>
            }


            <div className="d-flex align-items-center gap-2 me-4"
            >
                <Link to="/notifications">
                    <Badge count={user?.unseenNotifications?.length}>
                        <i className={`ri-notification-line  header-action-icon ${isSmall && 'text-white'}`}></i>
                    </Badge>
                </Link>
                <Link
                    className={`${isSmall ? 'text-white' : 'link'}`}
                    to="/profile">
                    {user?.name}
                </Link>
            </div>



        </>
    )
}
