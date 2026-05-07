// VogueAI Form Validation Script

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const mobileInput = document.getElementById('mobile');
    
    // Name validation: required, min 3 chars, letters only
    function validateName() {
        const name = nameInput.value.trim();
        const nameRegex = /^[A-Za-z\s]+$/;
        
        if (name.length < 3) {
            showInvalid(nameInput, 'Name must be at least 3 characters long');
            return false;
        }
        
        if (!nameRegex.test(name)) {
            showInvalid(nameInput, 'Name can only contain letters and spaces');
            return false;
        }
        
        showValid(nameInput);
        return true;
    }
    
    // Email validation: RFC format
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (!emailRegex.test(email)) {
            showInvalid(emailInput, 'Please enter a valid email address');
            return false;
        }
        
        showValid(emailInput);
        return true;
    }
    
    // Mobile validation: exactly 10 digits, numeric only
    function validateMobile() {
        const mobile = mobileInput.value.trim();
        const mobileRegex = /^[0-9]{10}$/;
        
        if (!mobileRegex.test(mobile)) {
            showInvalid(mobileInput, 'Mobile number must be exactly 10 digits');
            return false;
        }
        
        showValid(mobileInput);
        return true;
    }
    
    // Show invalid feedback
    function showInvalid(input, message) {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = message;
        }
    }
    
    // Show valid feedback
    function showValid(input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }
    
    // Real-time validation
    nameInput.addEventListener('blur', validateName);
    nameInput.addEventListener('input', function() {
        if (nameInput.classList.contains('is-invalid')) {
            validateName();
        }
    });
    
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', function() {
        if (emailInput.classList.contains('is-invalid')) {
            validateEmail();
        }
    });
    
    mobileInput.addEventListener('blur', validateMobile);
    mobileInput.addEventListener('input', function() {
        // Only allow numbers
        mobileInput.value = mobileInput.value.replace(/[^0-9]/g, '');
        if (mobileInput.classList.contains('is-invalid')) {
            validateMobile();
        }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Validate all fields
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMobileValid = validateMobile();
        
        if (isNameValid && isEmailValid && isMobileValid) {
            // Show success message
            showSuccessMessage();
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                nameInput.classList.remove('is-valid', 'is-invalid');
                emailInput.classList.remove('is-valid', 'is-invalid');
                mobileInput.classList.remove('is-valid', 'is-invalid');
            }, 2000);
        } else {
            // Show error message
            showErrorMessage();
        }
        
        form.classList.add('was-validated');
    });
    
    // Success message function
    function showSuccessMessage() {
        const existingMessage = document.querySelector('.success-message, .error-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message fade-in-up';
        successDiv.innerHTML = `
            <i class="bi bi-check-circle-fill me-2"></i>
            <strong>Success!</strong> You have been subscribed to our newsletter.
        `;
        
        form.parentNode.insertBefore(successDiv, form);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
    
    // Error message function
    function showErrorMessage() {
        const existingMessage = document.querySelector('.success-message, .error-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message fade-in-up';
        errorDiv.innerHTML = `
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Error!</strong> Please fix the validation errors before submitting.
        `;
        
        form.parentNode.insertBefore(errorDiv, form);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    // Product card click handlers for modal
    const productCards = document.querySelectorAll('.fashion-card');
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    
    productCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            productModal.show();
        });
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards
    document.querySelectorAll('section, .fashion-card').forEach(el => {
        observer.observe(el);
    });
    
    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = 'transparent';
            navbar.style.backdropFilter = 'none';
        }
    });
    
    // Mobile number formatting
    mobileInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        e.target.value = value;
    });
    
    // Prevent paste of non-numeric characters in mobile field
    mobileInput.addEventListener('paste', function(e) {
        e.preventDefault();
        const pastedData = (e.clipboardData || window.clipboardData).getData('text');
        const numericData = pastedData.replace(/\D/g, '').slice(0, 10);
        document.execCommand('insertText', false, numericData);
    });
    
    // Add to Cart button functionality
    const addToCartBtns = document.querySelectorAll('button');
    addToCartBtns.forEach(btn => {
        if (btn.textContent.includes('Add to Cart')) {
            btn.addEventListener('click', function() {
                showNotification('Product added to cart successfully!', 'success');
                // Close modal after adding to cart
                const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
                if (modal) {
                    modal.hide();
                }
            });
        }
    });
    
    // Add to Wishlist button functionality
    const addToWishlistBtns = document.querySelectorAll('button');
    addToWishlistBtns.forEach(btn => {
        if (btn.textContent.includes('Add to Wishlist')) {
            btn.addEventListener('click', function() {
                showNotification('Product added to wishlist!', 'success');
                // Close modal after adding to wishlist
                const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
                if (modal) {
                    modal.hide();
                }
            });
        }
    });
    
    // Generic notification function
    function showNotification(message, type = 'success') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} fade-in-up`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            min-width: 250px;
        `;
        
        if (type === 'success') {
            notification.style.backgroundColor = '#28a745';
            notification.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i>${message}`;
        } else if (type === 'error') {
            notification.style.backgroundColor = '#dc3545';
            notification.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>${message}`;
        }
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});
