import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  messages: [],
  loading: false,
  error: null,
  isConnected: false,
}

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload
    },
    clearMessages: state => {
      state.messages = []
    },
  },
})

export const { setMessages, addMessage, setLoading, setError, setConnectionStatus, clearMessages } =
  messagesSlice.actions

export default messagesSlice.reducer
