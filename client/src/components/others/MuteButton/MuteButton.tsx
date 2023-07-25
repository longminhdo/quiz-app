import React from 'react';
import MyTextButton from '@/components/common/MyTextButton/MyTextButton';
import './MuteButton.scss';

interface MuteButtonProps {
  muted?: boolean;
  onClick?: any;
}

const MuteButton: React.FC<MuteButtonProps> = ({ muted = true, onClick }) => (
  <MyTextButton onClick={onClick}className="mute-button">
    {muted ? 'unmute' : 'mute'}
  </MyTextButton>
);

export default MuteButton;
