import { BrowserOptions } from "@sentry/browser";
import { BaseBackend } from "@sentry/core";
import { Event, EventHint, Severity, Transport } from "@sentry/types";
/**
 * Configuration options for the Sentry ReactNative SDK.
 * @see ReactNativeFrontend for more information.
 */
export interface ReactNativeOptions extends BrowserOptions {
    /**
     * Enables native transport + device info + offline caching.
     * Be careful, disabling this also breaks automatic release setting.
     * This means you have to manage setting the release yourself.
     * Defaults to `true`.
     */
    enableNative?: boolean;
    /**
     * Enables native crashHandling. This only works if `enableNative` is `true`.
     * Defaults to `true`.
     */
    enableNativeCrashHandling?: boolean;
    /** Maximum time to wait to drain the request queue, before the process is allowed to exit. */
    shutdownTimeout?: number;
    /** Should the native nagger alert be shown or not. */
    enableNativeNagger?: boolean;
}
/** The Sentry ReactNative SDK Backend. */
export declare class ReactNativeBackend extends BaseBackend<BrowserOptions> {
    protected readonly _options: ReactNativeOptions;
    private readonly _browserBackend;
    /** Creates a new ReactNative backend instance. */
    constructor(_options: ReactNativeOptions);
    /**
     * Starts native client with dsn and options
     */
    private _startWithOptions;
    /**
     * If the user is in development mode, and the native nagger is enabled then it will show an alert.
     */
    private _showCannotConnectDialog;
    /**
     * @inheritDoc
     */
    protected _setupTransport(): Transport;
    /**
     * If true, native client is availabe and active
     */
    private _isNativeTransportAvailable;
    /**
     * If native client is available it will trigger a native crash.
     * Use this only for testing purposes.
     */
    nativeCrash(): void;
    /**
     * @inheritDoc
     */
    eventFromException(exception: any, hint?: EventHint): PromiseLike<Event>;
    /**
     * @inheritDoc
     */
    eventFromMessage(message: string, level?: Severity, hint?: EventHint): PromiseLike<Event>;
}
//# sourceMappingURL=backend.d.ts.map