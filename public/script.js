const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001',
})
const myVideo = document.createElement('video')
myVideo.muted = true

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', (call) => {
      console.log('call-answer')
      call.answer(stream)
    })

    socket.on('user-connected', (userId) => {
      console.log('user-connected', userId)
      connectToNewUser(userId, stream)
    })
  })

myPeer.on('open', (id) => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')

  console.log('connetToNewUser')
  call.on('stream', (userVideoStream) => {
    console.log('call-stream', userId)
    addVideoStream(video, userVideoStream)
  })

  call.on('close', () => {
    video.remove()
  })
}

function addVideoStream(video, stream) {
  console.log('addVideoStream')

  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}
