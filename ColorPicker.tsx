
import React from 'react';
import { Button } from '@/components/ui/button';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const presetColors = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
  '#ffc0cb', '#a52a2a', '#808080', '#000080', '#008000',
  '#ff6347', '#4682b4', '#d2691e', '#9acd32', '#ff1493'
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange }) => {
  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Colors</h3>
      
      <div className="mb-3">
        <label className="block text-xs text-gray-600 mb-1">Custom Color</label>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-full h-8 border border-gray-300 rounded cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-5 gap-1">
        {presetColors.map((color) => (
          <Button
            key={color}
            onClick={() => onColorChange(color)}
            className={`w-8 h-8 p-0 border-2 ${
              selectedColor === color 
                ? 'border-gray-800 scale-110' 
                : 'border-gray-300 hover:border-gray-500'
            } transition-all duration-200`}
            style={{ backgroundColor: color }}
            variant="ghost"
          />
        ))}
      </div>

      <div className="mt-2 p-2 bg-white rounded border text-center">
        <div className="text-xs text-gray-600">Current</div>
        <div
          className="w-full h-6 border border-gray-300 rounded mt-1"
          style={{ backgroundColor: selectedColor }}
        />
      </div>
    </div>
  );
};
