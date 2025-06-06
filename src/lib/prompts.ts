
/**
 * Prompt generation functions for AI-powered content creation
 * Each function returns a detailed prompt for specific content types
 */

export function aboutPrompt(clinicName: string, specialties: string[]): string {
  const specialtiesText = specialties.length > 0 ? specialties.join(', ') : 'general dental care';
  
  return `Context: You are writing an "About Us" section for ${clinicName}, a dental/medical clinic specializing in ${specialtiesText}.

Task: Create a professional, warm, and trustworthy About Us section that establishes credibility and builds patient confidence.

Requirements:
- Write 2-3 short paragraphs (150-200 words total)
- Use a professional but friendly tone
- Emphasize experience, qualifications, and patient care philosophy
- Include mention of specialties: ${specialtiesText}
- Focus on building trust and rapport with potential patients
- Avoid overly technical language
- Include phrases about commitment to patient comfort and quality care

Tone: Professional, warm, trustworthy, patient-focused
Output: Return only the About Us text content, no additional formatting or labels.`;
}

export function servicePrompt(clinicName: string, serviceName: string, location: string): string {
  return `Context: You are writing a service description for "${serviceName}" offered by ${clinicName} located in ${location}.

Task: Create a concise, informative service description that explains the benefits and builds patient confidence.

Requirements:
- Write 1-2 sentences (30-50 words total)
- Use professional medical/dental terminology appropriately
- Highlight key benefits and patient outcomes
- Emphasize quality and safety
- Include mention of ${clinicName}'s expertise in this service
- Focus on patient value and results

Tone: Professional, confident, benefit-focused
Output: Return only the service description text, no additional formatting or labels.`;
}

export function testimonialPrompt(clinicName: string): string {
  return `Context: You are creating a realistic patient testimonial for ${clinicName}, a dental/medical clinic.

Task: Write an authentic-sounding patient review that highlights positive experiences and outcomes.

Requirements:
- Write 2-3 sentences (40-80 words total)
- Use natural, conversational language as if written by a real patient
- Mention specific aspects: staff friendliness, professionalism, comfort, results
- Include emotional elements (relief, satisfaction, confidence)
- Avoid overly promotional language
- Make it feel genuine and relatable
- Include mention of recommending ${clinicName} to others

Tone: Genuine, grateful, conversational, positive
Output: Return only the testimonial text content, no additional formatting or labels.`;
}

export function heroPrompt(clinicName: string, location: string, specialties: string[]): string {
  const specialtiesText = specialties.length > 0 ? specialties.join(', ') : 'quality dental care';
  
  return `Context: You are writing a hero section headline and subheadline for ${clinicName} located in ${location}, specializing in ${specialtiesText}.

Task: Create compelling hero text that immediately communicates value and encourages action.

Requirements:
- Write a headline (5-8 words) and subheadline (15-25 words)
- Headline should be catchy and memorable
- Subheadline should mention location: ${location}
- Include reference to specialties: ${specialtiesText}
- Focus on patient benefits and outcomes
- Create urgency or emotional connection
- Use action-oriented language

Format:
Headline: [Your headline here]
Subheadline: [Your subheadline here]

Tone: Confident, welcoming, action-oriented
Output: Return only the formatted headline and subheadline as specified above.`;
}

export function contactPrompt(clinicName: string, location: string): string {
  return `Context: You are writing a contact section introduction for ${clinicName} located in ${location}.

Task: Create welcoming contact section text that encourages patients to reach out.

Requirements:
- Write 1-2 sentences (25-40 words total)
- Emphasize easy scheduling and responsive communication
- Mention ${location} location
- Use inviting, approachable language
- Include call-to-action elements
- Focus on accessibility and patient convenience

Tone: Welcoming, helpful, accessible
Output: Return only the contact section text, no additional formatting or labels.`;
}

export function featuresPrompt(clinicName: string, specialties: string[]): string {
  const specialtiesText = specialties.length > 0 ? specialties.join(', ') : 'comprehensive care';
  
  return `Context: You are writing feature descriptions for ${clinicName}, highlighting what makes them stand out in ${specialtiesText}.

Task: Create 3-4 key feature points that differentiate the clinic from competitors.

Requirements:
- Write 3-4 bullet points (10-15 words each)
- Focus on unique value propositions
- Mention specialties: ${specialtiesText}
- Highlight technology, experience, or service quality
- Use benefit-focused language
- Emphasize patient outcomes and satisfaction

Format:
• [Feature 1]
• [Feature 2]
• [Feature 3]
• [Feature 4]

Tone: Professional, distinctive, value-focused
Output: Return only the formatted feature list as specified above.`;
}
