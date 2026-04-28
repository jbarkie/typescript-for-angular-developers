import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// For this teaching app, MSW runs every time the app boots.
// In a real app you'd gate this on environment config. Keeping it simple here
// so the TS lessons are what students notice — not the build config.
async function startMocks() {
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

startMocks().then(() =>
  bootstrapApplication(App, appConfig).catch((err) => console.error(err)),
);
