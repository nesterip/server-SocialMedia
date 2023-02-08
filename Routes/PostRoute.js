import express from 'express';
import { createPost, deletePost, getPost, getTimelinePost, likesPost, updatePost } from '../Controllers/PostController.js';

const router = express.Router();

//POST a Post
router.post('/', createPost);

//GET a Post
router.get('/:id', getPost);

//UPDATE a Post
router.put('/:id', updatePost);

//DELETE a Post
router.delete('/:id', deletePost);

//Like a post
router.put('/:id/like', likesPost);

//GET All Post
router.get('/:id/timeline', getTimelinePost);



export default router;