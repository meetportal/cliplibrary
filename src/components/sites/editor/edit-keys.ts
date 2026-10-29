const storageKey = (slug: string): string => `neuclip-site-key:${slug}`;

export const rememberEditKey = (slug: string, editKey: string): void => {
  try {
    localStorage.setItem(storageKey(slug), editKey);
  } catch {
    return;
  }
};

export const recallEditKey = (slug: string): string | null => {
  try {
    return localStorage.getItem(storageKey(slug));
  } catch {
    return null;
  }
};

export const publicSiteUrl = (slug: string): string => `${window.location.origin}/s/${slug}`;

export const editSiteUrl = (slug: string, editKey: string): string =>
  `${window.location.origin}/s/${slug}/edit#key=${encodeURIComponent(editKey)}`;
