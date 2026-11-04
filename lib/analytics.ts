// Conversion events for the self-hosted Umami. No-op until the visitor accepts analytics
// (the tracker is only loaded after consent). Never pass personal data here.
declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string | number>) => void };
  }
}

export function track(event: string, data?: Record<string, string | number>) {
  try {
    window.umami?.track(event, data);
  } catch {
    // Analytics must never break a form.
  }
}
