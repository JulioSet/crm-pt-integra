import Link from 'next/link';

export default function UnauthorizedPage() {
   return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
         <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
         <p className="text-lg text-gray-700 mb-6">
            You do not have permission to access this page.
         </p>
         <Link href="/dashboard/messages" className="text-blue-500 hover:underline">
            Go back to Dashboard
         </Link>
      </div>
   );
}