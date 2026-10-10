import { useCallback, useEffect, useRef, useState } from 'react';

// Loads a resource and tracks its status:
// 'loading' | 'loaded' | 'error' | 'not-found'.
// A loader result of null/undefined, or an HTTP 404, means 'not-found'.
// Stale responses (older request, changed deps, unmount) are ignored.
// `reload({ silent: true })` refetches without switching back to 'loading'.
export default function useResource(loader, deps = []) {
  const [state, setState] = useState({ data: null, status: 'loading' });
  const requestId = useRef(0);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const reload = useCallback(async (options) => {
    const id = ++requestId.current;
    if (!options?.silent) {
      setState((previous) => ({ ...previous, status: 'loading' }));
    }

    try {
      const data = await loaderRef.current();
      if (id === requestId.current) {
        setState({ data, status: data == null ? 'not-found' : 'loaded' });
      }
    } catch (error) {
      console.error(error);
      if (id === requestId.current) {
        const notFound = error?.response?.status === 404;
        setState((previous) => ({
          data: notFound ? null : previous.data,
          status: notFound ? 'not-found' : 'error',
        }));
      }
    }
  }, []);

  useEffect(() => {
    setState({ data: null, status: 'loading' });
    reload();
    return () => {
      requestId.current += 1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, ...deps]);

  return { data: state.data, status: state.status, reload };
}