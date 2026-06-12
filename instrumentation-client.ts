import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const enabled =
  process.env.NODE_ENV === "production" ||
  process.env.NEXT_PUBLIC_SENTRY_ENABLE_IN_DEV === "true";

function isIgnoredBrowserNoise(event: Sentry.Event) {
  const exceptionValue = event.exception?.values?.[0]?.value ?? "";
  return exceptionValue.includes("TrackerStorageType is not defined");
}

if (dsn) {
  Sentry.init({
    dsn,
    enabled,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    sendDefaultPii: false,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    beforeSend(event) {
      delete event.user;
      if (isIgnoredBrowserNoise(event)) return null;
      return event;
    },
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
