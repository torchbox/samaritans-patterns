import { fetchWithTimeout } from './fetchWithTimeout';

export type QueueStatusResponse = {
    agents_staffed: number;
    agents_online: number;
    agents_available: number;
    is_open: boolean;
    avg_queue_answer_time: number;
    avg_queue_answer_time_period: 'Hour' | 'Day' | 'Week';
};

export class MetricsAPIClient {
    constructor(
        private readonly queueId: string,
        private readonly endpoint: string,
        private readonly apiKey: string,
    ) {}

    async getQueueStatus(): Promise<QueueStatusResponse> {
        const url = `${this.endpoint}?queueId=${this.queueId}`;
        const options = {
            method: 'GET',
            headers: {
                'X-Api-Key': this.apiKey,
            },
        };
        const response = await fetchWithTimeout(url, 15_000, options);

        if (!response.ok) {
            throw new Error('Failed to fetch queue status');
        }

        return response.json();
    }
}
