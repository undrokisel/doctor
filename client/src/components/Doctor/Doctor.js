import React from 'react'
import { Link } from 'react-router-dom'

export const Doctor = ({ doctor }) => {
    return (
        <Link
            to='/'
            className='card p-3'>
            <h4>{doctor.firstName} {doctor.lastName}</h4>
            <hr />
            <span>Специализация: {doctor.specialisation}</span>
            <span>Опыт: {doctor.experience}</span>
            <span>Стоимость консультации: {doctor.feePerConsultation} руб.</span>
        </Link>
    )
}

