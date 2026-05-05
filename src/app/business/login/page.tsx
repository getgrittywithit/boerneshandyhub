import { redirect } from 'next/navigation';

// Redirect to unified login page with business context
export default function BusinessLoginPage() {
  redirect('/login?context=business');
}
