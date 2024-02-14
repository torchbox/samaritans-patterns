import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';
import { RewriteFrames as RewriteFramesIntegration } from '@sentry/integrations';

if (document.getElementById('sentry_vars')) {
    const sentry_vars = JSON.parse(
        document.getElementById('sentry_vars').textContent,
    );

    Sentry.init({
        dsn: sentry_vars['SENTRY_DSN'],
        environment: sentry_vars['SENTRY_ENVIRONMENT'],
        release: sentry_vars['SENTRY_RELEASE'],
        integrations: [
            new RewriteFramesIntegration({
                iteratee: (frame) => {
                    // Modify the event to remove the hash suffix generated by
                    // ManifestStaticFileStorage from filename. This is necessary
                    // for Sentry to be able to tell which bundle the error came from.
                    if (frame.filename) {
                        const filenameParts = frame.filename.split('.');
                        filenameParts.splice(-2, 1);
                        frame.filename = filenameParts.join('.');
                    }
                    return frame;
                },
            }),
            new BrowserTracing(),
        ],

        // List of commonly unactionable errors taken from: https://gist.github.com/impressiver/5092952
        // Will cause a deprecation warning, but the demise of `ignoreErrors` is still under discussion.
        // See: https://github.com/getsentry/raven-js/issues/73
        ignoreErrors: [
            // Random plugins/extensions
            'top.GLOBALS',
            // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
            'originalCreateNotification',
            'canvas.contentDocument',
            'MyApp_RemoveAllHighlights',
            'http://tt.epicplay.com',
            "Can't find variable: ZiteReader",
            'jigsaw is not defined',
            'ComboSearch is not defined',
            'http://loading.retry.widdit.com/',
            'atomicFindClose',
            // Instagram browser error
            // https://developers.facebook.com/community/threads/320013549791141/
            "Can't find variable: _AutofillCallbackHandler",
            // Facebook borked
            'fb_xd_fragment',
            // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to reduce this. (thanks @acdha)
            // See http://stackoverflow.com/questions/4113268/how-to-stop-javascript-injection-from-vodafone-proxy
            'bmi_SafeAddOnload',
            'EBCallBackMessageReceived',
            // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
            'conduitPage',
            // Generic error code from errors outside the security sandbox
            // You can delete this if using raven.js > 1.0, which ignores these automatically.
            'Script error.',
            // Firefox extensions
            /^resource:\/\//i,
            // Ignore errors that are mostly likely to be network flakiness rather
            // than actual errors
            'TypeError: Failed to fetch',
            'TypeError: NetworkError when attempting to fetch resource.',
            'TypeError: Cancelled',
            // OneTrust error
            "TypeError ?(scripttemplates/6.32)",
            // Common third-party errors
            "TypeError: null is not an object (evaluating 'this.selector.appendChild')",
            "TypeError: undefined is not an object (evaluating 'r.DomainData')",
        ],
        denyUrls: [
            // Facebook flakiness
            /graph\.facebook\.com/i,
            // Facebook blocked
            /connect\.facebook\.net\/en_US\/all\.js/i,
            // Woopra flakiness
            /eatdifferent\.com\.woopra-ns\.com/i,
            /static\.woopra\.com\/js\/woopra\.js/i,
            // Chrome extensions
            /extensions\//i,
            /^chrome:\/\//i,
            // Other plugins
            /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
            /webappstoolbarba\.texthelp\.com\//i,
            /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
            // Ignore Google flakiness
            /\/(gtm|ga|analytics)\.js/i,
        ],
    });
    // Optional but adding tags will make it easier to filter issues on Sentry
    Sentry.setTag('lang', 'javascript');
    Sentry.setTag('module', 'front-end');
}
