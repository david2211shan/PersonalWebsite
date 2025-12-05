/**
 * Component Renderer
 * Handles rendering of dynamic components from data
 */
class ComponentRenderer {
  constructor(config) {
    this.config = config;
  }

  /**
   * Render Navigation Menu
   */
  renderNavigation(container) {
    const navItems = this.config.get('navigation') || [];
    const navHTML = navItems.map(item => `
      <li>
        <a href="#${item.id}" ${item.id === 'home' ? 'class="active"' : ''}>
          <i class="${item.icon}"></i> ${item.label}
        </a>
      </li>
    `).join('');
    
    if (container) {
      container.innerHTML = navHTML;
    }
    return navHTML;
  }

  /**
   * Render Home Section
   */
  renderHome(container) {
    const home = this.config.get('home') || {};
    const typingText = home.typingText || [];
    const socialLinks = home.socialLinks || [];
    
    const socialHTML = socialLinks.map(link => `
      <a href="${link.url}" target="_blank">
        <i class="${link.icon}"></i>
      </a>
    `).join('');

    const homeHTML = `
      <div class="intro">
        <img src="${home.image}" alt="profile" class="shadow-dark">
        <h1>${home.name}</h1>
        <span class="iTyped"></span>
        <div class="social-links">
          ${socialHTML}
        </div>
      </div>
    `;

    if (container) {
      container.innerHTML = homeHTML;
      // Initialize typing effect if iTyped is available
      if (window.ityped && typingText.length > 0) {
        window.ityped.init(document.querySelector('.iTyped'), {
          strings: typingText,
          loop: true
        });
      }
    }
    return homeHTML;
  }

  /**
   * Render About Section
   */
  renderAbout(container) {
    const about = this.config.get('about') || {};
    const intro = about.intro || {};
    const personalInfo = about.personalInfo || [];
    const skills = about.skills || [];
    const education = about.education || [];
    const experience = about.experience || [];

    // Personal Info HTML
    const personalInfoHTML = personalInfo.map(info => `
      <div class="info-item padd-15">
        <p>${info.label} : <span>${info.value}</span></p>
      </div>
    `).join('');

    // Skills HTML
    const skillsHTML = skills.map(skill => `
      <div class="skill-item padd-15">
        <h5>${skill.name}</h5>
        <div class="progress">
          <div class="progress-in" style="width: ${skill.level}%;"></div>
          <div class="skill-porcent">${skill.level}%</div>
        </div>
      </div>
    `).join('');

    // Education Timeline HTML
    const educationHTML = education.map(edu => `
      <div class="timeline-item">
        <div class="circle-dot"></div>
        <h6 class="timeline-date"><i class="fa fa-calendar"></i> ${edu.date}</h6>
        <h4 class="timeline-title">${edu.title}</h4>
        <p class="timeline-text">${edu.description}</p>
      </div>
    `).join('');

    // Experience Timeline HTML
    const experienceHTML = experience.map(exp => `
      <div class="timeline-item">
        <div class="circle-dot"></div>
        <h6 class="timeline-date"><i class="fa fa-calendar"></i> ${exp.date}</h6>
        <h4 class="timeline-title">${exp.title}</h4>
        <p class="timeline-text">${exp.description}</p>
      </div>
    `).join('');

    const aboutHTML = `
      <div class="row">
        <div class="about-content padd-15">
          <div class="row">
            <div class="about-text padd-15">
              <h3>${intro.title} <span>${intro.highlight}</span></h3>
              <p>${intro.description}</p>
            </div>
          </div>
          <div class="row">
            <div class="personal-info padd-15">
              <div class="row">
                ${personalInfoHTML}
              </div>
              <div class="row">
                <div class="buttons padd-15">
                  <a href="${about.cvLink}" class="btn">Download Cv</a>
                </div>
              </div>
            </div>
            <div class="skills padd-15">
              <div class="row">
                ${skillsHTML}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="education padd-15">
              <h3 class="title">Education</h3>
              <div class="row">
                <div class="timeline-box padd-15">
                  <div class="timeline shadow-dark">
                    ${educationHTML}
                  </div>
                </div>
              </div>
            </div>
            <div class="experience padd-15">
              <h3 class="title">Experience</h3>
              <div class="row">
                <div class="timeline-box padd-15">
                  <div class="timeline shadow-dark">
                    ${experienceHTML}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (container) {
      container.innerHTML = aboutHTML;
    }
    return aboutHTML;
  }

  /**
   * Render Portfolio Section
   */
  renderPortfolio(container) {
    const portfolio = this.config.get('portfolio') || {};
    const filters = portfolio.filters || [];
    const items = portfolio.items || [];

    // Filter Buttons HTML
    const filtersHTML = filters.map(filter => `
      <button type="button" 
              class="${filter.active ? 'active' : ''}" 
              data-filter="${filter.id}">
        ${filter.label}
      </button>
    `).join('');

    // Portfolio Items HTML
    const itemsHTML = items.map(item => `
      <div class="portfolio-item padd-15" data-category="${item.category}">
        <div class="portfolio-item-inner shadow-dark">
          <div class="portfolio-img">
            <img src="${item.image}" alt="${item.alt}">
          </div>
          <div class="portfolio-info">
            <h4>${item.title}</h4>
            <div class="icon">
              <i class="fa fa-search"></i>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    const portfolioHTML = `
      <div class="row">
        <div class="portfolio-filter padd-15">
          ${filtersHTML}
        </div>
      </div>
      <div class="row">
        ${itemsHTML}
      </div>
    `;

    if (container) {
      container.innerHTML = portfolioHTML;
    }
    return portfolioHTML;
  }

  /**
   * Render Contact Section
   */
  renderContact(container) {
    const contact = this.config.get('contact') || {};
    const formFields = contact.formFields || {};

    const contactHTML = `
      <div class="row">
        <div class="contact-info-item padd-15">
          <div class="icon">
            <i class="fa fa-envelope"></i>
            <h4>Email</h4>
            <p>${contact.email}</p>
          </div>
        </div>
      </div>
      <div class="row">
        <form action="${contact.formAction}" class="contact-form padd-15">
          <div class="row">
            <div class="form-item col-6 padd-15">
              <div class="form-group">
                <input type="text" name="name" class="form-control" 
                       placeholder="${formFields.name.placeholder}" 
                       ${formFields.name.required ? 'required' : ''}>
              </div>
            </div>
            <div class="form-item col-6 padd-15">
              <div class="form-group">
                <input type="email" name="email" class="form-control" 
                       placeholder="${formFields.email.placeholder}" 
                       ${formFields.email.required ? 'required' : ''}>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="form-item col-12 padd-15">
              <div class="form-group">
                <input type="text" name="subject" class="form-control" 
                       placeholder="${formFields.subject.placeholder}" 
                       ${formFields.subject.required ? 'required' : ''}>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="form-item col-12 padd-15">
              <div class="form-group">
                <textarea class="form-control" name="message" 
                          placeholder="${formFields.message.placeholder}" 
                          ${formFields.message.required ? 'required' : ''}></textarea>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 padd-15">
              <button type="submit" class="btn">Send Message</button>
            </div>
          </div>
        </form>
      </div>
    `;

    if (container) {
      container.innerHTML = contactHTML;
    }
    return contactHTML;
  }
}

// Export for use in other modules
window.ComponentRenderer = ComponentRenderer;

