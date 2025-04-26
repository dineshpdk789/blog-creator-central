
import React from 'react';
import Layout from '@/components/Layout';

const TermsOfService = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Terms</h2>
            <p>By accessing this blog platform, you agree to be bound by these Terms of Service and comply with all applicable laws and regulations.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p>Permission is granted to temporarily access the materials on our platform for personal, non-commercial use only.</p>
            <p className="mt-4">This license shall automatically terminate if you violate any of these restrictions.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Content Guidelines</h2>
            <p>Users must follow these guidelines when posting content:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>No hate speech or discrimination</li>
              <li>No copyright infringement</li>
              <li>No illegal or harmful content</li>
              <li>Respect others' privacy</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Limitation of Liability</h2>
            <p>We shall not be held liable for any damages arising from the use or inability to use our platform.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
