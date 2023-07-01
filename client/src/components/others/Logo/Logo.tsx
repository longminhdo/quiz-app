import React from 'react';
import HustLogo from '@/assets/images/hust-logo.png';
import './Logo.scss';

const Logo = ({ style, fullLogo = false } : {style?: object, fullLogo?: boolean}) => {
  const handleLogoClick = () => {
    window.open('https://hust.edu.vn/');
  };

  return (
    <div className="logo" style={style} onClick={handleLogoClick}>
      <img src={HustLogo} alt="" />
      {fullLogo && (
      <div className="logo-text">
        <div>
          <b>ĐẠI HỌC</b>
          <b>BÁCH KHOA HÀ NỘI</b>
        </div>
        <div>
          <p>HANOI UNIVERSITY</p>
          <p>OF SCIENCE AND TECHNOLOGY</p>
        </div>
      </div>
      )}
    </div>
  );
};

export default Logo;
