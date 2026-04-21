# lincd-server-utils

provides a set of utilities for applications with a lincd-server backend.

## Server

```tsx
import { Server } from 'lincd-server-utils/lib/utils/Server';
```

Call the server from the frontend.

## LinkedEmail

Send emails from anywhere in the backend.

Make sure to install an email client first, like `lincd-zeptomail`.
By adding `lincd-zeptomail` to your project (in package.json), it will automatically be used as the default email client.

After this, you can send emails from anywhere in the backend.

```tsx
LinkedEmail.sendEmail({
  ...
});
```

### Setting a default provider

If you want to implement an email client, you can use `LinkedEmail.setDefaultProvider` to set the default email client.
You can do this in the constructor of your backend provider. Here is an example:

```tsx
import { LinkedEmail } from 'lincd-server-utils/lib/utils/LinkedEmail';
// import your email client from this package
import { MyMailClient } from './utils/MyMailClient';
import { BackendProvider } from 'lincd-server-utils/lib/utils/BackendProvider';
export class MyBackendProvider extends BackendProvider {
  constructor(s) {
    super(s);
    LinkedEmail.setDefaultProvider(new MyMailClient());
  }
}
```
