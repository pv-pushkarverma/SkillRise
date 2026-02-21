import express from 'express'
import {
  getGroups,
  createGroup,
  toggleMembership,
  getPosts,
  createPost,
  getPost,
  togglePostUpvote,
  toggleResolve,
  deletePost,
  createReply,
  toggleReplyUpvote,
  acceptAnswer,
} from '../controllers/communityController.js'

const communityRouter = express.Router()

// Groups
communityRouter.get('/groups', getGroups)
communityRouter.post('/groups', createGroup)
communityRouter.post('/groups/:groupId/membership', toggleMembership)

// Posts
communityRouter.get('/posts', getPosts)
communityRouter.post('/posts', createPost)
communityRouter.get('/posts/:postId', getPost)
communityRouter.post('/posts/:postId/upvote', togglePostUpvote)
communityRouter.patch('/posts/:postId/resolve', toggleResolve)
communityRouter.delete('/posts/:postId', deletePost)

// Replies
communityRouter.post('/posts/:postId/replies', createReply)
communityRouter.post('/posts/:postId/replies/:replyId/upvote', toggleReplyUpvote)
communityRouter.patch('/posts/:postId/replies/:replyId/accept', acceptAnswer)

export default communityRouter
