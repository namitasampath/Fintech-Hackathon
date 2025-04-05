import React from 'react';
import { Link } from 'react-router-dom';
import { Coins } from 'lucide-react';

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-white">
          <Coins size={64} className="mb-8" />
          <h1 className="text-5xl font-bold mb-4 text-center">LendConnect</h1>
          <p className="text-xl mb-12 text-center max-w-2xl">
            Connect with trusted lenders and borrowers. Get the best rates for your loans or invest your money wisely.
          </p>
          
          <div className="flex gap-6">
            <Link
              to="/signup"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;