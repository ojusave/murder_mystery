'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Simplified validation schema
const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  legalName: z.string().min(1, 'Legal name is required'),
  willDressUp: z.enum(['Of course, who goes to a halloween murder mystery without dressing up?', 'I will try, but no commitments']).refine(val => val !== undefined, 'Please select an option'),
  charNameMode: z.enum(['I leave the fate of my character in your capable hands', 'Other:']),
  charNameOther: z.string().optional(),
  ackPairing: z.boolean().refine(val => val === true, 'You must acknowledge pairing'),
  ackAdultThemes: z.boolean().refine(val => val === true, 'You must acknowledge adult themes'),
  ackWaiver: z.boolean().refine(val => val === true, 'You must agree to the waiver'),
  ackOffensiveEmails: z.boolean().refine(val => val === true, 'You must agree to receive offensive emails'),
  ackIndemnification: z.boolean().refine(val => val === true, 'You must agree to the indemnification clause'),
}).refine((data) => {
  // If charNameMode is "Other:", then charNameOther must be provided
  if (data.charNameMode === 'Other:' && (!data.charNameOther || data.charNameOther.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "Please specify your character name preference",
  path: ["charNameOther"]
});

type FormData = z.infer<typeof formSchema>;

// Calculate form completion progress
const calculateProgress = (data: Partial<FormData>): number => {
  const fields = [
    'email',
    'legalName', 
    'willDressUp',
    'charNameMode',
    'ackPairing',
    'ackAdultThemes',
    'ackWaiver',
    'ackOffensiveEmails',
    'ackIndemnification'
  ];
  
  let completed = 0;
  fields.forEach(field => {
    const value = data[field as keyof FormData];
    if (field === 'charNameMode' && value === 'Other:') {
      // If "Other" is selected, charNameOther must also be filled
      if (data.charNameOther && data.charNameOther.trim()) {
        completed++;
      }
    } else if (value !== undefined && value !== '' && value !== false) {
      completed++;
    }
  });
  
  return Math.round((completed / fields.length) * 100);
};

export default function RSVPForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      legalName: '',
      willDressUp: '' as any,
      charNameMode: '' as any,
      charNameOther: '',
      ackPairing: false,
      ackAdultThemes: false,
      ackWaiver: false,
      ackOffensiveEmails: false,
      ackIndemnification: false,
    },
  });

  // Debug form initialization
  // console.log('Form initialized with values:', form.getValues());
  // console.log('Form state:', form.formState);

  // Save progress to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('rsvp-form-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Ensure volunteerDecor defaults to false if not explicitly set
        if (parsed.volunteerDecor === undefined) {
          parsed.volunteerDecor = false;
        }
        form.reset(parsed);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
        // Clear invalid data
        localStorage.removeItem('rsvp-form-data');
      }
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((data) => {
      localStorage.setItem('rsvp-form-data', JSON.stringify(data));
      setFormProgress(calculateProgress(data));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: FormData) => {
    // Validate all fields using the schema
    try {
      formSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Set the errors on the form
        const fieldErrors: any = {};
        error.issues.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0]] = { message: err.message };
          }
        });
        
        setSubmitError('Please fill in all required fields before submitting.');
        
        // Scroll to the top of the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        return;
      }
    }
    
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const method = isUpdating ? 'PUT' : 'POST';
      const response = await fetch('/api/rsvp', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        
        // Provide more specific error messages
        if (response.status === 400) {
          throw new Error(error.details ? `Validation error: ${JSON.stringify(error.details)}` : error.error || 'Invalid form data');
        } else if (response.status === 409) {
          // Automatically retry with PUT to update existing RSVP
          if (!isUpdating) {
            setIsUpdating(true);
            setSubmitError(`An RSVP with this email address already exists. Updating your existing RSVP...`);
            
            // Retry with PUT method
            const updateResponse = await fetch('/api/rsvp', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
            
            if (!updateResponse.ok) {
              const updateError = await updateResponse.json();
              throw new Error(updateError.error || 'Failed to update RSVP');
            }
            
            const updateResult = await updateResponse.json();
            console.log('RSVP updated successfully:', updateResult);
            
            // Redirect to thanks page
            window.location.href = '/thanks';
            return;
          } else {
            throw new Error('Failed to update existing RSVP');
          }
        } else if (response.status === 404) {
          throw new Error('No existing RSVP found with this email address');
        } else if (response.status === 503) {
          throw new Error('Service temporarily unavailable. Please try again later.');
        } else {
          throw new Error(error.error || error.message || 'Failed to submit RSVP');
        }
      }

      const result = await response.json();

      // Clear saved data and redirect to guest portal
      localStorage.removeItem('rsvp-form-data');
      window.location.href = `/guest/${result.token}`;
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900">
      {/* Background Image Container */}
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800">
        <Image 
          src="/black-lotus-poster.jpg"
          alt="Black Lotus Poster"
          fill
          className="object-contain"
          priority
        />
      </div>
      {/* Dark overlay for better text readability */}
      <div className="fixed inset-0 bg-black/50 pointer-events-none" />
      {/* Content */}
      <div className="relative z-10 bg-black/60 backdrop-blur-sm">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            Black Lotus
          </Link>
          <div className="flex gap-2">
            <Link href="/faq">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                FAQ
              </Button>
            </Link>
            <Link href="/waiver">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                Read Waiver
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white text-center">
              RSVP Form
            </CardTitle>
            <CardDescription className="text-gray-300 text-center">
              Black Lotus Halloween Murder Mystery Party
            </CardDescription>
            
            {/* Progress Indicator */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Form Progress</span>
                <span>{formProgress}% Complete</span>
              </div>
              <Progress 
                value={formProgress} 
                className="h-2 bg-gray-700"
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" aria-label="RSVP Form for Black Lotus Murder Mystery Party">
              {/* Personal Information Section */}
              <fieldset className="space-y-6">
                <legend className="text-xl font-semibold text-white mb-4 border-b border-gray-600 pb-4 w-full">
                  Personal Information
                </legend>
                
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-white font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register('email')}
                      className="bg-gray-800 border-gray-600 text-white mt-2 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="your.email@example.com"
                      onChange={(e) => {
                        form.setValue('email', e.target.value);
                        form.trigger('email');
                      }}
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <span>⚠️</span>
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Legal Name */}
                  <div>
                    <Label htmlFor="legalName" className="text-white font-medium">
                      Legal Name *
                    </Label>
                    <Input
                      id="legalName"
                      {...form.register('legalName')}
                      className="bg-gray-800 border-gray-600 text-white mt-2 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Your full legal name"
                      onChange={(e) => {
                        form.setValue('legalName', e.target.value);
                        form.trigger('legalName');
                      }}
                    />
                    {form.formState.errors.legalName && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <span>⚠️</span>
                        {form.formState.errors.legalName.message}
                      </p>
                    )}
                  </div>
                </div>
              </fieldset>

              {/* Event Preferences Section */}
              <fieldset className="space-y-6">
                <legend className="text-xl font-semibold text-white mb-4 border-b border-gray-600 pb-4 w-full">
                  Event Preferences
                </legend>

                {/* Costume Commitment */}
                <div>
                  <Label className="text-white font-medium mb-4 block">
                    Costume Commitment *
                  </Label>
                  <RadioGroup
                    value={form.watch('willDressUp') || ''}
                    onValueChange={(value) => {
                      form.setValue('willDressUp', value as 'Of course, who goes to a halloween murder mystery without dressing up?' | 'I will try, but no commitments');
                      form.trigger('willDressUp');
                    }}
                    className="space-y-3"
                  >
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                      <RadioGroupItem 
                        value="Of course, who goes to a halloween murder mystery without dressing up?" 
                        id="dress-yes" 
                        className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:text-black mt-1"
                      />
                      <Label htmlFor="dress-yes" className="text-gray-300 cursor-pointer flex-1">
                        Of course, who goes to a halloween murder mystery without dressing up?
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                      <RadioGroupItem 
                        value="I will try, but no commitments" 
                        id="dress-maybe" 
                        className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:text-black mt-1"
                      />
                      <Label htmlFor="dress-maybe" className="text-gray-300 cursor-pointer flex-1">
                        I will try, but no commitments
                      </Label>
                    </div>
                  </RadioGroup>
                  {form.formState.errors.willDressUp && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <span>⚠️</span>
                      {form.formState.errors.willDressUp.message}
                    </p>
                  )}
                </div>

                {/* Character Name Preference */}
                <div>
                  <Label className="text-white font-medium mb-4 block">
                    Character Name Preference *
                  </Label>
                  <RadioGroup
                    value={form.watch('charNameMode') || ''}
                    onValueChange={(value) => {
                      form.setValue('charNameMode', value as 'I leave the fate of my character in your capable hands' | 'Other:');
                      form.trigger('charNameMode');
                    }}
                    className="space-y-3"
                  >
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                      <RadioGroupItem 
                        value="I leave the fate of my character in your capable hands" 
                        id="name-fate" 
                        className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:text-black mt-1"
                      />
                      <Label htmlFor="name-fate" className="text-gray-300 cursor-pointer flex-1">
                        I leave the fate of my character in your capable hands
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                      <RadioGroupItem 
                        value="Other:" 
                        id="name-other" 
                        className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:text-black mt-1"
                      />
                      <Label htmlFor="name-other" className="text-gray-300 cursor-pointer flex-1">Other:</Label>
                    </div>
                  </RadioGroup>
                  {form.watch('charNameMode') === 'Other:' && (
                    <div className="mt-3">
                      <Input
                        {...form.register('charNameOther')}
                        placeholder="Please specify your character name preference"
                        className="bg-gray-800 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  )}
                  {form.formState.errors.charNameMode && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <span>⚠️</span>
                      {form.formState.errors.charNameMode.message}
                    </p>
                  )}
                  {form.formState.errors.charNameOther && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <span>⚠️</span>
                      {form.formState.errors.charNameOther.message}
                    </p>
                  )}
                </div>
              </fieldset>

              {/* Agreements & Acknowledgements Section */}
              <fieldset className="space-y-6">
                <legend className="text-xl font-semibold text-white mb-4 border-b border-gray-600 pb-4 w-full">
                  Agreements & Acknowledgements
                </legend>
                <p className="text-gray-400 text-sm mb-6">
                  Please read each section carefully and check the boxes to acknowledge your understanding.
                </p>

                {/* Waiver Agreement */}
                <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-700/50">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="ackWaiver"
                      checked={form.watch('ackWaiver')}
                      onCheckedChange={(checked) => {
                        form.setValue('ackWaiver', checked as boolean);
                        form.trigger('ackWaiver');
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor="ackWaiver" className="text-white font-medium cursor-pointer">
                        Waiver Agreement *
                      </Label>
                      <p className="text-gray-300 text-sm mt-2">
                        I have read, understood and agree to every single thing that is written here. 
                        By selecting Yes, I agree, accept and promise to adhere to the terms and conditions 
                        and the definitions provided in this{' '}
                        <Link 
                          href="/waiver"
                          className="text-purple-300 hover:text-purple-200 underline font-medium"
                        >
                          waiver document
                        </Link>
                      </p>
                      {form.formState.errors.ackWaiver && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                          <span>⚠️</span>
                          {form.formState.errors.ackWaiver.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pairing Acknowledgment */}
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600/50">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="ackPairing"
                      checked={form.watch('ackPairing')}
                      onCheckedChange={(checked) => {
                        form.setValue('ackPairing', checked as boolean);
                        form.trigger('ackPairing');
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor="ackPairing" className="text-white font-medium cursor-pointer">
                        Character Pairing Understanding *
                      </Label>
                      <p className="text-gray-300 text-sm mt-2">
                        I understand that in the murder mystery, I may be paired with a 'plus one' who may not be my partner and could be of any gender. I acknowledge that this pairing is solely for the purpose of the game and does not imply or necessitate any form of romantic or physical interaction.
                      </p>
                      {form.formState.errors.ackPairing && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                          <span>⚠️</span>
                          {form.formState.errors.ackPairing.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Adult Themes Acknowledgment */}
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600/50">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="ackAdultThemes"
                      checked={form.watch('ackAdultThemes')}
                      onCheckedChange={(checked) => {
                        form.setValue('ackAdultThemes', checked as boolean);
                        form.trigger('ackAdultThemes');
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor="ackAdultThemes" className="text-white font-medium cursor-pointer">
                        Adult Content Acknowledgment *
                      </Label>
                      <p className="text-gray-300 text-sm mt-2">
                        I understand that the Murder Mystery Party may contain adult themes, dark humor, suggestive content, and potentially disturbing or controversial scenarios. I am choosing to participate with this knowledge and will not hold the host responsible for any discomfort or offense I may experience.
                      </p>
                      {form.formState.errors.ackAdultThemes && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                          <span>⚠️</span>
                          {form.formState.errors.ackAdultThemes.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Communication Style Acknowledgment */}
                <div className="p-4 bg-red-900/30 rounded-lg border border-red-700/50">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="ackOffensiveEmails"
                      checked={form.watch('ackOffensiveEmails')}
                      onCheckedChange={(checked) => {
                        form.setValue('ackOffensiveEmails', checked as boolean);
                        form.trigger('ackOffensiveEmails');
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor="ackOffensiveEmails" className="text-white font-medium cursor-pointer">
                        Communication Style Agreement *
                      </Label>
                      <p className="text-gray-300 text-sm mt-2">
                        I understand that the host of the event has a brutally dismissive communication style 
                        <strong className="text-yellow-300"> that is intentionally humorous and satirical</strong>. 
                        By checking this box, I acknowledge that I will receive emails that may be offensive, condescending, sarcastic, 
                        and designed to make me feel like a worthless piece of shit - <strong className="text-yellow-300">all in good fun</strong>. 
                        I agree to receive these emails and will not complain about their tone, content, or delivery method. 
                        I understand this is part of the experience and I'm here for it. 
                        <strong className="text-red-300">The hosts, email senders, and anyone associated with this event are not responsible for any mental breakdown, emotional distress, or psychological harm that may result from receiving these communications.</strong>
                        If you can't handle harsh words,{' '}
                        <Link 
                          href="/faq"
                          className="text-red-300 hover:text-red-200 underline font-medium"
                        >
                          check the FAQ
                        </Link>
                        {' '}to see what you're getting into.
                      </p>
                      {form.formState.errors.ackOffensiveEmails && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                          <span>⚠️</span>
                          {form.formState.errors.ackOffensiveEmails.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Indemnification Agreement */}
                <div className="p-4 bg-orange-900/30 rounded-lg border border-orange-700/50">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="ackIndemnification"
                      checked={form.watch('ackIndemnification')}
                      onCheckedChange={(checked) => {
                        form.setValue('ackIndemnification', checked as boolean);
                        form.trigger('ackIndemnification');
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor="ackIndemnification" className="text-white font-medium cursor-pointer">
                        Comprehensive Indemnification Agreement *
                      </Label>
                      <p className="text-gray-300 text-sm mt-2">
                        Attendees agree to indemnify, protect, defend, release, and hold harmless the Host from all liability to them, 
                        their invitees/guests, their next of kin, their conservators, assigns, heirs, guardians, or other legal representatives, 
                        employers, government entities, law enforcement agencies, intelligence agencies, non-state actors, and any other third-party 
                        entities for any and all claims, demands, losses, or damages, suits, fines, including court costs and attorneys' fees, 
                        for any injury, illness, illegal activities, or mental harm including but not limited to offense, hurt, or shock arising 
                        prior to, during, or after the Party. Attendees hereby waive all legal rights to pursue any form of legal action against the Host.
                      </p>
                      {form.formState.errors.ackIndemnification && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                          <span>⚠️</span>
                          {form.formState.errors.ackIndemnification.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Submit Section */}
              <div className="pt-8 border-t border-gray-600">
                <div className="text-center space-y-4">
                  <div id="submit-status" className="text-sm text-gray-400" role="status" aria-live="polite">
                    {formProgress === 100 ? (
                      <span className="text-green-400 flex items-center justify-center gap-2">
                        <span>✅</span>
                        Form is complete and ready to submit!
                      </span>
                    ) : (
                      <span className="text-yellow-400 flex items-center justify-center gap-2">
                        <span>⚠️</span>
                        Please complete all required fields ({formProgress}% complete)
                      </span>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting || formProgress < 100}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    onClick={(e) => {
                      e.preventDefault();
                      onSubmit(form.getValues());
                    }}
                    aria-describedby="submit-status"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        {isUpdating ? 'Updating...' : 'Submitting...'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span>🚀</span>
                        {isUpdating ? 'Update RSVP' : 'Submit RSVP'}
                      </span>
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-500">
                    Your progress is automatically saved as you fill out the form
                  </p>
                </div>
              </div>

              {submitError && (
                <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 text-xl">⚠️</span>
                    <div className="flex-1">
                      <h4 className="text-red-300 font-semibold mb-2">Submission Error</h4>
                      <p className="text-red-200 mb-3">{submitError}</p>
                      
                      {Object.keys(form.formState.errors).length > 0 && (
                        <div className="bg-red-800/30 rounded p-3 mb-3">
                          <p className="text-red-200 text-sm font-medium mb-1">Missing or invalid fields:</p>
                          <ul className="text-red-200 text-sm list-disc list-inside">
                            {Object.keys(form.formState.errors).map((field) => (
                              <li key={field} className="capitalize">
                                {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {isUpdating && (
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsUpdating(false);
                              setSubmitError('');
                            }}
                            className="text-white border-white hover:bg-white hover:text-gray-900"
                          >
                            Cancel Update
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-700 mt-16">
        <div className="text-center text-gray-400">
        </div>
      </footer>
      </div>
    </div>
  );
}
