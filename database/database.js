import Mongoose from 'mongoose';
import { config } from '../config.js';

export async function connectedDB() {
  return Mongoose.connect(config.mongodb.host);
}
//ToDO(Patrick) : Delete below
let db;

export function getTweets() {
  return db.collection('tweets');
}

export function useVirtualId(schema) {
  // _id -> id
  schema.virtual('id').get(function () {
    return this._id.toString();
  });
  //https://mongoosejs.com/docs/tutorials/virtuals.html#virtuals-via-schema-options
  schema.set('toJSON', { virtuals: true });
  schema.set('toObject', { virtuals: true });
}
