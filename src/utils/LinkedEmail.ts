export interface IEmailProvider {
  send(emailOptions: EmailOptions): Promise<void>;
}
export interface EmailContact {
  address: string;
  name: string;
}

export interface EmailOptions {
  bounce_address?: string;
  from?: EmailContact;
  to: { email_address: EmailContact }[];
  subject: string;
  htmlbody: string;
}

export class LinkedEmail {
  private static provider: IEmailProvider;

  static setDefaultProvider(provider: IEmailProvider) {
    this.provider = provider;
  }
  static hasDefaultProvider() {
    return this.provider && true;
  }
  static send(emailOptions: EmailOptions) {
    if (!this.provider)
      throw new Error(
        'No email provider set. Make sure the package of your email provider is added to package.json of the application.'
      );
    return this.provider.send(emailOptions);
  }
}
