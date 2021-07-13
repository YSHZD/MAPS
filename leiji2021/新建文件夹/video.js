class VideoPlayer {
  constructor(video, uuid, channel, url) {
    this.uuid = uuid
    this.channel = channel
    this.mseSoucrceBuffer = null
    this.started = false
    this.mseQueue = []
    this.url = 'ws://'+ (!!url ? url : process.env.VUE_APP_VIDEO_URL) +'/stream/' + uuid + '/channel/' + channel + '/mse?uuid=' + uuid + '&channel=' + channel
    this.video = video
    this.close = false
    this.URLObject = null
    
    video.addEventListener('pause', function(e) {
      video.play()
    })
    this.init()
  }
  init() {
    this.close = false
    this.mse = new MediaSource()
    this.URLObject && URL.revokeObjectURL(this.URLObject)
    this.URLObject = URL.createObjectURL(this.mse)
    this.video.src = this.URLObject
    this.mse.addEventListener('sourceopen', (res) => {
      this.mseOpen.bind(this)()
    })
  }
  mseOpen() {
    const ws = new WebSocket(this.url)
    ws.binaryType = 'arraybuffer'
    //ws.onopen = event => console.log('Connected by ' + this.url)
    ws.onmessage = this.wsOnMsg.bind(this)
    ws.onerror = err => console.log(err)
    ws.onclose = () => {
      console.log('websocket is closed!' + new Date())
      setTimeout(() => !this.closed && this.init(), 5000)
    }
    this.ws = ws
  }
  initSouceBuffer() {
    this.mseSoucrceBuffer = this.mse.addSourceBuffer('video/mp4; codecs="' + this.mimeCodec + '"')
    this.mseSoucrceBuffer.mode = 'segments'

    this.mseSoucrceBuffer.addEventListener('updateend', () => {
      this.pushPacket()
      const len = this.video.buffered.length
      if (len && this.video.buffered.end(len - 1) - this.video.currentTime > 1) {
        this.video.currentTime = this.video.buffered.end(len - 1)
      }
    })
  }
  wsOnMsg(e) {
    if (new Uint8Array(e.data)[0] === 9) {
      this.mimeCodec = new TextDecoder('utf-8').decode(new Uint8Array(e.data).slice(1))
      this.initSouceBuffer()
    } else {
      const buffered = this.mseSoucrceBuffer.buffered
      let start, end, len = buffered.length
      if (len) {
        start = buffered.start(len - 1)
        end = buffered.end(len - 1)
      }
      if (len && end - start > 600) {
        this.started = true
        this.mseSoucrceBuffer.remove(start, end - 60)
      }
      try {
        this.readPacket.bind(this)(e.data)
      } catch {
        this.dispose()
        this.init()
      }
    }
  }
  readPacket(data) {
    if (!this.started) {
      this.mseSoucrceBuffer.appendBuffer(data)
      this.started = true
      return
    }
    this.mseQueue.push(data)
    if (!this.mseSoucrceBuffer.updating) this.pushPacket()
  }
  pushPacket() {
    if (!this.mseSoucrceBuffer.updating) {
      if (this.mseQueue.length > 0) {
        const packet = this.mseQueue.shift()
        this.mseSoucrceBuffer.appendBuffer(packet)
      } else {
        this.started = false
      }
    }
  }
  dispose() {
    //console.log('player dispose!')
    if (this.ws) {
      this.closed = true
      this.ws.close()
      this.ws = null
      this.URLObject && URL.revokeObjectURL(this.URLObject)
      this.URLObject = null
    }
  }
}

const getID = length =>{
    return Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
}
export{
    VideoPlayer,
    getID
}