import { FastifyInstance } from 'fastify';

export type TAvailableEnvs = 'test' | 'development' | 'production';

export type TEnvVariables = {
	name: string;
	version: string;
	port: number;
	host: string;
	environment: TAvailableEnvs;
};

export type TFnApplyToFastify = (
	app: FastifyInstance,
	env: TEnvVariables
) => Promise<void>;

export type TFnEventEmitter<T = object> = (
	type: string,
	payload: T
) => Promise<void>;
