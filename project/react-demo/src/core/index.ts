import { sappSDK } from 'servkit';

export async function bootstrap() {
  const isMiniAppMode = window != window.top;
  if (isMiniAppMode) {
    await sappSDK.setConfig({}).start();
  }
}
