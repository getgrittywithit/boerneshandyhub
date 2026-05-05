import { redirect } from 'next/navigation';

// Redirect to unified reset-password page
export default function BusinessResetPasswordPage() {
  redirect('/reset-password');
}
