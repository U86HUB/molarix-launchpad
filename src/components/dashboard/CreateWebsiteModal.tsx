
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Loader2, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Website } from '@/types/website';
import WebsiteInitializationLoader from '../website-builder/WebsiteInitializationLoader';
import { useWebsiteInitialization } from '@/hooks/useWebsiteInitialization';
import { useWebsiteCreationGuard } from '@/hooks/useWebsiteCreationGuard';

interface Clinic {
  id: string;
  name: string;
}

interface CreateWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWebsiteCreate: (website: Website) => void;
  clinics: Clinic[];
}

const templates = [
  {
    id: 'template-a',
    name: 'Modern Dental',
    description: 'Clean and professional design perfect for dental practices',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop&crop=center',
    features: ['Mobile Responsive', 'SEO Optimized', 'Contact Forms']
  },
  {
    id: 'template-b',
    name: 'Medical Center Pro',
    description: 'Comprehensive layout for medical centers and hospitals',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop&crop=center',
    features: ['Patient Portal', 'Appointment Booking', 'Service Showcase']
  },
  {
    id: 'template-c',
    name: 'Specialty Clinic',
    description: 'Elegant design tailored for specialty medical practices',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop&crop=center',
    features: ['Gallery Section', 'Team Profiles', 'Testimonials']
  }
];

export const CreateWebsiteModal = ({ isOpen, onClose, onWebsiteCreate, clinics }: CreateWebsiteModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    clinicId: '',
    template: ''
  });

  const {
    isInitializing,
    currentStep: initStep,
    currentMessage,
    isCompleted: initCompleted,
    hasError: initError,
    initializeWebsite,
  } = useWebsiteInitialization();

  const {
    isCreating,
    canCreate,
    startCreation,
    completeCreation,
    resetCreation,
  } = useWebsiteCreationGuard();

  const handleOpenChange = (open: boolean) => {
    if (!open && !isInitializing && !isCreating) {
      onClose();
      setStep(1);
      setFormData({ name: '', clinicId: '', template: '' });
      resetCreation();
    }
  };

  const handleNext = () => {
    if (step === 1 && formData.name && formData.clinicId) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleTemplateSelect = (templateId: string) => {
    setFormData(prev => ({ ...prev, template: templateId }));
  };

  const handleCreate = async () => {
    if (!user || !formData.name || !formData.clinicId || !formData.template) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const websiteName = formData.name.trim();
    
    // Use creation guard to prevent duplicates
    if (!canCreate(websiteName)) {
      return;
    }

    startCreation(websiteName);
    console.log('🔄 Creating website:', websiteName);

    try {
      // Create the basic website record
      const { data: newWebsite, error } = await supabase
        .from('websites')
        .insert({
          name: websiteName,
          clinic_id: formData.clinicId,
          template_type: formData.template,
          status: 'draft',
          primary_color: '#4f46e5',
          font_style: 'default',
          created_by: user.id,
        })
        .select(`
          id,
          name,
          template_type,
          status,
          clinic_id,
          primary_color,
          font_style,
          created_at,
          updated_at,
          clinics!inner(name)
        `)
        .single();

      if (error) {
        console.error('❌ Website creation error:', error);
        resetCreation();
        throw error;
      }

      console.log('✅ Website created successfully:', newWebsite.id);
      completeCreation(newWebsite.id);

      // Type the response properly to match Website interface
      const websiteWithClinic: Website = {
        id: newWebsite.id,
        name: newWebsite.name,
        template_type: newWebsite.template_type,
        status: newWebsite.status as 'draft' | 'published' | 'archived',
        clinic_id: newWebsite.clinic_id,
        primary_color: newWebsite.primary_color,
        font_style: newWebsite.font_style,
        created_at: newWebsite.created_at,
        updated_at: newWebsite.updated_at,
        created_by: user.id,
        clinic: { name: newWebsite.clinics.name }
      };

      // Get clinic data for initialization
      const selectedClinic = clinics.find(c => c.id === formData.clinicId);

      // Initialize the website with sections and content
      await initializeWebsite({
        websiteId: newWebsite.id,
        templateType: formData.template,
        primaryColor: '#4f46e5',
        fontStyle: 'default',
        clinicData: {
          name: selectedClinic?.name || 'Your Practice'
        }
      });

      onWebsiteCreate(websiteWithClinic);

    } catch (error: any) {
      console.error('❌ Error creating website:', error);
      resetCreation();
      toast({
        title: "Error",
        description: "Failed to create website",
        variant: "destructive",
      });
    }
  };

  // Close modal when initialization completes successfully
  if (initCompleted && isOpen) {
    setTimeout(() => {
      handleOpenChange(false);
    }, 1000);
  }

  const selectedClinic = clinics.find(c => c.id === formData.clinicId);
  const selectedTemplate = templates.find(t => t.id === formData.template);
  const isBusy = isCreating || isInitializing;

  return (
    <>
      <WebsiteInitializationLoader
        isVisible={isInitializing}
        currentStep={initStep}
        currentMessage={currentMessage}
        isCompleted={initCompleted}
        hasError={initError}
        onRetry={() => {
          console.log('Retry initialization requested');
        }}
      />

      <Dialog open={isOpen && !isInitializing} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Create New Website
              <span className="text-sm font-normal text-muted-foreground ml-2">
                Step {step} of 2
              </span>
            </DialogTitle>
            <DialogDescription>
              {step === 1 
                ? "Enter basic information for your new website"
                : "Choose a template that best fits your clinic's style"
              }
            </DialogDescription>
          </DialogHeader>

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-website-name">Website Name *</Label>
                <Input
                  id="create-website-name"
                  placeholder="Enter website name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={isBusy}
                  aria-describedby="create-website-name-description"
                />
                <p id="create-website-name-description" className="text-xs text-muted-foreground">
                  Choose a descriptive name for your website
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-website-clinic">Select Clinic *</Label>
                <Select value={formData.clinicId} onValueChange={(value) => setFormData(prev => ({ ...prev, clinicId: value }))}>
                  <SelectTrigger disabled={isBusy} id="create-website-clinic" aria-describedby="create-website-clinic-description">
                    <SelectValue placeholder="Choose a clinic" />
                  </SelectTrigger>
                  <SelectContent>
                    {clinics.map((clinic) => (
                      <SelectItem key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p id="create-website-clinic-description" className="text-xs text-muted-foreground">
                  The clinic this website will represent
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isBusy}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleNext} 
                  disabled={!formData.name || !formData.clinicId || isBusy}
                >
                  Next: Choose Template
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-lg text-sm">
                <strong>Website:</strong> {formData.name} <br />
                <strong>Clinic:</strong> {selectedClinic?.name}
              </div>

              <div className="space-y-3">
                <Label>Choose a Template *</Label>
                <div className="grid gap-4" role="radiogroup" aria-label="Website template selection">
                  {templates.map((template) => (
                    <Card 
                      key={template.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        formData.template === template.id 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : ''
                      } ${isBusy ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => !isBusy && handleTemplateSelect(template.id)}
                      role="radio"
                      aria-checked={formData.template === template.id}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (!isBusy) handleTemplateSelect(template.id);
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img 
                            src={template.image} 
                            alt={`${template.name} template preview`}
                            className="w-20 h-16 rounded object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{template.name}</h3>
                              {formData.template === template.id && (
                                <Check className="h-4 w-4 text-primary" aria-label="Selected" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {template.description}
                            </p>
                            <div className="flex gap-2">
                              {template.features.map((feature, idx) => (
                                <span 
                                  key={idx}
                                  className="text-xs bg-secondary px-2 py-1 rounded"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-between gap-2 pt-4">
                <Button variant="outline" onClick={handleBack} disabled={isBusy}>
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isBusy}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreate} 
                    disabled={!formData.template || isBusy}
                  >
                    {isCreating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {isCreating ? 'Creating...' : 'Create Website'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
