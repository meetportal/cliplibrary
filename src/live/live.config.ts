const { LIVE_PORT, LIVE_APP_URL } = process.env;

export const LIVE_SERVER_PORT = Number(LIVE_PORT ?? 3210);

export const LIVE_EDITOR_URL = (LIVE_APP_URL ?? 'http://localhost:3201').replace(/\/$/, '');
