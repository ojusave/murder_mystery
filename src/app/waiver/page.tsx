'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import StickyNavigation from "@/components/sticky-navigation";

export default function WaiverPage() {
  const handlePrint = () => {
    window.print();
  };

  const navigationItems = [
    // Terms and Conditions
    { id: 'private-event', label: 'Private Event at a Private Residence', href: '#private-event', level: 0 },
    { id: 'authority-host', label: 'Authority of the Host', href: '#authority-host', level: 0 },
    { id: 'host-liability', label: 'Host Liability', href: '#host-liability', level: 0 },
    { id: 'host-exemption', label: 'Host Exemption', href: '#host-exemption', level: 0 },
    { id: 'host-discretion', label: 'Host Discretion', href: '#host-discretion', level: 0 },
    { id: 'host-limitations', label: "Host's Limitations", href: '#host-limitations', level: 0 },
    { id: 'right-admission', label: 'Right of Admission and Expulsion', href: '#right-admission', level: 0 },
    { id: 'age-verification', label: 'Age and Identity Verification', href: '#age-verification', level: 0 },
    { id: 'safety-conduct', label: 'Safety, Conduct, and Assumption of Risk', href: '#safety-conduct', level: 0 },
    { id: 'property-damage', label: 'Property Damage and Cleanliness', href: '#property-damage', level: 0 },
    { id: 'guest-limitations', label: 'Guest Limitations', href: '#guest-limitations', level: 0 },
    { id: 'food-drink', label: 'Food and Drink Consumption', href: '#food-drink', level: 0 },
    { id: 'substance-use', label: 'Substance Use', href: '#substance-use', level: 0 },
    { id: 'prescription-medicines', label: 'Prescription Medicines', href: '#prescription-medicines', level: 0 },
    { id: 'health-considerations', label: 'Health Considerations and Liability', href: '#health-considerations', level: 0 },
    { id: 'emergency-situations', label: 'Emergency Situations', href: '#emergency-situations', level: 0 },
    { id: 'emergency-services', label: 'Emergency Services and Law Enforcement', href: '#emergency-services', level: 0 },
    { id: 'force-majeure', label: 'Force Majeure', href: '#force-majeure', level: 0 },
    { id: 'property-access', label: 'Access to the Property', href: '#property-access', level: 0 },
    { id: 'community-respect', label: 'Community and Neighborhood Respect and Liability', href: '#community-respect', level: 0 },
    { id: 'prohibited-activities', label: 'Prohibited Activities', href: '#prohibited-activities', level: 0 },
    { id: 'offensive-content', label: 'Offensive Content', href: '#offensive-content', level: 0 },
    { id: 'party-conclusion', label: 'Party Conclusion', href: '#party-conclusion', level: 0 },
    { id: 'data-collection', label: 'Data Collection and Usage', href: '#data-collection', level: 0 },
    { id: 'duration-waiver', label: 'Duration of Waiver', href: '#duration-waiver', level: 0 },
    { id: 'agreement-terms', label: 'Agreement to Terms', href: '#agreement-terms', level: 0 },
    
    // Definitions
    { id: 'attendees-def', label: 'Attendee(s)', href: '#attendees-def', level: 0 },
    { id: 'hosts-def', label: 'Host(s)', href: '#hosts-def', level: 0 },
    { id: 'party-def', label: 'Party', href: '#party-def', level: 0 },
    { id: 'property-def', label: 'Property', href: '#property-def', level: 0 },
    { id: 'prohibited-substances', label: 'Prohibited Substances', href: '#prohibited-substances', level: 0 },
    { id: 'alcohol-consumption', label: 'Alcohol Consumption', href: '#alcohol-consumption', level: 0 },
    { id: 'damage-def', label: 'Damage', href: '#damage-def', level: 0 },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            Dark Lotus
          </Link>
          <div className="flex gap-4">
            <Link href="/rsvp">
              <Button variant="outline" className="text-gray-800 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400">
                RSVP
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button variant="outline" className="text-gray-800 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400">
                Host Login
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Terms and Conditions / Waiver
          </h1>
          
          
          {/* Table of Contents */}
          <div className="mb-12 p-6 bg-purple-900/30 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">Table of Contents</h2>
            <nav className="space-y-2">
              <div className="text-purple-200 font-semibold mb-2">Terms and Conditions:</div>
              <a href="#private-event" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Private Event at a Private Residence
              </a>
              <a href="#authority-host" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Authority of the Host
              </a>
              <a href="#host-liability" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Host Liability
              </a>
              <a href="#host-exemption" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Host Exemption
              </a>
              <a href="#host-discretion" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Host Discretion
              </a>
              <a href="#host-limitations" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Host's Limitations
              </a>
              <a href="#right-admission" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Right of Admission and Expulsion
              </a>
              <a href="#age-verification" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Age and Identity Verification
              </a>
              <a href="#safety-conduct" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Safety, Conduct, and Assumption of Risk
              </a>
              <a href="#property-damage" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Property Damage and Cleanliness
              </a>
              <a href="#guest-limitations" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Guest Limitations
              </a>
              <a href="#food-drink" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Food and Drink Consumption
              </a>
              <a href="#substance-use" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Substance Use
              </a>
              <a href="#prescription-medicines" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Prescription Medicines
              </a>
              <a href="#health-considerations" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Health Considerations and Liability
              </a>
              <a href="#emergency-situations" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Emergency Situations
              </a>
              <a href="#emergency-services" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Emergency Services and Law Enforcement
              </a>
              <a href="#force-majeure" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Force Majeure
              </a>
              <a href="#property-access" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Access to the Property
              </a>
              <a href="#community-respect" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Community and Neighborhood Respect and Liability
              </a>
              <a href="#prohibited-activities" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Prohibited Activities
              </a>
              <a href="#offensive-content" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Offensive Content
              </a>
              <a href="#party-conclusion" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Party Conclusion
              </a>
              <a href="#data-collection" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Data Collection and Usage
              </a>
              <a href="#duration-waiver" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Duration of Waiver
              </a>
              <a href="#agreement-terms" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Agreement to Terms
              </a>
              <div className="text-purple-200 font-semibold mb-2 mt-4">Definitions:</div>
              <a href="#attendees-def" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Attendee(s)
              </a>
              <a href="#hosts-def" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Host(s)
              </a>
              <a href="#party-def" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Party
              </a>
              <a href="#property-def" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Property
              </a>
              <a href="#prohibited-substances" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Prohibited Substances
              </a>
              <a href="#alcohol-consumption" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Alcohol Consumption
              </a>
              <a href="#damage-def" className="block text-purple-200 hover:text-white transition-colors ml-4">
                Damage
              </a>
              <div className="text-purple-200 font-semibold mb-2 mt-4">Waiver Acceptance:</div>
            </nav>
          </div>

          {/* Print/Save Button */}
          <div className="mb-8 text-center">
            <Button 
              onClick={handlePrint}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Print / Save as PDF
            </Button>
          </div>

          {/* Waiver Content */}
          <div className="prose prose-invert max-w-none">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Party Rules and Liability Waiver</h2>
              <h3 className="text-xl font-semibold text-white mb-4">Terms and Conditions:</h3>
            </div>

            <section id="private-event" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Private Event at a Private Residence</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  The Murder Mystery Party is scheduled to take place on Saturday November 1, from 8:00 PM to 11.30 PM. Please note that while the event is allotted this time frame, the actual murder mystery gameplay may conclude earlier. This is a private event that will be hosted at a private residence in Fremont, California. The Host reserves the right to control all aspects of the event, including but not limited to, the guest list, event rules, and event procedures. The Host's decisions are final and binding. Attendees must respect the Host's authority and the private nature of the residence at all times.
                </p>
              </div>
            </section>

            <section id="authority-host" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Authority of the Host</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  The Host, as the property owner, holds the absolute authority within the Property. The Host's decisions regarding all aspects of the Party, including its rules and procedures, are final and binding. Non-compliance with these decisions may result in refused entry or expulsion without notice. The Host retains the right to take legal action against the Attendees violating these terms for any costs incurred due to their actions. The Host retains the right to recover any costs from Attendees who cause damage to the property.
                </p>
              </div>
            </section>

            <section id="host-liability" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Host Liability</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  The Host is not liable for any harm, injury, or damage that occurs during the Party. Attendees accept and assume all risks associated with their participation in the Party. The Host will not be held responsible for any harm, injury, or damage that occurs due to the reckless behavior or negligence of any Attendee, including the Host themselves. This extends to, but is not limited to, accidents, altercations, or incidents that result from inattentiveness, carelessness, or failure to adhere to the Party rules. Attendees are fully responsible for their actions during the Party and assume all risks associated with their participation. Attendees who are concerned about the potential risks associated with reckless behavior or negligence should not attend the party.
                </p>
              </div>
            </section>

            <section id="host-exemption" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Host Exemption</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  The Host, as the property owners, are not bound by the restrictions and limitations imposed on the Attendees in this waiver. The Host reserves the right to engage in activities and behaviors that may be restricted for Attendees.
                </p>
              </div>
            </section>

            <section id="host-discretion" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Host Discretion</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  The Host reserves the right to make exceptions to any of the rules outlined in this waiver at their sole discretion. This includes, but is not limited to, decisions regarding attendee behavior, alcohol consumption, and adherence to the Party's rules. Attendees acknowledge and accept that the Host's decisions in these matters are final and binding.
                </p>
              </div>
            </section>

            <section id="host-limitations" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Host's Limitations</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  The Host cannot be present in all areas of the Property at all times during the Party. As such, the Host may not be aware of or able to address all issues that arise during the Party, including but not limited to spills, messes, or other potential hazards. Attendees acknowledge and accept that they are solely responsible for their own safety and well-being during the Party. The Host will not be held liable for any harm, injury, or damage that occurs due to such incidents. Attendees are encouraged to immediately notify the Host or other attendees of any potential hazards or issues they encounter, but the Host bears no responsibility for resolving these issues or for any consequences that may arise from them.
                </p>
              </div>
            </section>

            <section id="right-admission" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Right of Admission and Expulsion</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  The Host reserves the absolute right to deny admission or to expel to any person for any reason, including but not limited to situations where the Host believes that:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>The individual presents a potential risk or danger to the safety, well-being, or enjoyment of themselves or others at the Party.</li>
                  <li>The individual appears to be under the influence of alcohol or substance upon arrival or during the party.</li>
                  <li>The individual fails to provide valid identification or proof of age as required.</li>
                  <li>The individual is suspected of carrying Prohibited Items as outlined in the 'Prohibited Substances' section of this waiver.</li>
                  <li>The individual's admission would exceed the safe or legally permitted capacity of the Property.</li>
                  <li>The individual has not signed this waiver or agreed to its terms.</li>
                  <li>The host has personal reservations or discomfort with the attendee.</li>
                </ul>
                <p>
                  This right of admission is not contingent upon the Host providing any prior warning, explanation, or justification. The Host's decision regarding admission is final and binding. Persons denied admission or expelled must leave the vicinity of the Property immediately.
                </p>
              </div>
            </section>

            <section id="age-verification" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Age and Identity Verification</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  Attendees must provide valid proof of age (over 21) and identity corresponding with the name on this waiver upon arrival. Failure to do so will prohibit entry.
                </p>
              </div>
            </section>

            <section id="safety-conduct" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Safety, Conduct, and Assumption of Risk</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  The Host is not responsible for the personal security or well-being of any Attendee when they are on the property. Attendees are responsible for their own safety and well-being. Attendees are expected to engage in safe and respectful conduct. Attendees assume all risk for any harm, injury, or even death sustained while on the Property, including potential injuries caused by other Attendees. The Host bears no liability for such incidents. In the event of harm caused by the reckless or dangerous behavior of another Attendee, the aggrieved party should directly address the issue with the offending party. The Host will not mediate or get involved in such disputes.
                </p>
              </div>
            </section>

            <section id="property-damage" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Property Damage and Cleanliness</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  Attendees are responsible for maintaining the cleanliness of the Property and will be held financially accountable for any damage they cause to the Property, including, but not limited to, creating a mess that requires clean-up. "Mess" is subject to definition and determination by the Host. Attendees are required to take precautions when consuming drinks and food to avoid spills and damages. Each attendee is allowed to use only one glass, one plate, one fork, and one knife for the entire event. Attendees must clean up their mess before leaving. Attendees agree to dispose of their leftovers in the appropriate garbage receptacles and not to leave food and glasses lying around. The Host reserves the right to recover cleaning charges from participants in the event of a mess (as determined by the Host). The typical cleaning charge is $250.
                </p>
              </div>
            </section>

            <section id="guest-limitations" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Guest Limitations</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  Unauthorized guests such as persons who have not RSVP'd and signed the waiver, individuals under 21, kids, and animals are not permitted. Attendees bear sole responsibility for any legal issues arising from this violation.
                </p>
              </div>
            </section>

            <section id="food-drink" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Food and Drink Consumption</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  The Host is not responsible for any illness or injury that occurs as a result of consuming food or drink at the Party, including but not limited to foodborne illnesses such as food poisoning. Attendees choose to consume food and drink at their own risk. The Host will not be held liable for any harm, injury, or damage that occurs due to food or drink consumed at the Party.
                </p>
              </div>
            </section>

            <section id="substance-use" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Substance Use</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  The possession or use of Illegal Substances is strictly forbidden. Discovery of such substances will result in expulsion, reporting to relevant authorities, and potential legal action.
                </p>
              </div>
            </section>

            <section id="prescription-medicines" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Prescription Medicines</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  Attendees are prohibited from bringing or consuming any medicines, including prescription medicines, during the Party. This measure is in place to prevent the misuse of prescription medicines or their use as a pretext for bringing in illegal substances. Attendees who require regular medication or have a medical condition that may require medication should consider this before deciding to attend the Party. The Host will not be held responsible for any health-related issues that arise due to non-compliance.
                </p>
              </div>
            </section>

            <section id="health-considerations" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Health Considerations and Liability</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  Attendees with known or unknown health issues, including but not limited to chronic illnesses, allergies, or conditions requiring regular medication, are advised to carefully consider their decision to attend the Party. The Host is not equipped to provide medical care or assistance, and will not be held responsible or liable for any health-related issues or emergencies that arise during the Party. Attendees are solely responsible for managing their health conditions and for seeking necessary medical attention. By choosing to attend the Party, Attendees with health issues acknowledge and accept the risks associated with their participation and agree to release the Host from any and all liability related to their health conditions.
                </p>
              </div>
            </section>

            <section id="emergency-situations" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Emergency Situations</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  The Host reserves the right to determine what constitutes an emergency and to manage such situations as they see fit, including summoning appropriate assistance at the distressed party's expense. Attendees unwilling or unable to bear such costs should carefully consider their decision to attend the Party. The Host will not be held responsible for the costs of any emergency services summoned during the Party.
                </p>
              </div>
            </section>

            <section id="emergency-services" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Emergency Services and Law Enforcement</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  Attendees are authorized to call emergency services or local authorities in the event of a health emergency, illegal substance discovery, or physical altercations involving another attendee. However, this authorization does not extend to situations involving the Host. Attendees are not authorized to call emergency services or local authorities on behalf of the Host without the explicit consent of the Host. Furthermore, attendees are not permitted to make prank calls or calls intended to disrupt the party. The decision to call and the subsequent costs or disputes arising from such a call will be the responsibility of the involved attendees. The Host will not be held responsible for this decision and should not be involved in any resulting costs or disputes.
                </p>
              </div>
            </section>

            <section id="force-majeure" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Force Majeure</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  The Host will not be held responsible or liable for any harm, injury, or damage that occurs as a result of events beyond their control, including but not limited to natural disasters (such as earthquakes, floods, landslides, or fires), acts of terrorism, gun violence, physical violence, or any other unforeseen circumstances or "Acts of God". Attendees acknowledge and accept that they attend the Party at their own risk and that the Host cannot predict or prevent such events.
                </p>
              </div>
            </section>

            <section id="property-access" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Access to the Property</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  Attendees are restricted to the specified areas of the Property. Attendees are allowed in the entryway, entryway porch, entryway bathroom, backyard, living room, living room bathroom and living room balcony. Unauthorized access to restricted areas is strictly prohibited. The Host reserves the right to determine and identify restricted areas, which may be communicated through signs or verbal instructions. Any Attendee found engaging in unauthorized access to restricted areas may face immediate expulsion from the Party and potential legal action in case of theft or missing items. Attendees will be considered suspects if any items go missing, and the Host has the right to pursue necessary legal actions.
                </p>
              </div>
            </section>

            <section id="community-respect" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Community and Neighborhood Respect and Liability</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  The Property is part of a community housing, which includes several other residences and is also located in a neighborhood with other communities and houses. Attendees must respect the community norms and maintain an acceptable noise level to avoid disturbing others in the community and neighborhood. Any behavior that disrupts the peace, causes a nuisance, or results in damage to the community property or neighborhood may result in immediate expulsion from the Party and potential legal action. Attendees may be held financially liable for any damage they cause to the community or neighborhood property or for any disturbance they cause within the community. Attendees are expected to conduct themselves in a manner that respects the rights and property of others in the community or neighborhood at all times.
                </p>
              </div>
            </section>

            <section id="prohibited-activities" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Prohibited Activities</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  Engaging in sexual activities, including but not limited to sexual intercourse, sexual contact, or any form of sexual behavior, is strictly prohibited on the Property, regardless of whether such activities are consensual. Attendees who wish to engage in such activities must do so off the Property. Violation of this rule may result in immediate expulsion from the Party and potential legal action. The Host will not be held responsible for any claims, disputes, or legal issues arising from such activities.
                </p>
              </div>
            </section>

            <section id="offensive-content" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Offensive Content</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  The Party may involve themes and content that some may find controversial or offensive. This includes, but is not limited to, dark humor, intense murder mystery themes, psychological thrillers, potentially disturbing or violent imagery, suggestive or sexual humor, political satire, religious parody, culturally sensitive topics, satire related to societal norms and stereotypes. This event is meant to entertain and engage participants, but it is recognized that sensitivity to these themes varies among individuals. Attendees who may be offended or disturbed by such content should not attend this event. The Host assumes no responsibility for any discomfort, offense, or psychological distress caused by exposure to these themes during the Party. By attending the Party, Attendees agree not to take legal action, share their thoughts on social media, or otherwise publicly express their offense or discomfort with the content of the Party.
                </p>
              </div>
            </section>

            <section id="party-conclusion" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Party Conclusion</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  Attendees must promptly leave the Property at the conclusion of the Party as determined by the Host. The Host is not responsible for items left behind, stolen, or misplaced. There are no provisions for overnight stays.
                </p>
              </div>
            </section>

            <section id="data-collection" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Data Collection and Usage</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  Attendees will be asked to RSVP through a Google Form, which will collect certain personal information necessary for the organization and execution of the Party. This information will be used solely for the purposes of verifying attendee identity, managing the guest list, and facilitating communication related to the Party. The Host does not intend to use this information for any other purposes or to retain it beyond the conclusion of the Party. However, Attendees acknowledge and accept that the Host cannot guarantee the security of the data collected through Google Forms and cannot be held responsible for any data breaches, misuse, or other issues that may arise in relation to this data. Furthermore, the Host cannot control or be held responsible for the actions of other individuals who may have access to this data. By choosing to RSVP and provide their information, Attendees agree to release the Host from any and all liability related to the collection, storage, and use of their personal information in relation to the Party.
                </p>
              </div>
            </section>

            <section id="duration-waiver" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Duration of Waiver</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  This waiver remains in effect indefinitely for all future visits to the Property by the Attendee, regardless of whether a party is ongoing or not. By signing this waiver, Attendees agree to its terms and conditions for all future visits to the Property.
                </p>
              </div>
            </section>

            <section id="agreement-terms" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Agreement to Terms</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  By attending the Party, Attendees affirm that they have read, understood, and agreed to all the terms and conditions stipulated in this document. If any Attendee has concerns or discrepancies regarding any part of these terms and conditions, they are advised not to attend the Party. Attendance at the Party will be considered as an unambiguous agreement to all these terms and conditions.
                </p>
              </div>
            </section>

            <div className="mt-12 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Definitions:</h2>
            </div>

            <section id="attendees-def" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Attendee(s)</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  Anyone who is attending the party / on the property and not the property owner, thereby expressing their intention to attend and participate in the Murder mystery party event. All attendees should agree to the waiver to attend the party.
                </p>
              </div>
            </section>

            <section id="hosts-def" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Host(s)</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  The individuals who are the owners of the property where the party is held. One of the hosts is also the one of the organizers of the party.
                </p>
              </div>
            </section>

            <section id="party-def" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Party</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  The event, known as the "Halloween Party", "Murder Mystery Party", "murder mystery", "party", is scheduled to take place at the specified private residence on the specified date and time. The exact details will be communicated later. However, the party is considered to have started whenever there is anyone else present at the property, excluding the host, regardless of the time and date specified. The party is considered ongoing until all attendees, excluding the host, have departed from the property.
                </p>
              </div>
            </section>

            <section id="property-def" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Property</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  The event, known as the "Halloween Party", "Murder Mystery Party", "murder mystery", "party", is hosted at a private residence. Accessible areas for attendees are only the entryway, entryway porch, entryway bathroom, backyard, living room,living room bathroom and living room balcony. Any areas within the property or the private residence of the host not explicitly mentioned here are considered off-limits and restricted for attendees. Attendees are responsible for ensuring they do not enter these restricted areas. Any attendee found in unauthorized areas may face immediate expulsion from the party and potential legal action in the event of theft or missing items. If any items go missing, attendees will be considered suspects, and the host reserves the right to pursue necessary legal actions.
                </p>
              </div>
            </section>

            <section id="prohibited-substances" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Prohibited Substances</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  This includes any substances that are illegal under the california state law or the federal law. Attendees should familiarize themselves with state and federal law regarding controlled substances to ensure compliance. Prohibited substances include but are not limited to the following:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>A. Alcohol unless provided by the host or brought by attendees with explicit permission from the host.</li>
                  <li>B. Tobacco (including cigarettes and cigars)</li>
                  <li>C. Cannabis products (including THC, CBD, and all forms of marijuana, delta, hemp)</li>
                  <li>D. Vaping devices and substances</li>
                  <li>E. Psychedelic substances (including mushrooms)</li>
                  <li>F. Outside food or beverages (without prior permission from the host)</li>
                  <li>G. Beef</li>
                  <li>H. Pork</li>
                  <li>I. Weapons, firearms, knives (legal or illegal)</li>
                  <li>J. Any sharp objects</li>
                  <li>K. Prescription medicines</li>
                </ul>
                <p>
                  The list is non exhaustive and is subject to hosts discretion. Please note that possession or use of Prohibited Items at the Party will result in immediate expulsion and potential legal consequences. Attendees are strongly advised to respect this policy for the duration of their stay at the Property.
                </p>
              </div>
            </section>

            <section id="alcohol-consumption" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Alcohol Consumption</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  The purpose of this event is not to encourage excessive drinking. Each attendee is allowed a maximum of two alcoholic drinks. This limit applies per individual and cannot be transferred or combined. For example, if a couple attends and one person does not drink, the other person is still limited to two drinks. Alcohol will be provided by the host or brought by the attendee with explicit permission from the host. The intent of this policy is to ensure a safe and enjoyable environment for all attendees, not to facilitate intoxication. Violators of this rule will be asked to leave immediately.
                </p>
              </div>
            </section>

            <section id="damage-def" className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Damage</h3>
              <div className="text-gray-300 space-y-4">
                <p>
                  Any alteration of the Property, including messes, that require clean-up, repair, or replacement to restore the property to its original state. This includes, but is not limited to, spills, broken items, stains, scuffs, scratches and disorganization of property items
                </p>
              </div>
            </section>

            <div className="mt-12 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Waiver Acceptance:</h2>
            </div>

            <section className="mb-8">
              <div className="text-gray-300 space-y-4">
                <p>
                  By attending the Party, Attendees confirm that they have read and understood the terms and conditions of the Party and agree to abide by them during the Party (including the strict maximum two alcoholic drinks). Attendees who do not agree to these terms and conditions should not attend the Party. Violation of these terms and conditions may result in immediate expulsion from the Party without notice and at the discretion of the Host. Attendees hereby release the Host, from all liability, including, but not limited to, disputes between Attendees, damage claims, and any legal proceedings arising out of their participation in the event.
                </p>
                <p>
                  Attendees agree to indemnify, protect, defend, release, and hold harmless the Host from all liability to them, their invitees/guests, their next of kin, their conservators, assigns, heirs, guardians, or other legal representatives, employers, government entities, law enforcement agencies, intelligence agencies, non-state actors, and any other third-party entities for any and all claims, demands, losses, or damages, suits, fines, including court costs and attorneys' fees, for any injury, illness, illegal activities, or mental harm including but not limited to offense, hurt, or shock arising prior to, during, or after the Party. Attendees hereby waive all legal rights to pursue any form of legal action against the Host.
                </p>
              </div>
            </section>
          </div>

          {/* Back to RSVP */}
          <div className="mt-12 text-center">
            <Link href="/rsvp">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4">
                Continue to RSVP
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-700 mt-16">
        <div className="text-center text-gray-400">
        </div>
      </footer>

      {/* Sticky Navigation */}
      <StickyNavigation items={navigationItems} />
    </div>
  );
}
