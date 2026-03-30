'use client';

type MembershipTier = 'basic' | 'verified' | 'premium' | 'elite';

interface ProviderSEOContentProps {
  providerName: string;
  categoryName: string;
  description: string;
  services: string[];
  serviceArea: string[];
  yearsInBusiness?: number;
  licensed?: boolean;
  insured?: boolean;
  membershipTier?: MembershipTier;
}

export default function ProviderSEOContent({
  providerName,
  categoryName,
  description,
  services,
  serviceArea,
  yearsInBusiness,
  licensed,
  insured,
  membershipTier,
}: ProviderSEOContentProps) {
  const primaryLocation = serviceArea[0] || 'Boerne';
  const otherLocations = serviceArea.slice(1, 4);
  const topServices = services.slice(0, 5);

  // Only show credentials for verified tier and above
  const isVerifiedTier = membershipTier && ['verified', 'premium', 'elite'].includes(membershipTier);
  const showCredentials = isVerifiedTier && (licensed || insured);

  return (
    <section className="bg-gray-50 rounded-xl p-6 mt-8">
      <h2 className="text-xl font-semibold text-boerne-navy mb-4">
        About {providerName}
      </h2>

      <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
        <p>
          {providerName} is a trusted {categoryName.toLowerCase()} provider proudly serving {primaryLocation} and the surrounding Texas Hill Country communities.
          {yearsInBusiness && yearsInBusiness > 0 && (
            <> With {yearsInBusiness} years of hands-on experience, they have built a solid reputation for quality workmanship and dependable service that local homeowners count on.</>
          )}
        </p>

        {topServices.length > 0 && (
          <>
            <h3 className="text-lg font-medium text-boerne-navy mt-6 mb-2">
              Services Offered
            </h3>
            <p>
              {providerName} specializes in {topServices.slice(0, -1).join(', ')}
              {topServices.length > 1 ? `, and ${topServices[topServices.length - 1]}` : topServices[0]}.
              {services.length > 5 && (
                <> They offer a total of {services.length} different services to meet your {categoryName.toLowerCase()} needs.</>
              )}
              {' '}Whether you need routine maintenance or emergency repairs, their experienced team is ready to help.
            </p>
          </>
        )}

        {otherLocations.length > 0 && (
          <>
            <h3 className="text-lg font-medium text-boerne-navy mt-6 mb-2">
              Service Area
            </h3>
            <p>
              Based in {primaryLocation}, {providerName} proudly serves homeowners throughout {otherLocations.join(', ')}, and neighboring Hill Country communities.
              {' '}Contact them today to confirm service availability in your area.
            </p>
          </>
        )}

        {showCredentials && (
          <>
            <h3 className="text-lg font-medium text-boerne-navy mt-6 mb-2">
              Verified Licensed & Insured Professional
            </h3>
            <p>
              {licensed && (
                <>When you hire {providerName}, you are working with a verified, fully licensed professional who meets all state and local requirements for {categoryName.toLowerCase()} work in Texas. </>
              )}
              {insured && (
                <>They carry verified, comprehensive insurance coverage to protect both you and your property throughout every project. </>
              )}
              {(licensed || insured) && (
                <>This means you can have complete peace of mind knowing your home is in qualified hands.</>
              )}
            </p>
          </>
        )}

        <h3 className="text-lg font-medium text-boerne-navy mt-6 mb-2">
          Why Choose Local?
        </h3>
        <p>
          Choosing a local {categoryName.toLowerCase()} provider like {providerName} means faster response times, personalized service, and supporting the {primaryLocation} business community.
          {' '}Local providers understand the unique needs of Hill Country homes and are invested in maintaining their reputation within the community.
        </p>
      </div>
    </section>
  );
}
