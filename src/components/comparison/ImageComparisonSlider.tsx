'use client';

import { useState, useRef, useCallback, useEffect, KeyboardEvent } from 'react';

interface ImageComparisonSliderProps {
  leftImage: string;
  rightImage: string;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
}

// Fullscreen Modal Component with Zoom
function FullscreenModal({
  image,
  label,
  onClose,
  onSwitch,
  showSwitchButton,
}: {
  image: string;
  label: string;
  onClose: () => void;
  onSwitch?: () => void;
  showSwitchButton?: boolean;
}) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.5, 1));
  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 50, y: 50 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPosition((prev) => ({
        x: Math.max(0, Math.min(100, prev.x - dx * 0.1)),
        y: Math.max(0, Math.min(100, prev.y - dy * 0.1)),
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      } else if ((e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') && onSwitch) {
        e.preventDefault();
        onSwitch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onSwitch]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex flex-col"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/80">
        <div className="flex items-center gap-4">
          <span className="text-white font-medium text-lg">{label}</span>
          {showSwitchButton && onSwitch && (
            <button
              onClick={onSwitch}
              className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Switch image
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-gray-700/50">
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-700 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-white text-sm w-14 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-700 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            {zoom > 1 && (
              <button
                onClick={handleResetZoom}
                className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-gray-800/80 backdrop-blur-sm rounded-xl transition-colors border border-transparent hover:border-gray-700/50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Image Container */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <img
          src={image}
          alt={label}
          className="max-w-none transition-transform duration-100"
          style={{
            transform: `scale(${zoom}) translate(${50 - position.x}%, ${50 - position.y}%)`,
            transformOrigin: `${position.x}% ${position.y}%`,
          }}
          draggable={false}
        />
      </div>

      {/* Footer hint */}
      <div className="p-3 bg-black/80 text-center text-gray-400 text-sm">
        Scroll to zoom • {zoom > 1 ? 'Drag to pan • ' : ''}Esc to close{showSwitchButton ? ' • Space to switch' : ''}
      </div>
    </div>
  );
}

export default function ImageComparisonSlider({
  leftImage,
  rightImage,
  leftLabel = 'Before',
  rightLabel = 'After',
  className = '',
}: ImageComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [leftImageLoaded, setLeftImageLoaded] = useState(false);
  const [rightImageLoaded, setRightImageLoaded] = useState(false);
  const [leftImageError, setLeftImageError] = useState(false);
  const [rightImageError, setRightImageError] = useState(false);
  
  // Flip mode and fullscreen state
  const [isFlipMode, setIsFlipMode] = useState(false);
  const [showLeftImage, setShowLeftImage] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState<'left' | 'right' | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderHandleRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const isLoading = !leftImageLoaded || !rightImageLoaded;
  const hasError = leftImageError || rightImageError;
  
  // Toggle flip mode
  const toggleFlipMode = useCallback(() => {
    setIsFlipMode((prev) => !prev);
    setShowLeftImage(true);
  }, []);
  
  // Flip between images
  const flipImage = useCallback(() => {
    setShowLeftImage((prev) => !prev);
  }, []);

  // Double click handler for fullscreen
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const clickPosition = x / rect.width;
    
    // If clicked on left side, show left image, otherwise right
    if (clickPosition < sliderPosition) {
      setFullscreenImage('left');
    } else {
      setFullscreenImage('right');
    }
  }, [sliderPosition]);

  const updatePosition = useCallback((clientX: number) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    });
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX);
    
    if (sliderHandleRef.current) {
      sliderHandleRef.current.setPointerCapture(e.pointerId);
    }
  }, [updatePosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    updatePosition(e.clientX);
  }, [isDragging, updatePosition]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false);
    
    if (sliderHandleRef.current) {
      sliderHandleRef.current.releasePointerCapture(e.pointerId);
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 5;
    
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        setSliderPosition(prev => Math.max(0, prev - step));
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        setSliderPosition(prev => Math.min(100, prev + step));
        break;
      case 'Home':
        e.preventDefault();
        setSliderPosition(0);
        break;
      case 'End':
        e.preventDefault();
        setSliderPosition(100);
        break;
    }
  }, []);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Handle global pointer up for safety
  useEffect(() => {
    if (!isDragging) return;
    
    const handleGlobalPointerUp = () => {
      setIsDragging(false);
    };
    
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);
    
    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [isDragging]);

  // Prevent context menu during drag
  useEffect(() => {
    if (!isDragging) return;
    
    const preventContextMenu = (e: Event) => e.preventDefault();
    window.addEventListener('contextmenu', preventContextMenu);
    
    return () => {
      window.removeEventListener('contextmenu', preventContextMenu);
    };
  }, [isDragging]);
  
  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      // Space to flip images when in flip mode
      if (e.key === ' ' && isFlipMode) {
        e.preventDefault();
        flipImage();
      }
    };
    
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isFlipMode, flipImage]);

  const handleLeftImageLoad = () => {
    setLeftImageLoaded(true);
    setLeftImageError(false);
  };

  const handleRightImageLoad = () => {
    setRightImageLoaded(true);
    setRightImageError(false);
  };

  const handleLeftImageError = () => {
    setLeftImageError(true);
    setLeftImageLoaded(true);
  };

  const handleRightImageError = () => {
    setRightImageError(true);
    setRightImageLoaded(true);
  };

  // Get current fullscreen image data
  const getFullscreenData = () => {
    if (fullscreenImage === 'left') {
      return { url: leftImage, label: leftLabel };
    } else if (fullscreenImage === 'right') {
      return { url: rightImage, label: rightLabel };
    }
    return null;
  };

  const switchFullscreenImage = () => {
    setFullscreenImage(prev => prev === 'left' ? 'right' : 'left');
  };

  return (
    <>
      {/* Fullscreen Modal */}
      {fullscreenImage && (
        <FullscreenModal
          image={getFullscreenData()!.url}
          label={getFullscreenData()!.label}
          onClose={() => setFullscreenImage(null)}
          onSwitch={switchFullscreenImage}
          showSwitchButton={true}
        />
      )}
      
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-lg bg-gray-900 select-none group ${className}`}
        style={{ aspectRatio: '16/9' }}
        onDoubleClick={!isFlipMode ? handleDoubleClick : undefined}
      >
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-30">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-gray-600 border-t-white rounded-full animate-spin" />
              <span className="text-gray-400 text-sm">Loading images...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-30">
            <div className="flex flex-col items-center gap-2 text-center p-4">
              <svg
                className="w-12 h-12 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-400 text-sm">
                Failed to load image{leftImageError && rightImageError ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Flip Mode - Single Image View */}
        {isFlipMode ? (
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={flipImage}
          >
            <img
              src={showLeftImage ? leftImage : rightImage}
              alt={showLeftImage ? leftLabel : rightLabel}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ) : (
          <>
            {/* Slider Mode */}
            {/* Right Image (bottom layer) */}
            <img
              src={rightImage}
              alt={rightLabel}
              className="absolute inset-0 w-full h-full object-cover"
              onLoad={handleRightImageLoad}
              onError={handleRightImageError}
              draggable={false}
            />

            {/* Left Image (top layer, clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={leftImage}
                alt={leftLabel}
                className="absolute inset-0 w-full h-full object-cover"
                onLoad={handleLeftImageLoad}
                onError={handleLeftImageError}
                draggable={false}
              />
            </div>

            {/* Slider Handle */}
            <div
              ref={sliderHandleRef}
              role="slider"
              tabIndex={0}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(sliderPosition)}
              aria-label="Image comparison slider"
              className={`absolute top-0 bottom-0 w-1 cursor-ew-resize transform -translate-x-1/2 focus:outline-none z-20 ${
                isDragging ? 'touch-none' : ''
              }`}
              style={{ left: `${sliderPosition}%` }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onKeyDown={handleKeyDown}
            >
              {/* Slider Line */}
              <div className="absolute inset-y-0 left-1/2 w-1 bg-white shadow-lg transform -translate-x-1/2">
                <div className="absolute inset-y-0 -left-3 w-3 bg-gradient-to-r from-black/30 to-transparent" />
                <div className="absolute inset-y-0 left-1 w-3 bg-gradient-to-l from-black/30 to-transparent" />
              </div>

              {/* Circular Handle */}
              <div
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                  w-10 h-10 rounded-full bg-white shadow-lg
                  flex items-center justify-center gap-0.5
                  transition-transform duration-150 ease-out
                  ${isDragging ? 'scale-110' : 'hover:scale-105'}
                  focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900`}
              >
                <svg className="w-3 h-3 text-gray-600 -mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <svg className="w-3 h-3 text-gray-600 -ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </>
        )}

        {/* Labels */}
        {!isLoading && !hasError && (
          <>
            <div
              className="absolute top-4 left-4 z-10 transition-opacity duration-200"
              style={{ opacity: (isFlipMode ? showLeftImage : sliderPosition > 15) ? 1 : 0 }}
            >
              <span className="px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-sm font-medium rounded-md">
                {leftLabel}
              </span>
            </div>

            <div
              className="absolute top-4 right-4 z-10 transition-opacity duration-200"
              style={{ opacity: (isFlipMode ? !showLeftImage : sliderPosition < 85) ? 1 : 0 }}
            >
              <span className="px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-sm font-medium rounded-md">
                {rightLabel}
              </span>
            </div>
          </>
        )}

        {/* Control Buttons - Only show on hover */}
        {!isLoading && !hasError && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
            <button
              onClick={toggleFlipMode}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-black/70 backdrop-blur-sm text-white hover:bg-black/80 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              {isFlipMode ? 'Slider Mode' : 'Quick Flip'}
            </button>
            
            {!isFlipMode && (
              <button
                onClick={() => setFullscreenImage('right')}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-black/70 backdrop-blur-sm text-white hover:bg-black/80 transition-all flex items-center gap-2"
                title="Fullscreen"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                Fullscreen
              </button>
            )}
          </div>
        )}

        {/* Bottom hint - Only show on hover */}
        {!isLoading && !hasError && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="px-3 py-1.5 bg-black/50 backdrop-blur-sm text-gray-300 text-xs rounded-md whitespace-nowrap">
              {isFlipMode 
                ? 'Click or Space to flip'
                : 'Drag slider to compare • Double-click or button to zoom'
              }
            </span>
          </div>
        )}
      </div>
    </>
  );
}
