/**
 * Simple-Slider - A lightweight JavaScript carousel/slider implementation
 * Used for the Dogs page carousel in the Class Activities website
 */
class SimpleSlider {
    /**
     * Constructor for SimpleSlider
     * @param {Object} options - Configuration options
     * @param {HTMLElement} options.container - Container element for slides
     * @param {number} options.duration - Time between slides in ms (default: 5000)
     * @param {boolean} options.autoplay - Whether to auto-advance slides (default: true)
     */
    constructor(options) {
        this.container = options.container;
        this.slides = Array.from(this.container.children);
        this.currentIndex = 0;
        this.duration = options.duration || 5000;
        this.autoplay = options.autoplay !== undefined ? options.autoplay : true;
        
        // Initialize if we have slides
        if (this.slides.length > 0) {
            this.initialize();
        } else {
            console.error('No slides found in the container');
        }
    }
    
    /**
     * Initialize the slider
     */
    initialize() {
        // Hide all slides except the first one
        this.slides.forEach((slide, index) => {
            if (index !== 0) {
                slide.style.display = 'none';
            }
        });
        
        // Apply basic styles to container and slides
        this.container.style.position = 'relative';
        this.container.style.overflow = 'hidden';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        
        this.slides.forEach(slide => {
            slide.style.width = '100%';
            slide.style.height = '100%';
            slide.style.position = 'absolute';
            slide.style.top = '0';
            slide.style.left = '0';
        });
        
        // Start autoplay if enabled
        if (this.autoplay && this.slides.length > 1) {
            this.startAutoplay();
        }
    }
    
    /**
     * Move to the next slide
     */
    next() {
        // Hide current slide
        this.slides[this.currentIndex].style.display = 'none';
        
        // Increment index
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        
        // Show next slide
        this.slides[this.currentIndex].style.display = 'block';
    }
    
    /**
     * Move to the previous slide
     */
    prev() {
        // Hide current slide
        this.slides[this.currentIndex].style.display = 'none';
        
        // Decrement index
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        
        // Show previous slide
        this.slides[this.currentIndex].style.display = 'block';
    }
    
    /**
     * Move to a specific slide
     * @param {number} index - Index of the slide to show
     */
    goTo(index) {
        if (index >= 0 && index < this.slides.length) {
            // Hide current slide
            this.slides[this.currentIndex].style.display = 'none';
            
            // Update index
            this.currentIndex = index;
            
            // Show selected slide
            this.slides[this.currentIndex].style.display = 'block';
        }
    }
    
    /**
     * Start autoplay
     */
    startAutoplay() {
        this.interval = setInterval(() => {
            this.next();
        }, this.duration);
    }
    
    /**
     * Stop autoplay
     */
    stopAutoplay() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
    
    /**
     * Destroy the slider and remove event listeners
     */
    destroy() {
        this.stopAutoplay();
        
        // Reset styles
        this.slides.forEach(slide => {
            slide.style.display = '';
            slide.style.position = '';
            slide.style.width = '';
            slide.style.height = '';
            slide.style.top = '';
            slide.style.left = '';
        });
        
        this.container.style.position = '';
        this.container.style.overflow = '';
        this.container.style.width = '';
        this.container.style.height = '';
    }
}