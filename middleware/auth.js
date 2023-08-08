import jwt from 'jsonwebtoken';
import * as userRepository from '../model/auth.js';
import { config } from '../config.js';

const AUTH_ERROR = { message: 'Authentication Error' };

// isAuth는 로그인 한 사용자만 접근 가능하도록 나중에 활용 가능
export const isAuth = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  //req에서 오는 토큰이 있는지 존재여부 확인
  if (!(authHeader && authHeader.startsWith('Bearer '))) {
    return res.status(401).json(AUTH_ERROR);
  }

  const token = authHeader.split(' ')[1];
  //Todo Make it secure
  //토큰 검증
  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      return res.status(401).json(AUTH_ERROR);
    }
    //2차 검증 토큰이 맞더라도, 해당 아이디가 있는지 확인
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      return res.status(401).json(AUTH_ERROR);
    }
    req.userId = user.id; //req.customData
    next();
  });
};
