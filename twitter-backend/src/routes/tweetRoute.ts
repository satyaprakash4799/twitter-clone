import express from 'express';


import { isUserAuthenticated } from '../middleware/authMidddleware';
import { TweetController } from '../controllers/TweetController';

const tweetRouter = express.Router();
const tweetController = new TweetController();

tweetRouter.use(isUserAuthenticated);

tweetRouter.get('/:tweetId', tweetController.getTweetById);
tweetRouter.get("/all", tweetController.getTweets);
tweetRouter.get("/all/:userId", );
tweetRouter.post("/", tweetController.createTweet);
tweetRouter.put('/:tweetId', tweetController.updateTweet);
tweetRouter.delete("/:tweetId", tweetController.deleteTweet);


export { tweetRouter };