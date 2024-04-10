// 引入WebSocketService
import { WebSocketService } from './socket'

// WebSocketManager类，负责WebSocket连接的创建、获取和关闭
class WebSocketManager {
	// 用于存储WebSocket连接的Map，键为id，值为WebSocketService对象
	socketMap : Map<string, WebSocketService> = new Map()

	// 创建WebSocket连接，并保存到Map中
	createSocket(id : string, url : string) {
		// 创建新的WebSocketService对象
		const socket = new WebSocketService(url)
		// 将WebSocketService对象保存到Map中，键为id
		this.socketMap.set(id, socket)
		// 返回创建的WebSocketService对象
		return socket
	}

	// 根据id获取WebSocket连接
	getSocket(id : string) {
		// 从Map中获取对应id的WebSocketService对象
		return this.socketMap.get(id)
	}

	// 根据id关闭WebSocket连接，并从Map中移除
	closeSocket(id : string) {
		// 从Map中获取对应id的WebSocketService对象
		const socket = this.socketMap.get(id)
		// 如果获取到了WebSocketService对象
		if (socket) {
			// 调用WebSocketService对象的close方法关闭WebSocket连接
			socket.close()
			// 从Map中移除该WebSocketService对象
			this.socketMap.delete(id)
		}
	}
	
	// 关闭所有打开的WebSocket连接
	closeAllSockets() {
	  for (const socket of this.socketMap.values()) {
	    socket.close();
	  }
	  this.socketMap.clear();
	}
	
	// 向所有WebSocket连接发送同样的消息
	broadcast(message: any) {
	  for (const socket of this.socketMap.values()) {
	    socket.send(message);
	  }
	}
	
	// 获取所有WebSocket连接的ID列表
	getSocketIds() {
	  return Array.from(this.socketMap.keys());
	}
}

// 导出WebSocketManager的单例
export default new WebSocketManager()