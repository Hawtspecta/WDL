import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { EmailEventType } from '@prisma/client';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const signature = headersList.get('resend-signature');
    const timestamp = headersList.get('resend-timestamp');
    
    if (!signature || !timestamp) {
      return NextResponse.json(
        { error: 'Missing signature headers' },
        { status: 400 }
      );
    }

    // Get the raw body for signature verification
    const rawBody = await request.text();
    
    // Verify webhook signature
    // Note: In production, you should verify the signature using the Resend webhook secret
    // const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    // const expectedSignature = crypto
    //   .createHmac('sha256', webhookSecret)
    //   .update(`${timestamp}.${rawBody}`)
    //   .digest('hex');
    // 
    // if (signature !== expectedSignature) {
    //   return NextResponse.json(
    //     { error: 'Invalid signature' },
    //     { status: 401 }
    //   );
    // }

    const eventData = JSON.parse(rawBody);
    
    // Map Resend event types to our enum
    const eventTypeMap: Record<string, EmailEventType> = {
      'sent': EmailEventType.SENT,
      'delivered': EmailEventType.DELIVERED,
      'opened': EmailEventType.OPENED,
      'clicked': EmailEventType.CLICKED,
      'bounced': EmailEventType.BOUNCED,
      'failed': EmailEventType.FAILED,
      'delayed': EmailEventType.DELAYED,
    };

    const eventType = eventTypeMap[eventData.type] || EmailEventType.SENT;
    
    // Extract relevant data from the webhook payload
    const messageId = eventData.data?.message_id || eventData.message_id || 'unknown';
    const recipient = eventData.data?.to?.[0] || eventData.data?.email || 'unknown';
    const subject = eventData.data?.subject || null;
    const timestamp = new Date(eventData.created_at || Date.now());
    
    // Create email event record
    const emailEvent = await prisma.emailEvent.create({
      data: {
        eventType,
        messageId,
        recipient,
        subject,
        timestamp,
        metadata: {
          raw: eventData,
          // Add additional metadata based on event type
          ...(eventType === EmailEventType.BOUNCED && {
            bounceReason: eventData.data?.error?.reason || eventData.data?.reason,
          }),
          ...(eventType === EmailEventType.FAILED && {
            failureReason: eventData.data?.error?.reason,
          }),
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: emailEvent,
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
