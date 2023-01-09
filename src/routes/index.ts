import commonRouter from './common.router';
import postsRouter from './posts.router';

export default [
	commonRouter,
	postsRouter.createPost,
	postsRouter.getPost,
	postsRouter.listPost,
	postsRouter.updatePost,
];
