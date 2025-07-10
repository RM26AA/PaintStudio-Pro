
import React from 'react';
import { Grid3X3, Ruler, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewOptionsProps {
  showGrid: boolean;
  showRulers: boolean;
  showStatusBar: boolean;
  onToggleGrid: () => void;
  onToggleRulers: () => void;
  onToggleStatusBar: () => void;
}

export const ViewOptions: React.FC<ViewOptionsProps> = ({
  showGrid,
  showRulers,
  showStatusBar,
  onToggleGrid,
  onToggleRulers,
  onToggleStatusBar,
}) => {
  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">View Options</h3>
      <Button
        onClick={onToggleGrid}
        variant={showGrid ? "default" : "ghost"}
        size="sm"
        className="justify-start w-full"
      >
        <Grid3X3 className="h-4 w-4 mr-2" />
        Grid
      </Button>
      <Button
        onClick={onToggleRulers}
        variant={showRulers ? "default" : "ghost"}
        size="sm"
        className="justify-start w-full"
      >
        <Ruler className="h-4 w-4 mr-2" />
        Rulers
      </Button>
      <Button
        onClick={onToggleStatusBar}
        variant={showStatusBar ? "default" : "ghost"}
        size="sm"
        className="justify-start w-full"
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        Status Bar
      </Button>
    </div>
  );
};
