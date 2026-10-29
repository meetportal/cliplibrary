// biome-ignore lint/style/noProcessEnv: Netlify sets URL to the site's public address at build time
const { URL: publicUrl = 'https://neuclip.netlify.app' } = process.env;

export const SITE_URL = new URL(publicUrl);
