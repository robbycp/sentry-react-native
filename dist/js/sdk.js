import { defaultIntegrations, getCurrentHub } from "@sentry/browser";
import { initAndBind, setExtra } from "@sentry/core";
import { RewriteFrames } from "@sentry/integrations";
import { getGlobalObject } from "@sentry/utils";
import { ReactNativeClient } from "./client";
import { DebugSymbolicator, DeviceContext, ReactNativeErrorHandlers, Release, } from "./integrations";
// const { RNSentry } = NativeModules;
const IGNORED_DEFAULT_INTEGRATIONS = [
    "GlobalHandlers",
    "TryCatch",
];
/**
 * Inits the SDK
 */
export function init(options = {
    enableNative: true,
    enableNativeCrashHandling: true,
}) {
    // tslint:disable: strict-comparisons
    if (options.defaultIntegrations === undefined) {
        options.defaultIntegrations = [
            new ReactNativeErrorHandlers(),
            new Release(),
            ...defaultIntegrations.filter((i) => !IGNORED_DEFAULT_INTEGRATIONS.includes(i.name)),
        ];
        if (__DEV__) {
            options.defaultIntegrations.push(new DebugSymbolicator());
        }
        options.defaultIntegrations.push(new RewriteFrames({
            iteratee: (frame) => {
                if (frame.filename) {
                    frame.filename = frame.filename
                        .replace(/^file\:\/\//, "")
                        .replace(/^address at /, "")
                        .replace(/^.*\/[^\.]+(\.app|CodePush|.*(?=\/))/, "");
                    if (frame.filename === "native") {
                        frame.in_app = false;
                    }
                    const appPrefix = "app://";
                    // We always want to have a tripple slash
                    frame.filename =
                        frame.filename.indexOf("/") === 0
                            ? `${appPrefix}${frame.filename}`
                            : `${appPrefix}/${frame.filename}`;
                }
                return frame;
            },
        }), new DeviceContext());
    }
    if (options.enableNative === undefined) {
        options.enableNative = true;
    }
    if (options.enableNativeCrashHandling === undefined) {
        options.enableNativeCrashHandling = true;
    }
    if (options.enableNativeNagger === undefined) {
        options.enableNativeNagger = true;
    }
    // tslint:enable: strict-comparisons
    initAndBind(ReactNativeClient, options);
    // TODO: Regist scope syncing here
    // Workaround for setting release/dist on native
    // const scope = getCurrentHub().getScope();
    // if (scope) {
    //   scope.addScopeListener(internalScope => {
    //     console.log(internalScope);
    //     // RNSentry.extraUpdated((internalScope as any)._extra)
    //   });
    // }
    // tslint:disable-next-line: no-unsafe-any
    if (getGlobalObject().HermesInternal) {
        getCurrentHub().setTag("hermes", "true");
    }
}
/**
 * Sets the release on the event.
 */
export function setRelease(release) {
    setExtra("__sentry_release", release);
}
/**
 * Sets the dist on the event.
 */
export function setDist(dist) {
    setExtra("__sentry_dist", dist);
}
/**
 * If native client is available it will trigger a native crash.
 * Use this only for testing purposes.
 */
export function nativeCrash() {
    const client = getCurrentHub().getClient();
    if (client) {
        client.nativeCrash();
    }
}
//# sourceMappingURL=sdk.js.map