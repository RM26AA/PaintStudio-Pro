
import React, { useState } from 'react';
import { Download, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface SaveOptionsProps {
  onSave: (format: string) => void;
}

const saveFormats = [
  { format: 'jpeg', label: 'JPEG (.jpg)', quality: 0.9 },
  { format: 'png', label: 'PNG (.png)', quality: 1 },
  { format: 'webp', label: 'WebP (.webp)', quality: 0.9 },
  { format: 'bmp', label: 'BMP (.bmp)', quality: 1 },
];

export const SaveOptions: React.FC<SaveOptionsProps> = ({ onSave }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 text-green-600 hover:text-green-700">
          <Download className="h-4 w-4" />
          Save As
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {saveFormats.map((format) => (
          <DropdownMenuItem key={format.format} onClick={() => onSave(format.format)}>
            {format.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
