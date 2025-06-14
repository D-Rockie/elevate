document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenuButton.innerHTML = '<i class="ri-menu-line ri-lg"></i>';
            } else {
                mobileMenuButton.innerHTML = '<i class="ri-close-line ri-lg"></i>';
            }
        });
    }
    
    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.innerHTML = '<i class="ri-menu-line ri-lg"></i>';
                }
            }
        });
    });
    
    // Header Scroll Effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('shadow-md');
                header.classList.remove('py-4');
                header.classList.add('py-3');
            } else {
                header.classList.remove('shadow-md');
                header.classList.remove('py-3');
                header.classList.add('py-4');
            }
        });
    }
    
    // Fade-in Animation on Scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length > 0) {
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeInObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        fadeElements.forEach(element => {
            fadeInObserver.observe(element);
        });
    }
    
    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            const consent = document.getElementById('consent').checked;
            
            // Validate form
            if (!name || !email || !subject || !message) {
                showAlert('Please fill in all required fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            if (!consent) {
                showAlert('Please agree to receive emails about services and updates', 'error');
                return;
            }
            
            // Prepare email data for founders
            const foundersEmailData = {
                from_name: name,
                from_email: email,
                subject: `New Contact Form Submission: ${subject}`,
                message: `
                    Name: ${name}
                    Email: ${email}
                    Subject: ${subject}
                    
                    Message:
                    ${message}
                `,
                to_email: 'Kailashathreyainelevate@gmail.com, devaeshinelevate@gmail.com',
                reply_to: email
            };

            // Prepare auto-reply data for client
            const autoReplyData = {
                to_name: name,
                to_email: email,
                subject: 'Thank you for contacting Elevate',
                message: message,
                from_name: 'Elevate Team',
                from_email: 'noreply@elevate.com',
                reply_to: 'Kailashathreyainelevate@gmail.com'
            };

            console.log('Auto-reply data:', autoReplyData); // Log the data being sent

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            // Send both emails
            Promise.all([
                // Send to founders
                emailjs.send('service_cnm8tlo', 'template_tabn0cc', foundersEmailData)
                    .then(response => {
                        console.log('Founders email response:', response);
                        return response;
                    })
                    .catch(error => {
                        console.error('Founders email error:', error);
                        throw error;
                    }),
                // Send auto-reply to client
                emailjs.send('service_cnm8tlo', 'template_i7xosrm', autoReplyData)
                    .then(response => {
                        console.log('Auto-reply response:', response);
                        return response;
                    })
                    .catch(error => {
                        console.error('Auto-reply error:', error);
                        throw error;
                    })
            ])
            .then(function(responses) {
                console.log('All responses:', responses);
                const foundersResponse = responses[0];
                const autoReplyResponse = responses[1];

                if (foundersResponse.status === 200 && autoReplyResponse.status === 200) {
                    showAlert('Message sent successfully! Please check your email for our auto-reply.', 'success');
                } else if (foundersResponse.status === 200) {
                    showAlert('Message sent, but there was an issue with the auto-reply. We will still get back to you soon.', 'warning');
                } else {
                    showAlert('Failed to send message. Please try again later or contact us directly.', 'error');
                }
                contactForm.reset();
            })
            .catch(function(error) {
                console.error('Detailed error:', error);
                if (error.text) {
                    console.error('Error details:', error.text);
                }
                showAlert('Failed to send message. Please try again later or contact us directly.', 'error');
            })
            .finally(function() {
                // Reset button state
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
        });
        
        // Add input validation styling
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value.trim() === '') {
                    this.classList.add('border-red-500');
                } else {
                    this.classList.remove('border-red-500');
                }
            });
            
            input.addEventListener('input', function() {
                this.classList.remove('border-red-500');
            });
        });
    }
    
    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Alert function
    function showAlert(message, type) {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;
        
        // Remove any existing alerts
        const existingAlert = document.querySelector('.form-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `form-alert p-4 mb-4 rounded-lg ${
            type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`;
        alert.textContent = message;
        
        // Insert alert before the form
        contactForm.parentNode.insertBefore(alert, contactForm);
        
        // Remove alert after 5 seconds
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
});

