import { useCallback, useRef } from 'react';

import { toast } from 'react-toastify';

import { toastContent } from './toast-provider';

export function useUpdateToast() {
  const toastIdRef = useRef();

  return useCallback(({ type, render, progress, autoClose = 5000, ...restOptions }) => {
    //@ts-ignore
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
}

export const useToast = () => {
  const updateToast = useUpdateToast();

  const successToast = (message: string) =>
    updateToast({
      type: 'success',
      render: message
    });

  const errorToast = (err: Error) =>
    updateToast({
      type: 'error',
      render: `${err.name}: ${err.message}`
    });

  return {
    successToast,
    errorToast
  };
};
