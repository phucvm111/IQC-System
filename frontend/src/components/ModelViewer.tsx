import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Stage, Grid } from '@react-three/drei';

interface ModelViewerProps {
  modelUrl: string;
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-white whitespace-nowrap bg-gray-900/50 px-3 py-1 rounded-full backdrop-blur">
          Loading 3D Model...
        </p>
      </div>
    </Html>
  );
}

import React from 'react';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div className="flex flex-col items-center gap-3">
            <div className="text-red-500 bg-red-100/90 px-4 py-2 rounded-lg font-medium whitespace-nowrap shadow-lg backdrop-blur">
              Failed to load 3D Model (Invalid or unsupported GLB file)
            </div>
          </div>
        </Html>
      );
    }
    return this.props.children;
  }
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function ModelViewer({ modelUrl }: ModelViewerProps) {
  const controlsRef = useRef<any>(null);

  return (
    <div className="w-full h-full min-h-[500px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl relative group">
      <div className="absolute inset-0">
        <Canvas shadows camera={{ position: [4, 4, 4], fov: 50 }}>
        <Suspense fallback={<Loader />}>
          <Stage 
            environment="city" 
            intensity={0.6} 
            controls={controlsRef} 
            preset="rembrandt"
            adjustCamera={1.2}
          >
            <ErrorBoundary>
              {modelUrl ? <Model url={modelUrl} /> : null}
            </ErrorBoundary>
          </Stage>
          
          <Grid 
            infiniteGrid 
            fadeDistance={20} 
            sectionColor="#4b5563" 
            cellColor="#374151" 
            position={[0, -0.01, 0]} 
          />
          
          <OrbitControls 
            ref={controlsRef}
            makeDefault 
            autoRotate 
            autoRotateSpeed={0.5} 
            enablePan={true} 
            enableZoom={true} 
            zoomSpeed={1.5}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2 + 0.1}
          />
        </Suspense>
        </Canvas>
      </div>
      
      {/* Overlay UI */}
      <div className="absolute top-4 left-4 bg-gray-900/70 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-gray-700">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          CAD Viewer
        </h3>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-gray-900/70 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-medium text-gray-300 border border-gray-700">
          Scroll to zoom • Drag to rotate
        </div>
      </div>
    </div>
  );
}
