
import { SectionMotion } from './SectionMotion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

export interface ContactProps {
  heading?: string;
  subheading?: string;
  address?: string;
  phone?: string;
  email?: string;
  mapEmbedUrl?: string;
  showForm?: boolean;
}

export function Contact({
  heading = 'Contact Us',
  subheading = 'Get in touch with our team',
  address = '',
  phone = '',
  email = '',
  mapEmbedUrl = '',
  showForm = true
}: ContactProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    submitted: false
  });

  const hasContactInfo = address || phone || email;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would send the form data to your backend
    // For now, we'll just show a success message
    setFormState(prev => ({ ...prev, submitted: true }));
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <SectionMotion className="container mx-auto px-4">
        <div className="text-center mb-12">
          {heading && (
            <h2 className="text-3xl font-bold mb-4"
              style={{ color: 'var(--primary-color)' }}>
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {subheading}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div>
            {hasContactInfo ? (
              <Card className="p-6 h-full">
                <h3 className="text-xl font-semibold mb-4">Our Information</h3>
                <div className="space-y-4">
                  {address && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-700 dark:text-gray-300">{address}</p>
                      </div>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-700 dark:text-gray-300">{phone}</p>
                      </div>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-700 dark:text-gray-300">{email}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {mapEmbedUrl && (
                  <div className="mt-6 aspect-[4/3] w-full">
                    <iframe
                      src={mapEmbedUrl}
                      className="w-full h-full rounded-md border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Location Map"
                    ></iframe>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-6 h-full">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Skeleton className="h-5 w-5 mr-3" />
                    <Skeleton className="h-4 w-full max-w-xs" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-5 w-5 mr-3" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-5 w-5 mr-3" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <Skeleton className="mt-6 h-48 w-full" />
              </Card>
            )}
          </div>
          
          {/* Contact Form */}
          {showForm && (
            <Card className="p-6">
              {!formState.submitted ? (
                <>
                  <h3 className="text-xl font-semibold mb-4">Send a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        value={formState.name}
                        onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formState.email}
                        onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        rows={5}
                        value={formState.message}
                        onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                        required 
                      />
                    </div>
                    <Button type="submit" className="w-full">Send Message</Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-16 w-16 mx-auto text-green-500 mb-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                  <p className="text-gray-600 dark:text-gray-300">Your message has been sent successfully.</p>
                  <Button 
                    onClick={() => setFormState(prev => ({ name: '', email: '', message: '', submitted: false }))}
                    className="mt-6"
                    variant="outline"
                  >
                    Send Another Message
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      </SectionMotion>
    </section>
  );
}
