import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  http.get('/api/health', async () => {
    await delay(120);
    return HttpResponse.json({ status: 'ok', msw: true });
  }),

  http.post('/api/mocks/reset', async () => {
    await delay(100);
    return HttpResponse.json({ reset: true, timestamp: new Date().toISOString() });
  })
];
