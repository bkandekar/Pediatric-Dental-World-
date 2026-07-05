/* ==========================================================================
   PEDIATRIC DENTAL WORLD - JAVASCRIPT LOGIC
   Fully interactive UI elements and Supabase database handlers.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation Active Link & Mobile Menu Toggle
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    // Check if the link's href matches the current file
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href)) {
      link.classList.add('active');
    } else if (currentPath === '/' && href === 'index.html') {
      link.classList.add('active');
    }
  });

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinksContainer = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('open');
      navLinksContainer.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenuBtn.contains(e.target) && !navLinksContainer.contains(e.target)) {
        mobileMenuBtn.classList.remove('open');
        navLinksContainer.classList.remove('open');
      }
    });
  }

  // 2. Scroll to Top Button
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 3. FAQ Accordion Animation
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.faq-body');
      
      // Close other active FAQs
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-body').style.maxHeight = null;
        }
      });

      // Toggle current FAQ
      item.classList.toggle('active');
      if (item.classList.contains('active')) {
        body.style.maxHeight = body.scrollHeight + "px";
      } else {
        body.style.maxHeight = null;
      }
    });
  });

  // 4. Supabase Database Integrations & Form Handlers
  const db = window.supabaseClient; // Initialized in supabase-config.js

  // Helpers to show form alert feedback
  function showAlert(form, type, message) {
    // Find or create an alert box inside/before the form
    let alertBox = form.querySelector('.alert-box');
    if (!alertBox) {
      alertBox = document.createElement('div');
      alertBox.className = `alert-box`;
      form.insertBefore(alertBox, form.firstChild);
    }
    
    alertBox.className = `alert-box alert-${type}`;
    alertBox.textContent = message;
    alertBox.style.display = 'block';
    
    // Auto-scroll to alert
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // A. Appointment Booking Form Handler
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';

      // Get fields
      const parentName = document.getElementById('parent-name').value.trim();
      const childName = document.getElementById('child-name').value.trim();
      const childAge = parseInt(document.getElementById('child-age').value) || null;
      const phone = document.getElementById('parent-phone').value.trim();
      const email = document.getElementById('parent-email').value.trim();
      const preferredDate = document.getElementById('preferred-date').value;
      const preferredTime = document.getElementById('preferred-time').value;
      const serviceNeeded = document.getElementById('service-needed').value;
      const doctorPreference = document.getElementById('doctor-preference').value;
      const notes = document.getElementById('appointment-notes').value.trim();

      const bookingData = {
        parent_name: parentName,
        child_name: childName,
        child_age: childAge,
        phone: phone,
        email: email,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        service_needed: serviceNeeded,
        doctor_preference: doctorPreference,
        notes: notes,
        created_at: new Date().toISOString()
      };

      try {
        if (db) {
          // INSERT INTO SUPABASE 'appointments' TABLE
          const { data, error } = await db
            .from('appointments')
            .insert([bookingData]);

          if (error) throw error;
        } else {
          // Fallback to Simulated LocalStorage Storage (Demo Mode)
          let simulatedList = JSON.parse(localStorage.getItem('demo_appointments') || '[]');
          simulatedList.push(bookingData);
          localStorage.setItem('demo_appointments', JSON.stringify(simulatedList));
          console.log("Simulated LocalStorage save successful:", bookingData);
        }

        // Success booking action
        bookingForm.reset();
        
        // Show a glorious, warm custom confirmation card
        const wrapper = bookingForm.parentElement;
        wrapper.innerHTML = `
          <div style="text-align: center; padding: 2rem 0;">
            <div style="width: 80px; height: 80px; background-color: var(--secondary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem; margin: 0 auto 1.5rem auto; box-shadow: 0 6px 20px rgba(126, 217, 168, 0.3);">
              <i class="fas fa-check"></i>
            </div>
            <h3 style="font-family: var(--font-header); font-size: 1.8rem; margin-bottom: 1rem; color: var(--text-dark);">Appointment Requested!</h3>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem; font-size: 1.1rem; line-height: 1.6;">
              Thank you, <strong>${parentName}</strong>! We have received your booking request for <strong>${childName}</strong> on <strong>${preferredDate}</strong> at <strong>${preferredTime}</strong>. 
            </p>
            <p style="color: var(--text-muted); margin-bottom: 2rem; font-size: 1rem;">
              Our reception desk will call you shortly to confirm your slot.
            </p>
            <div style="background-color: var(--bg-light); border-radius: var(--border-radius-md); padding: 1.5rem; border-left: 5px solid var(--accent); margin-bottom: 2rem; text-align: left;">
              <h4 style="font-family: var(--font-header); margin-bottom: 0.5rem; color: var(--text-dark); display: flex; align-items: center; gap: 0.5rem;">
                <i class="fab fa-whatsapp" style="color: #25D366; font-size: 1.4rem;"></i> Urgent Queries or Changes?
              </h4>
              <p style="font-size: 0.95rem; color: var(--text-dark); margin-bottom: 0.75rem;">
                Chat or call us directly on WhatsApp for immediate support:
              </p>
              <a href="https://wa.me/15550199?text=Hello%20Pediatric%20Dental%20World,%20I%20just%20requested%20an%20appointment%20for%20my%20child" target="_blank" class="btn btn-primary" style="display: inline-flex; width: 100%; justify-content: center;">
                <i class="fab fa-whatsapp" style="margin-right: 0.5rem;"></i> Message Clinic on WhatsApp
              </a>
            </div>
            <button onclick="window.location.reload();" class="btn btn-outline" style="min-width: 150px;">Book Another Slot</button>
          </div>
        `;
      } catch (err) {
        console.error("Booking error:", err);
        showAlert(bookingForm, 'error', `Could not save your appointment: ${err.message || 'Server error'}. Please try again.`);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  // B. Contact Form Handler
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      const contactData = {
        name: name,
        email: email,
        phone: phone,
        subject: subject,
        message: message,
        created_at: new Date().toISOString()
      };

      try {
        if (db) {
          // INSERT INTO SUPABASE 'contact_submissions' TABLE
          const { error } = await db
            .from('contact_submissions')
            .insert([contactData]);

          if (error) throw error;
        } else {
          // Fallback to LocalStorage (Demo Mode)
          let simulatedList = JSON.parse(localStorage.getItem('demo_contacts') || '[]');
          simulatedList.push(contactData);
          localStorage.setItem('demo_contacts', JSON.stringify(simulatedList));
          console.log("Simulated LocalStorage contact save:", contactData);
        }

        contactForm.reset();
        showAlert(contactForm, 'success', `Thank you, ${name}! Your message has been sent successfully. We will reply to your email within 24 hours.`);
      } catch (err) {
        console.error("Contact error:", err);
        showAlert(contactForm, 'error', `Failed to send message: ${err.message || 'Server error'}. Please try again.`);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  // C. Newsletter Sign-Up Handler (Supports multiple instances)
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const input = form.querySelector('input[type="email"]');
      const originalBtnText = submitBtn.innerHTML;
      
      if (!input || !input.value.trim()) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

      const email = input.value.trim();
      const subscriberData = {
        email: email,
        created_at: new Date().toISOString()
      };

      try {
        if (db) {
          // INSERT INTO SUPABASE 'newsletter_subscribers' TABLE
          const { error } = await db
            .from('newsletter_subscribers')
            .insert([subscriberData]);

          if (error) throw error;
        } else {
          // Fallback to LocalStorage (Demo Mode)
          let simulatedList = JSON.parse(localStorage.getItem('demo_newsletter') || '[]');
          simulatedList.push(subscriberData);
          localStorage.setItem('demo_newsletter', JSON.stringify(simulatedList));
          console.log("Simulated LocalStorage newsletter signup:", subscriberData);
        }

        form.reset();
        
        // Show success alert inline or update button temporarily
        submitBtn.innerHTML = '<i class="fas fa-check"></i>';
        submitBtn.style.backgroundColor = 'var(--secondary)';
        
        alert(`Thank you for subscribing! We've registered ${email} for child dental tips and health updates.`);
        
        setTimeout(() => {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.style.backgroundColor = '';
        }, 4000);
      } catch (err) {
        console.error("Newsletter error:", err);
        alert(`Failed to subscribe: ${err.message || 'Network error'}. Please try again.`);
        submitBtn.innerHTML = originalBtnText;
      } finally {
        submitBtn.disabled = false;
      }
    });
  });
});
