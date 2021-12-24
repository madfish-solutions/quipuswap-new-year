import React, { FC } from 'react';
import {
  ToastContainer
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const ToastProvider = () => {
  return (
    <ToastContainer
      autoClose={5000}
      limit={3}
      position="top-center"
      className="notificationContainer"
      bodyClassName="toastBody"
      toastClassName="notification"
      pauseOnHover
      closeOnClick={false}
      pauseOnFocusLoss
    />
  );
};

export const toastContent: FC = (
  children,
) => {

  return (
    <>
      {children}
    </>
  );
};