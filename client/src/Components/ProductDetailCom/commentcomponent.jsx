import { Input, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { WrapperButton, WrapperComment, WrapperCommentNew, WrapperInfo, WrapperTextBox } from './style';
import { LikeFilled, DislikeFilled, MessageFilled, SendOutlined } from '@ant-design/icons'
import axios from 'axios';
import { useParams } from 'react-router-dom';
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
import { useSelector } from 'react-redux';
const Comment = () => {
  const user = useSelector((state) => state.user)
  const [commentData, setCommentData] = useState(null);
  const [showReplyForms, setShowReplyForms] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { productName } = useParams();
  const [comment, setComment] = useState({
    author: user.fullName || '',
    content: ''
  });
  const [reply, setReply] = useState({
    author: user.fullName || '',
    content: '',
    commentId: null,
  });
  useEffect(() => {
    setComment(prevComment => ({
      ...prevComment,
      author: user.fullName || '',
    }));
  }, [user.fullName]);
  useEffect(() => {
    setReply(prevComment => ({
      ...prevComment,
      author: user.fullName || '',
    }));
  }, [user.fullName]);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const toggleReplyForm = (commentIndex) => {
    const newShowReplyForms = [...showReplyForms];
    newShowReplyForms[commentIndex] = !newShowReplyForms[commentIndex];
    setShowReplyForms(newShowReplyForms);
  };
  const onChange = event => {
    event.preventDefault();
    setComment({ ...comment, [event.target.name]: event.target.value });
  }
  const onChange1 = event => {
    event.preventDefault();
    setReply({ ...reply, [event.target.name]: event.target.value });
  }

  const addComment = event => {
    event.preventDefault();
    if (comment.author.trim() !== '' && comment.content.trim() !== '') {
      axios.post(`${process.env.REACT_APP_API_URL}/comment/addComment/${productName}?userId=${user._id || ''}`, comment)
        .then((res) => {
          toggleModal();
          setComment({
            author: user.fullName || '',
            content: ''
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
  const addReply = (event, commentId) => {
    event.preventDefault();
    if (reply.author.trim() !== '' && reply.content.trim() !== '') {
      axios.post(`${process.env.REACT_APP_API_URL}/comment/addReply/${commentId}/${productName}?userId=${user._id || ''}`, reply)
        .then((res) => {
          toggleModal();
          setReply({
            author: user.fullName || '',
            content: ''
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/comment/getCommentsByProduct/${productName}`)
      .then((response) => {
        setCommentData(response.data.data)
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API: ', error);
      });
  }, []);
  return (
    <WrapperCommentNew >
      <div className='comment-container'>
        <div className='comment-form'>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ff3300' }}>Hỏi và đáp</p>
          <form onSubmit={addComment}>
            <WrapperInfo style={{ display: 'flex', alignContent: 'space-between' }}>

              <input className='nameinput'
                name='author'
                value={comment.author}
                type="text"
                placeholder="Tên của bạn"
                onChange={onChange}
              />
              <div className="error-msg" id="name-error-msg"></div>
            </WrapperInfo>

            <div className='comment-form-content'>
              <div className='textarea-comment'>
                <img src='https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/af808c10-144a-4f31-b08d-e2108b4481bc/d622juu-a6a55fc8-da00-46b5-ab1f-8a32e5d48e1d.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2FmODA4YzEwLTE0NGEtNGYzMS1iMDhkLWUyMTA4YjQ0ODFiY1wvZDYyMmp1dS1hNmE1NWZjOC1kYTAwLTQ2YjUtYWIxZi04YTMyZTVkNDhlMWQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.OVHJUeMJdQ-ojp4LQwln1WdAjdmTAL4T8Q8d6ydk-qM' width={55} alt='icon' className='icon-img' />
                <textarea className='textarea' id='textarea' placeholder='Hãy để lại câu hỏi, chúng tôi sẽ giải đáp thắc mắc cho bạn!'
                  cols="120"
                  name='content'
                  value={comment.content}
                  onChange={onChange}
                ></textarea>
                <button className='btn-send' id='btn-send' >
                  <SendOutlined />Gửi
                </button>
              </div>
            </div>
          </form>
          {isModalVisible && (
            <MDBModal tabIndex='-1' show={isModalVisible} onHide={toggleModal}>
              <MDBModalDialog centered>
                <MDBModalContent st>
                  <MDBModalHeader >
                    Thông báo
                  </MDBModalHeader>
                  <MDBModalBody>
                    <i className="fas fa-check-circle" style={{ color: 'green', fontSize: '30px' }}>&nbsp;</i> <p>Bình luận của bạn đã được gửi để kiểm duyệt, sau đó sẽ hiển thị ra</p>
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
          <div className="error-msg" id="textarea-error-msg"></div>

          <br></br>
        </div>
        {commentData ? (
          commentData.map((comments, index) => (
            <div className='block-comment-list'>
              <br></br>

              <div id className='list-comment'>
                <hr></hr>

                <div className='item-comment'>

                  <div className='box-cmt'>

                    <div className='cmt-inf'>
                      <div className='box-inf'>
                        <div className='box-inf-avt'>
                          {comments?.user?.avatar ? (
                            <img src={comments.user.avatar} style={{ width: "30px" }} />
                          ) : <img src='../../image/logo.png' style={{ width: "30px" }} />}
                          &nbsp;
                        </div>
                        <div className='box-inf-name'>{comments.author} {comments?.user && comments.user?.role_id === 1 ? ' (QTV)' : ''}</div>
                      </div>
                    </div>
                    <div className='cmt-quest'>
                      <div className='content'>
                        <p>{comments.content}</p>
                      </div>
                      <button className='btn-rep' onClick={() => toggleReplyForm(index)}>
                        <MessageFilled />
                      </button>
                      {showReplyForms[index] && (
                        <form onSubmit={(e) => addReply(e, comments._id)}>
                          <div className='reply-form'>
                            <Input
                              type="text"
                              className='name-input'
                              name='author'
                              value={reply.author}
                              onChange={onChange1}
                              placeholder='Nhập tên'
                              style={{ width: '200px', height: '50px' }}
                            />
                            <div className='comment-form-content'>
                              <div className='textarea-comment'>
                                <img src='https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/af808c10-144a-4f31-b08d-e2108b4481bc/d622juu-a6a55fc8-da00-46b5-ab1f-8a32e5d48e1d.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2FmODA4YzEwLTE0NGEtNGYzMS1iMDhkLWUyMTA4YjQ0ODFiY1wvZDYyMmp1dS1hNmE1NWZjOC1kYTAwLTQ2YjUtYWIxZi04YTMyZTVkNDhlMWQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.OVHJUeMJdQ-ojp4LQwln1WdAjdmTAL4T8Q8d6ydk-qM' width={55} alt='icon' className='icon-img' />
                                <textarea
                                  className='textarea'
                                  placeholder='Trả lời!'
                                  cols="120"
                                  name='content'
                                  onChange={onChange1}
                                  value={reply.content}
                                ></textarea>
                                <button className='btn-send'>
                                  <SendOutlined /> Gửi
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>
                    <div className='cmt-rep' >
                      <div className='list-cmt-rep'>
                        {comments.replies.map((reply, replyIndex) => (
                          <div className='item-cmt-rep' style={{ marginTop: 8 }}>
                            <div className='box-inf'>
                              <div className='box-inf-avt'>
                                {reply?.user?.avatar ? (
                                  <img src={reply?.user?.avatar} style={{ width: "30px" }} />
                                ) : <img src='../../image/logo.png' style={{ width: "30px" }} />}
                                &nbsp;
                              </div>
                              <div className='box-inf-name'>{reply.author} {reply?.user && reply?.user?.role_id === 1 ? ' (QTV)' : ''}</div>
                            </div>
                            <div className='cmt-quest' style={{ marginTop: 8 }}>
                              <div className='content'>
                                <p>{reply.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          null
        )}
      </div>
    </WrapperCommentNew>
  );
};

export default Comment;
