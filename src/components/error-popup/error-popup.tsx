import { FC } from 'react';

interface Props {
  error: Error | null;
}

export const ErrorPopup: FC<Props> = ({ error }) => {
  if (!error) {
    return null;
  }

  return (
    <div className="error-popup">
      <h1>{error.name}</h1>
      <h4>{error.message}</h4>
      <p>
        <button onClick={() => window.location.reload()} className="pretty-button" style={{ marginTop: 16 }}>
          Refresh Page
        </button>
      </p>
    </div>
  );
};
