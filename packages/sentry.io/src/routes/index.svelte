<script>
    import * as Sentry from "@sentry/browser";
    import { BrowserTracing } from "@sentry/tracing";

    Sentry.init({
            dsn: "https://447ef65168574d7da03b31dfc2bf8255@o1234989.ingest.sentry.io/6384751",

            // Alternatively, use `process.env.npm_package_version` for a dynamic release version
            // if your build tool supports it.
            release: "my-project-name@2.3.12",
            integrations: [new BrowserTracing()],

            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for performance monitoring.
            // We recommend adjusting this value in production
            tracesSampleRate: 1.0,

    });

    setTimeout(()=>{
        throw new Error('myUndefinedFunction()');
    }, 1000);

</script>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
