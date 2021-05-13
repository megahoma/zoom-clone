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
    audio: false,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', (call) => {
      call.answer(stream)
      /*const video = document.createElement('video')
      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream)
      })*/
    })

    socket.on('user-connected', (userId) => {
      console.log('user-connected', userId)
      setTimeout(() => {
        connectToNewUser(userId, stream)
      }, 2500)
    })
  })

myPeer.on('open', (id) => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')

  console.log('connetToNewUser', stream)
  call.on('stream', (userVideoStream) => {
    console.log('call-stream', userId)
    addVideoStream(video, userVideoStream)
  })
}

function addVideoStream(content, stream) {
  console.log('addVideoStream', content, stream)

  content.srcObject = stream
  content.addEventListener('loadedmetadata', () => {
    content.play()
  })
  videoGrid.append(content)
}
