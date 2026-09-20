import { Resend } from 'resend';
import TransactionCreatedEmail from '@/emails/TransactionCreatedEmail';
import CriticalActivityEmail from '@/emails/CriticalActivityEmail';
import { render } from '@react-email/render';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface TransactionEmailData {
  to: string;
  userName: string;
  transactionId: string;
  amount: number;
  description: string;
  status: string;
}

export interface CriticalActivityEmailData {
  to: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  details?: string;
}

export async function sendTransactionEmail(data: TransactionEmailData) {
  if (!resend) {
    console.warn('Resend is not configured. Email would be sent to:', data.to);
    console.log('Email data:', data);
    return { messageId: 'mock-message-id', configured: false };
  }

  try {
    const emailHtml = await render(
      TransactionCreatedEmail({
        userName: data.userName,
        transactionId: data.transactionId,
        amount: data.amount,
        description: data.description,
        status: data.status,
      })
    );

    const { data: resendData, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
      to: data.to,
      subject: `Transaction Created: ${data.transactionId}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Failed to send email via Resend:', error);
      throw error;
    }

    return { messageId: resendData?.id, configured: true };
  } catch (error) {
    console.error('Error sending transaction email:', error);
    throw error;
  }
}

export async function sendCriticalActivityEmail(data: CriticalActivityEmailData) {
  if (!resend) {
    console.warn('Resend is not configured. Email would be sent to:', data.to);
    console.log('Email data:', data);
    return { messageId: 'mock-message-id', configured: false };
  }

  try {
    const emailHtml = CriticalActivityEmail({
      userName: data.userName,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      timestamp: data.timestamp,
      details: data.details,
    });

    const { data: resendData, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
      to: data.to,
      subject: `Critical Activity: ${data.action}`,
      react: emailHtml,
    });

    if (error) {
      console.error('Failed to send email via Resend:', error);
      throw error;
    }

    return { messageId: resendData?.id, configured: true };
  } catch (error) {
    console.error('Error sending critical activity email:', error);
    throw error;
  }
}

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY && !!process.env.EMAIL_FROM;
}
