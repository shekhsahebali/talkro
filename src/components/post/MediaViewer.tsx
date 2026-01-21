'use client';
import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Share2, Heart, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
interface MediaViewerProps {
  images: string[];
  startIndex: number;
  onClose: () => void;
}

const MediaViewer = ({ images, startIndex, onClose }: MediaViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="fixed inset-0 z-[200] bg-foreground/10 backdrop-blur flex items-center justify-center animate-in fade-in duration-300">
      <div className="absolute top-6 right-6 z-50 flex items-center space-x-4">
        {/* <Button variant="ghost" size="icon" className="rounded-full bg-background/40 hover:bg-background/60 text-foreground">
          <Share2 className="w-5 h-5" />
        </Button> */}
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full bg-background/40 hover:bg-background/60 text-foreground">
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="relative w-full h-full flex items-center justify-center p-4">
        <Image fill priority
          src={images[currentIndex]} 
          alt="Immersive View" 
          className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-300" 
        />

        {images.length > 1 && (
          <>
            <button 
              onClick={prev}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-background/40 hover:bg-background/60 text-foreground transition-all hover:scale-110"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
              onClick={next}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-background/40 hover:bg-background/60 text-foreground transition-all hover:scale-110"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-8 bg-background/10 backdrop-blur-md px-8 py-4 rounded-full border border-border/10">
        <div className="flex items-center space-x-2 text-white">
          <Heart className="w-6 h-6" />
          <span className="font-bold">1.2K</span>
        </div>
        <div className="flex items-center space-x-2 text-white">
          <MessageSquare className="w-6 h-6" />
          <span className="font-bold">245</span>
        </div>
        {images.length > 1 && (
          <div className="text-white/60 font-bold tracking-widest text-sm border-l border-white/20 pl-8">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaViewer;
