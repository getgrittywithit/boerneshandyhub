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
} from '@react-email/components';
import type { NewsletterSections } from '@/types/newsletter';

interface NewsletterEmailProps {
  previewText?: string;
  sections: NewsletterSections;
  unsubscribeUrl?: string;
  webViewUrl?: string;
}

export default function NewsletterEmail({
  previewText = 'Your monthly home care update from Boerne\'s Handy Hub',
  sections,
  unsubscribeUrl = 'https://boerneshandyhub.com/unsubscribe',
  webViewUrl = 'https://boerneshandyhub.com',
}: NewsletterEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Link href="https://boerneshandyhub.com" style={logoLink}>
              <Text style={logoText}>Boerne&apos;s Handy Hub</Text>
            </Link>
          </Section>

          {/* Intro */}
          {sections.intro?.text && (
            <Section style={section}>
              <Text style={paragraph}>{sections.intro.text}</Text>
            </Section>
          )}

          {/* Seasonal Services */}
          {sections.seasonal?.items && sections.seasonal.items.length > 0 && (
            <Section style={section}>
              <Heading style={h2}>This Month&apos;s Home Care Focus</Heading>
              {sections.seasonal.items.map((item, index) => (
                <Row key={item.id || index} style={serviceRow}>
                  <Column style={serviceIconColumn}>
                    <Text style={serviceIcon}>{item.icon}</Text>
                  </Column>
                  <Column style={serviceContentColumn}>
                    <Link href={`https://boerneshandyhub.com${item.link}`} style={serviceLink}>
                      <Text style={serviceName}>{item.name}</Text>
                    </Link>
                    <Text style={serviceDescription}>{item.description}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          )}

          {/* New Providers */}
          {sections.new_providers?.providers && sections.new_providers.providers.length > 0 && (
            <Section style={section}>
              <Heading style={h2}>New Providers This Month</Heading>
              <Text style={paragraph}>
                We&apos;ve added {sections.new_providers.count} new service providers to help you find the right pro for any job.
              </Text>
              {sections.new_providers.providers.slice(0, 5).map((provider, index) => (
                <Text key={provider.id || index} style={listItem}>
                  <strong>{provider.name}</strong> - {provider.category}
                </Text>
              ))}
              <Link href="https://boerneshandyhub.com/services" style={ctaButton}>
                Browse All Providers
              </Link>
            </Section>
          )}

          {/* Local Tip */}
          {sections.local_tip?.headline && (
            <Section style={tipSection}>
              <Heading style={h2}>Local Tip</Heading>
              <Text style={tipHeadline}>{sections.local_tip.headline}</Text>
              <Text style={paragraph}>{sections.local_tip.text}</Text>
              {sections.local_tip.link && (
                <Link href={sections.local_tip.link} style={tipLink}>
                  {sections.local_tip.link_text || 'Learn more'}
                </Link>
              )}
            </Section>
          )}

          {/* Featured Provider */}
          {sections.featured_provider?.provider_name && (
            <Section style={section}>
              <Heading style={h2}>Featured Provider</Heading>
              <Section style={providerCard}>
                <Text style={providerName}>{sections.featured_provider.provider_name}</Text>
                <Text style={providerCategory}>{sections.featured_provider.category}</Text>
                <Text style={paragraph}>{sections.featured_provider.description}</Text>
                {sections.featured_provider.endorsement && (
                  <Text style={endorsement}>&quot;{sections.featured_provider.endorsement}&quot;</Text>
                )}
                <Link href={sections.featured_provider.link} style={ctaButton}>
                  View Profile
                </Link>
              </Section>
            </Section>
          )}

          {/* Events */}
          {sections.events?.events && sections.events.events.length > 0 && (
            <Section style={section}>
              <Heading style={h2}>Upcoming in Boerne</Heading>
              {sections.events.events.map((event, index) => (
                <Row key={index} style={eventRow}>
                  <Column style={eventIconColumn}>
                    <Text style={eventIcon}>&#128197;</Text>
                  </Column>
                  <Column>
                    <Text style={eventName}>{event.name}</Text>
                    <Text style={eventDate}>
                      {event.date}
                      {event.location && ` • ${event.location}`}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>
          )}

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Boerne&apos;s Handy Hub - Your trusted guide to local home services
            </Text>
            <Text style={footerLinks}>
              <Link href={webViewUrl} style={footerLink}>
                View in browser
              </Link>
              {' • '}
              <Link href={unsubscribeUrl} style={footerLink}>
                Unsubscribe
              </Link>
            </Text>
            <Text style={footerAddress}>
              Boerne, Texas
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
  backgroundColor: '#1a365d', // boerne-navy
  padding: '24px',
  textAlign: 'center' as const,
};

const logoLink = {
  textDecoration: 'none',
};

const logoText = {
  color: '#d4a846', // boerne-gold
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
};

const section = {
  padding: '24px',
};

const h2 = {
  color: '#1a365d',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px 0',
};

const paragraph = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
};

const serviceRow = {
  marginBottom: '16px',
};

const serviceIconColumn = {
  width: '48px',
  verticalAlign: 'top' as const,
};

const serviceContentColumn = {
  verticalAlign: 'top' as const,
};

const serviceIcon = {
  fontSize: '24px',
  margin: '0',
};

const serviceLink = {
  textDecoration: 'none',
};

const serviceName = {
  color: '#1a365d',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const serviceDescription = {
  color: '#718096',
  fontSize: '14px',
  margin: '4px 0 0 0',
};

const listItem = {
  color: '#4a5568',
  fontSize: '14px',
  margin: '8px 0',
};

const tipSection = {
  backgroundColor: '#fef9e7',
  borderLeft: '4px solid #d4a846',
  padding: '24px',
  margin: '0 24px 24px 24px',
  borderRadius: '0 8px 8px 0',
};

const tipHeadline = {
  color: '#1a365d',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 8px 0',
};

const tipLink = {
  color: '#d4a846',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
};

const providerCard = {
  backgroundColor: '#f7fafc',
  borderRadius: '8px',
  padding: '16px',
};

const providerName = {
  color: '#1a365d',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0',
};

const providerCategory = {
  color: '#718096',
  fontSize: '14px',
  margin: '4px 0 12px 0',
};

const endorsement = {
  color: '#4a5568',
  fontSize: '14px',
  fontStyle: 'italic',
  margin: '12px 0',
  padding: '12px',
  backgroundColor: '#ffffff',
  borderRadius: '4px',
};

const ctaButton = {
  backgroundColor: '#d4a846',
  borderRadius: '6px',
  color: '#1a365d',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '600',
  padding: '12px 24px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  marginTop: '12px',
};

const eventRow = {
  marginBottom: '12px',
};

const eventIconColumn = {
  width: '32px',
  verticalAlign: 'top' as const,
};

const eventIcon = {
  fontSize: '18px',
  margin: '0',
};

const eventName = {
  color: '#1a365d',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0',
};

const eventDate = {
  color: '#718096',
  fontSize: '14px',
  margin: '2px 0 0 0',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '0',
};

const footer = {
  padding: '24px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#718096',
  fontSize: '14px',
  margin: '0 0 12px 0',
};

const footerLinks = {
  color: '#718096',
  fontSize: '14px',
  margin: '0 0 12px 0',
};

const footerLink = {
  color: '#d4a846',
  textDecoration: 'none',
};

const footerAddress = {
  color: '#a0aec0',
  fontSize: '12px',
  margin: '0',
};
