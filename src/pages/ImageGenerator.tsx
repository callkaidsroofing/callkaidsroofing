import { useState, useRef } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const defaultConfig = {
  project_title: "Berwick Tile Roof Restoration",
  tagline: "Proof In Every Roof",
  phone_number: "0435 900 709",
  website: "callkaidsroofing.com.au",
  warranty_text: "15-YEAR WORKMANSHIP WARRANTY",
};

export default function ImageGenerator() {
  const [config, setConfig] = useState(defaultConfig);
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'before' | 'after'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'before') {
          setBeforeImage(result);
        } else {
          setAfterImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = (format: 'png' | 'jpg') => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1080;

    // Fill background
    ctx.fillStyle = '#F7F8FA';
    ctx.fillRect(0, 0, 1080, 1080);

    let imagesToLoad = 0;
    let imagesLoaded = 0;

    const checkComplete = () => {
      if (imagesLoaded === imagesToLoad) {
        // Draw divider line
        ctx.fillStyle = '#007ACC';
        ctx.fillRect(538, 0, 4, 1080);

        // Draw overlays
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, 540, 1080);
        ctx.fillRect(540, 0, 540, 1080);

        // Setup text styling
        ctx.fillStyle = 'white';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Draw BEFORE/AFTER labels
        ctx.font = 'bold 32px Montserrat, sans-serif';
        ctx.fillText('BEFORE', 20, 52);
        ctx.fillText('AFTER', 560, 52);

        // Draw project title
        ctx.font = '600 28px Montserrat, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(config.project_title, 540, 960);

        // Draw tagline
        ctx.font = '500 24px Montserrat, sans-serif';
        ctx.fillText(config.tagline, 540, 1000);

        // Draw CTA
        ctx.font = '500 16px Montserrat, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(config.phone_number, 1060, 1040);
        ctx.fillText(config.website, 1060, 1060);

        // Draw warranty badge
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#007ACC';
        ctx.fillRect(900, 20, 160, 32);
        ctx.fillStyle = 'white';
        ctx.font = '600 14px Montserrat, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(config.warranty_text, 980, 40);

        // Download
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        link.download = `CKR_BeforeAfter_${timestamp}.${format}`;
        link.href = format === 'png' 
          ? canvas.toDataURL('image/png')
          : canvas.toDataURL('image/jpeg', 0.95);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    // Load before image
    if (beforeImage) {
      imagesToLoad++;
      const img1 = new Image();
      img1.onload = () => {
        ctx.drawImage(img1, 0, 0, 540, 1080);
        imagesLoaded++;
        checkComplete();
      };
      img1.src = beforeImage;
    }

    // Load after image
    if (afterImage) {
      imagesToLoad++;
      const img2 = new Image();
      img2.onload = () => {
        ctx.drawImage(img2, 540, 0, 540, 1080);
        imagesLoaded++;
        checkComplete();
      };
      img2.src = afterImage;
    }

    if (imagesToLoad === 0) {
      checkComplete();
    }
  };

  return (
    <AuthGuard requireInspector>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Before & After Generator</h1>
          <p className="text-muted-foreground">Create branded before/after images for social media</p>
        </div>

        {/* Canvas Preview */}
        <div 
          className="w-full max-w-[600px] mx-auto aspect-square bg-muted/30 rounded-lg shadow-2xl overflow-hidden relative"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          <div className="grid grid-cols-2 h-full">
            {/* Before Photo */}
            <div
              className={`relative cursor-pointer transition-all ${
                beforeImage ? '' : 'bg-muted/50 border-2 border-dashed border-muted-foreground/25 hover:border-primary'
              }`}
              style={beforeImage ? { backgroundImage: `url(${beforeImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              onClick={() => beforeInputRef.current?.click()}
            >
              {!beforeImage && (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <svg className="w-12 h-12 text-muted-foreground mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs font-semibold text-center">BEFORE photo</p>
                </div>
              )}
              {beforeImage && (
                <div className="absolute inset-0 bg-black/40 flex items-start justify-start p-3">
                  <div className="text-white font-bold text-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                    BEFORE
                  </div>
                </div>
              )}
            </div>

            {/* After Photo */}
            <div
              className={`relative cursor-pointer transition-all ${
                afterImage ? '' : 'bg-muted/50 border-2 border-dashed border-muted-foreground/25 hover:border-primary'
              }`}
              style={afterImage ? { backgroundImage: `url(${afterImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              onClick={() => afterInputRef.current?.click()}
            >
              {!afterImage && (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <svg className="w-12 h-12 text-muted-foreground mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs font-semibold text-center">AFTER photo</p>
                </div>
              )}
              {afterImage && (
                <div className="absolute inset-0 bg-black/40 flex items-start justify-start p-3">
                  <div className="text-white font-bold text-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                    AFTER
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Divider Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-primary -translate-x-1/2 z-10" />

          {/* Warranty Badge */}
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1.5 rounded text-[10px] font-semibold z-20">
            {config.warranty_text}
          </div>

          {/* Project Title */}
          <div 
            className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white font-semibold text-sm text-center z-20"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
          >
            {config.project_title}
          </div>

          {/* Tagline */}
          <div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white font-medium text-xs text-center z-20"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
          >
            {config.tagline}
          </div>

          {/* CTA */}
          <div 
            className="absolute bottom-3 right-3 text-white font-medium text-[10px] text-right z-20"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
          >
            <div>{config.phone_number}</div>
            <div>{config.website}</div>
          </div>
        </div>

        <input
          ref={beforeInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload(e, 'before')}
        />
        <input
          ref={afterInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload(e, 'after')}
        />

        {/* Controls */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Customization</h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="project_title">Project Title</Label>
              <Input
                id="project_title"
                value={config.project_title}
                onChange={(e) => setConfig({ ...config, project_title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={config.tagline}
                onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={config.phone_number}
                onChange={(e) => setConfig({ ...config, phone_number: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={config.website}
                onChange={(e) => setConfig({ ...config, website: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="warranty">Warranty Text</Label>
              <Input
                id="warranty"
                value={config.warranty_text}
                onChange={(e) => setConfig({ ...config, warranty_text: e.target.value })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-2">📋 CKR Brand Compliance</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ 1080×1080px (Meta Feed Standard)</li>
                <li>✅ Official CKR Color Palette</li>
                <li>✅ Montserrat Font Family</li>
                <li>✅ 4px #007ACC Divider Line</li>
                <li>✅ Warranty Badge Placement</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📸 Photo Requirements</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Same angle & position for both photos</li>
                <li>• Similar daylight conditions</li>
                <li>• Remove debris before AFTER shot</li>
                <li>• 3000px minimum width (raw)</li>
                <li>• No filters or color grading</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={() => downloadImage('png')}>
              📥 Download PNG (1080×1080)
            </Button>
            <Button onClick={() => downloadImage('jpg')} variant="outline">
              📥 Download JPG (95% Quality)
            </Button>
          </div>
          
          <p className="text-center text-muted-foreground mt-3 text-sm">
            Ready for Meta Feed • ≤1MB file size • CKR Brand Compliant
          </p>
        </Card>
      </div>
    </AuthGuard>
  );
}
