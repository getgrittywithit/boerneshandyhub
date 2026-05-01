const data = require('../src/data/serviceProviders.json');
const providers = data.providers;

function esc(str) {
  if (str === null || str === undefined || str === '') return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function jsonb(obj) {
  if (!obj || (Array.isArray(obj) && obj.length === 0)) return 'NULL';
  return "'" + JSON.stringify(obj).replace(/'/g, "''") + "'::jsonb";
}

// Split into batches of 30
const batchSize = 30;
const batches = [];

for (let i = 0; i < providers.length; i += batchSize) {
  const batch = providers.slice(i, i + batchSize);

  const values = batch.map(p => `(
    gen_random_uuid(),
    ${esc(p.name)},
    ${esc(p.category)},
    ${esc(p.subcategories?.[0] || p.category)},
    ${esc(p.address || 'Boerne, TX')},
    ${esc(p.phone || '')},
    ${esc(p.email)},
    ${esc(p.website)},
    ${esc(p.description)},
    ${p.rating || 0},
    '${p.membershipTier || 'basic'}',
    '${p.claimStatus || 'unclaimed'}',
    ${jsonb(p.photos)},
    ${jsonb(p.keywords)},
    ${jsonb(p.specialOffers)},
    ${jsonb(p.services)},
    ${esc(p.id)},
    ${jsonb(p.serviceArea)},
    ${p.licensed || false},
    ${p.insured || false},
    ${p.reviewCount || 0},
    ${esc(p.parentCategory || 'home')}
  )`).join(',\n');

  const sql = `INSERT INTO businesses (
    id, name, category, subcategory, address, phone, email, website, description,
    rating, membership_tier, claim_status, photos, keywords, special_offers, services,
    slug, service_area, licensed, insured, review_count, parent_category
  ) VALUES ${values};`;

  batches.push(sql);
}

// Output batch number from command line arg
const batchNum = parseInt(process.argv[2] || '0');
if (batchNum >= 0 && batchNum < batches.length) {
  console.log(batches[batchNum]);
} else {
  console.log(`Total batches: ${batches.length}`);
  console.log(`Total providers: ${providers.length}`);
}
