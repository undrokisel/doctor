import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Doctor = ({ doctor }) => {
    const navigate = useNavigate()
    return (
        <div
            onClick={() => navigate(`/book-appointment/${doctor._id}`)}
            className='card p-3 mt-3'>
            <h4>{doctor.firstName} {doctor.lastName}</h4>
            <hr />
            <span><b>Специализация:</b> {doctor.specialisation}</span>
            <span><b>Опыт:</b> {doctor.experience}</span>
            <span><b>Стоимость консультации:</b> {doctor.feePerConsultation} руб.</span>
            <span><b>Часы приема:</b>
                {doctor.timings[0]}-{doctor.timings[1]}
            </span>
        </div>
    )
}

