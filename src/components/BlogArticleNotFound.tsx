
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BlogArticleNotFound = () => {
  return (
    <div className="text-center" role="main">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Article Not Found
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Sorry, the article you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link 
          to="/blog"
          className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          aria-label="Return to blog articles list"
        >
          Back to Blog
        </Link>
      </Button>
    </div>
  );
};

export default BlogArticleNotFound;
