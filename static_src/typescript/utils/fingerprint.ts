import FingerprintJSOS from '@fingerprintjs/fingerprintjs';
import FingerprintJSPro from '@fingerprintjs/fingerprintjs-pro';
import type { GetResult } from '@fingerprintjs/fingerprintjs';
import type { ExtendedGetResult } from '@fingerprintjs/fingerprintjs-pro';

import config from '../config';

type Fingerprint = {
    visitorId: string;
    ip: string | undefined;
    browserName: string | undefined;
    browserVersion: string | undefined;
    os: string | undefined;
    osVersion: string | undefined;
};

const isExtendedResult = (
    result: ExtendedGetResult | GetResult,
): result is ExtendedGetResult => {
    if ((result as ExtendedGetResult).ip) {
        return true;
    }
    return false;
};

/**
 * Returns the user's current fingerprint
 *
 * If the fingerprint for this user is found in local storage, this function just returns
 * that. Otherwise, a fingerprint will be generated for them.
 *
 * How the fingerprint is generated is determined by a couple of factors: If the user has
 * consented to Functional Cookies, and if a Fingerprint JS Pro public key is set.
 *
 * If the user has consented to Functional Cookies via the OneTrust UI, and a Fingerprint
 * JS Pro public key is available, Fingerprint JS Pro will be used to generate a
 * fingerprint for the user.
 *
 * Otherwise, the open-source Fingerprint JS library is used.
 */
export async function getFingerprint(): Promise<Fingerprint> {
    let fp = null;
    let result = null;

    if (config.fingerprintPublicApiKey) {
        try {
            fp = await FingerprintJSPro.load({
                apiKey: config.fingerprintPublicApiKey,
                // Specify EU region if endpoint is undefined. Otherwise use the custom endpoint.
                // NB: Only one of region or endpoint should be set at one time, otherwise
                // this will crash.
                region: config.fingerprintEndpoint ? undefined : 'eu',
                endpoint: config.fingerprintEndpoint || undefined,
                // Despite being an NPM package, the FPJS Pro runtime still
                // needs to be downloaded client-side. This tells the loader
                // where to download the script. (e.g. through the
                // webchat.samaritans.org Cloudflare worker proxy.)
                scriptUrlPattern: [
                    config.fingerprintScriptUrlPattern ||
                        FingerprintJSPro.defaultScriptUrlPattern,
                    FingerprintJSPro.defaultScriptUrlPattern,
                ],
            });

            result = await fp.get({ extendedResult: true });
        } catch (e) {
            console.error(
                'FPJSPro encountered an error. Falling back to FPJSOS.',
            );
            fp = await FingerprintJSOS.load();
            result = await fp.get();
        }
    } else {
        fp = await FingerprintJSOS.load();
        result = await fp.get();
    }

    if (isExtendedResult(result)) {
        return {
            visitorId: result.visitorId,
            ip: result.ip,
            browserName: result.browserName,
            browserVersion: result.browserVersion,
            os: result.os,
            osVersion: result.osVersion,
        };
    }

    return {
        visitorId: result.visitorId,
        ip: undefined,
        browserName: undefined,
        browserVersion: undefined,
        os: undefined,
        osVersion: undefined,
    };
}
