import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  upiId: string;
  amount: number;
  merchantName?: string;
  className?: string;
}

export function QRCodeGenerator({ upiId, amount, merchantName = 'Sweet-Heaven', className = '' }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      // Create UPI payment URL
      const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Sweet-Heaven Order Payment')}`;
      
      QRCode.toCanvas(canvasRef.current, upiUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }, (error) => {
        if (error) {
          console.error('Error generating QR code:', error);
        }
      });
    }
  }, [upiId, amount, merchantName]);

  return (
    <div className={`flex flex-col items-center space-y-3 sm:space-y-4 ${className}`}>
      <canvas ref={canvasRef} className="border-2 border-gray-200 rounded-lg max-w-full h-auto" />
      <div className="text-center">
        <p className="text-xs sm:text-sm text-gray-600">Scan with any UPI app to pay</p>
        <p className="text-base sm:text-lg font-semibold text-gray-900">₹{amount.toFixed(2)}</p>
        <p className="text-xs text-gray-500 break-all">UPI ID: {upiId}</p>
      </div>
    </div>
  );
}