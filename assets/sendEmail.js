import sgMail from '@sendgrid/mail';
import { config } from 'dotenv';

config();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(SENDGRID_API_KEY);

export const sendEmail = async data => {
  const mail = { ...data, from: 'k.trzmiel@gmail.com' };
  await sgMail.send(mail);
  return true;
};
