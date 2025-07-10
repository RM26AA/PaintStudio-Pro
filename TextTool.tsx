
import React, { useState } from 'react';
import { Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TextToolProps {
  onAddText: (text: string, fontSize: number) => void;
}

export const TextTool: React.FC<TextToolProps> = ({ onAddText }) => {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [isOpen, setIsOpen] = useState(false);

  const handleAddText = () => {
    if (text.trim()) {
      onAddText(text, fontSize);
      setText('');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="justify-start w-full">
          <Type className="h-4 w-4 mr-2" />
          Text
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Text</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Enter text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Font size"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            min="8"
            max="72"
          />
          <Button onClick={handleAddText} className="w-full">
            Add Text
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
