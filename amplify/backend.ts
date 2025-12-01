import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { contactHandler } from './functions/contact/resource';

defineBackend({
  auth,
  data,
  contactHandler, // Ajout de la fonction ici
});