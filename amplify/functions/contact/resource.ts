import { defineFunction, secret } from '@aws-amplify/backend';

export const contactHandler = defineFunction({
  name: 'contact-handler',
  entry: './handler.ts',
  environment: {
    EMAIL_USER: secret('EMAIL_USER'), // Ton email Gmail
    EMAIL_PASS: secret('EMAIL_PASS'), // Ton mot de passe d'app Google
  },
});