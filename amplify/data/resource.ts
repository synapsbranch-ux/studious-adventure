import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { contactHandler } from '../functions/contact/resource';

const schema = a.schema({
  // Définition de la mutation pour envoyer le message
  envoyerContact: a
    .mutation()
    .arguments({
      name: a.string().required(),
      email: a.string().required(),
      phone: a.string(), // Optionnel
      message: a.string().required(),
    })
    .returns(a.json()) // On retourne un objet JSON générique pour éviter les erreurs de typage strict
    .authorization((allow) => [
      // Autorise l'accès public via une Clé API (le plus simple pour un formulaire de contact)
      allow.publicApiKey(), 
    ])
    .handler(a.handler.function(contactHandler)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    // Définit la Clé API comme méthode d'autorisation par défaut
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30, // La clé sera valide 30 jours (Amplify la renouvelle automatiquement en dev)
    },
  },
});