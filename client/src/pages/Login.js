import { Form } from 'antd'
import { Input } from 'antd'
import { Button } from 'antd'
import axios from 'axios'
import React from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../redux/alertReducer'

export const Login = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading())
      const res = await axios.post('/api/user/login', values)
      dispatch(hideLoading())
      if (res.data.success) {
        toast.success(res.data.message)
        localStorage.setItem('token', res.data.data)
        toast.success("Редирект на главную страницу")
        navigate('/')
      } else {
        toast.error(res.data.message)
      }
    } catch (e) {
      dispatch(hideLoading())
      toast.error("Что-то пошло не так", e)
    }
  }


  return (
    <div className='login m-0-auto volcano-2'>

      <div className="form card">
        <h1 className="flag">Рады видеть вас снова!</h1>
        <Form
          onFinish={onFinish}
          layout='vertical'>
          <Form.Item label="Email" name='email'>
            <Input type="email" placeholder='Email' />
          </Form.Item>
          <Form.Item label="Пароль" name='password'>
            <Input type="password" placeholder='********' />
          </Form.Item>
          <div className="d-flex justify-content-center mb-2">
            <Button type="primary"
              htmlType='submit'
              className='primary-button mt-2 mb-2'>Войти</Button>
          </div>
        </Form>
        <Link className="link" to="../register">Еще нет аккаунта?</Link>
      </div>

    </div>
  )
}
