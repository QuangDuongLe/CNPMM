import { createSlice } from '@reduxjs/toolkit'


const initialState ={
  fullName: '',
  email: '',
  access_token: '',
  role_id: '',
  id: ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state,action)=>{
        const {_id ,fullName, email, role_id, access_token, addRess, birthDay, phone_number,status,avatar} = action.payload
        state._id = _id
        state.fullName = fullName
        state.email = email
        state.role_id = role_id
        state.access_token = access_token
        state.addRess = addRess
        state.birthDay = birthDay
        state.phone_number = phone_number
        state.status = status
        state.avatar = avatar
    },
    resetUser: (state)=>{
      state.id = ''
      state.fullName = ''
      state.email = ''
      state.role_id = ''
      state.access_token = ''
      state.addRess = ''
      state.birthDay = ''
      state.phone_number = ''
      state.status = ''
  },
  },
})

export const { updateUser,resetUser } = userSlice.actions

export default userSlice.reducer