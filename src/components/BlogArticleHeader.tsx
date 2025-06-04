
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, User, Tag, ArrowLeft, Clock } from "lucide-react";

interface BlogArticleHeaderProps {
  article: {
    title: string;
    author: string;
    date: string;
    readTime: string;
    tags: string[];
    coverImage: string;
  };
}

const BlogArticleHeader = ({ article }: BlogArticleHeaderProps) => {
  return (
    <div className="mb-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/blog" className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
      </Button>

      <div className="mb-6">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-64 md:h-80 object-cover rounded-lg"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            <Tag className="h-3 w-3 mr-1" />
            {tag}
          </span>
        ))}
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
        {article.title}
      </h1>

      <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2" />
          {article.author}
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          {new Date(article.date).toLocaleDateString()}
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          {article.readTime}
        </div>
      </div>
    </div>
  );
};

export default BlogArticleHeader;
