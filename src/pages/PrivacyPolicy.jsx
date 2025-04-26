
import React from 'react';
import Layout from '@/components/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p>When you use our blog platform, we collect certain information to provide and improve our services:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Account information (email, username)</li>
              <li>Content you create (posts, comments)</li>
              <li>Usage information and analytics</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Provide and maintain our services</li>
              <li>Improve user experience</li>
              <li>Send important updates</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at privacy@example.com</p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
