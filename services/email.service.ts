import nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { InternalServerError } from 'http-errors';

const EMAIL_HOST: string = process.env.EMAIL_HOST as string;
const EMAIL_PORT: number = parseInt(process.env.EMAIL_PORT as string, 10);
const EMAIL_USER: string = process.env.EMAIL_USER as string;
const EMAIL_PASS: string = process.env.EMAIL_PASS as string;
const APP_NAME: string = process.env.APP_NAME || 'Ratacueva';
const APP_URL: string = process.env.APP_URL || 'http://localhost:3000';

let transporter: Transporter;

const createTransporter = () => {
  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
    throw new InternalServerError('Error en la configuración del servicio de correo.');
  }

  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    }
  });
};

createTransporter();

const sendEmail = async (to: string, subject: string, text: string, html: string): Promise<void> => {
  try {
    const mailOptions = {
      from: `"${APP_NAME}" <${EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email enviado a ${to} con asunto: ${subject}`);
  } catch (error) {
    console.error(`Error al enviar email a ${to}:`, error);
    throw new InternalServerError('Error al enviar el correo electrónico.');
  }
};

export const sendVerificationEmail = async (toEmail: string, verificationToken: string, userId: string): Promise<void> => {
  const verificationLink = `${APP_URL}/api/auth/verify-email?token=${verificationToken}&userId=${userId}`;
  const subject = 'Verifica tu cuenta de correo electrónico';
  const text = `Hola,\n\nPor favor, verifica tu cuenta haciendo clic en el siguiente enlace: ${verificationLink}\n\nSi no solicitaste esto, puedes ignorar este correo.\n\nSaludos,\nEl equipo de ${APP_NAME}`;
  const html = `
    <p>Hola,</p>
    <p>Por favor, verifica tu cuenta de correo electrónico haciendo clic en el siguiente enlace:</p>
    <p><a href="${verificationLink}">Verificar mi Cuenta</a></p>
    <p>Si no solicitaste esto, puedes ignorar este correo.</p>
    <p>Saludos,</p>
    <p>El equipo de ${APP_NAME}</p>
  `;
  await sendEmail(toEmail, subject, text, html);
};

export const sendPasswordResetEmail = async (toEmail: string, resetToken: string, userId: string): Promise<void> => {
  const resetLink = `${APP_URL}/api/auth/reset-password?token=${resetToken}&userId=${userId}`;
  const subject = 'Restablece tu contraseña';
  const text = `Hola,\n\nHas solicitado restablecer tu contraseña. Haz clic en el siguiente enlace: ${resetLink}\n\nSi no solicitaste esto, puedes ignorar este correo.\n\nSaludos,\nEl equipo de ${APP_NAME}`;
  const html = `
    <p>Hola,</p>
    <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
    <p><a href="${resetLink}">Restablecer Contraseña</a></p>
    <p>Si no solicitaste esto, puedes ignorar este correo.</p>
    <p>Saludos,</p>
    <p>El equipo de ${APP_NAME}</p>
  `;
  await sendEmail(toEmail, subject, text, html);
};