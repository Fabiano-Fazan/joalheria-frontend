import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn } from 'lucide-react';

type ZoomableImageProps = {
  src: string;
  alt: string;
  className?: string;
  onZoomChange?: (isZooming: boolean) => void;
};

export function ZoomableImage({ src, alt, className = '', onZoomChange }: ZoomableImageProps) {
  const [isZooming, setIsZooming] = useState(false);
  const [isMobileZooming, setIsMobileZooming] = useState(false);
  const [mobileFrameStyle, setMobileFrameStyle] = useState<React.CSSProperties>({});
  const [canUseHoverZoom, setCanUseHoverZoom] = useState(false);
  const imgRef = useRef<HTMLDivElement | null>(null);
  const mobileZoomImageRef = useRef<HTMLImageElement | null>(null);
  const mobileZoomFrameRef = useRef<number | null>(null);
  const mobilePointerRef = useRef({ x: 50, y: 50 });

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updateZoomMode = () => setCanUseHoverZoom(query.matches);
    updateZoomMode();
    query.addEventListener?.('change', updateZoomMode);
    return () => query.removeEventListener?.('change', updateZoomMode);
  }, []);

  const updateMobileZoomOrigin = () => {
    mobileZoomFrameRef.current = null;
    const image = mobileZoomImageRef.current;
    if (!image) return;

    const rect = image.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((mobilePointerRef.current.x - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((mobilePointerRef.current.y - rect.top) / rect.height) * 100));
    image.style.transformOrigin = `${x}% ${y}%`;
  };

  const scheduleMobileZoomUpdate = () => {
    if (mobileZoomFrameRef.current !== null) return;
    mobileZoomFrameRef.current = window.requestAnimationFrame(updateMobileZoomOrigin);
  };

  const buildMobileFrameStyle = () => {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return {};

    const padding = 12;
    const targetWidth = Math.min(rect.width * 1.42, window.innerWidth - padding * 2);
    const targetHeight = Math.min(rect.height * 1.42, window.innerHeight - padding * 2);
    const left = Math.max(padding, Math.min(window.innerWidth - targetWidth - padding, rect.left + rect.width / 2 - targetWidth / 2));
    const top = Math.max(padding, Math.min(window.innerHeight - targetHeight - padding, rect.top + rect.height / 2 - targetHeight / 2));

    return {
      width: `${targetWidth}px`,
      height: `${targetHeight}px`,
      left: `${left}px`,
      top: `${top}px`,
    };
  };

  useEffect(() => {
    onZoomChange?.(isZooming || isMobileZooming);
  }, [isZooming, isMobileZooming, onZoomChange]);

  useEffect(() => {
    if (!isMobileZooming) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handlePointerMove = (event: PointerEvent) => {
      event.preventDefault();
      mobilePointerRef.current = { x: event.clientX, y: event.clientY };
      scheduleMobileZoomUpdate();
    };

    const closeZoom = () => setIsMobileZooming(false);

    scheduleMobileZoomUpdate();
    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', closeZoom);
    window.addEventListener('pointercancel', closeZoom);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', closeZoom);
      window.removeEventListener('pointercancel', closeZoom);
      if (mobileZoomFrameRef.current !== null) {
        window.cancelAnimationFrame(mobileZoomFrameRef.current);
        mobileZoomFrameRef.current = null;
      }
    };
  }, [isMobileZooming]);

  const openDesktopZoom = () => {
    if (!canUseHoverZoom) return;
    setIsZooming(true);
  };

  return (
    <>
      <div
        ref={imgRef}
        className={`relative group touch-none w-full h-full mobile-image-shine ${canUseHoverZoom ? '' : 'cursor-zoom-in'} ${className}`}
        onPointerDown={(event) => {
          if (canUseHoverZoom || event.pointerType === 'mouse') return;
          event.preventDefault();
          event.stopPropagation();
          mobilePointerRef.current = { x: event.clientX, y: event.clientY };
          setMobileFrameStyle(buildMobileFrameStyle());
          setIsMobileZooming(true);
        }}
        onClick={openDesktopZoom}
      >
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 rounded-lg"
          style={{ opacity: isZooming ? 0.3 : 1 }}
        />

      </div>

      {isZooming && createPortal(
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#1F2428]/70 p-6 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsZooming(false)}
        >
          <div className="relative flex max-h-[88vh] w-full max-w-5xl items-center justify-center rounded-3xl border border-white/35 bg-white p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <img src={src} alt={alt} className="max-h-[82vh] w-full object-contain" />
          </div>
        </div>,
        document.body,
      )}

      {isMobileZooming && createPortal(
        <div
          className="fixed inset-0 z-[120] bg-black/35 overflow-hidden mobile-zoom-backdrop"
          role="dialog"
          aria-modal="true"
        >
          <div className="mobile-finger-zoom-frame fixed overflow-hidden rounded-2xl border border-white/50 bg-white shadow-2xl" style={mobileFrameStyle}>
            <img
              ref={mobileZoomImageRef}
              src={src}
              alt={alt}
              className="mobile-finger-zoom-image absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
