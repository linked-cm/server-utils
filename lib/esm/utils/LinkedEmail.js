export class LinkedEmail {
    static setDefaultProvider(provider) {
        this.provider = provider;
    }
    static hasDefaultProvider() {
        return this.provider && true;
    }
    static send(emailOptions) {
        if (!this.provider)
            throw new Error('No email provider set. Make sure the package of your email provider is added to package.json of the application.');
        return this.provider.send(emailOptions);
    }
}
//# sourceMappingURL=LinkedEmail.js.map