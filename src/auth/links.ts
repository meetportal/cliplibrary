export const AUTH_RETURN_PARAM = 'auth_return';

export const signInHref = (returnTo: string): string =>
  `/sign-in?redirect_url=${encodeURIComponent(returnTo)}`;

export const safeReturnPath = (value: string | null): string =>
  value?.startsWith('/') === true && !value.startsWith('//') ? value : '/';

export const withAuthReturn = (path: string): string =>
  `${path}${path.includes('?') ? '&' : '?'}${AUTH_RETURN_PARAM}=1`;

export const withoutAuthReturn = (url: URL): string => {
  const next = new URL(url);
  next.searchParams.delete(AUTH_RETURN_PARAM);
  return `${next.pathname}${next.search}${next.hash}`;
};
