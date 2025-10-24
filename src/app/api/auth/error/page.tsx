import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/');
  }

  const error = searchParams.error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {error === 'OAuthSignin'
              ? 'There was an error signing in with your OAuth provider. Please try again.'
              : 'An authentication error occurred. Please try again.'}
          </p>
        </div>
        <div className="flex justify-center">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
