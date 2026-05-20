import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import channelsReducer from '../slices/channelsSlice'
import messagesReducer from '../slices/messagesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer,
    messages: messagesReducer,
  },
})
