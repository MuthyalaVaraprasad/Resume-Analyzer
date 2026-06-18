import React, { useState, useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Refs for tracking positions
  const mouseCoords = useRef({ x: -100, y: -100 });
  const ringCoords = useRef({ x: -100, y: -100 });
  
  // Element references
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseCoords.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'SELECT' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('clickable') ||
        target.getAttribute('role') === 'button';
      setIsHovered(!!isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    // Animation loop for smooth trailing interpolation
    let animFrameId: number;
    const updateCursor = () => {
      // Linear interpolation formula: current += (target - current) * factor
      const factor = 0.15; // Speed factor of trailing
      
      const targetX = mouseCoords.current.x;
      const targetY = mouseCoords.current.y;
      
      const currentX = ringCoords.current.x;
      const currentY = ringCoords.current.y;
      
      const nextX = currentX + (targetX - currentX) * factor;
      const nextY = currentY + (targetY - currentY) * factor;
      
      ringCoords.current = { x: nextX, y: nextY };
      
      // Update core dot directly
      if (dotRef.current) {
        dotRef.current.style.left = `${targetX}px`;
        dotRef.current.style.top = `${targetY}px`;
      }
      
      // Update lagging ring
      if (ringRef.current) {
        ringRef.current.style.left = `${nextX}px`;
        ringRef.current.style.top = `${nextY}px`;
      }
      
      animFrameId = requestAnimationFrame(updateCursor);
    };
    
    animFrameId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <>
      {/* 4px pointer dot */}
      <div 
        ref={dotRef}
        className="custom-cursor-dot hidden md:block"
      />

      {/* Lagging outer ring */}
      <div 
        ref={ringRef}
        className={`custom-cursor-ring hidden md:block ${isHovered ? 'hovered' : ''}`}
      />
    </>
  );
};
