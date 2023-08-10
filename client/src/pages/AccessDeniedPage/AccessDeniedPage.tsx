import React from 'react';
import { useNavigate } from 'react-router-dom';
import AccessDeniedIllustrator from '@/assets/images/access-denied.png';
import { routePaths } from '@/constants/routePaths';
import './AccessDeniedPage.scss';

const AccessDenied: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="access-denied">
      <img className="access-denied-illustration" src={AccessDeniedIllustrator} alt="access-denied" />
      <br />
      <h2 className="access-denied-text-1">Sorry something went wrong</h2>
      <p className="access-denied-text-2">You don't have permission to view this form</p>

      <div className="go-back" onClick={() => { navigate(routePaths.HOME); }}>Go back to your dashboard</div>
    </div>
  );
};

export default AccessDenied;