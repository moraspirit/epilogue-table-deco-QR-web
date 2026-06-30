import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId } from './types';
import AmbientWaves from './components/AmbientWaves';
import ScreenArrival from './components/ScreenArrival';
import ScreenArtists from './components/ScreenArtists';
import ScreenDetails from './components/ScreenDetails';
import ScreenCreative from './components/ScreenCreative';
import ScreenTeaser from './components/ScreenTeaser';
import ScreenHub from './components/ScreenHub';
export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('arrival');
  const [synthEnabled, setSynthEnabled] = useState(false);

  // Smooth, continuous video-like sequence without dropping to black
  useEffect(() => {
    const sequence = [
      { id: 'arrival', duration: 7000 },
      { id: 'artists', duration: 4500 },
      { id: 'details', duration: 4500 },
      { id: 'creative', duration: 4500 },
      { id: 'teaser', duration: 5500 },
    ];
    
    let timeout: NodeJS.Timeout;
    
    const runSequence = () => {
      const idx = sequence.findIndex(s => s.id === currentScreen);
      if (idx !== -1 && idx < sequence.length - 1) {
        timeout = setTimeout(() => {
          setCurrentScreen(sequence[idx + 1].id as ScreenId);
        }, sequence[idx].duration);
      } else if (idx === sequence.length - 1) {
        timeout = setTimeout(() => {
          setCurrentScreen('hub');
        }, sequence[idx].duration);
      }
    };
    
    runSequence();
    return () => clearTimeout(timeout);
  }, [currentScreen]);

  // Rendering screen with continuous overlapping transition
  const renderScreenContent = (screenId: string) => {
    switch (screenId) {
      case 'arrival': return <ScreenArrival />;
      case 'artists': return <ScreenArtists />;
      case 'details': return <ScreenDetails />;
      case 'creative': return <ScreenCreative />;
      case 'teaser': return <ScreenTeaser />;
      case 'hub': return <ScreenHub />;
      default: return null;
    }
  };

  return (
    <div className="w-full h-full relative overflow-auto bg-dark-bg text-slate-100 font-sans flex flex-col justify-between">
      
      {/* Persistent Visualizer Background */}
      <AmbientWaves
        intensity={currentScreen === 'hub' ? 1 : currentScreen === 'teaser' ? 3.5 : 2}
        particlesEnabled={currentScreen !== 'hub'}
        synthEnabled={synthEnabled}
        setSynthEnabled={setSynthEnabled}
      />

      <div className="absolute inset-0 pointer-events-none select-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(3,1,11,0.55))] z-20" />

      {/* Screen Router Grid with Absolute Overlapping Video-like Crossfades */}
      {/* Notice mode="wait" is intentionally omitted to allow simultaneous fade-in/out */}
      <div className="w-full h-full relative flex-1 z-30">
        <AnimatePresence>
          {['arrival', 'artists', 'details', 'creative', 'teaser', 'hub'].map((screenId) => (
             currentScreen === screenId && (
              <motion.div
                key={screenId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                {renderScreenContent(screenId)}
              </motion.div>
             )
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
