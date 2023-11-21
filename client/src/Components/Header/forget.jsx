import React, { useState } from "react";
import axios from "axios";

import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';

function Forget() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({
    email: '',
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); 

  const onChange = event => {
    event.preventDefault();
    setUser({ ...user, [event.target.name]: event.target.value });
  }

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const forgetHandler = event => {
    event.preventDefault();
    setLoading(true); 

    axios.put(`${process.env.REACT_APP_API_URL}/user/forgotpassword`, user)
      .then((res) => {
        toggleModal();
        setSuccess(true);
        setMessage(``);
      }).catch((err) => {
        setSuccess(false);
        setMessage(`Email chưa được đăng ký tài khoản`);
      }).finally(() => {
        setLoading(false);
      });
  }

  return (
    <div>
      <form className="form-add-new" onSubmit={(e) => {
        forgetHandler(e);  
      }}>
        <MDBContainer fluid>
          <MDBRow className='d-flex justify-content-center align-items-center h-100'>
            <MDBCol col='12'>
              <MDBCard className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '500px' }}>
                <MDBCardBody className='p-5 w-100 d-flex flex-column'>
                  {message && (
                    <h4 className="fw-bold mb-2 text-center">
                      <i className={`fas ${success ? 'fa-check-circle' : 'fa-times-circle'}`} style={{ color: success ? 'green' : 'red' }}>&nbsp;</i>
                      {message}
                    </h4>
                  )}
                  <h2 className="fw-bold mb-2 text-center">Quên Mật Khẩu</h2>
                  <p className="text-white-50 mb-3"></p>
                  <MDBInput wrapperClass='mb-4 w-100' label='Email' name="email" value={user.email} type='email' size="lg" onChange={onChange} />
                  <MDBBtn size='lg' type="submit" disabled={loading} style={{backgroundColor: '#FF3300'}}>
                    {loading ? 'Đang gửi...' : 'Xác nhận'}
                  </MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </form>

      {isModalVisible && (
        <MDBModal tabIndex='-1' show={isModalVisible} onHide={toggleModal}>
          <MDBModalDialog centered>
            <MDBModalContent st>
              <MDBModalHeader >
                Thông báo
              </MDBModalHeader>
              <MDBModalBody>
                <i className="fas fa-check-circle" style={{ color: 'green',fontSize:'30px' }}>&nbsp;</i> <p>Bạn đã yêu cầu gửi lại mật khẩu qua email thành công. Hãy tiến hành kiểm tra email</p>
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn onClick={toggleModal}>
                  Quay lại
                </MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      )}
    </div>
  );
}

export default Forget;
