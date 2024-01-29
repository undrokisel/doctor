import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'

export const Home = () => {

  const getData = async () => {
    try {
      const response = await axios.post('/api/user/get-user-info-by-id', {}, {
        headers: {
          Authorisation: 'Bearer ' + localStorage.getItem('token')
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData();
  }, [])

  return (
    <div>Home</div>
  )
}
