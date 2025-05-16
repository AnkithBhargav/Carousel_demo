class LinearCarousel {
    /**
     * Create a new carousel instance
     * @param {string} selector - CSS selector for the carousel container
     * @param {Object} options - Configuration options
     */
    constructor(selector, options = {}) {
        // Default options
        this.options = {
            autoplay: true,
            autoplaySpeed: 5000,
            dots: true,
            arrows: true,
            swipe: true,
            ...options
        };

        // Get DOM elements
        this.container = document.querySelector(selector);
        if (!this.container) {
            console.error(`Carousel container not found: ${selector}`);
            return;
        }

        this.track = this.container.querySelector('.carousel-track');
        this.slides = Array.from(this.container.querySelectorAll('.carousel-slide'));
        
        // Exit if no slides
        if (!this.slides.length) {
            console.error('No slides found in carousel');
            return;
        }

        // Set up state
        this.slideCount = this.slides.length;
        this.currentIndex = 0;
        this.slideWidth = 100; // percentage width
        this.autoplayInterval = null;
        
        // Initialize
        this.setupArrowNavigation();
        this.setupDotNavigation();
        this.setupSwipeSupport();
        this.setupAutoplay();
        this.updateCarousel();
    }

    /**
     * Set up arrow navigation
     */
    setupArrowNavigation() {
        if (!this.options.arrows) return;
        
        // Create arrows if they don't exist
        if (!this.container.querySelector('.carousel-button.prev')) {
            const prevButton = document.createElement('button');
            prevButton.className = 'carousel-button prev';
            prevButton.innerHTML = '&#10094;';
            this.container.appendChild(prevButton);
        }
        
        if (!this.container.querySelector('.carousel-button.next')) {
            const nextButton = document.createElement('button');
            nextButton.className = 'carousel-button next';
            nextButton.innerHTML = '&#10095;';
            this.container.appendChild(nextButton);
        }
        
        // Add event listeners
        this.prevButton = this.container.querySelector('.carousel-button.prev');
        this.nextButton = this.container.querySelector('.carousel-button.next');
        
        this.prevButton.addEventListener('click', () => this.prevSlide());
        this.nextButton.addEventListener('click', () => this.nextSlide());
    }

    /**
     * Set up dot navigation
     */
    setupDotNavigation() {
        if (!this.options.dots) return;
        
        // Create dots container if it doesn't exist
        let dotsContainer = this.container.querySelector('.carousel-dots');
        if (!dotsContainer) {
            dotsContainer = document.createElement('div');
            dotsContainer.className = 'carousel-dots';
            this.container.appendChild(dotsContainer);
        } else {
            // Clear existing dots
            dotsContainer.innerHTML = '';
        }
        
        // Create dots
        for (let i = 0; i < this.slideCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            dotsContainer.appendChild(dot);
        }
        
        this.dots = Array.from(dotsContainer.querySelectorAll('.dot'));
    }

    /**
     * Set up touch/swipe support
     */
    setupSwipeSupport() {
        if (!this.options.swipe) return;
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    /**
     * Handle swipe gesture
     */
    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        if (endX < startX - swipeThreshold) {
            // Swipe left
            this.nextSlide();
        } else if (endX > startX + swipeThreshold) {
            // Swipe right
            this.prevSlide();
        }
    }

    /**
     * Set up autoplay
     */
    setupAutoplay() {
        if (!this.options.autoplay) return;
        
        this.startAutoplay();
        
        // Pause on hover
        this.container.addEventListener('mouseenter', () => {
            this.stopAutoplay();
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.startAutoplay();
        });
    }

    /**
     * Start autoplay
     */
    startAutoplay() {
        this.stopAutoplay(); // Ensure no duplicate intervals
        if (this.options.autoplay) {
            this.autoplayInterval = setInterval(() => {
                // Only advance if the document is visible (pause when tab is inactive)
                if (!document.hidden) {
                    this.nextSlide();
                }
            }, this.options.autoplaySpeed);
        }
    }

    /**
     * Stop autoplay
     */
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    /**
     * Go to previous slide
     */
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
        this.updateCarousel();
    }

    /**
     * Go to next slide
     */
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slideCount;
        this.updateCarousel();
    }

    /**
     * Go to specific slide
     */
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }

    /**
     * Update carousel display
     */
    updateCarousel() {
        // Update track position
        if (this.track) {
            this.track.style.transform = `translateX(-${this.currentIndex * this.slideWidth}%)`;
        }
        
        // Update active dot
        if (this.dots) {
            this.dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }
    }

    /**
     * Destroy carousel instance and remove event listeners
     */
    destroy() {
        this.stopAutoplay();
        
        // Remove event listeners (simplified version)
        if (this.prevButton) this.prevButton.removeEventListener('click', this.prevSlide);
        if (this.nextButton) this.nextButton.removeEventListener('click', this.nextSlide);
        
        // Remove dots event listeners
        if (this.dots) {
            this.dots.forEach((dot, index) => {
                dot.removeEventListener('click', () => this.goToSlide(index));
            });
        }
    }
}

/**
 * CSS styles for the carousel
 * Inject these styles into the document head
 */
function injectCarouselStyles() {
    const styleId = 'linear-carousel-styles';
    
    // Don't add styles if they already exist
    if (document.getElementById(styleId)) {
        return;
    }
    
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = `
        /* Carousel Container */
        .carousel-container {
            position: relative;
            overflow: hidden;
            border-radius: 18px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 1.5px 6px rgba(0,0,0,0.08);
            margin: 40px auto;
            background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%);
            max-width: 900px;
        }

        /* Carousel Track */
        .carousel-track {
            display: flex;
            transition: transform 0.7s cubic-bezier(.77,0,.18,1);
            height: 420px;
        }

        /* Carousel Slides */
        .carousel-slide {
            min-width: 100%;
            position: relative;
            overflow: hidden;
            border-radius: 18px;
            box-shadow: 0 2px 16px rgba(0,0,0,0.10);
        }

        .carousel-slide img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: brightness(0.92) saturate(1.15);
            transition: filter 0.4s;
        }

        .carousel-slide:hover img {
            filter: brightness(1) saturate(1.2);
        }

        /* Slide Content */
        .slide-content {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 32px 28px 24px 28px;
            background: linear-gradient(to top, rgba(24, 28, 38, 0.88) 60%, rgba(24,28,38,0.0) 100%);
            color: #fff;
            border-radius: 0 0 18px 18px;
            box-sizing: border-box;
        }

        .slide-content h2 {
            font-size: 2.1rem;
            font-weight: 700;
            margin-bottom: 12px;
            letter-spacing: 0.5px;
            text-shadow: 0 2px 8px rgba(0,0,0,0.18);
        }

        .slide-content p {
            font-size: 1.08rem;
            line-height: 1.6;
            margin-bottom: 18px;
            color: #e0e7ef;
            text-shadow: 0 1px 4px rgba(0,0,0,0.12);
        }

        .read-more {
            display: inline-block;
            margin-top: 10px;
            padding: 10px 26px;
            border: none;
            border-radius: 24px;
            background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
            color: #fff;
            text-decoration: none;
            font-size: 1rem;
            font-weight: 600;
            letter-spacing: 0.2px;
            box-shadow: 0 2px 8px rgba(99,102,241,0.18);
            transition: background 0.3s, color 0.3s, box-shadow 0.3s;
        }

        .read-more:hover {
            background: linear-gradient(90deg, #60a5fa 0%, #6366f1 100%);
            color: #fff;
            box-shadow: 0 4px 16px rgba(99,102,241,0.22);
        }

        /* Navigation Buttons */
        .carousel-button {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.72);
            border: none;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 2rem;
            color: #6366f1;
            box-shadow: 0 2px 8px rgba(99,102,241,0.10);
            transition: background 0.3s, color 0.3s, box-shadow 0.3s;
            z-index: 10;
            opacity: 0.92;
        }

        .carousel-button:hover {
            background: #6366f1;
            color: #fff;
            box-shadow: 0 4px 16px rgba(99,102,241,0.18);
            opacity: 1;
        }

        .carousel-button.prev {
            left: 18px;
        }

        .carousel-button.next {
            right: 18px;
        }

        /* Dots Navigation */
        .carousel-dots {
            display: flex;
            justify-content: center;
            margin-top: 22px;
            gap: 12px;
        }

        .dot {
            width: 13px;
            height: 13px;
            border-radius: 50%;
            background: linear-gradient(135deg, #dbeafe 0%, #a5b4fc 100%);
            box-shadow: 0 1px 4px rgba(99,102,241,0.10);
            cursor: pointer;
            transition: background 0.3s, transform 0.2s;
            border: 2px solid transparent;
        }

        .dot.active {
            background: linear-gradient(135deg, #6366f1 0%, #60a5fa 100%);
            border: 2px solid #6366f1;
            transform: scale(1.18);
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
            .carousel-track {
                height: 320px;
            }
            .carousel-container {
                max-width: 98vw;
            }
        }
        @media (max-width: 768px) {
            .carousel-track {
                height: 210px;
            }
            .slide-content {
                padding: 18px 12px 12px 12px;
            }
            .slide-content h2 {
                font-size: 1.25rem;
            }
            .read-more {
                font-size: 0.92rem;
                padding: 8px 18px;
            }
            .carousel-button {
                width: 38px;
                height: 38px;
                font-size: 1.3rem;
            }
        }
        @media (max-width: 480px) {
            .carousel-track {
                height: 140px;
            }
            .slide-content {
                padding: 10px 6px 6px 6px;
            }
            .carousel-button {
                width: 32px;
                height: 32px;
                font-size: 1.1rem;
            }
        }
    `;
    
    document.head.appendChild(styleElement);
}

// Inject styles when this script is loaded
injectCarouselStyles();


