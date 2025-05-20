document.addEventListener('DOMContentLoaded', function() {
    // 3D Card Tilt Effect
    const cards = document.querySelectorAll('.card-3d');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            this.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
        
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'none';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.5s ease';
            this.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
    });
    
    // Floating elements animation
    const floatingElements = document.querySelectorAll('.floating');
    
    floatingElements.forEach(el => {
        // Randomize animation delay and duration for natural effect
        const delay = Math.random() * 2;
        const duration = 3 + Math.random() * 2;
        
        el.style.animationDelay = `${delay}s`;
        el.style.animationDuration = `${duration}s`;
    });
    
    // Parallax effect for hero section
    const heroBg = document.querySelector('.hero-bg');
    
    if (heroBg) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            heroBg.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        });
    }
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn-3d');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const x = e.offsetX;
            const y = e.offsetY;
            
            const btnWidth = this.clientWidth;
            const btnHeight = this.clientHeight;
            
            const transX = (x - btnWidth / 2) / 20;
            const transY = (y - btnHeight / 2) / 20;
            
            this.style.transform = `translateY(-2px) translateX(${transX}px) translateY(${transY}px)`;
        });
        
        btn.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(-2px)';
        });
    });
});