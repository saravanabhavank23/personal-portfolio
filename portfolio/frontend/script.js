// ============================================
// PROJECT FILTERING
// ============================================

function filterProjects(category) {
    // Get all project cards
    const projects = document.querySelectorAll('.project-card');
    
    // Get all filter buttons
    const buttons = document.querySelectorAll('.filter-btn');
    
    // Remove active class from all buttons
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Filter projects
    projects.forEach(project => {
        if (category === 'all') {
            project.style.display = 'block';
            // Add fade-in animation
            project.style.animation = 'slideInDown 0.5s ease';
        } else if (project.dataset.category === category) {
            project.style.display = 'block';
            project.style.animation = 'slideInDown 0.5s ease';
        } else {
            project.style.display = 'none';
        }
    });
}

// ============================================
// CONTACT FORM HANDLING
// ============================================

const CONTACT_API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api/contact'
    : '/api/contact';

async function handleSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Simple validation
    if (!name || !email || !subject || !message) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        const response = await fetch(CONTACT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone, subject, message })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to send message');
        }

        showMessage(result.message || 'Thank you! Your message has been sent successfully. I will get back to you soon!', 'success');
        document.getElementById('contactForm').reset();
        localStorage.removeItem('contactFormDraft');
    } catch (error) {
        showMessage('Unable to send your message right now. Please try again later.', 'error');
    }
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.textContent = message;
    messageDiv.className = `form-message ${type}`;
    
    // Auto-hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.className = 'form-message';
        }, 5000);
    }
}

// ============================================
// NAVIGATION ACTIVE LINK
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Set active nav link based on current page
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        // Remove all active classes first
        link.classList.remove('active');
        
        // Check if the link matches current page
        if (link.getAttribute('href') === currentPage.split('/').pop() || 
            (currentPage.includes('index.html') && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// ============================================
// SMOOTH SCROLLING
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// ADD ANIMATION ON SCROLL (Optional Enhancement)
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe project cards and skill items
document.querySelectorAll('.project-card, .skill-item, .section-box').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// ============================================
// ADD TO LOCALSTORAGE (Optional: Save form data)
// ============================================

function saveFormDraft() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    localStorage.setItem('contactFormDraft', JSON.stringify(formData));
}

// Save form data automatically every 30 seconds
function initAutoSave() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Restore saved data if exists
    const savedData = localStorage.getItem('contactFormDraft');
    if (savedData) {
        const data = JSON.parse(savedData);
        document.getElementById('name').value = data.name || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('phone').value = data.phone || '';
        document.getElementById('subject').value = data.subject || '';
        document.getElementById('message').value = data.message || '';
    }
    
    // Auto-save every 30 seconds
    setInterval(saveFormDraft, 30000);
}

document.addEventListener('DOMContentLoaded', initAutoSave);

// THEME TOGGLE: persist and apply theme
(function() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const applyTheme = (theme) => {
        if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
        else document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', theme);
    };

    // initialize
    const saved = localStorage.getItem('theme') || 'light';
    applyTheme(saved);

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        // small click animation
        toggle.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 250 });
    });
})();

// Simple reveal-on-scroll using IntersectionObserver
(function() {
    const els = document.querySelectorAll('.project-card, .skill-item, .section-box, .featured-projects .project-card');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('revealed');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    els.forEach(el => {
        el.classList.add('reveal');
        io.observe(el);
    });
})();