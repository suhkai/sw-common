import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";


Sentry.init({
  dsn: "https://7e952013f2d4430590e223d154ade430@o1234989.ingest.sentry.io/6385378",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  release:""
});

const transaction = Sentry.startTransaction({
  op: "test",
  name: "My First Test Transaction",
});

// can you see this comment
// 8-May-2022-15:54 CET
setTimeout(() => {
  try {
    foo();
  } catch (e) {
    Sentry.captureException(e);
  } finally {
    transaction.finish();
  }
}, 99);