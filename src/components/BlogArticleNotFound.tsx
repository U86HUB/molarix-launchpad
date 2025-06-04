
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BlogArticleNotFound = () => {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Article Not Found
      </h1>
      <Button asChild>
        <Link to="/blog">Back to Blog</Link>
      </Button>
    </div>
  );
};

export default BlogArticleNotFound;
