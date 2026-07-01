import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
}

export default function QRScanner({ onScanSuccess }: QRScannerProps) {
  const onScanSuccessRef = useRef(onScanSuccess);

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
  }, [onScanSuccess]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    let isScanned = false;

    const onScan = (decodedText: string) => {
      if (isScanned) return;
      isScanned = true;
      // We don't call clear() here because parent will unmount this component,
      // which will trigger the cleanup function below automatically.
      onScanSuccessRef.current(decodedText);
    };

    scanner.render(onScan, () => {});

    return () => {
      try {
        scanner.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner.", error);
        });
      } catch (error) {
        console.error("Error during scanner cleanup", error);
      }
    };
  }, []); // Run only once on mount

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white w-full mx-auto">
      <h2 className="text-xl font-bold text-slate-800 mb-4 text-center flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect width="10" height="10" x="7" y="7" rx="1"/></svg>
        </span>
        Scan Product QR Code
      </h2>
      <div id="qr-reader" className="w-full overflow-hidden rounded-xl border-2 border-dashed border-blue-200"></div>
      <p className="text-sm text-slate-500 mt-4 text-center font-medium">
        Position the QR code inside the frame to scan.
      </p>
    </div>
  );
}
