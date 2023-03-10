import commonRouter from './common.router';
import postsRouter from './posts.router';
import webhooksRouter from './webhooks.router';

export default [
	commonRouter,
	webhooksRouter.webhookToEvents,
	postsRouter.createPost,
	postsRouter.getPost,
	postsRouter.listPost,
	postsRouter.updatePost,
];
