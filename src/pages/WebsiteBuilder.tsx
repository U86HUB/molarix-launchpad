
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import WebsiteBuilder from '@/components/website-builder/WebsiteBuilder';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { FullPageLoader } from '@/components/ui/loading-states';

const WebsiteBuilderPage = () => {
  const { websiteId } = useParams<{ websiteId: string }>();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // Validate websiteId exists
    if (!websiteId) {
      navigate('/dashboard');
      return;
    }
    setIsValidating(false);
  }, [websiteId, navigate]);

  if (isValidating) {
    return <FullPageLoader text="Loading..." />;
  }

  if (!websiteId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <WebsiteBuilder websiteId={websiteId} />
    </div>
  );
};

export default WebsiteBuilderPage;
