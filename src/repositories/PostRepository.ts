import { randomBytes } from 'crypto';

import ApplicationError from '@/exceptions/ApplicationError';
import EventBus from '@/events/EventBus';

export type TPostStatus = 'draft' | 'published' | 'archived';

export interface IPostRecord {
	id: string;
	title: string;
	content: string;
	status: TPostStatus;
}

let globalPosts: Record<string, IPostRecord> = {};

export default class PostRepository {
	static get(id: string) {
		return globalPosts[id] ?? undefined;
	}

	static async create(post: Omit<IPostRecord, 'id'>) {
		const createdPost = {
			id: randomBytes(6).toString('hex'),
			...post,
		};

		globalPosts[createdPost.id] = createdPost;
		await EventBus.emit('post.created', createdPost);
		return createdPost;
	}

	static async update(
		id: string,
		post: Partial<Omit<IPostRecord, 'id'>>
	) {
		const found = PostRepository.get(id);

		if (!found) {
			throw new ApplicationError(
				500,
				'CannotUpdatePost',
				'Post does not exist to be updated.'
			);
		}

		const updatedPost = {
			...found,
			title: post.title ?? found.title,
			content: post.content ?? found.content,
			status: post.status ?? found.status,
		};

		globalPosts[id] = updatedPost;
		await EventBus.emit('post.updated', updatedPost);
		return updatedPost;
	}

	static all() {
		return Object.values(globalPosts);
	}

	static fresh() {
		globalPosts = {};
	}
}
