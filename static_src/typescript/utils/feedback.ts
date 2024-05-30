export class FeedbackAPI {
    constructor(private baseUrl: string, private apiKey: string) {}

    async submitPreFeedbackScore({
        contactId,
        distressScoreBefore,
    }: {
        contactId: string;
        distressScoreBefore: number;
    }) {
        const response = await fetch(`${this.baseUrl}/distress-score/before`, {
            method: 'POST',
            headers: {
                'X-Api-Key': this.apiKey,
            },
            body: JSON.stringify({
                contactId,
                distressScoreBefore: distressScoreBefore.toString(),
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to post feedback');
        }
    }

    async submitPostFeedbackScore({
        contactId,
        distressScoreAfter,
    }: {
        contactId: string;
        distressScoreAfter: number;
    }) {
        const response = await fetch(`${this.baseUrl}/distress-score/after`, {
            method: 'POST',
            headers: {
                'X-Api-Key': this.apiKey,
            },
            body: JSON.stringify({
                contactId,
                distressScoreAfter: distressScoreAfter.toString(),
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to post feedback');
        }
    }
}
