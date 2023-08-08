import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import tweetsRoute from './router/tweets.js';
import authRoute from './router/auth.js';
import { config } from './config.js';
import { initSocket, getSocketIO } from './connection/socket.js';
import { Server } from 'socket.io';
import { db } from './db/database.js';
import { connectedDB } from './database/database.js';

const app = express();

const corsOption = cors({
  origin: ['*'],
  optionsSuccessStatus: 200,
  credentials: true,
  maxAge: 3000,
});
// t
app.use(cors());
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(helmet());
app.use(express.json());

//트윗에 대한 모든 미들웨이 처리
app.use('/tweets', tweetsRoute);
app.use('/auth', authRoute);
//에러는 아니지만 위 모든 미들웨어에서 처리하지 못한 요청(req)에 대한 대응 받아내기
app.use((req, res, next) => {
  res.sendStatus(404);
});
//에러 받아내기
app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

connectedDB()
  .then(() => {
    const server = app.listen(config.host.port);
    initSocket(server);
  })
  .catch(console.error());
