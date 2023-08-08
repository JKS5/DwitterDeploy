import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

// export 하지 않은 class이다.
// 객체지향프로그래밍에서는 보통 싱글톤을 구현할때는
// 우리가 class 안에서 구현할 수 있다.
// private과 factory 함수인 static 함수를 만들면 되지만, 그건 나중에 Typescript에서
class Socket {
  constructor(server) {
    this.io = new Server(server, {
      cors: '*',
    });

    this.io.use((Socket, next) => {
      const token = Socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      jwt.verify(token, config.jwt.secretKey, (error, decoded) => {
        if (error) {
          return next(new Error('Authentication error'));
        }
        next();
      });
    });
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      jwt.verify(token, config.jwt.secretKey, (error, decoded) => {
        if (error) {
          return next(new Error('Authentication error'));
        }
        next();
      });
    });

    this.io.on('connection', (socket) => {
      console.log('Socket client connected');
    });
  }
}

// 한번만 위 class Socket의 instance를 만든다.
let socket;
export function initSocket(server) {
  // class의 Socket instance가 없다면 만들고있다면 만들지 않는다..
  if (!socket) {
    socket = new Socket(server);
  }
}
// 사용하는 사람은 나중에 getSocketIo를 호출하면 위 class의 socket.io를 전달해주게 된다.
export function getSocketIO() {
  if (!socket) {
    throw new Error('Please call init first');
  }
  return socket.io;
}
