// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
}

// Close mobile menu when clicking on a nav link
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
});

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navHeight = document.querySelector('header').offsetHeight;
            window.scrollTo({
                top: targetElement.offsetTop - navHeight,
                behavior: 'smooth'
            });
        }
    });
});

// Form Validation + Backend Integration
const validateForm = (formId) => {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        const formElements = form.elements;

        // Clear previous errors
        form.querySelectorAll('.error-message').forEach(el => el.remove());
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        for (let i = 0; i < formElements.length; i++) {
            const el = formElements[i];
            if (el.hasAttribute('required') && el.value.trim() === '') {
                isValid = false;
                el.classList.add('error');
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                el.parentNode.appendChild(errorMsg);
            } else if (el.type === 'email' && el.value.trim() !== '') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(el.value)) {
                    isValid = false;
                    el.classList.add('error');
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Please enter a valid email';
                    el.parentNode.appendChild(errorMsg);
                }
            }
        }

        // Submit to backend
        if (isValid && formId === 'query-form') {
            const formData = {
                name: formElements['query-name'].value,
                email: formElements['query-email'].value,
                subject: formElements['query-subject'].value,
                message: formElements['query-message'].value
            };

            fetch('/send-query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(res => res.json())
            .then(data => {
                const box = document.createElement('div');
                box.className = data.success ? 'success-message' : 'error-message';
                box.textContent = data.message || 'Submission complete!';
                form.innerHTML = '';
                form.appendChild(box);
            })
            .catch(err => {
                console.error(err);
                const box = document.createElement('div');
                box.className = 'error-message';
                box.textContent = 'Something went wrong. Try again later.';
                form.innerHTML = '';
                form.appendChild(box);
            });
        }
    });

    // Remove errors while typing
    form.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                input.classList.remove('error');
                const errorMsg = input.parentNode.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            }
        });
    });
};

// On Load
document.addEventListener('DOMContentLoaded', () => {
    validateForm('query-form');
    validateForm('order-form');

    const style = document.createElement('style');
    style.textContent = `
        .error {
            border-color: #e53e3e !important;
            background-color: #fff5f5 !important;
        }
        .error-message {
            color: #e53e3e;
            font-size: 0.8rem;
            margin-top: 0.25rem;
        }
        .success-message {
            color: #38a169;
            text-align: center;
            padding: 1rem;
            background-color: #f0fff4;
            border-radius: 5px;
            margin: 1rem 0;
            font-weight: bold;
            animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Scroll animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.benefit-card, .variant-card, .product-col');
        elements.forEach(el => {
            const position = el.getBoundingClientRect().top;
            const screenPos = window.innerHeight / 1.3;
            if (position < screenPos) {
                el.classList.add('animate');
            }
        });
    };

    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .benefit-card, .variant-card, .product-col {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .animate {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(animationStyle);

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Hero button scroll
    const cta = document.querySelector('.cta-button');
    if (cta) {
        cta.addEventListener('click', () => {
            const section = document.querySelector('#order');
            const navHeight = document.querySelector('header').offsetHeight;
            window.scrollTo({
                top: section.offsetTop - navHeight,
                behavior: 'smooth'
            });
        });
    }

    // FAQ toggle
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        question.addEventListener("click", () => {
            faqItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
        });
    });
});

// ✅ Notify Form Submission Logic
const notifyForm = document.getElementById('notify-form');
if (notifyForm) {
    notifyForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('notify-name').value;
        const email = document.getElementById('notify-email').value;
        const phone = document.getElementById('notify-phone').value;
        const successBox = document.getElementById('notify-success');

        // Hide old message
        successBox.style.display = 'none';

        try {
            const response = await fetch('/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone }),
            });

            const data = await response.json();

            if (response.ok) {
                successBox.textContent = '✅ Thank you! We\'ll notify you when we go live.';
                successBox.style.color = '#38a169';
                successBox.style.display = 'block';
                successBox.classList.add('success-message');
                notifyForm.reset();

                setTimeout(() => {
                    successBox.style.display = 'none';
                }, 5000);
            } else {
                successBox.textContent = data.message || '❌ Something went wrong.';
                successBox.style.color = 'crimson';
                successBox.style.display = 'block';
                successBox.classList.remove('success-message');
            }

        } catch (error) {
            console.error('Notify form error:', error);
            successBox.textContent = '❌ Network error. Please try again later.';
            successBox.style.color = 'crimson';
            successBox.style.display = 'block';
            successBox.classList.remove('success-message');
        }
    });
}
