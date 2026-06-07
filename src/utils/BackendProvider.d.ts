export declare class BackendProvider {
    server: any;
    lincdServer: any;
    request: any;
    response: any;
    constructor(server: any, lincdServer: any);
    /**
     * Each request, all providers are given the opportunity to provide data for the request.
     * For example, a provider that handles logins, may return data about the current user
     * This data will then be available on the frontend right upon initialisation
     */
    supplyDataForRequest(request: any, response: any, data: Record<string, any>): Promise<void> | void;
    initRequest(request: any, response: any): Promise<void> | void;
    setupBeforeControllers(): void;
    setupBeforeCatchAllControllers(): void;
    setupAfterControllers(): void;
    protected assignEnvPathToField(envKey: any, field: any): Promise<void>;
    protected callOtherProvider<S extends BackendProvider>(provider: typeof BackendProvider): S;
}
