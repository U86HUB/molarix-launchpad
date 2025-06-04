
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BlogArticleContentProps {
  content: string;
}

const BlogArticleContent = ({ content }: BlogArticleContentProps) => {
  return (
    <>
      <article className="prose prose-lg dark:prose-invert max-w-none" role="main">
        <div 
          dangerouslySetInnerHTML={{ __html: content }}
          className="text-gray-700 dark:text-gray-300 leading-relaxed"
        />
      </article>

      <nav className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700" aria-label="Article navigation">
        <Button asChild>
          <Link 
            to="/blog"
            className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Return to all blog articles"
          >
            ← Back to All Articles
          </Link>
        </Button>
      </nav>
    </>
  );
};

export default BlogArticleContent;
