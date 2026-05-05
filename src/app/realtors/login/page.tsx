import { redirect } from 'next/navigation';

// Redirect to unified login page with realtor context
export default function RealtorLoginPage() {
  redirect('/login?context=realtor');
}
