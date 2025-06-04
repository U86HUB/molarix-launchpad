
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogArticleNotFound from "@/components/BlogArticleNotFound";
import BlogArticleHeader from "@/components/BlogArticleHeader";
import BlogArticleContent from "@/components/BlogArticleContent";
import { blogArticles } from "@/data/BlogArticleData";

const BlogArticle = () => {
  const { id } = useParams();
  const articleId = id ? parseInt(id, 10) : null;
  const article = articleId && blogArticles[articleId as keyof typeof blogArticles] ? blogArticles[articleId as keyof typeof blogArticles] : null;

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <BlogArticleNotFound />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BlogArticleHeader article={article} />
        <BlogArticleContent content={article.content} />
      </main>

      <Footer />
    </div>
  );
};

export default BlogArticle;
