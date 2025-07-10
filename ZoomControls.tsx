
import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, Fullscreen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToCanvas: () => void;
  onToggleFullscreen: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onFitToCanvas,
  onToggleFullscreen,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={onZoomOut} variant="outline" size="sm">
        <ZoomOut className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium min-w-[60px] text-center">
        {Math.round(zoom * 100)}%
      </span>
      <Button onClick={onZoomIn} variant="outline" size="sm">
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button onClick={onFitToCanvas} variant="outline" size="sm">
        <Maximize2 className="h-4 w-4" />
      </Button>
      <Button onClick={onToggleFullscreen} variant="outline" size="sm">
        <Fullscreen className="h-4 w-4" />
      </Button>
    </div>
  );
};
