import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBRow,
  MDBInput,
}
  from 'mdb-react-ui-kit';

function Register() {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: '',
    addRess: '',
    phone_number: '',
    email: '',
    passWord: '',
    confirmPassword: ''
  });
  const onChange = event => {
    event.preventDefault();
    setUser({ ...user, [event.target.name]: event.target.value });
    if (user.passWord !== user.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
  }

  const signupHandler = event => {
    event.preventDefault();
    if (!passwordsMatch) {
      setSuccess(false);
      setMessage("Xác nhận password sai");
      return;
    }
    axios.post(`${process.env.REACT_APP_API_URL}/user/Register`, user,
      {
        withCredentials: true,
      })
      .then((res) => {
        setSuccess(true);
        setMessage(`Đăng ký ${res.data.msg}`);
        setUser({
          fullName: '',
          addRess: '',
          phone_number: '',
          email: '',
          passWord: '',
          confirmPassword: ''
        });
        navigate('/');
      }).catch((err) => {
        setSuccess(false);
        setMessage(`Email đã được sử dụng`);
      })
  }
  return (
    <form className="form-add-new" onSubmit={signupHandler} >
        <MDBCard className='' style={{ background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)' }}>
          <MDBCardBody className='p-5 text-center'>
            {message && (
              <h2>
                {success ? (
                  <i className="fas fa-check-circle" style={{ color: 'green' }}>&nbsp;</i>
                ) : (
                  <i className="fas fa-times-circle" style={{ color: 'red' }}>&nbsp;</i>
                )}
                {message}
              </h2>
            )}
            <h2 className="fw-bold mb-5">Đăng ký</h2>
            <MDBRow>
              <MDBCol col='6'>
                <MDBInput wrapperClass='mb-4' label='Họ và tên' name="fullName" value={user.fullName} onChange={onChange} type='text' tabIndex="1" />
              </MDBCol>
              <MDBCol col='6'>
                <MDBInput wrapperClass='mb-4' label='Địa chỉ cụ thể' name="addRess" value={user.addRess} onChange={onChange} type='text' tabIndex="2" />
              </MDBCol>
            </MDBRow>
            <MDBInput wrapperClass='mb-4' label='Số điện thoại' name="phone_number" value={user.phone_number} onChange={onChange} type='text' tabIndex="3" />
            <MDBInput wrapperClass='mb-4' label='Email' name="email" value={user.email} onChange={onChange} type='email' tabIndex="4" />
            <MDBInput wrapperClass='mb-4' label='Password' name="passWord" value={user.passWord} onChange={onChange} type='password' tabIndex="5" onBlur={() => { setPasswordsMatch(user.passWord === user.confirmPassword); }} />
            <MDBInput wrapperClass='mb-4' label='Nhập lại password' name="confirmPassword" value={user.confirmPassword} onChange={onChange} type='password' tabIndex="6" onBlur={() => { setPasswordsMatch(user.passWord === user.confirmPassword); }} />

            <MDBBtn className='w-100 mb-4' size='md' style={{ background: '#FF3300' }}>Đăng ký</MDBBtn>


          </MDBCardBody>
        </MDBCard>
    </form>
  );
}

export default Register;