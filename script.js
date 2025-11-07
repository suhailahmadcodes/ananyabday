document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentPage = 1;
    const totalPages = 6;
    const pages = document.querySelectorAll('.story-page');
    const dots = document.querySelectorAll('.dot');
    // Initialize all pages except first as hidden and inactive
    pages.forEach((page, index) => {
        if (index !== 0) {
            page.classList.add('hidden');
            page.classList.remove('active');
        } else {
            page.classList.add('active');
            page.classList.remove('hidden');
        }
    });
// Page click handler
    document.addEventListener('click', function(e) {
        if (currentPage === 1 && e.target.closest('#page1')) {
            navigateTo(2);
        } else if (currentPage === 6 && e.target.closest('#final-button')) {
            showFireworks();
        }
    });
    // Navigation controls
    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentPage > 1) {
            navigateTo(currentPage - 1);
        }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentPage < totalPages) {
            navigateTo(currentPage + 1);
        }
    });

    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const pageNum = parseInt(this.getAttribute('data-page'));
            navigateTo(pageNum);
        });
    });

    // Hide swipe hint after first interaction
    const swipeHint = document.getElementById('swipe-hint');
    let interactionOccurred = false;

    function hideSwipeHint() {
        if (!interactionOccurred) {
            gsap.to(swipeHint, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                onComplete: () => swipeHint.style.display = 'none'
            });
            interactionOccurred = true;
        }
    }

    document.addEventListener('click', hideSwipeHint);
    document.addEventListener('touchstart', hideSwipeHint);
// Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            if (currentPage < totalPages) {
                navigateTo(currentPage + 1);
            }
        } else if (e.key === 'ArrowLeft') {
            if (currentPage > 1) {
                navigateTo(currentPage - 1);
            }
        }
    });
    
    // Swipe detection for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    // Enhanced swipe detection
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if (!touchStartX) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        // Check if horizontal swipe (prevent vertical scroll interference)
        if (Math.abs(touchEndX - touchStartX) > Math.abs(touchEndY - touchStartY)) {
            e.preventDefault();
        }
    }, { passive: false });
    
    document.addEventListener('touchend', function(e) {
        if (!touchStartX) return;
        
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
        touchStartX = 0;
    }, { passive: true });
    function handleSwipe() {
        const threshold = 50; // Minimum swipe distance
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) < threshold) return;
        
        if (swipeDistance < 0 && currentPage < totalPages) {
            // Swipe left - next page
            navigateTo(currentPage + 1);
        } else if (swipeDistance > 0 && currentPage > 1) {
            // Swipe right - previous page
            navigateTo(currentPage - 1);
        }
    }
// Navigation function
    function navigateTo(pageNum) {
        const direction = pageNum > currentPage ? 'next' : 'prev';
        const currentPageEl = document.querySelector(`#page${currentPage}`);
        const newPageEl = document.querySelector(`#page${pageNum}`);
        
        // Prepare animation classes
        currentPageEl.classList.remove('active');
        currentPageEl.classList.add('hidden');
        currentPageEl.classList.add(direction === 'next' ? 'prev' : 'next');
        
        newPageEl.classList.remove('hidden', 'prev', 'next');
        newPageEl.classList.add('active');
// Update dots
        document.querySelector(`.dot[data-page="${currentPage}"]`).classList.remove('active');
        document.querySelector(`.dot[data-page="${pageNum}"]`).classList.add('active');
currentPage = pageNum;
        
        // Trigger page-specific animations
        triggerPageAnimations(pageNum);
    }
    
    // Page-specific animations
    function triggerPageAnimations(pageNum) {
        switch(pageNum) {
            case 1:
                // Sparkles animation for page 1
                gsap.to("#page1-sparkle", {
                    opacity: 1,
                    duration: 1,
                    y: -20,
                    ease: "power2.out"
                });
                break;
            case 2:
                // Typing effect for page 2
                const lines = document.querySelectorAll('.typing-line');
                lines.forEach((line, index) => {
                    const text = line.textContent;
                    line.textContent = '';
                    setTimeout(() => {
                        typeWriter(line, text, 0, 50);
                    }, index * 1500);
                });
                
                // Quote card animation
                setTimeout(() => {
                    gsap.to("#quote-card", {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "elastic.out(1, 0.5)"
                    });
                }, 3500);
                break;
            case 3:
                // Classroom image and text animations
                gsap.to("#classroom-img", {
                    opacity: 1,
                    duration: 1,
                    y: 0,
                    ease: "power2.out"
                });
                
                setTimeout(() => {
                    gsap.to("#memory-line1", {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out"
                    });
                    
                    setTimeout(() => {
                        gsap.to("#memory-line2", {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power2.out"
                        });
                        
                        setTimeout(() => {
                            gsap.to("#page3-sparkle", {
                                opacity: 0.5,
                                duration: 1
                            });
                        }, 500);
                    }, 500);
                }, 500);
                break;
            case 4:
                // Witch hat and personality animations
                gsap.to("#witch-hat", {
                    opacity: 1,
                    duration: 1,
                    x: -50,
                    y: -50,
                    ease: "power2.out"
                });
                
                setTimeout(() => {
                    gsap.to("#personality-line1", {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out"
                    });
                    
                    setTimeout(() => {
                        gsap.to("#personality-line2", {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power2.out"
                        });
                        
                        setTimeout(() => {
                            gsap.to("#handwriting-text", {
                                opacity: 1,
                                y: 0,
                                duration: 0.8,
                                ease: "power2.out"
                            });
                        }, 500);
                    }, 500);
                }, 500);
                break;
            case 5:
                // Birthday wish animations
                gsap.to("#wish-line1", {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });
                
                setTimeout(() => {
                    gsap.to("#wish-line2", {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out"
                    });
                    
                    setTimeout(() => {
                        gsap.to("#phone-animation", {
                            opacity: 1,
                            duration: 1,
                            y: 0,
                            ease: "elastic.out(1, 0.5)"
                        });
                    }, 500);
                }, 500);
                break;
            case 6:
                // Finale animations
                gsap.to("#final-title", {
                    opacity: 1,
                    duration: 1,
                    y: 0,
                    ease: "power2.out"
                });
                
                setTimeout(() => {
                    gsap.to("#final-subtitle", {
                        opacity: 1,
                        duration: 1,
                        y: 0,
                        ease: "power2.out"
                    });
                    
                    setTimeout(() => {
                        gsap.to("#final-button", {
                            opacity: 1,
                            duration: 1,
                            y: 0,
                            ease: "power2.out"
                        });
                    }, 500);
                }, 500);
                break;
        }
    }
    
    // Fireworks show
    function showFireworks() {
        // No fireworks animation
    }
// Typewriter effect
    function typeWriter(element, text, i, speed) {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(() => typeWriter(element, text, i, speed), speed);
        } else {
            element.style.borderRight = 'none';
        }
    }
    
    // Initial animations
    setTimeout(() => {
        document.querySelector('#page1 h1').classList.add('glow-text');
    }, 500);
});