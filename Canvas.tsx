
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Undo2, Redo2, Trash2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SaveOptions } from './SaveOptions';
import { ZoomControls } from './ZoomControls';

interface Point {
  x: number;
  y: number;
}

interface CanvasProps {
  tool: string;
  color: string;
  brushSize: number;
  showGrid: boolean;
  showRulers: boolean;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ 
  tool, 
  color, 
  brushSize, 
  showGrid, 
  showRulers, 
  zoom, 
  onZoomChange 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<ImageData | null>(null);

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const downloadCanvas = (format: string = 'jpeg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    if (format !== 'png') {
      tempCtx.fillStyle = '#ffffff';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    }

    tempCtx.drawImage(canvas, 0, 0);

    const mimeType = format === 'jpeg' ? 'image/jpeg' :
                     format === 'png' ? 'image/png' :
                     format === 'webp' ? 'image/webp' :
                     format === 'bmp' ? 'image/bmp' : 'image/jpeg';

    tempCanvas.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `artwork-${new Date().getTime()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, mimeType, 0.9);
  };

  const printCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head><title>Print Canvas</title></head>
        <body style="margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh;">
          <img src="${canvas.toDataURL()}" style="max-width: 100%; max-height: 100%;" />
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handlePaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            const blob = await clipboardItem.getType(type);
            const img = new Image();
            img.onload = () => {
              const canvas = canvasRef.current;
              const ctx = canvas?.getContext('2d');
              if (!ctx) return;
              
              ctx.drawImage(img, 50, 50, img.width * 0.5, img.height * 0.5);
              saveState();
            };
            img.src = URL.createObjectURL(blob);
            break;
          }
        }
      }
    } catch (err) {
      console.log('Failed to read clipboard contents: ', err);
    }
  };

  const handleCopy = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
      } catch (err) {
        console.log('Failed to copy to clipboard: ', err);
      }
    });
  };

  const handleCut = () => {
    handleCopy();
    clearCanvas();
  };

  const addText = (text: string, fontSize: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.fillText(text, 100, 100);
    saveState();
  };

  const drawShape = (ctx: CanvasRenderingContext2D, shape: string, start: Point, end: Point) => {
    switch (shape) {
      case 'triangle':
        const centerX = (start.x + end.x) / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, start.y);
        ctx.lineTo(start.x, end.y);
        ctx.lineTo(end.x, end.y);
        ctx.closePath();
        ctx.stroke();
        break;
      case 'star':
        drawStar(ctx, start.x, start.y, Math.abs(end.x - start.x) / 2, 5);
        break;
      case 'heart':
        drawHeart(ctx, start.x, start.y, Math.abs(end.x - start.x));
        break;
    }
  };

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, points: number) => {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points;
      const r = i % 2 === 0 ? radius : radius / 2;
      const pointX = x + Math.cos(angle) * r;
      const pointY = y + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(pointX, pointY);
      else ctx.lineTo(pointX, pointY);
    }
    ctx.closePath();
    ctx.stroke();
  };

  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.stroke();
  };

  const fillArea = (ctx: CanvasRenderingContext2D, x: number, y: number, targetColor: Uint8ClampedArray, fillColor: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const stack = [[x, y]];
    const visited = new Set();

    const rgb = hexToRgb(fillColor);
    if (!rgb) return;

    while (stack.length > 0) {
      const [px, py] = stack.pop()!;
      const key = `${px},${py}`;
      
      if (visited.has(key) || px < 0 || py < 0 || px >= canvas.width || py >= canvas.height) continue;
      visited.add(key);

      const index = (py * canvas.width + px) * 4;
      const currentColor = [data[index], data[index + 1], data[index + 2], data[index + 3]];

      if (!colorsMatch(currentColor, targetColor)) continue;

      data[index] = rgb.r;
      data[index + 1] = rgb.g;
      data[index + 2] = rgb.b;
      data[index + 3] = 255;

      stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const colorsMatch = (a: number[], b: Uint8ClampedArray) => {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getMousePos(e);
    setIsDrawing(true);
    setLastPoint(point);
    setStartPoint(point);
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'paintbucket') {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const targetColor = new Uint8ClampedArray([
        imageData.data[(Math.floor(point.y) * canvas.width + Math.floor(point.x)) * 4],
        imageData.data[(Math.floor(point.y) * canvas.width + Math.floor(point.x)) * 4 + 1],
        imageData.data[(Math.floor(point.y) * canvas.width + Math.floor(point.x)) * 4 + 2],
        imageData.data[(Math.floor(point.y) * canvas.width + Math.floor(point.x)) * 4 + 3]
      ]);
      fillArea(ctx, Math.floor(point.x), Math.floor(point.y), targetColor, color);
      saveState();
      return;
    }

    if (tool === 'brush' || tool === 'pencil') {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    }

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const currentPoint = getMousePos(e);

    if (tool === 'brush' || tool === 'pencil' || tool === 'eraser') {
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
    }

    setLastPoint(currentPoint);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !startPoint || !lastPoint) return;

    ctx.globalCompositeOperation = 'source-over';

    if (tool === 'rectangle') {
      const width = lastPoint.x - startPoint.x;
      const height = lastPoint.y - startPoint.y;
      ctx.strokeRect(startPoint.x, startPoint.y, width, height);
    } else if (tool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(lastPoint.x - startPoint.x, 2) + Math.pow(lastPoint.y - startPoint.y, 2)
      );
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (tool === 'line') {
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(lastPoint.x, lastPoint.y);
      ctx.stroke();
    } else if (['triangle', 'star', 'heart'].includes(tool)) {
      drawShape(ctx, tool, startPoint, lastPoint);
    }

    setIsDrawing(false);
    setLastPoint(null);
    setStartPoint(null);
    saveState();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      const previousState = history[historyIndex - 1];
      ctx.putImageData(previousState, 0, 0);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      const nextState = history[historyIndex + 1];
      ctx.putImageData(nextState, 0, 0);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const zoomIn = () => onZoomChange(Math.min(zoom * 1.2, 5));
  const zoomOut = () => onZoomChange(Math.max(zoom * 0.8, 0.1));
  const fitToCanvas = () => onZoomChange(1);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    if (!showGrid) return;
    
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    
    for (let x = 0; x < 800; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 600);
      ctx.stroke();
    }
    
    for (let y = 0; y < 600; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(800, y);
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx);
    saveState();
  }, [showGrid]);

  return (
    <div ref={containerRef} className="flex flex-col gap-4">
      <div className="flex gap-2 items-center justify-between flex-wrap">
        <div className="flex gap-2">
          <Button
            onClick={undo}
            disabled={historyIndex <= 0}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Undo2 className="h-4 w-4" />
            Undo
          </Button>
          <Button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Redo2 className="h-4 w-4" />
            Redo
          </Button>
          <Button
            onClick={clearCanvas}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </div>

        <ZoomControls
          zoom={zoom}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onFitToCanvas={fitToCanvas}
          onToggleFullscreen={toggleFullscreen}
        />

        <div className="flex gap-2">
          <SaveOptions onSave={downloadCanvas} />
          <Button
            onClick={printCanvas}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>
      
      <div className="border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden bg-white">
        {showRulers && (
          <div className="flex">
            <div className="w-6 h-6 bg-gray-100"></div>
            <div className="flex-1 h-6 bg-gray-100 border-b border-gray-300"></div>
          </div>
        )}
        <div className="flex">
          {showRulers && (
            <div className="w-6 bg-gray-100 border-r border-gray-300"></div>
          )}
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="cursor-crosshair block"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>
    </div>
  );
};
