
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface BrushSizeProps {
  size: number;
  onSizeChange: (size: number) => void;
}

export const BrushSize: React.FC<BrushSizeProps> = ({ size, onSizeChange }) => {
  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Brush Size</h3>
      
      <div className="space-y-3">
        <Slider
          value={[size]}
          onValueChange={(value) => onSizeChange(value[0])}
          max={50}
          min={1}
          step={1}
          className="w-full"
        />
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Size: {size}px</span>
          <div
            className="rounded-full bg-gray-800 transition-all duration-200"
            style={{ 
              width: Math.max(size, 4), 
              height: Math.max(size, 4) 
            }}
          />
        </div>
      </div>
    </div>
  );
};
