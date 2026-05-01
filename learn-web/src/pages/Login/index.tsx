import { useState, useEffect, useCallback } from 'react'
import { Form, Input, Button, Card, Tabs, message } from 'antd'
import type { TabsProps, FormProps } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, SafetyOutlined, ReloadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { login, register, getCaptcha, LoginParams, RegisterParams, CaptchaParams } from '@/api/auth'
import { useUserStore } from '@/store/userStore'
import './index.css'

type LoginFormValues = LoginParams & CaptchaParams
type RegisterFormValues = RegisterParams & CaptchaParams & { confirmPassword: string }

const Login = () => {
  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [loginForm] = Form.useForm<LoginFormValues>()
  const [registerForm] = Form.useForm<RegisterFormValues>()
  const [captchaUuid, setCaptchaUuid] = useState('')
  const [captchaImage, setCaptchaImage] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useUserStore()

  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  const fetchCaptcha = useCallback(async () => {
    try {
      const uuid = generateUUID()
      setCaptchaUuid(uuid)
      const res = await getCaptcha(uuid)
      setCaptchaImage(res.data)
    } catch (error) {
      console.error('获取验证码失败:', error)
      message.error('获取验证码失败，请重试')
    }
  }, [])

  useEffect(() => {
    fetchCaptcha()
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [fetchCaptcha])

  const handleRefreshCaptcha = () => {
    fetchCaptcha()
  }

  const handleLogin: FormProps<LoginFormValues>['onFinish'] = async (values) => {
    setLoading(true)
    try {
      const loginParams: LoginParams = {
        userName: values.userName,
        password: values.password,
      }
      const res = await login({
        ...loginParams,
        uuid: captchaUuid,
        captcha: values.captcha,
      } as LoginParams & CaptchaParams)
      setAuth(res.data.token, res.data.userInfo)
      message.success('登录成功')
      navigate('/')
    } catch (error) {
      console.error('登录失败:', error)
      fetchCaptcha()
    } finally {
      setLoading(false)
    }
  }

  const handleRegister: FormProps<RegisterFormValues>['onFinish'] = async (values) => {
    setLoading(true)
    try {
      const { confirmPassword, captcha, ...registerData } = values
      await register({
        ...registerData,
        uuid: captchaUuid,
        captcha: captcha,
      } as RegisterParams & CaptchaParams)
      message.success('注册成功，请登录')
      setActiveTab('login')
      registerForm.resetFields()
      fetchCaptcha()
    } catch (error) {
      console.error('注册失败:', error)
      fetchCaptcha()
    } finally {
      setLoading(false)
    }
  }

  const loginItems: TabsProps['items'] = [
    {
      key: 'login',
      label: '登录',
      children: (
        <Form
          form={loginForm}
          name="login"
          onFinish={handleLogin}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="userName"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined className="input-icon" />} placeholder="请输入用户名" className="login-input" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined className="input-icon" />} placeholder="请输入密码" className="login-input" />
          </Form.Item>
          <Form.Item
            name="captcha"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <div className="captcha-row">
              <Input
                prefix={<SafetyOutlined className="input-icon" />}
                placeholder="请输入验证码"
                className="login-input captcha-input"
                maxLength={4}
              />
              <div className="captcha-image-wrapper" onClick={handleRefreshCaptcha} title="点击刷新验证码">
                {captchaImage ? (
                  <img src={captchaImage} alt="验证码" className="captcha-image" />
                ) : (
                  <div className="captcha-loading">
                    <ReloadOutlined spin />
                  </div>
                )}
              </div>
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block className="login-btn">
              登 录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'register',
      label: '注册',
      children: (
        <Form
          form={registerForm}
          name="register"
          onFinish={handleRegister}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="userName"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 4, max: 20, message: '用户名长度为4-20个字符' },
            ]}
          >
            <Input prefix={<UserOutlined className="input-icon" />} placeholder="请输入用户名（4-20个字符）" className="login-input" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, max: 20, message: '密码长度为6-20个字符' },
            ]}
          >
            <Input.Password prefix={<LockOutlined className="input-icon" />} placeholder="请输入密码（6-20个字符）" className="login-input" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined className="input-icon" />} placeholder="请再次输入密码" className="login-input" />
          </Form.Item>
          <Form.Item name="nickName">
            <Input placeholder="昵称（选填）" className="login-input" />
          </Form.Item>
          <Form.Item
            name="phone"
            rules={[{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]}
          >
            <Input prefix={<PhoneOutlined className="input-icon" />} placeholder="手机号（选填）" className="login-input" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ type: 'email', message: '请输入正确的邮箱' }]}
          >
            <Input prefix={<MailOutlined className="input-icon" />} placeholder="邮箱（选填）" className="login-input" />
          </Form.Item>
          <Form.Item
            name="captcha"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <div className="captcha-row">
              <Input
                prefix={<SafetyOutlined className="input-icon" />}
                placeholder="请输入验证码"
                className="login-input captcha-input"
                maxLength={4}
              />
              <div className="captcha-image-wrapper" onClick={handleRefreshCaptcha} title="点击刷新验证码">
                {captchaImage ? (
                  <img src={captchaImage} alt="验证码" className="captcha-image" />
                ) : (
                  <div className="captcha-loading">
                    <ReloadOutlined spin />
                  </div>
                )}
              </div>
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block className="login-btn">
              注 册
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ]

  return (
    <div className="login-container">
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>
      <div className="bg-shape shape-4"></div>
      
      <Card className={`login-box ${isVisible ? 'visible' : ''}`}>
        <div className="login-header">
          <div className="logo-wrapper">
            <div className="logo-icon">
              <span className="logo-text">智</span>
            </div>
          </div>
          <h1 className="login-title">智能在线学习平台</h1>
          <p className="login-subtitle">智慧学习，成就未来</p>
        </div>
        
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key)
            fetchCaptcha()
          }}
          items={loginItems}
          centered
          className="login-tabs"
        />
        
        <div className="login-footer">
          <p>© 2024 智能在线学习平台 - 版权所有</p>
        </div>
      </Card>
    </div>
  )
}

export default Login
