import React from 'react';
import ImaginationBanner from '../components/ImaginationBanner';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Very subtle background pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#5e2ca0 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
                <div className="bg-white p-8 md:p-12 lg:p-16 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    
                    <div className="text-center mb-12">
                        <h1 className="font-heading text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Privacy Policy</h1>
                        <p className="text-gray-500">Last updated: April 11, 2026</p>
                    </div>

                    <div className="prose prose-lg prose-indigo max-w-none text-gray-600 space-y-8">
                        <section>
                            <p>
                                This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
                            </p>
                            <p className="mt-4">
                                We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">Collecting and Using Your Personal Data</h2>
                            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Types of Data Collected</h3>
                            <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">Personal Data</h4>
                            <p>
                                While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-2">
                                <li>Email address</li>
                                <li>First name and last name</li>
                                <li>Phone number</li>
                                <li>Address, State, Province, ZIP/Postal code, City</li>
                                <li>Usage Data</li>
                            </ul>

                            <h4 className="text-lg font-medium text-gray-800 mt-6 mb-2">Usage Data</h4>
                            <p>
                                Usage Data is collected automatically when using the Service. It may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">Tracking Technologies and Cookies</h2>
                            <p>
                                We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service. The technologies We use may include:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-2">
                                <li><strong>Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service.</li>
                                <li><strong>Web Beacons.</strong> Certain sections of our Service and our emails may contain small electronic files known as web beacons that permit the Company, for example, to count users who have visited those pages or opened an email.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">Use of Your Personal Data</h2>
                            <p>The Company may use Personal Data for the following purposes:</p>
                            <ul className="list-disc pl-6 space-y-2 mt-2">
                                <li><strong>To provide and maintain our Service</strong>, including to monitor the usage of our Service.</li>
                                <li><strong>To manage Your Account:</strong> to manage Your registration as a user of the Service.</li>
                                <li><strong>For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased.</li>
                                <li><strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">Security of Your Personal Data</h2>
                            <p>
                                The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">Children's Privacy</h2>
                            <p>
                                Our Service may be used to create products intended for children, but the Service itself does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">Changes to this Privacy Policy</h2>
                            <p>
                                We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.
                            </p>
                            <p className="mt-4">
                                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">Contact Us</h2>
                            <p>If you have any questions about this Privacy Policy, You can contact us:</p>
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
