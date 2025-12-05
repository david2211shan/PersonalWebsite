/**
 * Main Application Controller
 * Initializes and coordinates all components
 */
class App {
  constructor() {
    this.configLoader = new ConfigLoader('data/config.json');
    this.config = null;
    this.renderer = null;
  }

  async init() {
    try {
      // Load configuration
      this.config = await this.configLoader.load();
      if (!this.config) {
        console.error('Failed to load configuration');
        return;
      }

      // Initialize renderer
      this.renderer = new ComponentRenderer(this.configLoader);

      // Render components
      this.renderComponents();

      // Initialize existing functionality
      this.initExistingFeatures();

      console.log('App initialized successfully');
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }

  renderComponents() {
    // Render navigation
    const navContainer = document.querySelector('.nav');
    if (navContainer) {
      this.renderer.renderNavigation(navContainer);
    }

    // Render home section
    const homeContainer = document.querySelector('#home .container');
    if (homeContainer) {
      this.renderer.renderHome(homeContainer);
    }

    // Render about section
    const aboutContainer = document.querySelector('#about .container .row:last-child');
    if (aboutContainer) {
      this.renderer.renderAbout(aboutContainer);
    }

    // Render portfolio section
    const portfolioContainer = document.querySelector('#portfolio .container');
    if (portfolioContainer) {
      const titleRow = portfolioContainer.querySelector('.row:first-child');
      const contentHTML = this.renderer.renderPortfolio(null);
      portfolioContainer.insertAdjacentHTML('beforeend', contentHTML);
    }

    // Render contact section
    const contactContainer = document.querySelector('#contact .container');
    if (contactContainer) {
      const titleRow = contactContainer.querySelector('.row:first-child');
      const contentHTML = this.renderer.renderContact(null);
      contactContainer.insertAdjacentHTML('beforeend', contentHTML);
    }
  }

  initExistingFeatures() {
    // Initialize portfolio filtering (from existing script.js)
    this.initPortfolioFilter();
    
    // Initialize navigation (from existing script.js)
    this.initNavigation();
    
    // Initialize blog loading (from existing script.js)
    this.initBlogLoading();
  }

  initPortfolioFilter() {
    const filterContainer = document.querySelector('.portfolio-filter');
    if (!filterContainer) return;

    const filterBtns = filterContainer.children;
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    for (let i = 0; i < filterBtns.length; i++) {
      filterBtns[i].addEventListener("click", function() {
        filterContainer.querySelector('.active')?.classList.remove('active');
        this.classList.add("active");

        const filterValue = this.getAttribute('data-filter');
        portfolioItems.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.classList.remove('hide');
            item.classList.add('show');
          } else {
            item.classList.remove('show');
            item.classList.add('hide');
          }
        });
      });
    }
  }

  initNavigation() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const navList = nav.querySelectorAll('li');
    const allSection = document.querySelectorAll('.section');

    navList.forEach(navItem => {
      const a = navItem.querySelector('a');
      a.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active from all nav items
        navList.forEach(item => item.querySelector('a').classList.remove('active'));
        this.classList.add('active');

        // Show target section
        const target = this.getAttribute('href').split('#')[1];
        allSection.forEach(section => section.classList.remove('active'));
        document.querySelector('#' + target)?.classList.add('active');

        // Close mobile menu if open
        if (window.innerWidth < 1200) {
          document.querySelector('.aside')?.classList.toggle('open');
        }
      });
    });
  }

  initBlogLoading() {
    const blogList = document.getElementById('blog-list');
    const blogContent = document.getElementById('blog-content');
    if (!blogList || !blogContent) return;

    blogList.querySelectorAll('.blog-item').forEach(item => {
      item.addEventListener('click', function() {
        const blogFile = this.getAttribute('data-blog');
        fetch(blogFile)
          .then(response => response.json())
          .then(data => {
            blogList.style.display = 'none';
            blogContent.style.display = 'block';
            blogContent.innerHTML = `
              <h1>${data.title}</h1>
              <p><em>${data.date}</em></p>
              <div>${data.content}</div>
              <button id="back-to-list" class="btn">Back to Blog List</button>
            `;
            document.getElementById('back-to-list').onclick = function() {
              blogContent.style.display = 'none';
              blogList.style.display = 'flex';
            };
          })
          .catch(error => {
            console.error('Error loading blog:', error);
            blogContent.innerHTML = '<p>Error loading blog post. Please try again later.</p>';
          });
      });
    });
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const app = new App();
  await app.init();
});

// Export for global access
window.App = App;

