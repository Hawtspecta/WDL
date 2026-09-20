import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from '@react-email/components';

interface TransactionCreatedEmailProps {
  userName: string;
  transactionId: string;
  amount: number;
  description: string;
  status: string;
}

export default function TransactionCreatedEmail({
  userName,
  transactionId,
  amount,
  description,
  status,
}: TransactionCreatedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New Transaction Created - Transaction Portal</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Transaction Created Successfully</Heading>
          <Text style={text}>Hello {userName},</Text>
          <Text style={text}>
            A new transaction has been created in your account. Here are the details:
          </Text>
          
          <Section style={box}>
            <Text style={text}>
              <strong>Transaction ID:</strong> {transactionId}
            </Text>
            <Text style={text}>
              <strong>Amount:</strong> ${amount.toFixed(2)}
            </Text>
            <Text style={text}>
              <strong>Description:</strong> {description}
            </Text>
            <Text style={text}>
              <strong>Status:</strong> {status}
            </Text>
          </Section>

          <Hr style={hr} />
          
          <Text style={text}>
            If you did not initiate this transaction, please contact support immediately.
          </Text>

          <Button style={button} href={`${process.env.APP_URL}/transactions/${transactionId}`}>
            View Transaction
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
  backgroundColor: '#f6f9fc',
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
  border: '1px solid #eaeaea',
  borderRadius: '8px',
  margin: '24px 0',
  backgroundColor: '#f9fafb',
};

const h1 = {
  color: '#333',
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
  backgroundColor: '#5469d4',
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
