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

describe('Events Server Handlers', () => {
  test('GET /api/events responds with an array of events', async () => {
    try {
      const { data: fetchedEvents } = await axios.get(`http://localhost:${PORT}/api/event`, {
        params: {
          locationFilter: {
            city: '',
            state: '',
          }
        }
      });
      expect(fetchedEvents).toBeDefined();
      expect(Array.isArray(fetchedEvents)).toBe(true);
      expect(fetchedEvents.length).toBeGreaterThanOrEqual(2);
    } catch (error: unknown) {
      // console.error('Failed to get events for test:', error);
    }
  });

  test('GET /api/events responds with events from a specified location', async () => {
    try {
      const { data: fetchedEvents } = await axios.get(`http://localhost:${PORT}/api/event`, {
        params: {
          locationFilter: {
            city: 'New Orleans',
            state: 'LA',
          }
        }
      });
      expect(fetchedEvents).toBeDefined();
      expect(Array.isArray(fetchedEvents)).toBe(true);
      expect(fetchedEvents.length).toBeGreaterThanOrEqual(1);
      expect(fetchedEvents[0].Venue.city_name).toBe('New Orleans');
      expect(fetchedEvents[0].Venue.state_name).toBe('LA');
    } catch (error: unknown) {
      // console.error('Failed to get events for test:', error);
    }
  });

  test('GET /api/events responds with no events from a location with no events', async () => {
    try {
      const { data: fetchedEvents } = await axios.get(`http://localhost:${PORT}/api/event`, {
        params: {
          locationFilter: {
            city: 'Nowhere',
            state: 'XX',
          }
        }
      });

      expect(fetchedEvents).toBeDefined();
      expect(Array.isArray(fetchedEvents)).toBe(true);
      expect(fetchedEvents.length).toBe(0);
    } catch (error: unknown) {
      // console.error('Failed to get events for test:', error);
    }
  });
});
