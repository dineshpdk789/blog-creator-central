
import React from "react";
import Layout from "@/components/Layout";

const About = () => (
  <Layout>
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4">About Blogger</h1>
      <div className="max-w-2xl mx-auto py-16 px-4 flex flex-row gap-4 ">
      <div className=" rounded-xs"><img className="rounded-xl" src="https://niyqtjsukjrfoprdzmly.supabase.co/storage/v1/object/public/blog_images//passphoto.jpg"  width="200" height="150"></img>
        </div>
        <div className="max-w-xl mx-auto py-16 px-4 gap-4">
          <h1 className='font-mono text-xl mx-auto text-blue-600 underline '><b>Dinesh Kumar</b></h1>
          <h1 className='font-mono text-xl mx-auto  '><b>software developer</b></h1>
         
        </div>
        
      </div>
      
      <p >
        
      I am a passionate and dedicated fresher in Python and Full Stack Development. 
      As I embark on my professional journey, I am committed to achieving success in this field.
      My enthusiasm for front-end development is not only evident in my growing experience but also in the dedication and energy I bring to every project I undertake.
</p><br></br>
<p>

I have a strong foundation in programming, especially in Python,SQL and JavaScript. During my studies, 
I developed an interest in working with databases, and I am proficient in using MySQL. 
I have completed several projects that helped me enhance my skills and gain practical experience. 
This project allowed me to apply my programming knowledge and understand the basics of GUI development and database integration.
</p><br></br>
<p>

I am passionate about software development and always strive to improve my skills. I am a quick learner and enjoy solving problems and finding innovative solutions. 
I am looking forward to starting my career in a dynamic environment where I can contribute and grow as a developer
</p><br></br>
<p >

Thank you for considering my application. I am excited about the opportunity to work with a team that values creativity and continuous learning.
      </p>
      <p className="mb-4 text-gray-700">
       
        <br /><br />
        Easily write, publish, and share your thoughts with the world. Our aim is to provide a clean and user-friendly experience for bloggers of all backgrounds.
      </p><br></br>
      <p className="text-gray-700">
        <strong>Features:</strong>
        <ul className="list-disc pl-6 mt-2">
          <li>Simple post creation & editing</li>
          <li>Rich-text support including HTML tags</li>
          <li>Image uploads</li>
          <li>Admin dashboard</li>
        </ul>
      </p><br></br>
      <p className="mt-6 text-gray-500 text-sm">
        Made with <span className="text-blog-primary">Dinesh</span> by the Blogger team.
      </p>
    </div>
  </Layout>
);

export default About;
