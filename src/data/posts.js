
export const posts = [
  {
    id: "1",
    title: "Getting Started with Web Development",
    content: "Web development is an exciting field that encompasses everything from creating simple static web pages to complex web applications. The journey begins with learning the fundamentals of HTML, CSS, and JavaScript – the building blocks of the web.\n\nHTML (HyperText Markup Language) provides the structure of a webpage, CSS (Cascading Style Sheets) handles the presentation and styling, while JavaScript adds interactivity. As you progress, you might explore frameworks like React, Vue, or Angular, which can significantly streamline your development process.\n\nRemember, the key to becoming proficient in web development is consistent practice and building projects that challenge you to learn new skills.",
    excerpt: "Explore the fundamental concepts and tools needed to start your journey in web development.",
    slug: "getting-started-with-web-development",
    images: ["photo-1486312338219-ce68d2c6f44d", "photo-1498050108023-c5249f4df085"],
    categories: ["programming", "web development", "beginner"],
    created_at: "2025-04-15T10:30:00Z",
    updated_at: "2025-04-15T10:30:00Z",
    user_id: "1"
  },
  {
    id: "2",
    title: "The Future of Artificial Intelligence",
    content: "Artificial Intelligence continues to evolve at a rapid pace, transforming industries and our daily lives in profound ways. From virtual assistants like Siri and Alexa to sophisticated machine learning algorithms powering recommendation systems, AI is becoming increasingly integrated into our digital experiences.\n\nOne of the most exciting frontiers in AI research is generative models, which can create new content like text, images, and music. These systems are trained on vast amounts of data and can produce remarkably human-like outputs.\n\nAs we look to the future, ethical considerations in AI development will be paramount. Questions around bias, privacy, and the responsible use of AI technologies will shape how these powerful tools are deployed in society.",
    excerpt: "Discover how AI is evolving and the potential impact it will have on various industries in the coming years.",
    slug: "future-of-artificial-intelligence",
    images: ["photo-1461749280684-dccba630e2f6", "photo-1531297484001-80022131f5a1"],
    categories: ["ai", "technology", "future"],
    created_at: "2025-04-10T14:45:00Z",
    updated_at: "2025-04-12T09:15:00Z",
    user_id: "1"
  },
  {
    id: "3",
    title: "Exploring Nature's Wonders",
    content: "The natural world is filled with breathtaking landscapes and phenomena that remind us of Earth's incredible diversity and beauty. From the auroras dancing across polar skies to the intricate ecosystems of tropical rainforests, there's no shortage of wonders to explore.\n\nTraveling to experience these natural marvels firsthand can be transformative. Standing before the Grand Canyon, witnessing a volcanic eruption, or diving among vibrant coral reefs connects us to the planet in ways that photographs simply cannot capture.\n\nAs climate change threatens many of these precious environments, there's a growing importance to sustainable tourism and conservation efforts. By appreciating nature's wonders responsibly, we can help ensure they remain for future generations to enjoy.",
    excerpt: "Journey through some of the most spectacular natural phenomena and landscapes our planet has to offer.",
    slug: "exploring-natures-wonders",
    images: ["photo-1469474968028-56623f02e42e"],
    categories: ["nature", "travel", "environment"],
    created_at: "2025-04-05T08:20:00Z",
    updated_at: "2025-04-05T08:20:00Z",
    user_id: "1"
  }
];

// Helper functions to work with our mock data
export const getAllPosts = () => {
  return [...posts].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

export const getPostBySlug = (slug) => {
  return posts.find(post => post.slug === slug);
};

export const addPost = (post) => {
  const newPost = {
    ...post,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  posts.unshift(newPost);
  return newPost;
};

export const updatePost = (id, updates) => {
  const index = posts.findIndex(post => post.id === id);
  if (index === -1) return undefined;
  
  posts[index] = {
    ...posts[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  return posts[index];
};

export const deletePost = (id) => {
  const index = posts.findIndex(post => post.id === id);
  if (index === -1) return false;
  
  posts.splice(index, 1);
  return true;
};
