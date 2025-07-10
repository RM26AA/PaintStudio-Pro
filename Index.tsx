
import React, { useState } from 'react';
import { Canvas } from '@/components/Canvas';
import { Toolbar } from '@/components/Toolbar';
import { ColorPicker } from '@/components/ColorPicker';
import { BrushSize } from '@/components/BrushSize';
import { ViewOptions } from '@/components/ViewOptions';
import { Palette } from 'lucide-react';

const Index = () => {
  const [activeTool, setActiveTool] = useState('brush');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [showGrid, setShowGrid] = useState(false);
  const [showRulers, setShowRulers] = useState(false);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [zoom, setZoom] = useState(1);

  const handlePaste = async () => {
    // This will be handled by the Canvas component
  };

  const handleCopy = () => {
    // This will be handled by the Canvas component
  };

  const handleCut = () => {
    // This will be handled by the Canvas component
  };

  const handleAddText = (text: string, fontSize: number) => {
    // This will be handled by the Canvas component
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Paint Studio Pro</h1>
              <p className="text-gray-600">Professional digital artwork creation</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="flex flex-col gap-4 w-64">
            <Toolbar 
              activeTool={activeTool} 
              onToolChange={setActiveTool}
              onAddText={handleAddText}
              onPaste={handlePaste}
              onCopy={handleCopy}
              onCut={handleCut}
            />
            <ColorPicker selectedColor={selectedColor} onColorChange={setSelectedColor} />
            <BrushSize size={brushSize} onSizeChange={setBrushSize} />
            <ViewOptions
              showGrid={showGrid}
              showRulers={showRulers}
              showStatusBar={showStatusBar}
              onToggleGrid={() => setShowGrid(!showGrid)}
              onToggleRulers={() => setShowRulers(!showRulers)}
              onToggleStatusBar={() => setShowStatusBar(!showStatusBar)}
            />
          </div>

          {/* Canvas Area */}
          <div className="flex-1">
            <Canvas 
              tool={activeTool} 
              color={selectedColor} 
              brushSize={brushSize}
              showGrid={showGrid}
              showRulers={showRulers}
              zoom={zoom}
              onZoomChange={setZoom}
            />
          </div>
        </div>

        {/* Status Bar */}
        {showStatusBar && (
          <div className="mt-6 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>Tool: {activeTool}</span>
                <span>Color: {selectedColor}</span>
                <span>Brush Size: {brushSize}px</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Zoom: {Math.round(zoom * 100)}%</span>
                <span>Canvas: 800x600</span>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Enhanced Features:</h3>
          <ul className="text-sm text-gray-600 space-y-1 grid grid-cols-2 gap-x-4">
            <li>• Paste images from clipboard</li>
            <li>• Multiple drawing tools and shapes</li>
            <li>• Text insertion with custom fonts</li>
            <li>• Paint bucket fill tool</li>
            <li>• Eraser and pencil tools</li>
            <li>• Zoom in/out and fit to canvas</li>
            <li>• Copy, cut, and paste functions</li>
            <li>• Multiple save formats (JPEG, PNG, WebP, BMP)</li>
            <li>• Print functionality</li>
            <li>• Grid and ruler overlays</li>
            <li>• Fullscreen mode</li>
            <li>• Professional status bar</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Index;
