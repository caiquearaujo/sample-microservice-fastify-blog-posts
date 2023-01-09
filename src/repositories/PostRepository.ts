import { randomBytes } from 'crypto';

import emitter from '@/events/EventEmitter';
import { IPostRecord } from '@/types/records';
import ApplicationError from '@/exceptions/ApplicationError';

let globalPosts: Record<string, IPostRecord> = {};

export default class PostRepository {
	static get(id: string) {
		return globalPosts[id] ?? undefined;
	}

	static create(post: Omit<IPostRecord, 'id'>) {
		const createdPost = {
			id: randomBytes(6).toString('hex'),
			...post,
		};

		globalPosts[createdPost.id] = createdPost;
		emitter('PostCreated', createdPost);
		return createdPost;
	}

	static update(id: string, post: Partial<Omit<IPostRecord, 'id'>>) {
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
		};

		globalPosts[id] = updatedPost;
		emitter('PostCreated', updatedPost);
		return updatedPost;
	}

	static all() {
		return Object.values(globalPosts);
	}

	static fresh() {
		globalPosts = {};
	}
}
