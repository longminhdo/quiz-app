import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import React from 'react';
import MyTextButton from '@/components/common/MyTextButton/MyTextButton';
import './PlayButton.scss';

interface PlayButtonProps {
  isPlaying?: boolean;
  onClick?: any;
}

const PlayButton: React.FC<PlayButtonProps> = ({ onClick, isPlaying = false }) => (
  <MyTextButton onClick={onClick} className="play-button">
    { isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
  </MyTextButton>
);

export default PlayButton;
