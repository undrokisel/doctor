import { Form } from 'antd'
import { Input } from 'antd'
import { Button } from 'antd'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import toast from 'react-hot-toast'
import { hideLoading, showLoading } from '../redux/alertReducer'
import { useDispatch } from 'react-redux'

export const Register = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading())
      const res = await axios.post('/api/user/register', values)
      dispatch(hideLoading())
      if (res.data.success) {
        toast.success(res.data.message)
        toast.success("Редирект на страницу входа")
        navigate('/login')
      } else {
        toast.error(res.data.message)
      }
    } catch (e) {
      dispatch(hideLoading())

      toast.error("Что-то пошло не так", e)
    }
  }

  return (
    <div className='register m-0-auto volcano-2'>
      <div className="form card">
        <h1 className="flag">Добро пожаловать</h1>

        <Form
          onFinish={onFinish}
          layout='vertical'>

          <Form.Item label="Имя" name='name'>
            <Input type="text" placeholder='Имя' />
          </Form.Item>
          <Form.Item label="Email" name='email'>
            <Input type="email" placeholder='Email' />
          </Form.Item>
          <Form.Item label="Пароль" name='password'>
            <Input type="password" placeholder='********' />
          </Form.Item>

          <Button type="primary"
            htmlType='submit'
            className='primary-button mt-3 mb-2'>Зарегистрироваться</Button>
        </Form>
        <Link className="link" to="../login">Уже есть аккаунт?</Link>

      </div>
    </div>
  )
}
