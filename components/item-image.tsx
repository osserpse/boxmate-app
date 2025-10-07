'use client';

import Image from 'next/image';

interface ItemImageProps {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function ItemImage({src, alt, className = '', priority = false}: ItemImageProps) {
  return (
    <div className="relative w-full h-full">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          className={className}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const placeholder = target.parentElement?.querySelector('.placeholder') as HTMLElement;
            if (placeholder) placeholder.style.display = 'flex';
          }}
        />
      ) : null}
      <div className="placeholder absolute inset-0 bg-secondary flex items-center justify-center text-muted-foreground text-xs font-medium"
           style={{ display: src ? 'none' : 'flex' }}>
        {alt}
      </div>
    </div>
  );
}
