import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AudioContext } from '@/contexts/AudioContext';

interface AudioWrapperProps {
  children: any;
}

const AudioWrapper: React.FC<AudioWrapperProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<any>(null);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      if (isMuted && !prev) {
        setIsMuted(false);
      }

      return !prev;
    });
  }, [isMuted]);

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return useMemo(
    () => (
      <AudioContext.Provider value={{
        volume,
        setVolume,
        handleToggleMute,
        handleTogglePlay,
        muted: isMuted,
        isPlaying,
      }}
      >
        <audio ref={audioRef} loop muted={isMuted} preload="auto">
          <source
            src="https://res.cloudinary.com/thecodingpanda/video/upload/v1690269177/y2mate.com_-_Quiz_Background_Music_4_No_Copyright_dmbz3j.mp3"
            type="audio/mpeg"
          />
          <track kind="captions" label="English Captions" srcLang="en" default />
          Your browser does not support the audio element.
        </audio>

        {children}
      </AudioContext.Provider>
    ),
    [children, handleTogglePlay, isMuted, isPlaying, volume],
  );
};

export default AudioWrapper;
