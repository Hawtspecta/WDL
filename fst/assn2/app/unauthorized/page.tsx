import Link from 'next/link';
import { ShieldX, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-4 rounded-full">
              <ShieldX className="w-12 h-12 text-red-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          
          <p className="text-gray-600 mb-6">
            You don&apos;t have permission to access this resource. Please contact your administrator if you believe this is an error.
          </p>
          
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition text-center"
            >
              <Home className="w-4 h-4 inline mr-2" />
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="block w-full py-2 px-4 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition text-center"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
