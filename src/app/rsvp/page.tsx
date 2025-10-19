'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Validation schemas
const section1Schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  legalName: z.string().min(1, 'Legal name is required'),
  wantsToPlay: z.enum(['Yes', 'No, I think I would just be interested in a regular party']),
  ackWaiver: z.boolean().refine(val => val === true, 'You must agree to the waiver'),
});

const section2Schema = z.object({
  bringOptions: z.array(z.string()).min(1, 'Please select at least one option'),
  bringOther: z.string().optional(),
  volunteerDecor: z.boolean(),
  willDressUp: z.enum(['Of course, who goes to a halloween murder mystery without dressing up?', 'I will try, but no commitments']).refine(val => val !== undefined, 'Please select an option'),
});

const section3Schema = z.object({
  genderPref: z.enum(['Male', 'Female', 'Other:']),
  genderOther: z.string().optional(),
  charNamePref: z.string().optional(),
  charNameMode: z.enum(['I leave the fate of my character in your capable hands', 'Other:']),
  charNameOther: z.string().optional(),
  charInfoTiming: z.enum(['Yes. If I get to know about this before, I will have enough time to get into the character and plan my attire accordingly', 'I am very busy. The host should consider themselves lucky that I am attending this party. You can give me a character once I show up.']),
  talents: z.array(z.string()).optional(),
  talentsOther: z.string().optional(),
  ackPairing: z.boolean().refine(val => val === true, 'You must acknowledge pairing'),
  ackAdultThemes: z.boolean().refine(val => val === true, 'You must acknowledge adult themes'),
  suggestions: z.string().optional(),
}).refine((data) => {
  // If genderPref is "Other:", then genderOther must be provided
  if (data.genderPref === 'Other:' && (!data.genderOther || data.genderOther.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "Please specify your gender preference",
  path: ["genderOther"]
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

const fullSchema = section1Schema.merge(section2Schema).merge(section3Schema);

type FormData = z.infer<typeof fullSchema>;

const bringOptions = [
  'a. Snacks / munchies (nachos, chips, pizza, cheese sticks, nuggets etc) -- No Pork or Beef',
  'b. Liquor and liquers (Whiskey, tequila etc)',
  'c. decoration items (please drop the items a day before)',
  'd. Beverages',
];

const talentOptions = [
  'have a good taste of party music, and would like to nominate myself for the position of DJ',
  'dance as if Michael Jackson came back to life',
  'sing so well, even Taylor Swift would take notes',
  'would like to handle the bar counter and make amazing cocktails ("some" experience preferred)',
  'am good at cracking jokes or passing sarcastic comments (and I can take them on myself too)',
  'would like to take leadership during some portions of the game',
  'would like to just go with the flow',
];

export default function RSVPForm() {
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const form = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      legalName: '',
      wantsToPlay: undefined,
      ackWaiver: false,
      bringOptions: [],
      bringOther: '',
      volunteerDecor: false,
      willDressUp: undefined,
      genderPref: undefined,
      genderOther: '',
      charNamePref: '',
      charNameMode: undefined,
      charNameOther: '',
      charInfoTiming: undefined,
      talents: [],
      talentsOther: '',
      ackPairing: false,
      ackAdultThemes: false,
      suggestions: '',
    },
  });

  // Debug form initialization
  console.log('Form initialized with values:', form.getValues());
  console.log('Form state:', form.formState);

  // Save progress to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('rsvp-form-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        form.reset(parsed);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
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
    console.log('Form submitted with data:', data);
    console.log('Form validation state:', form.formState);
    console.log('Form errors:', form.formState.errors);
    console.log('All form values:', form.getValues());
    
    // First, validate all fields
    const isValid = await form.trigger();
    console.log('Full form validation result:', isValid);
    
    if (!isValid) {
      console.log('Validation errors found:', form.formState.errors);
      
      // Find which section has the first error
      let errorSection = 1;
      const errors = form.formState.errors;
      
      if (errors.genderPref || errors.charNameMode || errors.charInfoTiming || errors.ackPairing || errors.ackAdultThemes) {
        errorSection = 3;
      } else if (errors.bringOptions || errors.willDressUp) {
        errorSection = 2;
      }
      
      // Go to the section with the error
      setCurrentSection(errorSection);
      
      // Show error message
      setSubmitError(`Please complete all required fields. Missing: ${Object.keys(errors).join(', ')}`);
      
      // Scroll to the top of the form
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const error = await response.json();
        console.log('Error response:', error);
        throw new Error(error.message || 'Failed to submit RSVP');
      }

      const result = await response.json();
      console.log('Success response:', result);

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

  const nextSection = () => {
    console.log('nextSection called, current section:', currentSection);
    console.log('Form state:', form.formState);
    console.log('Form values:', form.getValues());
    
    if (currentSection === 1) {
      form.trigger(['email', 'legalName', 'wantsToPlay', 'ackWaiver']).then((isValid) => {
        console.log('Section 1 validation result:', isValid);
        console.log('Form errors:', form.formState.errors);
        console.log('Form values after trigger:', form.getValues());
        if (isValid) {
          setCurrentSection(2);
          setSubmitError(''); // Clear any previous errors
        } else {
          // Show which fields are missing
          const errors = form.formState.errors;
          const missingFields = Object.keys(errors).filter(key => 
            ['email', 'legalName', 'wantsToPlay', 'ackWaiver'].includes(key)
          );
          setSubmitError(`Please complete: ${missingFields.join(', ')}`);
        }
      });
    } else if (currentSection === 2) {
      form.trigger(['bringOptions', 'volunteerDecor', 'willDressUp']).then((isValid) => {
        console.log('Section 2 validation result:', isValid);
        console.log('Form errors:', form.formState.errors);
        if (isValid) {
          setCurrentSection(3);
          setSubmitError(''); // Clear any previous errors
        } else {
          // Show which fields are missing
          const errors = form.formState.errors;
          const missingFields = Object.keys(errors).filter(key => 
            ['bringOptions', 'volunteerDecor', 'willDressUp'].includes(key)
          );
          setSubmitError(`Please complete: ${missingFields.join(', ')}`);
        }
      });
    }
  };

  const prevSection = () => {
    setCurrentSection(currentSection - 1);
  };

  const progress = (currentSection / 3) * 100;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Background Image Container */}
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800">
        <img 
          src="/dark-lotus-poster.jpg"
          alt="Dark Lotus Poster"
          className="w-auto h-screen object-contain"
          style={{
            maxWidth: '100vw',
            maxHeight: '100vh',
          }}
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
            Dark Lotus
          </Link>
          <Link href="/waiver">
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
              Read Waiver
            </Button>
          </Link>
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
              Section {currentSection} of 3
            </CardDescription>
            <Progress value={progress} className="mt-4" />
          </CardHeader>

          <CardContent className="space-y-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Section 1: Murder Mystery Party Invitee */}
              {currentSection === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Murder Mystery Party Invitee
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-white">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register('email')}
                        className="bg-gray-800 border-gray-600 text-white"
                        onChange={(e) => {
                          console.log('Email changed:', e.target.value);
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

                    <div>
                      <Label htmlFor="legalName" className="text-white">
                        What is the name that your parents gave you? *
                      </Label>
                      <Input
                        id="legalName"
                        {...form.register('legalName')}
                        className="bg-gray-800 border-gray-600 text-white"
                        onChange={(e) => {
                          console.log('Legal name changed:', e.target.value);
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

                    <div>
                      <Label className="text-white mb-4 block">
                        Are you interested to play the murder mystery? *
                      </Label>
                      <RadioGroup
                        value={form.watch('wantsToPlay') || ''}
                        onValueChange={(value) => {
                          console.log('Radio button changed:', value);
                          form.setValue('wantsToPlay', value as 'Yes' | 'No, I think I would just be interested in a regular party');
                          form.trigger('wantsToPlay');
                        }}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value="Yes" 
                            id="yes" 
                            className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                          />
                          <Label htmlFor="yes" className="text-gray-300 cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value="No, I think I would just be interested in a regular party" 
                            id="no" 
                            className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                          />
                          <Label htmlFor="no" className="text-gray-300 cursor-pointer">
                            No, I think I would just be interested in a regular party
                          </Label>
                        </div>
                      </RadioGroup>
                      {form.formState.errors.wantsToPlay && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.wantsToPlay.message}
                        </p>
                      )}
                    </div>

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
                            console.log('Checkbox changed:', checked);
                            form.setValue('ackWaiver', checked as boolean);
                            form.trigger('ackWaiver');
                          }}
                        />
                        <Label htmlFor="ackWaiver" className="text-white">
                          Yes
                        </Label>
                      </div>
                      {form.formState.errors.ackWaiver && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.ackWaiver.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Section 2: The Main Event */}
              {currentSection === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    The Main Event
                  </h2>
                  
                  <div className="p-4 bg-purple-900/30 rounded-lg mb-6">
                    <p className="text-gray-300">
                      This is a Bring your anything to the party. Going along with the halloween theme, we'll be mixing up some spooky drinks (both alcoholic and non-alcoholic) to add to the fun. We aim to keep the atmosphere light and enjoyable for everyone, so we've decided to limit the amount of alcohol at the party. We'll be asking a select few to bring alcohol, while we encourage everyone else to bring other fun items or non-alcoholic beverages. Importantly, we'd like to mention that this is not a party for getting drunk. We want everyone to have a good time and make pleasant memories together. So, let's keep the spirit cheerful and the fun flowing all night long!
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white mb-4 block">
                        I can get the following * (select at least one)
                      </Label>
                      <div className="space-y-2">
                        {bringOptions.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={option}
                              checked={form.watch('bringOptions')?.includes(option) || false}
                              onCheckedChange={(checked) => {
                                const current = form.watch('bringOptions') || [];
                                if (checked) {
                                  form.setValue('bringOptions', [...current, option]);
                                } else {
                                  form.setValue('bringOptions', current.filter(item => item !== option));
                                }
                                form.trigger('bringOptions');
                              }}
                            />
                            <Label htmlFor={option} className="text-gray-300">
                              {option}
                            </Label>
                          </div>
                        ))}
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="bringOther"
                            checked={form.watch('bringOptions')?.includes('Other') || false}
                            onCheckedChange={(checked) => {
                              const current = form.watch('bringOptions') || [];
                              if (checked) {
                                form.setValue('bringOptions', [...current, 'Other']);
                              } else {
                                form.setValue('bringOptions', current.filter(item => item !== 'Other'));
                              }
                              form.trigger('bringOptions');
                            }}
                          />
                          <Label htmlFor="bringOther" className="text-gray-300">
                            Other:
                          </Label>
                        </div>
                      </div>
                      {form.watch('bringOptions')?.includes('Other') && (
                        <Input
                          {...form.register('bringOther')}
                          placeholder="Please specify"
                          className="bg-gray-800 border-gray-600 text-white mt-2"
                        />
                      )}
                      {form.formState.errors.bringOptions && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.bringOptions.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-white mb-4 block">
                        I can volunteer for designing / decorating the area before the party (if selected the host may invite you a day prior or earlier for decorating)
                      </Label>
                      <RadioGroup
                        value={form.watch('volunteerDecor') ? 'Yes' : 'No'}
                        onValueChange={(value) => {
                          form.setValue('volunteerDecor', value === 'Yes');
                          form.trigger('volunteerDecor');
                        }}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value="Yes" 
                            id="volunteer-yes" 
                            className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                          />
                          <Label htmlFor="volunteer-yes" className="text-gray-300 cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value="No" 
                            id="volunteer-no" 
                            className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                          />
                          <Label htmlFor="volunteer-no" className="text-gray-300 cursor-pointer">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-white mb-4 block">
                        I understand that it'll be more fun to dress up for the party (FYI: ITS HALLOWEEN) *
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
                  </div>
                </div>
              )}

              {/* Section 3: Character Questions */}
              {currentSection === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Character Questions
                  </h2>
                  
                  <div className="p-4 bg-purple-900/30 rounded-lg mb-6">
                    <p className="text-gray-300">
                      Wow! you made it this far!<br/>
                      Please answer the questions to the best of your ability to assign a character that fits this description (Absolutely No Promises).<br/><br/>
                      There are no "wrong" answers in this section.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="genderPref" className="text-white">
                        Do you have a gender preference for your character?
                      </Label>
                      <RadioGroup
                        value={form.watch('genderPref')}
                        onValueChange={(value) => {
                          form.setValue('genderPref', value as 'Male' | 'Female' | 'Other:');
                          form.trigger('genderPref');
                        }}
                        className="space-y-2 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value="Male" 
                            id="gender-male" 
                            className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                          />
                          <Label htmlFor="gender-male" className="text-gray-300 cursor-pointer">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value="Female" 
                            id="gender-female" 
                            className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                          />
                          <Label htmlFor="gender-female" className="text-gray-300 cursor-pointer">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value="Other:" 
                            id="gender-other" 
                            className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                          />
                          <Label htmlFor="gender-other" className="text-gray-300 cursor-pointer">Other:</Label>
                        </div>
                      </RadioGroup>
                      {form.watch('genderPref') === 'Other:' && (
                        <Input
                          {...form.register('genderOther')}
                          placeholder="Please specify"
                          className="bg-gray-800 border-gray-600 text-white mt-2"
                        />
                      )}
                      {form.formState.errors.genderPref && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.genderPref.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-white mb-4 block">
                        The preferred name for my character is... (Host judgment final on this)
                      </Label>
                      <RadioGroup
                        value={form.watch('charNameMode')}
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
                          placeholder="Please specify"
                          className="bg-gray-800 border-gray-600 text-white mt-2"
                        />
                      )}
                    </div>

                    <div>
                      <Label className="text-white mb-4 block">
                        I would like to know about my character/ and their traits before the party
                      </Label>
                      <RadioGroup
                        value={form.watch('charInfoTiming')}
                        onValueChange={(value) => {
                          form.setValue('charInfoTiming', value as 'Yes. If I get to know about this before, I will have enough time to get into the character and plan my attire accordingly' | 'I am very busy. The host should consider themselves lucky that I am attending this party. You can give me a character once I show up.');
                          form.trigger('charInfoTiming');
                        }}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value="Yes. If I get to know about this before, I will have enough time to get into the character and plan my attire accordingly" 
                            id="timing-early" 
                            className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                          />
                          <Label htmlFor="timing-early" className="text-gray-300 cursor-pointer">
                            Yes. If I get to know about this before, I will have enough time to get into the character and plan my attire accordingly
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value="I am very busy. The host should consider themselves lucky that I am attending this party. You can give me a character once I show up." 
                            id="timing-arrival" 
                            className="text-white border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                          />
                          <Label htmlFor="timing-arrival" className="text-gray-300 cursor-pointer">
                            I am very busy. The host should consider themselves lucky that I am attending this party. You can give me a character once I show up.
                          </Label>
                        </div>
                      </RadioGroup>
                      {form.formState.errors.charInfoTiming && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.charInfoTiming.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-white mb-4 block">
                        I ... (Irrespective of what options you select, you will still play the game)
                      </Label>
                      <div className="space-y-2">
                        {talentOptions.map((talent) => (
                          <div key={talent} className="flex items-center space-x-2">
                            <Checkbox
                              id={talent}
                              checked={form.watch('talents')?.includes(talent) || false}
                              onCheckedChange={(checked) => {
                                const current = form.watch('talents') || [];
                                if (checked) {
                                  form.setValue('talents', [...current, talent]);
                                } else {
                                  form.setValue('talents', current.filter(item => item !== talent));
                                }
                                form.trigger('talents');
                              }}
                            />
                            <Label htmlFor={talent} className="text-gray-300">
                              {talent}
                            </Label>
                          </div>
                        ))}
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="talentsOther"
                            checked={form.watch('talents')?.includes('Other') || false}
                            onCheckedChange={(checked) => {
                              const current = form.watch('talents') || [];
                              if (checked) {
                                form.setValue('talents', [...current, 'Other']);
                              } else {
                                form.setValue('talents', current.filter(item => item !== 'Other'));
                              }
                              form.trigger('talents');
                            }}
                          />
                          <Label htmlFor="talentsOther" className="text-gray-300">
                            Other
                          </Label>
                        </div>
                      </div>
                      {form.watch('talents')?.includes('Other') && (
                        <Input
                          {...form.register('talentsOther')}
                          placeholder="Please specify"
                          className="bg-gray-800 border-gray-600 text-white mt-2"
                        />
                      )}
                    </div>

                    <div className="space-y-4">
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
                          I understand that the Murder Mystery Party may contain adult themes, dark humor, suggestive content, and potentially disturbing or controversial scenarios. I am choosing to participate with this knowledge and will not hold the host responsible for any discomfort or offense I may experience. (Please read point 22 in terms and conditions of the waiver) *
                        </Label>
                      </div>
                      {form.formState.errors.ackAdultThemes && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.ackAdultThemes.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="suggestions" className="text-white">
                        Do you have any suggestions for your character, plot, spooky drink ideas, fun decorations or anything that we should know?
                      </Label>
                      <Textarea
                        id="suggestions"
                        {...form.register('suggestions')}
                        className="bg-gray-800 border-gray-600 text-white mt-2"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-8">
                {currentSection > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevSection}
                    className="text-white border-white hover:bg-white hover:text-gray-900"
                  >
                    Previous
                  </Button>
                )}
                
                {currentSection < 3 ? (
                  <Button
                    type="button"
                    onClick={nextSection}
                    className="bg-purple-600 hover:bg-purple-700 text-white ml-auto"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700 text-white ml-auto"
                    onClick={(e) => {
                      console.log('Submit button clicked!');
                      console.log('Event:', e);
                      console.log('Form element:', e.currentTarget.form);
                      console.log('Form state:', form.formState);
                      console.log('Form errors:', form.formState.errors);
                      console.log('Form values:', form.getValues());
                      
                      // Don't prevent default - let the form handle submission
                    }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
                  </Button>
                )}
              </div>

              {submitError && (
                <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">⚠️</span>
                    <div>
                      <p className="text-red-300 font-medium">{submitError}</p>
                      {Object.keys(form.formState.errors).length > 0 && (
                        <p className="text-red-200 text-sm mt-2">
                          Missing fields: {Object.keys(form.formState.errors).join(', ')}
                        </p>
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
