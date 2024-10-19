import express from 'express';


import { isUserAuthenticated } from '../middleware/authMidddleware';
import { TweetController, TweetLikeController } from '../controllers/TweetController';

const tweetRouter = express.Router();
const tweetController = new TweetController();
const tweetLikeController = new TweetLikeController()

tweetRouter.use(isUserAuthenticated);

tweetRouter.get('/:tweetId', tweetController.getTweetById);
tweetRouter.get("/all", tweetController.getTweets);
tweetRouter.get("/all/:userId", tweetController.getTweetsByUser);
tweetRouter.post("/", tweetController.createTweet);
tweetRouter.put('/:tweetId', tweetController.updateTweet);
tweetRouter.delete("/:tweetId", tweetController.deleteTweet);

tweetRouter.post("/like", tweetLikeController.createLike);
tweetRouter.get("/like/:tweetId", tweetLikeController.getLike);
tweetRouter.delete("/like/:tweetId", tweetLikeController.removeLike);
tweetRouter.get("/like/user", tweetLikeController.getTweetLikedByUser);
tweetRouter.get("/likes/:tweetId", tweetLikeController.getLikedTweetByUsers);

export { tweetRouter };