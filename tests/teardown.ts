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
    await globalThis.user1.destroy();
    await globalThis.user2.destroy();
    await globalThis.event1.destroy();
    await globalThis.event2.destroy();
    await globalThis.venue1.destroy();
    await globalThis.venue2.destroy();
    await globalThis.notif1.destroy();
    await globalThis.notif2.destroy();
    // Close the server
    await promiseServerClose(globalThis.testServer);
  } catch (error: unknown) {
    console.error('Failed to delete test data from DB and close server:', error);
  }
}
