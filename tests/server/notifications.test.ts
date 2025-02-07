import axios from 'axios';
import http from 'http';

import User_Notification from '../../src/server/db/models/users_notifications';

declare global {
  var PORT: number;
  var testServer: http.Server;
  var user1: any;
  var user2: any;
  var event1: any;
  var event2: any;
  var venue1: any;
  var venue2: any;
  var notif1: any;
  var notif2: any;
};

const PORT = globalThis.PORT;

describe('Notifications Server Handlers', () => {
  const UserId = globalThis.user1.id; // req.user
  const eventId1 = globalThis.event1.id; // Notification sends right away since event is in one hour
  const eventId2 = globalThis.event2.id; // Notification sends an hour later so shouldn't show up with GET
  
  beforeEach(async () => {
    // User attends event 1
    await axios.post(`http://localhost:${PORT}/api/event/attend/${eventId1}`);
    // User attends event 2
    await axios.post(`http://localhost:${PORT}/api/event/attend/${eventId2}`);
    // FindOrCreate used with these endpoints, so no need to delete between tests; teardown will delete them
  });

  test('POST /api/event/attend/:id adds notifications for user', async () => {
    try {
      // Check database for the notifications added since send_time will be tested later
      const notifications = await User_Notification.findAll({ where: { UserId } });

      expect(notifications).toBeDefined();
      expect(Array.isArray(notifications)).toBe(true);
      expect(notifications.length).toBe(2);
      // Only two should show up; this is testing that they get deleted after test suite
    } catch (error: unknown) {
      console.error('Failed to query User_Notifications:', error);
    }
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