import { useState, useEffect } from 'react';

export default function useDebounce(valor, delay = 400) {
  const [valorDebounced, setValorDebounced] = useState(valor);

  useEffect(() => {
    const timer = setTimeout(() => {
      setValorDebounced(valor);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [valor, delay]);

  return valorDebounced;
}
