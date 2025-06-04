
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Sparkles, Globe, Palette } from 'lucide-react';

interface DashboardEmptyProps {
  onCreateNew: () => void;
}

const DashboardEmpty = ({ onCreateNew }: DashboardEmptyProps) => {
  return (
    <div className="text-center space-y-8">
      {/* Welcome Message */}
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to Your Dental Website Builder
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create beautiful, professional websites for your dental practice in minutes with AI-powered copy generation and stunning templates.
          </p>
        </div>
      </div>

      {/* Screenshot/Preview */}
      <div className="relative max-w-4xl mx-auto">
        <Card className="overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
          <CardContent className="p-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-lg p-8 space-y-6">
              {/* Mock Website Preview */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    <div className="w-24 h-3 bg-gray-100 dark:bg-gray-700 rounded mt-1"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="w-full h-6 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  <div className="w-3/4 h-4 bg-gray-100 dark:bg-gray-700 rounded"></div>
                  <div className="w-5/6 h-4 bg-gray-100 dark:bg-gray-700 rounded"></div>
                </div>
                
                <div className="flex gap-2">
                  <div className="w-20 h-8 bg-blue-600 rounded"></div>
                  <div className="w-20 h-8 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Preview of your future dental website
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="text-center p-6">
          <CardHeader className="pb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto">
              <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-lg">AI-Powered Copy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Generate professional website content tailored to your dental practice automatically.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center p-6">
          <CardHeader className="pb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto">
              <Palette className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-lg">Beautiful Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Choose from professionally designed templates crafted specifically for dental practices.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center p-6">
          <CardHeader className="pb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto">
              <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-lg">Launch Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your website will be optimized, mobile-friendly, and ready to attract new patients.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="space-y-4">
        <Button 
          onClick={onCreateNew} 
          size="lg"
          className="text-lg px-8 py-6 h-auto flex items-center gap-3"
        >
          <Plus className="h-5 w-5" />
          Create Your First Clinic Website
        </Button>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          It takes less than 5 minutes to get started
        </p>
      </div>
    </div>
  );
};

export default DashboardEmpty;
