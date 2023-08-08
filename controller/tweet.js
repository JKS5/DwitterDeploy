import 'express-async-errors';
import * as ImportData from '../model/tweet.js';
import { getSocketIO } from '../connection/socket.js';

export async function getTweets(req, res, next) {
  const username = req.query.username;
  const data = await (username
    ? ImportData.GetAllByUsername(username)
    : ImportData.GetAll());
  res.status(200).json(data);
}

export async function getTweetbyId(req, res) {
  const id = req.params.id;
  const tweet = await ImportData.GetbyId(id);
  if (tweet) {
    res.status(200).json(tweet);
  } else {
    res.sendStatus(404);
  }
}

export async function postTweet(req, res, next) {
  const { text } = req.body;
  const createdTweet = await ImportData.create(text, req.userId);
  res.status(201).json(createdTweet);
  getSocketIO().emit('tweets', createdTweet);
}

export async function putTweet(req, res, next) {
  const id = req.params.id;
  const text = req.body.text;

  const tweet = await ImportData.GetbyId(id);
  if (!tweet) {
    return res.sendStatus(404);
  }
  if (tweet.userId !== req.userId) {
    return res.sendStatus(403);
  }
  const updated = await ImportData.update(id, text);
  res.status(200).json(updated);
}
export async function deleteTweet(req, res, next) {
  const id = req.params.id;
  const tweet = await ImportData.GetbyId(id);
  if (!tweet) {
    return res.sendStatus(404);
  }
  if (tweet.userId !== req.userId) {
    return res.sendStatus(403);
  }
  if (id) {
    await ImportData.Remove(id);
    res.sendStatus(204);
  }
}
