import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { Layout } from '../components/Layout'

export const Home = () => {

  const getData = async () => {
    try {
      const response = await axios.post('/api/user/get-user-info-by-id', {}, {
        headers: {
          Authorisation: 'Bearer ' + localStorage.getItem('token')
        }
      })
    } catch (error) {
    }
  }

  useEffect(() => {
    getData();
  }, [])

  return (
    <Layout>
      <h1 className='ps-4'>Homepage</h1>
    </Layout>
  )
}
