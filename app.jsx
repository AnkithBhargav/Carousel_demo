import React, { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Dynamically import the carousel script and initialize it
    import('./src/js/Linearcarousel.js').then(() => {
      // Wait for DOM to be ready
      window.LinearCarousel = LinearCarousel;
      new window.LinearCarousel('.carousel-container', {
        autoplay: true,
        dots: true,
        arrows: true,
        swipe: true,
        autoplaySpeed: 4000,
      });
    });
  }, []);

  return (
    <div>
      <h1>Image Carousel Demo</h1>
      <div className="carousel-container">
        <div className="carousel-track">
          <div className="carousel-slide">
            <img src="images/image 1.avif" alt="Slide 1" />
          </div>
          <div className="carousel-slide">
            <img src="images/image 2.avif" alt="Slide 2" />
          </div>
          <div className="carousel-slide">
            <img src="images/images 3.avif" alt="Slide 3" />
          </div>
          <div className="carousel-slide">
            <img src="images/images 4.avif" alt="Slide 4" />
          </div>
          <div className="carousel-slide">
            <img src="images/image 5.avif" alt="Slide 5" />
          </div>
        </div>
      </div>
    </div>
  );
}