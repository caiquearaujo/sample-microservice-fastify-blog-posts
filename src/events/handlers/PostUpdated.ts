import { IPostRecord } from '@/repositories/PostRepository';
import { IEventHandler } from '@/types/classes';
import EventBus from '../EventBus';

class PostUpdated implements IEventHandler<IPostRecord> {
	protected name;

	constructor() {
		this.name = 'post.updated';
	}

	public event() {
		return this.name;
	}

	public async handle(event: string, payload: IPostRecord) {
		if (event !== this.name) return false;

		if (payload.status === 'draft') {
			await EventBus.emit('post.drafted', payload);
		}

		if (payload.status === 'published') {
			await EventBus.emit('post.published', payload);
		}

		return true;
	}
}

export default new PostUpdated();
