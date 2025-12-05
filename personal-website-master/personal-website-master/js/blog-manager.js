/**
 * Blog Manager
 * Automatically loads and renders blogs from blogs.json
 * Makes it easy to add new blogs without editing HTML
 */
class BlogManager {
  constructor() {
    this.blogs = [];
    this.blogListContainer = null;
    this.blogContentContainer = null;
  }

  /**
   * Initialize blog manager
   */
  async init() {
    this.blogListContainer = document.getElementById('blog-list');
    this.blogContentContainer = document.getElementById('blog-content');
    
    if (!this.blogListContainer) {
      console.error('Blog list container not found');
      return;
    }

    // Load blog metadata
    await this.loadBlogs();
    
    // Render blog list
    this.renderBlogList();
    
    // Setup click handlers
    this.setupEventListeners();
  }

  /**
   * Load blog metadata from blogs.json
   */
  async loadBlogs() {
    try {
      const response = await fetch('data/blogs.json');
      if (!response.ok) {
        throw new Error(`Failed to load blogs: ${response.statusText}`);
      }
      const data = await response.json();
      this.blogs = data.blogs || [];
      
      // Sort blogs by date (newest first)
      this.blogs.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
    } catch (error) {
      console.error('Error loading blogs:', error);
      this.blogs = [];
    }
  }

  /**
   * Render blog list from metadata
   */
  renderBlogList() {
    if (!this.blogListContainer || this.blogs.length === 0) {
      return;
    }

    const blogHTML = this.blogs.map(blog => {
      const tagsHTML = blog.tags.map(tag => 
        `<a href="#">${tag}</a>`
      ).join(' , ');

      return `
        <div class="blog-item padd-15" data-blog="${blog.file}">
          <div class="blog-item-inner shadow-dark">
            <div class="blog-img">
              <img src="${blog.image}" alt="${blog.title}">
              <div class="blog-date">${blog.date}</div>
            </div>
            <div class="blog-info">
              <h4 class="blog-title">${blog.title}</h4>
              <p class="blog-description">${blog.summary}</p>
              <p class="blog-tags">Tags : ${tagsHTML}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');

    this.blogListContainer.innerHTML = blogHTML;
  }

  /**
   * Setup event listeners for blog items
   */
  setupEventListeners() {
    if (!this.blogListContainer) return;

    this.blogListContainer.querySelectorAll('.blog-item').forEach(item => {
      item.addEventListener('click', () => {
        const blogFile = item.getAttribute('data-blog');
        this.loadBlogContent(blogFile);
      });
    });
  }

  /**
   * Load and display blog content
   */
  async loadBlogContent(blogFile) {
    if (!this.blogContentContainer) return;

    try {
      const response = await fetch(blogFile);
      if (!response.ok) {
        throw new Error(`Failed to load blog: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Hide blog list, show content
      this.blogListContainer.style.display = 'none';
      this.blogContentContainer.style.display = 'block';
      
      // Render blog content
      this.blogContentContainer.innerHTML = `
        <div class="blog-post">
          <h1>${data.title}</h1>
          <p class="blog-post-date"><em>${data.date}</em></p>
          <div class="blog-post-content">${data.content}</div>
          <button id="back-to-list" class="btn">Back to Blog List</button>
        </div>
      `;

      // Setup back button
      document.getElementById('back-to-list').addEventListener('click', () => {
        this.blogContentContainer.style.display = 'none';
        this.blogListContainer.style.display = 'flex';
      });

    } catch (error) {
      console.error('Error loading blog content:', error);
      this.blogContentContainer.innerHTML = `
        <div class="blog-error">
          <p>Sorry, this blog post could not be loaded. Please try again later.</p>
          <button id="back-to-list" class="btn">Back to Blog List</button>
        </div>
      `;
      
      document.getElementById('back-to-list').addEventListener('click', () => {
        this.blogContentContainer.style.display = 'none';
        this.blogListContainer.style.display = 'flex';
      });
    }
  }

  /**
   * Add a new blog (helper method for future use)
   */
  addBlog(blogData) {
    // This could be used with a form or admin interface
    this.blogs.push(blogData);
    this.renderBlogList();
    this.setupEventListeners();
  }
}

// Initialize blog manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const blogManager = new BlogManager();
  blogManager.init();
  
  // Make it globally available for debugging
  window.blogManager = blogManager;
});

