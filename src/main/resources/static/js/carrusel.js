document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    
    // Mostrar la primera imagen
    slides[currentIndex].classList.add('active');
    
    function nextSlide() {
        // Ocultar la imagen actual
        slides[currentIndex].classList.remove('active');
        
        // Avanzar al siguiente índice
        currentIndex = (currentIndex + 1) % totalSlides;
        
        // Mostrar la nueva imagen
        slides[currentIndex].classList.add('active');
    }
    
    // Cambia de imagen cada 4 segundos
    setInterval(nextSlide, 4000);
});