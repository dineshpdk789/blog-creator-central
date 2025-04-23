
import React from "react";
import Layout from "@/components/Layout";

const About = () => (
  <Layout>
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4">About BloggerClone</h1>
      <p className="mb-4 text-gray-700">
        <span className="font-semibold">BloggerClone</span> is a simple, open-source blogging platform inspired by Google Blogger.
        <br /><br />
        Easily write, publish, and share your thoughts with the world. Our aim is to provide a clean and user-friendly experience for bloggers of all backgrounds.
      </p>
      <p className="text-gray-700">
        <strong>Features:</strong>
        <ul className="list-disc pl-6 mt-2">
          <li>Simple post creation & editing</li>
          <li>Rich-text support including HTML tags</li>
          <li>Image uploads</li>
          <li>Admin dashboard</li>
        </ul>
      </p>
      <p className="mt-6 text-gray-500 text-sm">
        Made with <span className="text-blog-primary">love</span> by the BloggerClone team.
      </p>
    </div>
  </Layout>
);

export default About;
