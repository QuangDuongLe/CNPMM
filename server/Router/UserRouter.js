require('dotenv').config();
const express = require('express');
const router = express.Router();

const userAuthenticate = require('../controller/UserController');
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');


router.post('/Register', userAuthenticate.userRegister);

router.post('/Login', userAuthenticate.userLogin);

router.post('/Logout', userAuthenticate.userLogout);

router.post('/update/:id', authUserMiddleware, userAuthenticate.userUpdate);

router.delete('/delete/:id', authMiddleware, userAuthenticate.deleteUser);

router.get('/getAll',authMiddleware,userAuthenticate.getAllUser)

router.get('/get-Detail/:id',authUserMiddleware,userAuthenticate.getDetailUser)

router.post('/refresh-token',userAuthenticate.refreshToken)

router.put('/forgotpassword',userAuthenticate.forgotPassword)

router.get('/searchUser', authMiddleware,userAuthenticate.searchUser)

router.put('/changepassword/:id',authUserMiddleware,userAuthenticate.changePassword)

router.get('/checkAcc/:email',userAuthenticate.checkAcc)
module.exports = router