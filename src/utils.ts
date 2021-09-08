import React from 'react';
import { useLocation } from 'react-router-dom';

export function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = React.useState('idle');
  const [value, setValue] = React.useState(null);
  const [error, setError] = React.useState(null);

  const execute = React.useCallback(() => {
    setStatus('pending');
    setValue(null);
    setError(null);

    return asyncFunction()
      .then((response) => {
        setValue(response);
        setStatus('success');
      })
      .catch((errorMessage) => {
        setError(errorMessage);
        setStatus('error');
      });
  }, [asyncFunction]);

  React.useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute, status, value, error,
  };
}

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}
