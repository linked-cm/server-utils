import path from 'path';

export class BackendProvider {
  public request;
  public response;

  constructor(public server, public lincdServer) {}

  /**
   * Each request, all providers are given the opportunity to provide data for the request.
   * For example, a provider that handles logins, may return data about the current user
   * This data will then be available on the frontend right upon initialisation
   */
  supplyDataForRequest(
    request,
    response,
    data: Record<string, any>
  ): Promise<void> | void {
    return null;
  }

  initRequest(request, response): Promise<void> | void {
    this.request = request;
    this.response = response;
  }

  setupBeforeControllers() {}
  setupBeforeCatchAllControllers() {}
  setupAfterControllers() {}

  protected async assignEnvPathToField(envKey, field) {
    let envValue = process.env[envKey];
    if (envValue) {
      if (envValue.indexOf('./') === 0) {
        envValue = path.resolve(process.cwd(), envValue);
      }
      try {
        //require the path defined in the environment variable
        let envModule = await import(envValue);
        //if the module has a default export, use that
        if (envModule.default) {
          this[field] = envModule.default;
        } else {
          //otherwise, use the first named export
          let keys = Object.getOwnPropertyNames(envModule).filter(
            (p) => p !== '__esModule'
          );
          if (keys.length > 0) {
            this[field] = envModule[keys[0]];
          } else {
            console.warn(
              process.env[envKey] + ' does not export a default or named export'
            );
          }
        }
      } catch (e) {
        console.error(
          'Error loading ' +
            process.env[envKey] +
            ' defined by environment variable ' +
            envKey,
          e
        );
      }
    }
  }
  protected callOtherProvider<S extends BackendProvider>(
    provider: typeof BackendProvider
  ): S {
    //init and return a new instance of the given provider with the same request and response
    let authProvider = new provider(this.server, this.lincdServer);
    authProvider.request = this.request;
    authProvider.response = this.response;
    // authProvider.initRequest(this.request, this.response);
    return authProvider as S;
  }
}
