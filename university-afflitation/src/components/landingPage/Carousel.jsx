import React, { useState, useEffect } from "react";
import './curousal.css'
const images = [
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80", 
  "https://images.unsplash.com/photo-1504386106331-3e4e71712b38?auto=format&fit=crop&w=1200&q=80", 
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80", 
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80", 
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"  
];

const ImageCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % images.length),
      2500
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel">
      {images.map((img, i) => (
        <div
          key={i}
          className={`carousel-item ${i === index ? "active" : ""}`}
          style={{ backgroundImage: `url(${img})` }}
        ></div>
      ))}
    </div>
  );
};

export default ImageCarousel;
