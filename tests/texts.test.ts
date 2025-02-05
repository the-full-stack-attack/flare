import axios from 'axios';
import Text from '../src/server/db/models/texts';

const PORT = globalThis.PORT;

describe('Texts Server Handlers', () => {
  
  const event_id = globalThis.event1.dataValues.id; // Event used for testing
  const user_id = globalThis.user1.dataValues.id; // req.user
  
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

  test('2 + 2', () => {
    expect(2 + 2).toBe(4);
  });
});