import { ReactElement, useCallback, useRef } from 'react';

import { toast } from 'react-toastify';

import { toastContent } from './toast-provider';

export const useToastNotification = () => {
  const toastIdRef = useRef();

  return useCallback(({ type, render, progress, autoClose = 5000, ...restOptions }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const creationFn = type && type !== 'default' ? toast[type] : toast;

    const contentRender = toastContent(render);

    if (toastIdRef.current && toast.isActive(toastIdRef.current)) {
      toast.update(toastIdRef.current, {
        render: contentRender,
        type,
        progress,
        autoClose,
        ...restOptions
      });
    } else {
      toastIdRef.current = creationFn(contentRender);
    }
  }, []);
};

export const useToast = () => {
  const showToast = useToastNotification();

  const successToast = (message: string) =>
    showToast({
      type: 'success',
      render: message
    });

  const errorToast = (error: Error) =>
    showToast({
      type: 'error',
      render: `${error.name}: ${error.message}`
    });

  const imageToast = (image: ReactElement) =>
    showToast({
      type: 'success',
      render: image
    });

  return {
    successToast,
    errorToast,
    imageToast
  };
};
