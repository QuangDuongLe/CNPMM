const User = require('../Model/UserModel');
const argon2 = require('argon2');
const { generalAcesstoken, generalRefreshtoken } = require('../middleware/JWT');
const JWT = require('../middleware/JWT')
const sendMail = require('../ultils/sendMail')
const userRegister = async (req, res) => {
    const hashPass = await argon2.hash(req.body.passWord);
    User.create({
        fullName: req.body.fullName,
        phone_number: req.body.phone_number,
        email : req.body.email,
        passWord: hashPass,
        googleId: req.body.googleId,
        facebookId: req.body.facebookId,
        role_id: 2,
        addRess: req.body.addRess,
        isBlocked: false,
    })
        .then(user => res.status(200).json({ msg: 'thành công' }))
        .catch(err => res.status(400).json({msg : 'thất bại'}))
};

const userLogin = async (req, res) => {
    const password = req.body.passWord;
    const email = req.body.email.toLowerCase();
    try {
        const userFound = await User.findOne({ email: email });
        if (userFound) {
            const validPassword = await argon2.verify(userFound.passWord, password);
            if (validPassword) {
                const access_Token = await generalAcesstoken({
                    id: userFound._id,
                    fullName: userFound.fullName,
                    phone_number: userFound.phone_number,
                    email: userFound.email,
                    addRess: userFound.addRess,
                    avatar: userFound.avatar,
                    birthDay: userFound.birthDay,
                    role_id: userFound.role_id
                });
                const refresh_Token = await generalRefreshtoken({
                    id: userFound._id,
                    fullName: userFound.fullName,
                    phone_number: userFound.phone_number,
                    email: userFound.email,
                    addRess: userFound.addRess,
                    avatar: userFound.avatar,
                    birthDay: userFound.birthDay,
                    role_id: userFound.role_id
                });
                
                
                const tokenData = refresh_Token
                res.cookie('refresh_token', tokenData, { httpOnly: true, secure:true, samesite: 'strict',expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
                return res.status(200).json({
                   access_Token,
                   refresh_Token
                });
            } else {
                return res.status(401).json({ err: 'Username/Password not match!' });
            }
        } else {
            return res.status(401).json({ err: 'Username/Password not match!' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ err: 'Something went wrong' });
    }
};


const userUpdate = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        if (userId) {
            const updatedUser = await User.findByIdAndUpdate(userId, data);        
            if (!updatedUser) {
                return res.status(404).json({ msg: 'Người dùng không tồn tại' });
            }
            return res.status(200).json({ msg: 'Cập nhật thành công', updatedUser });
        } else {
            return res.status(401).json({ msg: 'Không tìm thấy ID' });
        }
    } catch (error) {
        console.error('Lỗi:', error);
        return res.status(500).json({ msg: 'Lỗi Server' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (userId) {
            const checkUser = await User.findOne({ _id: userId });
            if (checkUser) {
                const user = await User.findByIdAndDelete(userId);
                return res.status(200).json({ data: user });
            } else {
                return res.status(401).json({ err: 'Không tồn tại User' });
            }
        } else {
            return res.status(401).json({ msg: 'Không tìm thấy ID' });
        }
    } catch (error) {
        return res.status(500).json({ msg: 'Lỗi Server' });
    }
};
const getAllUser = async (req, res) => {
    try {
        const data = await User.find();
        return res.status(200).json({
            data: data
        });
    } catch (error) {
        console.error('Lỗi:', error);
        return res.status(500).json({ msg: 'Lỗi Server' });
    }
};
const getDetailUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (userId) {
            const data = await User.findOne({ _id: userId });
            if (data) {
                return res.status(200).json({ data: data });
            } else {
                return res.status(500).json({ err: 'Không tồn tại User' });
            }
        } else {
            return res.status(400).json({ msg: 'Không tìm thấy ID' });
        }
    } catch (error) {
        console.error('Lỗi:', error);
        return res.status(500).json({ msg: 'Lỗi Server' });
    }
};

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refresh_token;
        if (!token) {
            return res.status(401).json({ msg: 'Không tìm thấy ID' });
        }
        
        const result = await JWT.refreshTokenJWT(token); // Gọi refreshTokenJWT và lưu kết quả vào biến result
        if (result.status === 'error') {
            return res.status(401).json({ msg: 'Lỗi khi làm mới token' });
        }
      res.status(200).json({ access_Token: result.access_Token });
    } catch (error) {
        console.error('Lỗi Server:', error);
        return res.status(500).json({ msg: 'Lỗi Server' });
    }
};


const userLogout = (req, res) => {
    res.clearCookie('refresh_token', { httpOnly: true }); 
    return res.status(200).json({ msg: 'Good bye!' });
  };
function generateRandomPassword(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });     
      const newPassword = generateRandomPassword();
      const hashPass = await argon2.hash(newPassword);
      user.passWord = hashPass;
      await user.save();
  
      const disclaimer = "<p>Lưu ý: Đây là email tự động, vui lòng không trả lời email này.</p>";
      const emailContent = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              text-align: center;
              padding: 20px;
            }
            .container {
              max-width: 500px;
              margin: 0 auto;
              background-color: #fff;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              padding: 20px;
            }
            h1 {
              color: #333;
            }
            p {
              color: #555;
            }
            .password {
              font-size: 24px;
              font-weight: bold;
              color: #0073e6;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Di động Gen Z, xin chào</h1>
            <p>Bạn đã yêu cầu đặt lại mật khẩu. Dưới đây là mật khẩu mới của bạn:</p>
            <p class="password">${newPassword}</p>
            <p>Vui lòng lưu trữ mật khẩu này một cách an toàn.</p>
            <p class="footer">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
          </div>
          ${disclaimer}
        </body>
        </html>
      `;
  
      const data = {
        email,
        html: emailContent,
      };
  
      const rs = await sendMail(data);
  
      return res.status(200).json({
        success: true,
        rs,
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };
  
const changePassword = async (req, res) => {
    try {
      const userId = req.params.id;
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(401).json({ msg: 'Không tìm thấy ID' });
      }
      const isPasswordValid = await argon2.verify(user.passWord, currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ msg: 'Mật khẩu cũ không đúng' });
      }
      const hashPass = await argon2.hash(newPassword);
      await User.findByIdAndUpdate(userId, { passWord: hashPass }, { new: true });
      return res.status(200).json({ msg: 'Cập nhật mật khẩu thành công' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
  const searchUser = async (req, res) => {
    try {
      const keyword = req.query.keyword;
      const regex = new RegExp(keyword, 'i'); 
      const users = await User.find({
        email : { $regex: regex }, 
      })
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      console.error('Lỗi:', error);
      res.status(500).json({ success: false, error: 'Lỗi Server' });
    }
  };
  const checkAcc = async (req, res) => {
    try {
      const  email  = req.params.email.toLowerCase();
      const user = await User.findOne({ email: email });   
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ isBlocked: user.isBlocked });
    } catch (error) {
      console.error('Error checking account status:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

module.exports = { userRegister, userLogin, userLogout , userUpdate, deleteUser,getAllUser,refreshToken,getDetailUser,forgotPassword,changePassword,searchUser,checkAcc};