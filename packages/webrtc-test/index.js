const WebSocket = require('ws');
// state
const s = [];

function pick(o, ...props) {
  const rc = {}
  for (const prop of props) {
    if (o[prop]) {
      rc[prop] = o[prop];
    }

  }
  return rc;
}


const ws = new WebSocket('wss://dss-webrtc-109-71-161-100.dditsadn.com', {
  followRedirects: true
});

ws.binaryType = 'string';
ws.on('open', open);
ws.on('ping', ping);
ws.on('close', close);
ws.on('message', consume)

function close(code, reason) {
  console.log(`closed because: ${code}, ${reason}`);
}

function open() {
  console.log('connection established');
  console.log(ws.binaryType)
  this.send(Buffer.from(JSON.stringify({
    type: "sign_in",
    message: {
      user_name: "defaultUserName",
      room: "defaultRoom",
      token: "%7B%22type%22:%22token1%22,%22key%22:%22q3jvByp5ebJaGVjd%22%7D",
      api_version: "5.7.3"
    },
    message_id: 0
  })));
}

function ping(data) {
   console.log(`pinged with data ${JSON.stringify(data.toString('utf8'))}`);
}

function consume(message) {
  const o = JSON.parse(message);
  s.unshift(o);
  s.cursor = pick(o, 'session_id', 'user_id', 'status');
  //console.log(o.ice_servers);
  console.log(message);
}
/*
{
  "type":"start_broadcast",
  "message":{
    "output":"rtmp://109.71.162.28/memberChat/jasminTestPerfYYYThree4a81bd708a22ae559301d9275019ac4a",
    "streamname":"streams/member_streamE5500DA2",
    "videobitrate":"500000",
    "videowidth":"0",
    "videoheight":"0",
    "audiobitrate":"128000",
    "framerate":"30",
    "dropframes":"0",
    "h264passthrough":"1",
    "icecast_audio":"0",
    "rtmpconnectinfo":"{
      "userType\":\"webRTCClient\",
      "sid": "m2adc8d879048b250463d835c03d008cd",
      "cid": "25340347881915610308544929762613",
      "isAudio":true,
      "isVideo":false
    }",
    "stream_label":"HvMpLtL1TXwfh8jKKB1mg1u1C5X6asHIPDsY",
    "stream_label2":"",
    "videocodec":"H264",
    "audio":"1",
    "video":"0",
    "session_id":"h8@E@cD7M"
  },
  "message_id":1
}

{
  "session_id":"DctyUCwaQ",
  "message_id":0,
  "user_id":"203382",
  "ice_servers":[
    {"urls":["stun:109.71.162.100:3478"], "username":"nano","credential":"nano"},
    {"urls":["turn:109.71.162.100:3478?transport=udp","turn:109.71.162.100:3478?transport=tcp"], "username":"nano","credential":"nano"}
  ],
  "status":200
}
*/