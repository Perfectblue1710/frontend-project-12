import { io } from 'socket.io-client'

let socket = null

export const initSocket = () => {
  const token = localStorage.getItem('token')

  if (socket) {
    socket.disconnect()
  }

  socket = io({
    path: '/socket.io',
    transports: ['websocket'],
    auth: {
      token,
    },
  })

  return socket
}

export const closeSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
