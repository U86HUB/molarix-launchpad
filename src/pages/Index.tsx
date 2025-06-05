import React from 'react';
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { TypingAnimation } from "@/components/TypingAnimation";
import { ArrowRight, Eye } from "lucide-react";
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <TypingAnimation />
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Create beautiful, professional dental websites with AI-powered content generation. 
            No technical expertise required - just answer a few questions and watch your website come to life.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4" asChild>
              <Link to="/unified-onboarding">
                Get Started - Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4" asChild>
              <Link to="/templates">
                View Templates
                <Eye className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            No credit card required • Setup in minutes • HIPAA compliant
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-8">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                AI-Powered Content
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Generate unique, engaging content tailored for your dental practice.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Stunning Templates
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose from a variety of professionally designed templates.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Easy Customization
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Customize your website with our drag-and-drop builder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-8">
            What Our Users Say
          </h2>
          {/* Testimonial 1 */}
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-400 italic mb-4">
              "Molarix made creating a website for my dental practice so easy. The AI content is impressive!"
            </p>
            <p className="text-gray-700 dark:text-gray-300 font-semibold">
              - Dr. Jane Doe
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Molarix. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
