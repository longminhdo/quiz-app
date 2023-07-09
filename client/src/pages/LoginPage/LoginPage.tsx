import React, { useCallback } from 'react';
import { Button, Form, Input, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import { getSSOToken } from '@/actions/authentication';
import './LoginPage.scss';

const LoginPage = () => {
  const [run] = useDispatchAsyncAction();

  const handleSSOLogin = useCallback(async () => {
    const { data } = await run(getSSOToken());
    window.location.replace(data.url);
  }, [run]);

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
    >
      <div className="title">HUST Form</div>
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input
          disabled
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input
          disabled
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item>
        <Button
          disabled
          type="primary"
          htmlType="submit"
          className="login-form-button"
        >
          Login
        </Button>
      </Form.Item>
      <Divider>or</Divider>
      <Form.Item>
        <Button
          type="default"
          htmlType="button"
          className="login-form-button-sso"
          onClick={handleSSOLogin}
        >
          Login with HUST account
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginPage;
