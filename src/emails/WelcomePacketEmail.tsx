import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Row,
  Column,
  Button,
} from '@react-email/components';

interface WelcomePacketEmailProps {
  clientName: string;
  address: string;
  city: string;
  realtorName: string;
  realtorCompany: string;
  realtorPhone?: string;
  realtorPhotoUrl?: string;
  realtorLogoUrl?: string;
  brandColor?: string;
  welcomeMessage?: string;
  packetUrl: string;
}

export default function WelcomePacketEmail({
  clientName = 'New Homeowner',
  address = '123 Main Street',
  city = 'Boerne',
  realtorName = 'Your Realtor',
  realtorCompany = 'Real Estate Company',
  realtorPhone,
  realtorPhotoUrl,
  realtorLogoUrl,
  brandColor = '#1a365d',
  welcomeMessage = 'Congratulations on your new home! I\'ve put together a special welcome packet with trusted local service providers and helpful resources to make your transition seamless.',
  packetUrl = 'https://boerneshandyhub.com/welcome/demo',
}: WelcomePacketEmailProps) {
  const previewText = `Your welcome packet from ${realtorName} - ${realtorCompany}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Branding */}
          <Section
            style={{
              ...header,
              backgroundColor: brandColor,
            }}
          >
            {realtorLogoUrl ? (
              <Img
                src={realtorLogoUrl}
                alt={realtorCompany}
                width={150}
                height={60}
                style={logoImage}
              />
            ) : (
              <Text style={logoText}>{realtorCompany}</Text>
            )}
          </Section>

          {/* Welcome Message */}
          <Section style={heroSection}>
            <Text style={welcomeEmoji}>🏠</Text>
            <Heading style={h1}>
              Welcome to Your New Home!
            </Heading>
            <Text style={addressText}>
              {address}, {city}
            </Text>
          </Section>

          {/* Client Greeting */}
          <Section style={section}>
            <Text style={greeting}>
              Dear {clientName},
            </Text>
            <Text style={paragraph}>
              {welcomeMessage}
            </Text>
          </Section>

          {/* CTA Button */}
          <Section style={ctaSection}>
            <Link href={packetUrl} style={ctaButton}>
              View Your Welcome Packet
            </Link>
            <Text style={ctaSubtext}>
              Your personalized guide to trusted local service providers
            </Text>
          </Section>

          {/* What's Inside */}
          <Section style={section}>
            <Heading style={h2}>What&apos;s Inside Your Packet</Heading>
            <Row style={featureRow}>
              <Column style={featureIconColumn}>
                <Text style={featureIcon}>🔧</Text>
              </Column>
              <Column>
                <Text style={featureTitle}>Trusted Service Providers</Text>
                <Text style={featureDesc}>
                  Hand-picked HVAC, plumbing, electrical, and more
                </Text>
              </Column>
            </Row>
            <Row style={featureRow}>
              <Column style={featureIconColumn}>
                <Text style={featureIcon}>📚</Text>
              </Column>
              <Column>
                <Text style={featureTitle}>Homeowner Guides</Text>
                <Text style={featureDesc}>
                  Essential tips for your first months in your new home
                </Text>
              </Column>
            </Row>
            <Row style={featureRow}>
              <Column style={featureIconColumn}>
                <Text style={featureIcon}>🏡</Text>
              </Column>
              <Column>
                <Text style={featureTitle}>Local Resources</Text>
                <Text style={featureDesc}>
                  Utilities, schools, and everything you need to know
                </Text>
              </Column>
            </Row>
            <Row style={featureRow}>
              <Column style={featureIconColumn}>
                <Text style={featureIcon}>🚨</Text>
              </Column>
              <Column>
                <Text style={featureTitle}>Emergency Contacts</Text>
                <Text style={featureDesc}>
                  Important numbers to keep handy
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Realtor Card */}
          <Section style={realtorSection}>
            <Row>
              {realtorPhotoUrl && (
                <Column style={realtorPhotoColumn}>
                  <Img
                    src={realtorPhotoUrl}
                    alt={realtorName}
                    width={80}
                    height={80}
                    style={realtorPhoto}
                  />
                </Column>
              )}
              <Column style={realtorInfoColumn}>
                <Text style={realtorNameText}>{realtorName}</Text>
                <Text style={realtorCompanyText}>{realtorCompany}</Text>
                {realtorPhone && (
                  <Link href={`tel:${realtorPhone}`} style={realtorPhoneLink}>
                    {realtorPhone}
                  </Link>
                )}
              </Column>
            </Row>
            <Text style={realtorMessage}>
              I&apos;m here to help you settle into your new home. Don&apos;t hesitate to reach out if you have any questions!
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This welcome packet was created with
            </Text>
            <Link href="https://boerneshandyhub.com" style={footerLink}>
              Boerne&apos;s Handy Hub
            </Link>
            <Text style={footerSubtext}>
              Your trusted guide to local home services
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
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
};

const header = {
  padding: '24px',
  textAlign: 'center' as const,
};

const logoImage = {
  margin: '0 auto',
  display: 'block' as const,
  objectFit: 'contain' as const,
};

const logoText = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
};

const heroSection = {
  padding: '40px 24px',
  textAlign: 'center' as const,
  backgroundColor: '#f7fafc',
};

const welcomeEmoji = {
  fontSize: '48px',
  margin: '0 0 16px 0',
};

const h1 = {
  color: '#1a365d',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 8px 0',
};

const addressText = {
  color: '#d4a846',
  fontSize: '18px',
  fontWeight: '500',
  margin: '0',
};

const section = {
  padding: '24px',
};

const greeting = {
  color: '#1a365d',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const paragraph = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0',
};

const ctaSection = {
  padding: '8px 24px 32px 24px',
  textAlign: 'center' as const,
};

const ctaButton = {
  backgroundColor: '#d4a846',
  borderRadius: '8px',
  color: '#1a365d',
  display: 'inline-block',
  fontSize: '18px',
  fontWeight: '600',
  padding: '16px 40px',
  textDecoration: 'none',
  textAlign: 'center' as const,
};

const ctaSubtext = {
  color: '#718096',
  fontSize: '14px',
  margin: '12px 0 0 0',
};

const h2 = {
  color: '#1a365d',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 20px 0',
};

const featureRow = {
  marginBottom: '16px',
};

const featureIconColumn = {
  width: '48px',
  verticalAlign: 'top' as const,
};

const featureIcon = {
  fontSize: '24px',
  margin: '0',
};

const featureTitle = {
  color: '#1a365d',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const featureDesc = {
  color: '#718096',
  fontSize: '14px',
  margin: '4px 0 0 0',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '0',
};

const realtorSection = {
  padding: '24px',
  backgroundColor: '#f7fafc',
};

const realtorPhotoColumn = {
  width: '100px',
  verticalAlign: 'top' as const,
};

const realtorPhoto = {
  borderRadius: '50%',
  objectFit: 'cover' as const,
};

const realtorInfoColumn = {
  verticalAlign: 'top' as const,
  paddingLeft: '12px',
};

const realtorNameText = {
  color: '#1a365d',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0',
};

const realtorCompanyText = {
  color: '#4a5568',
  fontSize: '14px',
  margin: '4px 0',
};

const realtorPhoneLink = {
  color: '#d4a846',
  fontSize: '14px',
  textDecoration: 'none',
};

const realtorMessage = {
  color: '#4a5568',
  fontSize: '14px',
  fontStyle: 'italic',
  margin: '16px 0 0 0',
  padding: '12px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
};

const footer = {
  padding: '24px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#718096',
  fontSize: '14px',
  margin: '0 0 4px 0',
};

const footerLink = {
  color: '#d4a846',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
};

const footerSubtext = {
  color: '#a0aec0',
  fontSize: '12px',
  margin: '8px 0 0 0',
};
