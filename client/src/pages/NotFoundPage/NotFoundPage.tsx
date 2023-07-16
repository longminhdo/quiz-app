import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotFoundIllustrator from '@/assets/images/not-found.png';
import { routePaths } from '@/constants/routePaths';
import './NotFoundPage.scss';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <img src={NotFoundIllustrator} className="not-found-illustration" alt="not-found" />
      <br />
      <h2 className="not-found-text-1">Sorry something went wrong</h2>
      <p className="not-found-text-2">We can't find your page</p>

      <div className="go-back" onClick={() => { navigate(routePaths.COLLECTIONS); }}>Go back to your dashboard</div>
    </div>
  );
};

export default NotFoundPage;
