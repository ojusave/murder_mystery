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


export default function RSVPForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

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
          </CardHeader>

          <CardContent className="space-y-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-white">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    className="bg-gray-800 border-gray-600 text-white"
                    onChange={(e) => {
                      form.setValue('email', e.target.value);
                      form.trigger('email');
                    }}
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-400 text-sm mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Legal Name */}
                <div>
                  <Label htmlFor="legalName" className="text-white">
                    Legal Name *
                  </Label>
                  <Input
                    id="legalName"
                    {...form.register('legalName')}
                    className="bg-gray-800 border-gray-600 text-white"
                    onChange={(e) => {
                      form.setValue('legalName', e.target.value);
                      form.trigger('legalName');
                    }}
                  />
                  {form.formState.errors.legalName && (
                    <p className="text-red-400 text-sm mt-1">
                      {form.formState.errors.legalName.message}
                    </p>
                  )}
                </div>

                {/* Costume Commitment */}
                <div>
                  <Label className="text-white mb-4 block">
                    Costume Commitment *
                  </Label>
                  <RadioGroup
                    value={form.watch('willDressUp') || ''}
                    onValueChange={(value) => {
                      form.setValue('willDressUp', value as 'Of course, who goes to a halloween murder mystery without dressing up?' | 'I will try, but no commitments');
                      form.trigger('willDressUp');
                    }}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="Of course, who goes to a halloween murder mystery without dressing up?" 
                        id="dress-yes" 
                        className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <Label htmlFor="dress-yes" className="text-gray-300 cursor-pointer">
                        Of course, who goes to a halloween murder mystery without dressing up?
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="I will try, but no commitments" 
                        id="dress-maybe" 
                        className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <Label htmlFor="dress-maybe" className="text-gray-300 cursor-pointer">
                        I will try, but no commitments
                      </Label>
                    </div>
                  </RadioGroup>
                  {form.formState.errors.willDressUp && (
                    <p className="text-red-400 text-sm mt-1">
                      {form.formState.errors.willDressUp.message}
                    </p>
                  )}
                </div>

                {/* Character Name Preference */}
                <div>
                  <Label className="text-white mb-4 block">
                    Character Name Preference *
                  </Label>
                  <RadioGroup
                    value={form.watch('charNameMode') || ''}
                    onValueChange={(value) => {
                      form.setValue('charNameMode', value as 'I leave the fate of my character in your capable hands' | 'Other:');
                      form.trigger('charNameMode');
                    }}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="I leave the fate of my character in your capable hands" 
                        id="name-fate" 
                        className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <Label htmlFor="name-fate" className="text-gray-300 cursor-pointer">
                        I leave the fate of my character in your capable hands
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="Other:" 
                        id="name-other" 
                        className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <Label htmlFor="name-other" className="text-gray-300 cursor-pointer">Other:</Label>
                    </div>
                  </RadioGroup>
                  {form.watch('charNameMode') === 'Other:' && (
                    <Input
                      {...form.register('charNameOther')}
                      placeholder="Please specify your character name preference"
                      className="bg-gray-800 border-gray-600 text-white mt-2"
                    />
                  )}
                  {form.formState.errors.charNameMode && (
                    <p className="text-red-400 text-sm mt-1">
                      {form.formState.errors.charNameMode.message}
                    </p>
                  )}
                  {form.formState.errors.charNameOther && (
                    <p className="text-red-400 text-sm mt-1">
                      {form.formState.errors.charNameOther.message}
                    </p>
                  )}
                </div>

                {/* Acknowledgements */}
                <div className="space-y-4">
                  <div className="p-4 bg-purple-900/30 rounded-lg">
                    <p className="text-gray-300 mb-4">
                      I have read, understood and agree to every single thing that is written here. 
                      By selecting Yes, I agree, accept and promise to adhere to the terms and conditions 
                      and the definitions provided in this{' '}
                      <Link 
                        href="/waiver"
                        className="text-purple-300 hover:text-purple-200 underline"
                      >
                        waiver document
                      </Link>
                    </p>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ackWaiver"
                        checked={form.watch('ackWaiver')}
                        onCheckedChange={(checked) => {
                          form.setValue('ackWaiver', checked as boolean);
                          form.trigger('ackWaiver');
                        }}
                      />
                      <Label htmlFor="ackWaiver" className="text-white">
                        I agree to the waiver *
                      </Label>
                    </div>
                    {form.formState.errors.ackWaiver && (
                      <p className="text-red-400 text-sm mt-1">
                        {form.formState.errors.ackWaiver.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ackPairing"
                      checked={form.watch('ackPairing')}
                      onCheckedChange={(checked) => {
                        form.setValue('ackPairing', checked as boolean);
                        form.trigger('ackPairing');
                      }}
                    />
                    <Label htmlFor="ackPairing" className="text-white">
                      I understand that in the murder mystery, I may be paired with a 'plus one' who may not be my partner and could be of any gender. I acknowledge that this pairing is solely for the purpose of the game and does not imply or necessitate any form of romantic or physical interaction. *
                    </Label>
                  </div>
                  {form.formState.errors.ackPairing && (
                    <p className="text-red-400 text-sm mt-1">
                      {form.formState.errors.ackPairing.message}
                    </p>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ackAdultThemes"
                      checked={form.watch('ackAdultThemes')}
                      onCheckedChange={(checked) => {
                        form.setValue('ackAdultThemes', checked as boolean);
                        form.trigger('ackAdultThemes');
                      }}
                    />
                    <Label htmlFor="ackAdultThemes" className="text-white">
                      I understand that the Murder Mystery Party may contain adult themes, dark humor, suggestive content, and potentially disturbing or controversial scenarios. I am choosing to participate with this knowledge and will not hold the host responsible for any discomfort or offense I may experience. *
                    </Label>
                  </div>
                  {form.formState.errors.ackAdultThemes && (
                    <p className="text-red-400 text-sm mt-1">
                      {form.formState.errors.ackAdultThemes.message}
                    </p>
                  )}

                  <div className="p-4 bg-red-900/30 rounded-lg">
                    <p className="text-gray-300 mb-4">
                      I understand that the hosts of The Black Lotus Murder Mystery Party have a brutally dismissive communication style. 
                      By checking this box, I acknowledge that I will receive emails that may be offensive, condescending, sarcastic, 
                      and designed to make me feel like a worthless piece of shit. I agree to receive these emails and will not complain 
                      about their tone, content, or delivery method. I understand this is part of the experience and I'm here for it. 
                      If you can't handle harsh words,{' '}
                      <Link 
                        href="/faq"
                        className="text-red-300 hover:text-red-200 underline"
                      >
                        check the FAQ
                      </Link>
                      {' '}to see what you're getting into.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ackOffensiveEmails"
                        checked={form.watch('ackOffensiveEmails')}
                        onCheckedChange={(checked) => {
                          form.setValue('ackOffensiveEmails', checked as boolean);
                          form.trigger('ackOffensiveEmails');
                        }}
                      />
                      <Label htmlFor="ackOffensiveEmails" className="text-white">
                        I agree to receive brutally dismissive and offensive emails *
                      </Label>
                    </div>
                    {form.formState.errors.ackOffensiveEmails && (
                      <p className="text-red-400 text-sm mt-1">
                        {form.formState.errors.ackOffensiveEmails.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-8">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      onSubmit(form.getValues());
                    }}
                  >
                    {isSubmitting ? (isUpdating ? 'Updating...' : 'Submitting...') : (isUpdating ? 'Update RSVP' : 'Submit RSVP')}
                  </Button>
                </div>
              </div>

              {submitError && (
                <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">⚠️</span>
                    <div className="flex-1">
                      <p className="text-red-300 font-medium">{submitError}</p>
                      {Object.keys(form.formState.errors).length > 0 && (
                        <p className="text-red-200 text-sm mt-2">
                          Missing fields: {Object.keys(form.formState.errors).join(', ')}
                        </p>
                      )}
                      {isUpdating && (
                        <div className="mt-3 flex gap-2">
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
