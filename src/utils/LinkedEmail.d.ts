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
    to: {
        email_address: EmailContact;
    }[];
    subject: string;
    htmlbody: string;
}
export declare class LinkedEmail {
    private static provider;
    static setDefaultProvider(provider: IEmailProvider): void;
    static hasDefaultProvider(): boolean;
    static send(emailOptions: EmailOptions): Promise<void>;
}
