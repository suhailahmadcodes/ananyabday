document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentPage = 1;
    const totalPages = 9;
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
                // Classroom image and text animations (was page 3)
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
            case 3:
    // Animate in lines on Personality Magic page
    const personalityLines = [
        "#personality-line1",
        "#personality-line2",
        "#handwriting-text"
    ];

    personalityLines.forEach((selector, i) => {
        gsap.to(selector, {
            opacity: 1,
            y: 0,
            delay: i * 0.5,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // Optional: witch-hat animation if you want it to appear magically
    gsap.fromTo("#witch-hat",
        { opacity: 0, rotate: -45, y: -30 },
        { opacity: 1, rotate: 0, y: 0, delay: 0.5, duration: 1, ease: "elastic.out(1, 0.5)" }
    );
    break;

            case 4:
                // Compliment Page Animations (Typewriter + Quote Card)
                const lines4 = document.querySelectorAll("#page4 .typing-line");
                const quoteCard = document.getElementById("quote-card");

                // Reset previous state
                lines4.forEach(line => line.textContent = line.getAttribute("data-fulltext") || line.textContent);
                lines4.forEach(line => line.textContent = ""); // Clear text for typing
                quoteCard.style.opacity = 0;

                // Typewriter function
                function typeWriter(element, text, speed, callback) {
                    let i = 0;
                    function typing() {
                        if (i < text.length) {
                            element.textContent += text.charAt(i);
                            i++;
                            setTimeout(typing, speed);
                        } else if (callback) {
                            callback();
                        }
                    }
                    typing();
                }
            
                // Sequential typing for both lines
                const line1 = lines4[0];
                const line2 = lines4[1];
                const text1 = "Mujhe samajh nhi aata — HOW can someone be this attractive, pretty, smart, intelligent, anddd mature...";
                const text2 = "and still behave THIS good to me 😭💀";
            
                typeWriter(line1, text1, 40, () => {
                    setTimeout(() => {
                        typeWriter(line2, text2, 40, () => {
                            // Show the quote card after typing finishes
                            gsap.to(quoteCard, {
                                opacity: 1,
                                y: 0,
                                duration: 1,
                                ease: "elastic.out(1, 0.5)"
                            });
                        });
                    }, 400);
                });
                break;
            
                // Reveal the quote card after text finishes
                gsap.fromTo("#quote-card",
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        delay: 2.8,
                        ease: "elastic.out(1, 0.5)"
                    }
                );
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
            // ✨ Page 7 — Shayari Page
            case 7:
                gsap.to("#shayari-line", {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power2.out"
                });
                break;
            
            case 6:
                // --- Pandey Ji Tariff Card Page Animation ---
                const tariffLines = [
                    "#tariff-line1", "#tariff-line2", "#tariff-line3",
                    "#tariff-line4", "#tariff-line5", "#tariff-line6"
                ];
                const viewBtn = document.getElementById("view-once-btn");
            
                // Reset opacity & position
                tariffLines.forEach(sel => gsap.set(sel, { opacity: 0, y: 20 }));
                gsap.set(viewBtn, { opacity: 0, scale: 0.8 });
            
                // Sequentially animate lines
                tariffLines.forEach((sel, i) => {
                    gsap.to(sel, {
                        opacity: 1,
                        y: 0,
                        delay: i * 0.4,
                        duration: 0.6,
                        ease: "power2.out"
                    });
                });
            
                // Button pops in last
                gsap.to(viewBtn, {
                    opacity: 1,
                    scale: 1,
                    delay: tariffLines.length * 0.4 + 0.3,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                });
                break;
            
            case 8:
                // --- Party Question Page Animation ---
                const wishLine = document.getElementById("wish-line1");
                const yesBtn = document.getElementById("yes-btn");
                const noBtn = document.getElementById("no-btn");

                // Reset
                gsap.set(wishLine, { opacity: 0, y: 20 });
                gsap.set([yesBtn, noBtn], { opacity: 0, scale: 0.8 });

                // Animate question
                gsap.to(wishLine, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });
            
                // Animate buttons in sequence
                gsap.to(yesBtn, {
                    opacity: 1,
                    scale: 1,
                    delay: 0.6,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                });
                gsap.to(noBtn, {
                    opacity: 1,
                    scale: 1,
                    delay: 0.9,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                });
                break;
            

            // 🎉 Page 9 — Finale Page (moved from old case 7)
            case 9:
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
