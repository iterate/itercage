import React from 'react';

export const InfoAlert = ({ message }) => {
  return (
    <div className="alert alert-info" role="alert">
      {message}
    </div>
  );
};

export const DangerAlert = ({ message }) => {
  return (
    <div className="alert alert-danger" role="alert">
      {message}
    </div>
  );
};
