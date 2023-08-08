import express from 'express';
import 'express-async-errors';
import * as tweetController from '../controller/tweet.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import { isAuth } from '../middleware/auth.js';

// validation
// sanitizaiton
// Contract Testing: Client-Server
// Proto-base

const router = express.Router();

const validateTweet = [
  body('text')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('text should be atleast 3 characters'),
  validate,
];
// Get /tweets
// GET /tweets?username=:username
router.get('/', isAuth, tweetController.getTweets);
// GET /tweets/:id
router.get('/:id', isAuth, tweetController.getTweetbyId);
// POST /tweets
router.post('/', isAuth, validateTweet, tweetController.postTweet);
// PUT /tweets/:id
router.put('/:id', isAuth, validateTweet, tweetController.putTweet);
// DELETE /tweets/:id
router.delete('/:id', isAuth, tweetController.deleteTweet);

export default router;
