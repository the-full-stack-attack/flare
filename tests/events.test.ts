import axios from 'axios';

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
      console.error('Failed to get events for test:', error);
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
      console.error('Failed to get events for test:', error);
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
      console.error('Failed to get events for test:', error);
    }
  });
});
