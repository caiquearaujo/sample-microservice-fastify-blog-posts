import routes from '@/routes';
import PostRepository from '@/repositories/PostRepository';
import ApiServer from '@/server/ApiServer';
import FastifyApplierGroup from '@/server/FastifyApplierGroup';
import plugins from '@/server/plugins';
import { IPostRecord } from '@/types/records';

beforeAll(async () => {
	const api = new ApiServer({
		routes: new FastifyApplierGroup(...routes),
		plugins: new FastifyApplierGroup(...plugins),
	});

	await api.bootstrap();
	PostRepository.fresh();
});

describe('Post Repository', () => {
	let createdPost: IPostRecord;

	it('should get empty post', () => {
		expect(PostRepository.all().length).toBe(0);
	});

	it('can add and get a post', () => {
		const created = PostRepository.create({
			title: 'My first post',
			content: 'This is my first post',
		});

		const found = PostRepository.get(created.id);
		expect(found).toStrictEqual(created);

		createdPost = created;
	});

	it('should get recent created post', () => {
		const posts = PostRepository.all();

		expect(posts.length).toBe(1);
		expect(posts[0]).toStrictEqual(createdPost);
	});

	it('cannot get a post by invalid id', () => {
		expect(PostRepository.get('unknown')).toBeUndefined();
	});

	it('can update a post', () => {
		let updatedPost = PostRepository.update(createdPost.id, {
			title: 'My new title',
		});

		expect(updatedPost).toStrictEqual({
			id: createdPost.id,
			title: 'My new title',
			content: createdPost.content,
		});

		updatedPost = PostRepository.update(createdPost.id, {
			content: 'My new content',
		});

		expect(updatedPost).toStrictEqual({
			id: createdPost.id,
			title: 'My new title',
			content: 'My new content',
		});

		updatedPost = PostRepository.update(createdPost.id, {
			title: 'My updated title',
			content: 'This is my updated content, okay?',
		});

		expect(updatedPost).toStrictEqual({
			id: createdPost.id,
			title: 'My updated title',
			content: 'This is my updated content, okay?',
		});
	});

	it('cannot update an invalid post id', () => {
		expect(() => PostRepository.update('unknown', {})).toThrowError();
	});
});
