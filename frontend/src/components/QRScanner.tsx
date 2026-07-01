import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
}

export default function QRScanner({ onScanSuccess }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    const onScan = (decodedText: string) => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
      onScanSuccess(decodedText);
    };

    const onScanFailure = (error: string) => {
      // Handle or ignore
    };

    scannerRef.current.render(onScan, onScanFailure);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg border border-gray-100 max-w-md w-full mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Scan Product QR Code</h2>
      <div id="qr-reader" className="w-full overflow-hidden rounded-lg border-2 border-dashed border-primary"></div>
      <p className="text-sm text-gray-500 mt-4 text-center">
        Position the QR code inside the frame to scan.
      </p>
    </div>
  );
}
