import { redirect } from 'next/navigation';

// Redirect to unified forgot-password page
export default function BusinessForgotPasswordPage() {
  redirect('/forgot-password');
}
