import http from 'http';

export default async function () {
  function promiseServerClose(server: http.Server): Promise<void> {
    return new Promise<void>((resolve) => {
      server.close(() => {
        resolve();
      })
    });
  }

  try {
    // Destroy the test user and test event and test venue
    globalThis.user1.destroy();
    globalThis.user2.destroy();
    globalThis.event1.destroy();
    globalThis.event2.destroy();
    globalThis.venue1.destroy();
    globalThis.venue2.destroy();
    // Close the server
    await promiseServerClose(globalThis.testServer);
  } catch (error: unknown) {
    console.error('Failed to delete test data from DB and close server:', error);
  }
}
