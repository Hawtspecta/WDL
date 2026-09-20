import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from '@react-email/components';

interface CriticalActivityEmailProps {
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  details?: string;
}

export default function CriticalActivityEmail({
  userName,
  action,
  entityType,
  entityId,
  timestamp,
  details,
}: CriticalActivityEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Critical Activity Detected - Transaction Portal</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Critical Activity Detected</Heading>
          <Text style={text}>Hello {userName},</Text>
          <Text style={text}>
            We detected important activity on your account. Please review the details below:
          </Text>
          
          <Section style={box}>
            <Text style={text}>
              <strong>Action:</strong> {action}
            </Text>
            <Text style={text}>
              <strong>Entity Type:</strong> {entityType}
            </Text>
            <Text style={text}>
              <strong>Entity ID:</strong> {entityId}
            </Text>
            <Text style={text}>
              <strong>Timestamp:</strong> {timestamp}
            </Text>
            {details && (
              <Text style={text}>
                <strong>Details:</strong> {details}
              </Text>
            )}
          </Section>

          <Hr style={hr} />
          
          <Text style={text}>
            If you did not perform this action, please secure your account immediately.
          </Text>

          <Button style={button} href={`${process.env.APP_URL}/audit-logs`}>
            View Audit Logs
          </Button>

          <Text style={footer}>
            This is an automated email from the Secure Transaction Management Portal.
            Please do not reply to this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#fef2f2',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const box = {
  padding: '24px',
  border: '2px solid #dc2626',
  borderRadius: '8px',
  margin: '24px 0',
  backgroundColor: '#fef2f2',
};

const h1 = {
  color: '#dc2626',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  textAlign: 'left' as const,
};

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px',
  margin: '24px 0',
};

const hr = {
  border: 'none',
  borderTop: '1px solid #eaeaea',
  margin: '24px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '24px 0',
  textAlign: 'center' as const,
};
