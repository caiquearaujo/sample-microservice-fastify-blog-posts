import { FastifyInstance } from 'fastify';
import { TFnApplyToFastify } from '@/types/types';
import PostRepository from '@/repositories/PostRepository';

const createPost: TFnApplyToFastify = async (app: FastifyInstance) => {
	app.post('/posts', async (request, reply) => {
		const { title, content, status } = request.body as any;

		return reply
			.status(201)
			.send(await PostRepository.create({ title, content, status }));
	});
};

const updatePost: TFnApplyToFastify = async (app: FastifyInstance) => {
	app.put('/posts/:id', async (request, reply) => {
		const { id } = request.params as Record<string, string>;
		const { title, content, status } = request.body as any;

		const post = await PostRepository.update(id, {
			title,
			content,
			status,
		});

		return reply.status(200).send(post);
	});
};

const getPost: TFnApplyToFastify = async (app: FastifyInstance) => {
	app.get('/posts/:id', (request, reply) => {
		const { id } = request.params as any;

		const post = PostRepository.get(id);

		if (!post) {
			return reply.status(404).send({
				status: 404,
				name: 'PostNotFound',
				message: 'Requested post was not found.',
			});
		}

		return reply.status(200).send(PostRepository.get(id));
	});
};

const listPost: TFnApplyToFastify = async (app: FastifyInstance) => {
	app.get('/posts', (request, reply) => {
		const posts = PostRepository.all();

		if (posts.length === 0) {
			return reply.status(404).send({
				status: 404,
				name: 'PostsNotFound',
				message: 'No posts were found.',
			});
		}

		return reply.status(200).send(posts);
	});
};

export default { getPost, listPost, createPost, updatePost };
