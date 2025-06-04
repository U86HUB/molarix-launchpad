
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, User, Tag, ArrowLeft, Clock } from "lucide-react";

const blogArticles = {
  1: {
    title: "5 Essential Tips for Modern Dental Practice Management",
    author: "Dr. Sarah Johnson",
    date: "2024-01-15",
    readTime: "5 min read",
    tags: ["Practice Management", "Technology", "Patient Care"],
    coverImage: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=400&fit=crop",
    content: `
      <p>Modern dental practice management has evolved significantly over the past decade. With advancing technology and changing patient expectations, dental professionals must adapt their management strategies to stay competitive and provide excellent patient care.</p>

      <h2>1. Embrace Digital Patient Records</h2>
      <p>Transitioning from paper-based records to electronic health records (EHR) systems can dramatically improve your practice efficiency. Digital records allow for better organization, easier access to patient information, and improved communication between team members.</p>

      <h2>2. Implement Online Scheduling</h2>
      <p>Online appointment scheduling systems reduce administrative burden and provide convenience for patients. Studies show that practices with online scheduling see a 25% increase in appointment bookings and reduced no-show rates.</p>

      <h2>3. Focus on Patient Communication</h2>
      <p>Clear, consistent communication builds trust and improves patient satisfaction. Use automated appointment reminders, treatment plan explanations, and follow-up communications to keep patients engaged and informed.</p>

      <h2>4. Leverage Social Media Marketing</h2>
      <p>Social media platforms offer powerful tools for patient education and practice promotion. Share oral health tips, before-and-after photos (with permission), and patient testimonials to build your online presence.</p>

      <h2>5. Invest in Continuing Education</h2>
      <p>Stay current with the latest dental techniques, technologies, and practice management strategies. Regular continuing education ensures you're providing the best possible care while maintaining practice efficiency.</p>

      <p>By implementing these strategies, dental practices can improve patient satisfaction, increase efficiency, and build a sustainable, profitable business model for the future.</p>
    `
  },
  2: {
    title: "Building Patient Trust Through Transparent Communication",
    author: "Dr. Michael Chen",
    date: "2024-01-10",
    readTime: "7 min read",
    tags: ["Communication", "Patient Relations", "Trust"],
    coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
    content: `
      <p>Trust is the foundation of any successful healthcare relationship. When patients trust their healthcare providers, they're more likely to follow treatment recommendations, maintain regular appointments, and refer others to the practice.</p>

      <h2>The Importance of Transparency</h2>
      <p>Transparent communication involves being honest about diagnoses, treatment options, costs, and potential outcomes. This approach helps patients make informed decisions about their healthcare and builds confidence in your expertise.</p>

      <h2>Active Listening Techniques</h2>
      <p>Effective communication starts with listening. Give patients your full attention, ask clarifying questions, and summarize what you've heard to ensure understanding. This demonstrates that you value their concerns and input.</p>

      <h2>Explaining Treatment Options</h2>
      <p>Present treatment options in clear, simple language. Use visual aids when possible and explain the benefits, risks, and costs associated with each option. This empowers patients to participate actively in their treatment decisions.</p>

      <h2>Setting Realistic Expectations</h2>
      <p>Be honest about treatment timelines, potential discomfort, and expected outcomes. Setting realistic expectations prevents disappointment and builds trust in your professional judgment.</p>

      <p>Remember, building trust is an ongoing process that requires consistency, empathy, and genuine care for your patients' well-being.</p>
    `
  },
  3: {
    title: "The Future of Telemedicine in Healthcare Practices",
    author: "Dr. Emily Rodriguez",
    date: "2024-01-05",
    readTime: "6 min read",
    tags: ["Telemedicine", "Innovation", "Healthcare"],
    coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
    content: `
      <p>Telemedicine has rapidly evolved from a niche service to a mainstream healthcare delivery method. The COVID-19 pandemic accelerated its adoption, and now it's becoming an integral part of modern healthcare practices.</p>

      <h2>Benefits of Telemedicine</h2>
      <p>Telemedicine offers numerous advantages including increased access to care, reduced travel time for patients, and the ability to provide follow-up care more efficiently. It's particularly valuable for routine consultations and chronic disease management.</p>

      <h2>Technology Requirements</h2>
      <p>Successful telemedicine implementation requires reliable internet connectivity, secure video conferencing platforms, and integration with existing electronic health record systems. HIPAA compliance is essential for protecting patient privacy.</p>

      <h2>Best Practices for Virtual Consultations</h2>
      <p>Effective telemedicine consultations require proper preparation, clear communication protocols, and appropriate patient selection. Not all conditions are suitable for virtual care, so providers must establish clear guidelines.</p>

      <h2>Future Trends</h2>
      <p>Emerging technologies like AI-powered diagnostic tools, remote monitoring devices, and virtual reality are expanding the possibilities for telemedicine. These innovations will further enhance the quality and scope of virtual healthcare services.</p>

      <p>As telemedicine continues to evolve, healthcare practices that embrace these technologies will be better positioned to serve their patients and remain competitive in the changing healthcare landscape.</p>
    `
  },
  4: {
    title: "Website Accessibility: Why It Matters for Medical Practices",
    author: "Alex Thompson",
    date: "2024-01-01",
    readTime: "4 min read",
    tags: ["Accessibility", "Web Design", "Compliance"],
    coverImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop",
    content: `
      <p>Website accessibility ensures that people with disabilities can effectively use and navigate your medical practice's website. This isn't just about compliance—it's about providing equal access to healthcare information and services.</p>

      <h2>Legal Requirements</h2>
      <p>The Americans with Disabilities Act (ADA) applies to websites, and medical practices can face legal consequences for non-compliant sites. Following Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards helps ensure compliance.</p>

      <h2>Common Accessibility Features</h2>
      <p>Key accessibility features include alternative text for images, keyboard navigation support, proper heading structure, sufficient color contrast, and compatibility with screen readers. These features benefit all users, not just those with disabilities.</p>

      <h2>Impact on Patient Experience</h2>
      <p>Accessible websites improve the user experience for everyone. Clear navigation, readable fonts, and intuitive design help all visitors find information quickly and easily.</p>

      <h2>Implementation Steps</h2>
      <p>Start with an accessibility audit of your current website, prioritize the most critical issues, and work with experienced web developers who understand accessibility requirements. Regular testing and updates are essential for maintaining compliance.</p>

      <p>Investing in website accessibility demonstrates your commitment to serving all patients and can help avoid legal issues while improving overall user experience.</p>
    `
  }
};

const BlogArticle = () => {
  const { id } = useParams();
  const articleId = id ? parseInt(id, 10) : null;
  const article = articleId && blogArticles[articleId as keyof typeof blogArticles] ? blogArticles[articleId as keyof typeof blogArticles] : null;

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Article Not Found
            </h1>
            <Button asChild>
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        <article className="prose prose-lg dark:prose-invert max-w-none">
          <div 
            dangerouslySetInnerHTML={{ __html: article.content }}
            className="text-gray-700 dark:text-gray-300 leading-relaxed"
          />
        </article>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Button asChild>
            <Link to="/blog">← Back to All Articles</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogArticle;
