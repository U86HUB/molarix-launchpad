
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BlogArticleContentProps {
  content: string;
}

const BlogArticleContent = ({ content }: BlogArticleContentProps) => {
  return (
    <>
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <div 
          dangerouslySetInnerHTML={{ __html: content }}
          className="text-gray-700 dark:text-gray-300 leading-relaxed"
        />
      </article>

      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <Button asChild>
          <Link to="/blog">← Back to All Articles</Link>
        </Button>
      </div>
    </>
  );
};

export default BlogArticleContent;
