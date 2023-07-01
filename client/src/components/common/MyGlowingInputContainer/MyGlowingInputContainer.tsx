import React, { FunctionComponent, HTMLAttributes } from 'react';
import './MyGlowingInputContainer.scss';

interface MyGlowingInputProps
  extends React.DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  children: any;
  whiteBackground?: boolean;
  style?: any;
  className?: string;
}

const MyGlowingInputContainer: FunctionComponent<MyGlowingInputProps> = ({
  children,
  whiteBackground,
  style,
  className = '',
}) => (
  <div
    className={`my-glowing-input-container ${
      whiteBackground ? 'background-white' : ''
    } ${className}`}
    style={style}
  >
    {children}
  </div>
);

export default MyGlowingInputContainer;
