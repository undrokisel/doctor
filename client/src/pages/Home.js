import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Layout } from '../components/Layout'
import { useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../redux/alertReducer'
import toast from 'react-hot-toast'
import { Doctor } from '../components/Doctor/Doctor'
import { Col, Row } from 'antd'

export const Home = () => {
  const dispatch = useDispatch()
  const [approvedDoctors, setApprovedDoctors] = useState(null)

  const getApprovedDoctors = async () => {
    try {
      dispatch(showLoading())
      const response = await axios.get('/api/user/get-all-approved-doctors', {
        headers: {
          Authorisation: 'Bearer ' + localStorage.getItem('token')
        }
      })
      dispatch(hideLoading())
      if (response.data.success) {
        setApprovedDoctors(response.data.data)
      }
    } catch (error) {
      dispatch(hideLoading())
      toast.error("Ошибка при получении данных подтвержденных врачей")
    }
  }

  useEffect(() => {
    getApprovedDoctors();
  }, [])

  return (
    <Layout>
      <h1 className='ps-4'>Наши врачи</h1>
      <Row gutter={20}>
        {
          approvedDoctors && approvedDoctors.map((doctor, index) => (
            <Col key={index} span={8} xs={24} sm={24} lg={8}>
              <Doctor doctor={doctor} />
            </Col>
          ))
        }
      </Row>
    </Layout>
  )
}
