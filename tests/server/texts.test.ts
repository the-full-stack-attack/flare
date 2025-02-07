import axios from 'axios';
import http from 'http';
import Text from '../../src/server/db/models/texts';

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

describe('Texts Server Handlers', () => {
  
  const event_id = globalThis.event1.id; // Event used for testing
  const user_id = globalThis.user1.id; // req.user
  
  beforeEach(async () => {
    try {
      const body = {
        text: {
          content: 'Test Text Message',
          time_from_start: '30-minutes',
          send_time: new Date(Date.now() + 1000 * 60 * 30),
          event_id,
        },
      };
  
      await axios.post(`http://localhost:${PORT}/api/text`, body);
    } catch (error: unknown) {
      console.error('Failed to POST /api/text', error);
    }
  });

  afterEach(async () => {
    try {
      await Text.destroy({ where: { user_id, event_id } });
    } catch (error: unknown) {
      console.error('Failed to Destroy text:', error);
    }
  })

  test('POST /api/text stores text in Database', async () => {
    try {
      const text: any = await Text.findOne({ where: { user_id, event_id } });
      
      expect(text.content).toBe('Test Text Message');
      expect(text.time_from_start).toBe('30-minutes');
      expect(text.user_id).toBe(user_id);
      expect(text.event_id).toBe(event_id);
    } catch (error: unknown) {
      console.error('Failed to query Database for text:', error);
    }
  });

  test('GET /api/text/:eventId retrieves text using user_id & event_id', async () => {
    try {
      const { data: text } = await axios.get(`http://localhost:${PORT}/api/text/${event_id}`);
      
      expect(text.content).toBe('Test Text Message');
      expect(text.time_from_start).toBe('30-minutes');
      expect(text.user_id).toBe(user_id);
      expect(text.event_id).toBe(event_id);
    } catch (error: unknown) {
      console.error('Failed to GET /api/text/:eventId', error);
    }
  });

  test('PATCH /api/text/:eventId updates text info for user', async () => {
    try {
      const { data: text } = await axios.get(`http://localhost:${PORT}/api/text/${event_id}`);
      
      expect(text.content).toBe('Test Text Message');
      expect(text.time_from_start).toBe('30-minutes');


      const newContent = 'New updated content'

      await axios.patch(`http://localhost:${PORT}/api/text/${event_id}`, { text: { content: newContent } });
      const { data: updateContentText } = await axios.get(`http://localhost:${PORT}/api/text/${event_id}`);

      expect(updateContentText.content).toBe(newContent);


      const newTimeFromStart = '2-hours';

      await axios.patch(`http://localhost:${PORT}/api/text/${event_id}`, { text: { time_from_start: newTimeFromStart } });
      const { data: updateTimeFromStartText } = await axios.get(`http://localhost:${PORT}/api/text/${event_id}`);

      expect(updateTimeFromStartText.time_from_start).toBe(newTimeFromStart);
    } catch (error: unknown) {
      console.error('Failed to update text info with PATCH request', error);
    }
  });

  test('DELETE /api/text/:eventId deletes text from database', async () => {
    try {
      // Check that the text is there before deletion
      const { data: text } = await axios.get(`http://localhost:${PORT}/api/text/${event_id}`);
      expect(text.content).toBe('Test Text Message');
      expect(text.time_from_start).toBe('30-minutes');
      expect(text.user_id).toBe(user_id);
      expect(text.event_id).toBe(event_id);
      
      // Send request to DELETE to the text
      await axios.delete(`http://localhost:${PORT}/api/text/${event_id}`);
      
      // Check GET for deletedText
      const { data: fetchedDeletedText } = await axios.get(`http://localhost:${PORT}/api/text/${event_id}`);
      expect(fetchedDeletedText).toBe('');

      // Check Database for deletedText
      const isItDeleted = await Text.findOne({ where: { user_id, event_id } });
      expect(isItDeleted).toBe(null);
    } catch (error: unknown) {
      console.error('Failed to DELETE /api/text/:eventId', error);
    }
  });
});