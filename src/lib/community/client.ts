// Community Contributions Client
// Per docs/COMMUNITY_SPEC.md

import type {
  ContributionSubmission,
  SubmitResponse,
  TipList,
  DisplayPref,
} from './types';

const API_BASE = '/api/community';

/**
 * Submit a contribution (feedback, photo, story, or tip)
 */
export async function submitContribution(
  submission: ContributionSubmission
): Promise<SubmitResponse> {
  // For photo/story submissions with files, use FormData
  if (
    (submission.type === 'photo' || submission.type === 'story') &&
    'photos' in submission &&
    submission.photos?.length
  ) {
    const formData = new FormData();
    formData.append('type', submission.type);
    formData.append('email', submission.email);
    if (submission.name) formData.append('name', submission.name);
    formData.append('display_pref', submission.display_pref);
    formData.append('ip_attestation', String(submission.ip_attestation));

    if (submission.type === 'story') {
      formData.append('title', submission.title);
      formData.append('body', submission.body);
      if (submission.era) formData.append('era', submission.era);
      formData.append('accuracy_attestation', String(submission.accuracy_attestation));
      if (submission.related_places?.length) {
        formData.append('related_places', JSON.stringify(submission.related_places));
      }
    }

    // Append photos with metadata
    submission.photos.forEach((photo, index) => {
      formData.append(`photo_${index}`, photo.file);
      formData.append(`photo_${index}_meta`, JSON.stringify({
        caption: photo.caption,
        year: 'year' in photo ? photo.year : undefined,
        location: 'location' in photo ? photo.location : undefined,
        neighborhood: 'neighborhood' in photo ? photo.neighborhood : undefined,
        related_category: 'related_category' in photo ? photo.related_category : undefined,
        related_business: 'related_business' in photo ? photo.related_business : undefined,
      }));
    });

    const response = await fetch(`${API_BASE}/submit`, {
      method: 'POST',
      body: formData,
    });

    return response.json();
  }

  // For feedback and tips, use JSON
  const response = await fetch(`${API_BASE}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission),
  });

  return response.json();
}

/**
 * Verify contributor email via magic link token
 */
export async function verifyEmail(token: string): Promise<{
  success: boolean;
  message: string;
  contributor_id?: string;
}> {
  const response = await fetch(`${API_BASE}/verify?token=${encodeURIComponent(token)}`);
  return response.json();
}

/**
 * Get active tip lists for the tip form dropdown
 */
export async function getTipLists(): Promise<TipList[]> {
  const response = await fetch(`${API_BASE}/tip-lists`);
  const data = await response.json();
  return data.lists || [];
}

/**
 * Check submission status (for contributor view)
 */
export async function getSubmissionStatus(
  token: string
): Promise<{
  success: boolean;
  status?: string;
  message: string;
}> {
  const response = await fetch(`${API_BASE}/status?token=${encodeURIComponent(token)}`);
  return response.json();
}

/**
 * Request removal of a published contribution
 */
export async function requestRemoval(
  contributionId: string,
  email: string,
  reason: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/removal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contribution_id: contributionId, email, reason }),
  });
  return response.json();
}

/**
 * Flag a published contribution
 */
export async function flagContribution(
  contributionId: string,
  reason: string,
  email?: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contribution_id: contributionId, reason, email }),
  });
  return response.json();
}

// Helper to format display name based on preference
export function formatDisplayName(
  name: string | null | undefined,
  pref: DisplayPref
): string {
  if (!name) return 'Anonymous';

  switch (pref) {
    case 'full_name':
      return name;
    case 'first_name':
      return name.split(' ')[0];
    case 'initials':
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    case 'anonymous':
      return 'Anonymous';
    default:
      return name.split(' ')[0];
  }
}

// Helper to generate a slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}
