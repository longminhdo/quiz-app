import React, { HTMLAttributes } from 'react';
import './MyCard.scss';

interface MyCardProps
  extends React.DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  children?: any;
  className?: string;
}

const MyCard: React.FC<MyCardProps> = ({ children, className = '', ...rest }) => (
  <div className={`my-card ${className}`} {...rest}>
    {children}
  </div>
);

export default MyCard;
