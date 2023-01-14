import routes from '@/routes';
import PostRepository, {
	IPostRecord,
} from '@/repositories/PostRepository';
import ApiServer from '@/server/ApiServer';
import FastifyApplierGroup from '@/server/FastifyApplierGroup';
import plugins from '@/server/plugins';

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

	it('can add and get a post', async () => {
		const created = await PostRepository.create({
			title: 'My first post',
			content: 'This is my first post',
			status: 'draft',
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

	it('can update a post', async () => {
		let updatedPost = await PostRepository.update(createdPost.id, {
			title: 'My new title',
		});

		expect(updatedPost).toStrictEqual({
			id: createdPost.id,
			title: 'My new title',
			content: createdPost.content,
			status: 'draft',
		});

		updatedPost = await PostRepository.update(createdPost.id, {
			content: 'My new content',
		});

		expect(updatedPost).toStrictEqual({
			id: createdPost.id,
			title: 'My new title',
			content: 'My new content',
			status: 'draft',
		});

		updatedPost = await PostRepository.update(createdPost.id, {
			title: 'My updated title',
			content: 'This is my updated content, okay?',
		});

		expect(updatedPost).toStrictEqual({
			id: createdPost.id,
			title: 'My updated title',
			content: 'This is my updated content, okay?',
			status: 'draft',
		});

		updatedPost = await PostRepository.update(createdPost.id, {
			title: 'My updated title',
			content: 'This is my updated content, okay?',
			status: 'published',
		});

		expect(updatedPost).toStrictEqual({
			id: createdPost.id,
			title: 'My updated title',
			content: 'This is my updated content, okay?',
			status: 'published',
		});
	});

	it('cannot update an invalid post id', () => {
		expect(
			async () => await PostRepository.update('unknown', {})
		).rejects.toThrowError();
	});
});
