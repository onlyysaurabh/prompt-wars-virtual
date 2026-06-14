document.addEventListener("DOMContentLoaded", () => {
  // 1. Intersection Observer for fade-up animations
  const fadeElements = document.querySelectorAll('.fade-up');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once visible, we can stop observing it
        observer.unobserve(entry.target);
        
        // Trigger chart animation if it's the impact section
        if (entry.target.querySelector('.chart-body')) {
          animateChart();
        }
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));

  // 2. Chart Animation
  function animateChart() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
      const targetHeight = bar.style.height;
      bar.style.height = '0%';
      setTimeout(() => {
        bar.style.transition = 'height 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        bar.style.height = targetHeight;
      }, 300 + (index * 200));
    });
  }

  // 3. Carbon Unit Counter (Signature Element)
  const counterElement = document.getElementById('co2-count');
  const leaves = document.querySelectorAll('.leaf-icon');
  
  // Max CO2 saved in this simulation
  const maxCO2 = 1250;
  
  window.addEventListener('scroll', () => {
    // Calculate scroll percentage
    const scrollTop = window.scrollY;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    
    // Safety check for very short documents
    if (docHeight <= 0) return;
    
    const scrollPercent = Math.min(1, Math.max(0, scrollTop / docHeight));
    
    // Update counter
    const currentCount = Math.floor(scrollPercent * maxCO2);
    counterElement.innerText = currentCount;
    
    // Grow leaves based on progress
    if (scrollPercent > 0.2) {
      leaves[0].classList.add('grown');
    } else {
      leaves[0].classList.remove('grown');
    }
    
    if (scrollPercent > 0.5) {
      leaves[1].classList.add('grown');
    } else {
      leaves[1].classList.remove('grown');
    }
    
    if (scrollPercent > 0.8) {
      leaves[2].classList.add('grown');
    } else {
      leaves[2].classList.remove('grown');
    }
  });

  // Numbers animation for Community Section stats
  const statsElements = document.querySelectorAll('.stat-card h3');
  
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Just add a small bump animation
        entry.target.style.transform = 'scale(1.1)';
        entry.target.style.transition = 'transform 0.3s';
        setTimeout(() => {
          entry.target.style.transform = 'scale(1)';
        }, 300);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  statsElements.forEach(el => statsObserver.observe(el));
});
