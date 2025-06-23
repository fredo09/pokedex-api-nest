import axios, { AxiosInstance } from 'axios'
import { Injectable } from '@nestjs/common';
import { HttpAdapterI } from "../interface";

@Injectable()
export class AxiosAdapter implements HttpAdapterI {
	private axios: AxiosInstance = axios;

	async get<T>(url: string): Promise<T> {
		try {

			const {data} = await this.axios.get<T>(url);
			return data;
		} catch (error) {

			console.warn("🚀 ~ content_log :", error);
			throw new Error('Error in GET request');
		}
	}
}