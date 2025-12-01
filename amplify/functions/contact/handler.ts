import type { Handler } from 'aws-lambda';
import type { Transporter } from 'nodemailer';

// Création du transporteur (hors du handler pour être réutilisé si la fonction est "chaude")
const createTransporter = async (): Promise<Transporter> => {
  const nodemailer = await import('nodemailer');
  return nodemailer.default.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const handler: Handler = async (event) => {
  // 1. Récupération des arguments depuis l'appel API
  const { name, email, phone, message } = event.arguments;

  // Validation rapide
  if (!name || !email || !message) {
    return { success: false, message: 'Les champs nom, email et message sont obligatoires' };
  }

  const transporter = await createTransporter();

  try {
    // --- EMAIL 1 : Pour toi (ADMIN) ---
    const mailOptionsAdmin = {
      from: `"LIMAJS MOTORS" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Nouveau message de ${name} via le formulaire de contact`,
      text: `Nom: ${name}\nEmail: ${email}\nTéléphone: ${phone || 'Non spécifié'}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <h2 style="color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Nouveau message de contact</h2>
          <div style="margin-bottom: 20px;">
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #3b82f6;">${email}</a></p>
            ${phone ? `<p><strong>Téléphone:</strong> <a href="tel:${phone}" style="color: #3b82f6;">${phone}</a></p>` : ''}
          </div>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #333;">Message:</h3>
            <p style="white-space: pre-line;">${message}</p>
          </div>
        </div>
      `
    };

    // --- EMAIL 2 : Pour le client (CONFIRMATION) ---
    const mailOptionsClient = {
      from: `"LIMAJS MOTORS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Nous avons bien reçu votre message',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <h2 style="color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Merci pour votre message, ${name}!</h2>
          <p>Nous avons bien reçu votre message et nous vous remercions de nous avoir contactés.</p>
          <p>Notre équipe examinera votre demande et vous répondra dans les plus brefs délais.</p>
          <div style="margin: 30px 0; padding: 15px; background-color: #f0f9ff; border-left: 4px solid #3b82f6; border-radius: 3px;">
            <p><strong>Heures d'ouverture:</strong></p>
            <p>Bureaux administratifs: Lundi - Vendredi (8h00 - 17h00), Samedi (8h00 - 12h00)</p>
          </div>
          <p>Si vous avez besoin d'une assistance immédiate, n'hésitez pas à nous appeler au <a href="tel:+50941704234" style="color: #3b82f6;">+509 41 70 4234</a>.</p>
          <p style="margin-top: 30px;">Cordialement,</p>
          <p><strong>L'équipe LIMAJS MOTORS</strong></p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e1e1e1; font-size: 12px; color: #6b7280; text-align: center;">
            <p>LIMAJS MOTORS - Génipailler, 3e Section Milot, Haïti</p>
          </div>
        </div>
      `
    };

    // Envoi des deux emails en parallèle (Promise.all pour la rapidité)
    await Promise.all([
      transporter.sendMail(mailOptionsAdmin),
      transporter.sendMail(mailOptionsClient)
    ]);

    return {
      success: true,
      message: 'Emails envoyés avec succès'
    };

  } catch (error) {
    console.error('Erreur d\'envoi:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'envoi',
      // En prod, évite de renvoyer l'erreur technique exacte au client
      error: JSON.stringify(error)
    };
  }
};