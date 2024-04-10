// WebSocketService 类封装了WebSocket的基本操作，包括连接、发送消息、关闭连接和接收消息
export class WebSocketService {
	// 存储未发送的消息队列
	socketMessageQueue : Array<any> = []

	// WebSocket连接状态，默认为false
	socketOpen = false

	// WebSocket服务器地址
	socketUrl : string

	// 最大重连次数，即尝试重新连接的次数上限
	maxReconnectAttempts : number = 3

	// 当前重连次数，每次尝试重新连接时增加，连接成功后重置
	reconnectAttempts : number = 0

	// 是否自动重连，默认为true，如果关闭连接，将设置为false
	autoReconnect : boolean = true

	// 心跳检测定时器的ID
	heartBeatIntervalId : any

	// 构造函数，创建WebSocketService对象时需要传入服务器地址
	constructor(url : string) {
		this.socketUrl = url
		this.connect()
	}

	// 连接WebSocket服务器
	connect() {
		uni.connectSocket({
			url: this.socketUrl,
			complete: () => { },
		})
		// 监听WebSocket打开事件
		uni.onSocketOpen(() => {
			console.log('WebSocket连接已打开！')
			this.socketOpen = true
			this.reconnectAttempts = 0  // 连接成功后重置重连次数
			// 开启心跳检测
			this.startHeartBeat()
			// 连接成功后，遍历并发送未发送的消息队列中的消息
			for (let i = 0; i < this.socketMessageQueue.length; i++) {
				this.send(this.socketMessageQueue[i])
			}
			// 清空消息队列
			this.socketMessageQueue = []
		})
		// 监听WebSocket错误事件
		uni.onSocketError(() => {
			console.log('WebSocket连接打开失败，请检查！')
			// 如果连接失败且允许自动重连，并且重连次数未达到最大值，则尝试重新连接
			if (this.autoReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
				this.reconnectAttempts++
				this.connect()
			}
		})
		// 监听WebSocket关闭事件
		uni.onSocketClose(() => {
			console.log('WebSocket连接已关闭！')
			this.socketOpen = false
			// 停止心跳检测
			this.stopHeartBeat()
			// 如果连接关闭且允许自动重连，并且重连次数未达到最大值，则尝试重新连接
			if (this.autoReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
				this.reconnectAttempts++
				this.connect()
			}
		})
	}

	// 发送WebSocket消息
	send(msg : any) {
		// 如果WebSocket连接已打开，直接发送消息
		if (this.socketOpen) {
			uni.sendSocketMessage({
				data: msg,
			})
		} else {
			// 如果WebSocket连接未打开，将消息加入到未发送的消息队列中
			this.socketMessageQueue.push(msg)
		}
	}

	// 关闭WebSocket连接
	close() {
		// 当主动调用关闭方法时，将自动重连设为false，阻止自动重连
		this.autoReconnect = false
		uni.closeSocket()
	}

	// 注册消息接收回调函数
	onMessage(callback : (msg : any) => void) {
		// 当接收到WebSocket消息时，调用注册的回调函数处理消息
		uni.onSocketMessage(function (res) {
			console.log('收到服务器内容：' + res.data)
			callback(res.data)
		})
	}

	// 开启心跳检测
	startHeartBeat() {
		this.heartBeatIntervalId = setInterval(() => {
			if (this.socketOpen) {
				// 这里发送的是心跳消息，你可以根据你的服务器要求来修改
				this.send("HEART_BEAT");
			}
		}, 10000); // 每10秒发送一次心跳
	}

	// 停止心跳检测
	stopHeartBeat() {
		if (this.heartBeatIntervalId) {
			clearInterval(this.heartBeatIntervalId);
		}
	}
}