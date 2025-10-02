'use client';

interface ItemImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ItemImage({src, alt, className = ''}: ItemImageProps) {
  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className={className}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const placeholder = target.parentElement?.querySelector('.placeholder') as HTMLElement;
          if (placeholder) placeholder.style.display = 'flex';
        }}
      />
      <div className="placeholder absolute inset-0 bg-stone-100 flex items-center justify-center text-stone-400 text-xs font-medium"
           style={{ display: 'none' }}>
        {alt}
      </div>
    </div>
  );
}
