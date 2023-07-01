import React from 'react';
import './SyncStatus.scss';

const SyncStatus = ({ syncing }: {syncing: boolean}) => (
  <div className="sync-status">
    {syncing ? <span>Saving...</span> : <span>All changes saved</span>}
  </div>
);

export default SyncStatus;
