import React from 'react';
import ImaginationBanner from '../components/ImaginationBanner';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Very subtle background pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4338ca 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
                <div className="bg-white p-8 md:p-12 lg:p-16 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    
                    <div className="text-center mb-12">
                        <h1 className="font-heading text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Terms and Conditions</h1>
                        <p className="text-gray-500">Last updated: April 11, 2026</p>
                    </div>

                    <div className="prose prose-lg prose-indigo max-w-none text-gray-600 space-y-8">
                        <section>
                            <p>
                                Please read these terms and conditions carefully before using Our Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">Interpretation and Definitions</h2>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Interpretation</h3>
                            <p>
                                The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                            </p>
                            
                            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Definitions</h3>
                            <p>For the purposes of these Terms and Conditions:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
                                <li><strong>Country</strong> refers to: India</li>
                                <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to MagicWish.</li>
                                <li><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</li>
                                <li><strong>Service</strong> refers to the Website.</li>
                                <li><strong>Terms and Conditions</strong> (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.</li>
                                <li><strong>Website</strong> refers to MagicWish, accessible from magicwish.in</li>
                                <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">Acknowledgment</h2>
                            <p>
                                These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
                            </p>
                            <p className="mt-4">
                                Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">Links to Other Websites</h2>
                            <p>
                                Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.
                            </p>
                            <p className="mt-4">
                                The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">Termination</h2>
                            <p>
                                We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.
                            </p>
                            <p className="mt-4">
                                Upon termination, Your right to use the Service will cease immediately.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">Limitation of Liability</h2>
                            <p>
                                Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased anything through the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">"AS IS" and "AS AVAILABLE" Disclaimer</h2>
                            <p>
                                The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">Governing Law</h2>
                            <p>
                                The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">Disputes Resolution</h2>
                            <p>
                                If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">Contact Us</h2>
                            <p>If you have any questions about these Terms and Conditions, You can contact us:</p>
                            <ul className="list-disc pl-6 mt-4">
                                <li>By email: support@magicwish.in</li>
                            </ul>
                        </section>

                    </div>
                </div>
            </div>

            <ImaginationBanner />
        </div>
    );
}
