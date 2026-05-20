import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { initSocket, closeSocket } from '../services/socket'

import { addMessage, setConnectionStatus } from '../slices/messagesSlice'

import {
  addChannel,
  removeChannel,
  renameChannelWS,
} from '../slices/channelsSlice'

export const useWebSocket = () => {
  const dispatch = useDispatch()

  const { isAuthenticated } = useSelector((state) => state.auth)

  const socketRef = useRef(null)

  useEffect(() => {
    if (!isAuthenticated) {
      if (socketRef.current) {
        closeSocket()
        socketRef.current = null
      }

      return
    }

    const socket = initSocket()

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('✅ WebSocket connected')

      dispatch(setConnectionStatus(true))
    })

    socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason)

      dispatch(setConnectionStatus(false))
    })

    socket.on('newMessage', (message) => {
      console.log('📨 message from server:', message)

      dispatch(addMessage(message))
    })

    socket.on('newChannel', (channel) => {
      dispatch(addChannel(channel))
    })

    socket.on('removeChannel', ({ id }) => {
      dispatch(removeChannel(id))
    })

    socket.on('renameChannel', ({ id, name }) => {
      dispatch(renameChannelWS({ id, name }))
    })

    socket.on('connect_error', (error) => {
      console.error('🔌 Socket error:', error)

      dispatch(setConnectionStatus(false))
    })

    return () => {
      if (socketRef.current) {
        socket.off('connect')
        socket.off('disconnect')
        socket.off('newMessage')
        socket.off('newChannel')
        socket.off('removeChannel')
        socket.off('renameChannel')
        socket.off('connect_error')

        closeSocket()

        socketRef.current = null
      }
    }
  }, [dispatch, isAuthenticated])

  return null
}

export default useWebSocket
