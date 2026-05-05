import { redirect } from 'next/navigation';

// Redirect to unified login page with home tracker context
export default function HomeTrackerLoginPage() {
  redirect('/login?context=home');
}
