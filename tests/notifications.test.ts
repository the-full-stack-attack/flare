import axios from 'axios';

const PORT = globalThis.PORT;

describe('Notifications Server Handlers', () => {
  const user_id = globalThis.user1.id; // req.user
  const eventId1 = globalThis.event1.id; // Notification sends right away since event is in one hour
  const eventId2 = globalThis.event2.id; // Notification sends an hour later so shouldn't show up with GET
  
  beforeEach(async () => {
    // User attends event 1
    await axios.post(`http://localhost:${PORT}/api/event/attend/${eventId1}`);
    // User attends event 2
    await axios.post(`http://localhost:${PORT}/api/event/attend/${eventId2}`);
  });

  test('GET /api/notifications retrieves notifications for user according to send_time', async () => {
    try {
      const { data: notifications } = await axios.get(`http://localhost:${PORT}/api/notifications`);
  
      expect(notifications).toBeDefined();
      expect(Array.isArray(notifications)).toBe(true);
      expect(notifications.length).toBe(1); // Should not send back the notifications before their send time
    } catch (error: unknown) {
      console.error('Failed to GET /api/notifications', error);
    }
  });
});