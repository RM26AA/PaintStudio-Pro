
import React from 'react';
import { 
  Brush, 
  Square, 
  Circle, 
  Minus, 
  Eraser, 
  Pencil, 
  PaintBucket, 
  Type,
  Triangle,
  Star,
  Heart,
  ZoomIn,
  Copy,
  Scissors,
  Clipboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextTool } from './TextTool';

interface ToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
  onAddText: (text: string, fontSize: number) => void;
  onPaste: () => void;
  onCopy: () => void;
  onCut: () => void;
}

const tools = [
  { id: 'brush', icon: Brush, label: 'Brush' },
  { id: 'pencil', icon: Pencil, label: 'Pencil' },
  { id: 'eraser', icon: Eraser, label: 'Eraser' },
  { id: 'paintbucket', icon: PaintBucket, label: 'Paint Bucket' },
  { id: 'magnifier', icon: ZoomIn, label: 'Magnifier' },
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'line', icon: Minus, label: 'Line' },
  { id: 'triangle', icon: Triangle, label: 'Triangle' },
  { id: 'star', icon: Star, label: 'Star' },
  { id: 'heart', icon: Heart, label: 'Heart' },
];

export const Toolbar: React.FC<ToolbarProps> = ({ 
  activeTool, 
  onToolChange, 
  onAddText,
  onPaste,
  onCopy,
  onCut
}) => {
  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Tools</h3>
      
      {/* Clipboard Tools */}
      <div className="flex flex-col gap-1 mb-2 pb-2 border-b">
        <Button
          onClick={onPaste}
          variant="ghost"
          size="sm"
          className="justify-start w-full"
        >
          <Clipboard className="h-4 w-4 mr-2" />
          Paste
        </Button>
        <Button
          onClick={onCopy}
          variant="ghost"
          size="sm"
          className="justify-start w-full"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
        <Button
          onClick={onCut}
          variant="ghost"
          size="sm"
          className="justify-start w-full"
        >
          <Scissors className="h-4 w-4 mr-2" />
          Cut
        </Button>
      </div>

      {/* Drawing Tools */}
      <div className="flex flex-col gap-1 mb-2 pb-2 border-b">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Button
              key={tool.id}
              onClick={() => onToolChange(tool.id)}
              variant={activeTool === tool.id ? "default" : "ghost"}
              size="sm"
              className="justify-start w-full"
            >
              <Icon className="h-4 w-4 mr-2" />
              {tool.label}
            </Button>
          );
        })}
      </div>

      {/* Text Tool */}
      <TextTool onAddText={onAddText} />
    </div>
  );
};
