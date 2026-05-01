import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Preview,
} from '@react-email/components';

interface WelcomeEmailProps {
  name?: string;
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  const previewText = "Welcome to Boerne's Handy Hub - Your local home services guide";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>Boerne&apos;s Handy Hub</Text>
          </Section>

          <Section style={content}>
            <Text style={heading}>
              Welcome{name ? `, ${name}` : ''}!
            </Text>

            <Text style={paragraph}>
              Thanks for subscribing to our monthly homecare tips. You&apos;re now part of a
              community of Boerne homeowners who stay ahead of seasonal maintenance and
              discover trusted local service providers.
            </Text>

            <Text style={paragraph}>
              <strong>What you&apos;ll receive:</strong>
            </Text>

            <Text style={listItem}>
              • Seasonal home maintenance reminders
            </Text>
            <Text style={listItem}>
              • Tips from local Boerne professionals
            </Text>
            <Text style={listItem}>
              • Recommendations for trusted service providers
            </Text>
            <Text style={listItem}>
              • Exclusive offers from our partners
            </Text>

            <Text style={paragraph}>
              In the meantime, explore our directory of{' '}
              <Link href="https://boerneshandyhub.com/services" style={link}>
                local service providers
              </Link>{' '}
              for all your home needs.
            </Text>

            <Section style={ctaSection}>
              <Link href="https://boerneshandyhub.com/services" style={button}>
                Browse Services
              </Link>
            </Section>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              Boerne&apos;s Handy Hub - Connecting Boerne homeowners with trusted local pros
            </Text>
            <Text style={footerText}>
              <Link href="https://boerneshandyhub.com" style={footerLink}>
                boerneshandyhub.com
              </Link>
            </Text>
            <Text style={footerSmall}>
              You received this email because you subscribed at boerneshandyhub.com.
              <br />
              <Link href="https://boerneshandyhub.com/unsubscribe" style={footerLink}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
  borderRadius: '8px',
  overflow: 'hidden',
};

const header = {
  backgroundColor: '#1e3a5f',
  padding: '24px',
  textAlign: 'center' as const,
};

const logo = {
  color: '#d4a84b',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
};

const content = {
  padding: '32px 24px',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#1e3a5f',
  margin: '0 0 24px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#374151',
  margin: '0 0 16px 0',
};

const listItem = {
  fontSize: '16px',
  lineHeight: '1.8',
  color: '#374151',
  margin: '0',
  paddingLeft: '8px',
};

const link = {
  color: '#d4a84b',
  textDecoration: 'underline',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#d4a84b',
  color: '#1e3a5f',
  padding: '14px 28px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '16px',
  display: 'inline-block',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '0',
};

const footer = {
  padding: '24px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0 0 8px 0',
};

const footerLink = {
  color: '#d4a84b',
  textDecoration: 'none',
};

const footerSmall = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '16px 0 0 0',
};
