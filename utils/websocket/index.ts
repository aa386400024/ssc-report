export * from "./socket";
export * from "./webSocketManager";

// 下面代码是使用的例子，不是这个的代码
// 在需要使用的地方，你可以这样创建和获取 WebSocket 连接：
// import wsManager from '@/utils/websocket/WebSocketManager'

// // 创建并获取一个 WebSocket 连接
// const ws = wsManager.createSocket('socket1', 'wss://www.example.com/socket')

// // 获取一个已存在的 WebSocket 连接
// // const ws = wsManager.getSocket('socket1')

// // 使用 WebSocket 连接
// ws.send('Hello World')
// ws.onMessage((msg) => {
//   console.log('从服务器收到的消息: ', msg)
// })

// // 在适当的时候关闭连接
// // wsManager.closeSocket('socket1')
