
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, User, Tag } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "5 Essential Tips for Modern Dental Practice Management",
    excerpt: "Discover how technology and patient-centered approaches are revolutionizing dental practice management in 2024.",
    author: "Dr. Sarah Johnson",
    date: "2024-01-15",
    tags: ["Practice Management", "Technology", "Patient Care"],
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Building Patient Trust Through Transparent Communication",
    excerpt: "Learn effective communication strategies that help build lasting relationships with your patients and improve treatment outcomes.",
    author: "Dr. Michael Chen",
    date: "2024-01-10",
    tags: ["Communication", "Patient Relations", "Trust"],
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "The Future of Telemedicine in Healthcare Practices",
    excerpt: "Explore how telemedicine is transforming patient consultations and what it means for modern healthcare providers.",
    author: "Dr. Emily Rodriguez",
    date: "2024-01-05",
    tags: ["Telemedicine", "Innovation", "Healthcare"],
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Website Accessibility: Why It Matters for Medical Practices",
    excerpt: "Understanding the importance of web accessibility and how it can improve patient experience and legal compliance.",
    author: "Alex Thompson",
    date: "2024-01-01",
    tags: ["Accessibility", "Web Design", "Compliance"],
    readTime: "4 min read"
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Healthcare Insights Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Expert insights, tips, and trends for modern healthcare and dental practices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                <CardTitle className="text-xl hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Link to={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {post.readTime}
                  </span>
                </div>
                <Button variant="outline" asChild className="w-full">
                  <Link to={`/blog/${post.id}`}>
                    Read Article
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
