import { useCallback, useEffect, useRef, useState } from 'react';

const LOADING = { data: null, status: 'loading' };

// Loads a resource and tracks its status:
// 'loading' | 'loaded' | 'error' | 'not-found'.
// A loader result of null/undefined, or an HTTP 404, means 'not-found'.
// Stale responses (older request, changed deps, unmount) are ignored and their
// HTTP request is aborted: the loader receives `{ signal }`.
// `reload({ silent: true })` refetches without switching back to 'loading'.
// `reload` never throws; it resolves to true on success and false otherwise.
export default function useResource(loader, deps = []) {
  const [state, setState] = useState(LOADING);
  const requestId = useRef(0);
  const controller = useRef(null);
  // The loader is usually an inline closure over `deps`; keeping the latest one
  // in a ref lets `reload` stay stable while always calling the current loader.
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const reload = useCallback(async (options) => {
    const id = ++requestId.current;
    controller.current?.abort();
    const { signal } = (controller.current = new AbortController());
    if (!options?.silent) {
      setState((previous) => (previous.status === 'loading' ? previous : { ...previous, status: 'loading' }));
    }

    try {
      const data = await loaderRef.current({ signal });
      if (id !== requestId.current) {
        return false;
      }
      setState({ data, status: data == null ? 'not-found' : 'loaded' });
      return data != null;
    } catch (error) {
      if (id !== requestId.current) {
        return false;
      }
      console.error(error);
      const notFound = error?.response?.status === 404;
      setState((previous) => ({
        data: notFound ? null : previous.data,
        status: notFound ? 'not-found' : 'error',
      }));
      return false;
    }
  }, []);

  useEffect(() => {
    // No-op on mount (state is already loading); resets stale data when deps change.
    setState((previous) => (previous.status === 'loading' && previous.data === null ? previous : LOADING));
    reload();
    return () => {
      requestId.current += 1;
      controller.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, ...deps]);

  return { data: state.data, status: state.status, reload };
}
