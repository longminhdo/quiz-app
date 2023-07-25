import { createContext } from 'react';
import { Audio } from '@/types/audio';

export const AudioContext = createContext<Audio>({
  volume: 0.5,
  isPlaying: false,
  muted: true,
  setVolume: () => undefined,
  handleTogglePlay: () => undefined,
  handleToggleMute: () => undefined,
});
