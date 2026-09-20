import Link from 'next/link';
import { Shield, Lock, Database, Mail } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Secure Transaction Management Portal
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A professional full-stack application demonstrating authentication, authorization, and transactional email workflows
          </p>
          
          <div className="flex justify-center space-x-4 mb-12">
            <Link
              href="/login"
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Sign In
            </Link>
            <Link
              href="/database-demo"
              className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg border border-indigo-600 hover:bg-indigo-50 transition"
            >
              View Database Demo
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <FeatureCard
              icon={Shield}
              title="Authentication"
              description="Secure login with Better Auth and session management"
            />
            <FeatureCard
              icon={Lock}
              title="Authorization"
              description="Role-based access control (ADMIN, MEMBER, GUEST)"
            />
            <FeatureCard
              icon={Database}
              title="Database"
              description="PostgreSQL with Prisma ORM and automated seeding"
            />
            <FeatureCard
              icon={Mail}
              title="Transactional Email"
              description="React Email templates with Resend integration"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Icon className="w-8 h-8 text-indigo-600 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
