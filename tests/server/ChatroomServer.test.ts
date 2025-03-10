import axios from 'axios';
import http from 'http';

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

describe('Chats Server Gets A Room', () => {
  test('GET /api/events responds with an array of events', async () => {
    try {
      const { data: macroArray } = await axios.get(`http://localhost:${PORT}/api/chatroom/chats`, {
        params: 
        {
        eventId: '1',
        user: 'bobby',
        userId:'3',
        }
      });
      expect(macroArray).toBeDefined();
      expect(Array.isArray(macroArray)).toBe(true);
    } catch (error: unknown) {
      console.error('wooah', error)
      // console.error('Failed to get events for test:', error);
    }
  });

});
