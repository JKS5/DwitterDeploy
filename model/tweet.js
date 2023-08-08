import Mongoose from 'mongoose';
import { useVirtualId } from '../database/database.js';
import * as userRepository from './auth.js';

const tweetSchema = new Mongoose.Schema(
  {
    text: { type: String, required: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    url: String,
  },
  { timestamps: true }
);

useVirtualId(tweetSchema);
const Tweet = Mongoose.model('Tweet', tweetSchema);

export async function GetAll() {
  return Tweet.find().sort({ createdAt: -1 });
}

export async function GetAllByUsername(username) {
  return Tweet.find({ username }).sort({ createdAt: -1 });
}

export async function GetbyId(id) {
  return Tweet.findById(id);
}

export async function create(text, userId) {
  return userRepository.findById(userId).then((user) =>
    new Tweet({
      text,
      userId,
      name: user.name,
      username: user.username,
    }).save()
  );
}
export async function update(id, text) {
  return Tweet.findByIdAndUpdate(id, { text }, { returnOriginal: false });
}
export async function Remove(id) {
  return Tweet.findByIdAndDelete(id);
}
