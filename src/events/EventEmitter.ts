import axios from 'axios';

import { EVENT_URL } from '@/env/config';
import { TFnEventEmitter } from '@/types/types';
import Logger from '@/utils/Logger';

const emitter: TFnEventEmitter = async (type, payload) => {
	try {
		await axios.post(EVENT_URL, { type, payload });
	} catch (err) {
		Logger.getInstance().logger.error(err);
	}
};

export default emitter;
