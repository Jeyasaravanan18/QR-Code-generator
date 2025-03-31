import React, { useState, useRef } from 'react';
import { QRCode } from 'react-qr-code';
import './Qrcss.css';

const Qrcode = () => {
  const [input, setInput] = useState({
    url: '',
    name: '',
    color: '#000000',
    bgColor: '#ffffff',
    size: 200
  });
  const [error, setError] = useState('');
  const qrRef = useRef(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInput(prev => ({ ...prev, [id]: value }));
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const downloadQR = () => {
    if (!input.url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(input.url)) {
      setError('Please include http:// or https://');
      return;
    }

    setError('');
    
    try {
      const svg = qrRef.current?.querySelector('svg');
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const png = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = input.name 
          ? `${input.name.replace(/\s+/g, '_')}.png` 
          : `qr_${Date.now()}.png`;
        link.href = png;
        link.click();
      };

      img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
    } catch (err) {
      console.error('Download failed:', err);
      setError('Failed to generate download');
    }
  };

  return (
    <div className="qr-container">
      <h1 className="qr-title">QR Code Generator</h1>
      
      <div className="qr-generator">
        <div className="qr-controls">
          <div className="input-group">
            <label htmlFor="url">Website URL*</label>
            <input
              type="url"
              id="url"
              value={input.url}
              onChange={handleInputChange}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="name">Custom Name</label>
            <input
              type="text"
              id="name"
              value={input.name}
              onChange={handleInputChange}
              placeholder="MyQRCode"
            />
          </div>

          <div className="customization-group">
            <div className="color-picker">
              <label>QR Color</label>
              <input
                type="color"
                id="color"
                value={input.color}
                onChange={handleInputChange}
              />
            </div>

            <div className="color-picker">
              <label>Background</label>
              <input
                type="color"
                id="bgColor"
                value={input.bgColor}
                onChange={handleInputChange}
              />
            </div>

            <div className="size-control">
              <label>Size: {input.size}px</label>
              <input
                type="range"
                id="size"
                min="100"
                max="500"
                value={input.size}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            onClick={downloadQR}
            className="download-btn"
            disabled={!input.url.trim()}
          >
            Download QR Code
          </button>
        </div>

        <div className="qr-preview">
          <div ref={qrRef} className="qr-display">
            {input.url && validateUrl(input.url) ? (
              <QRCode
                value={input.url}
                size={input.size}
                fgColor={input.color}
                bgColor={input.bgColor}
                level="Q"
              />
            ) : (
              <div className="placeholder">
                {error || 'Preview will appear here'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Qrcode;