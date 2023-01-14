import EventBus from '@/events/EventBus';
import PostUpdated from '@/events/handlers/PostUpdated';

const mockedEventBus = EventBus as jest.Mocked<typeof EventBus>;

describe('Post Updated Event', () => {
	beforeEach(() => {
		EventBus.emit = jest.fn();
	});

	afterEach(jest.clearAllMocks);

	it('should has a compatible event name', () => {
		const event = PostUpdated;
		expect(event.event()).toBe('post.updated');
	});

	it('should not handle the incompatible event', async () => {
		const response = await PostUpdated.handle('any.kindofevent', {
			id: 'anyid',
			title: 'Post Title',
			content: 'My post content',
			status: 'draft',
		});

		expect(response).toBeFalsy();
		expect(mockedEventBus.emit).not.toHaveBeenCalled();
	});

	const eventByStatusDataset = [
		{ status: 'draft', event: 'post.drafted' },
		{ status: 'published', event: 'post.published' },
	];

	it.each(eventByStatusDataset)(
		`should emit $event when status is $status`,
		async ({ event, status }) => {
			const payload = {
				id: 'anyid',
				title: 'Post Title',
				content: 'My post content',
				status: status,
			} as any;

			mockedEventBus.emit.mockResolvedValue(true);
			const response = await PostUpdated.handle(
				'post.updated',
				payload
			);

			expect(response).toBeTruthy();
			expect(mockedEventBus.emit).toHaveBeenCalledWith(event, payload);
			expect(mockedEventBus.emit).toHaveBeenCalledTimes(1);
		}
	);
});
