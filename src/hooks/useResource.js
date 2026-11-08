import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { createLogger } from '../utils/logger';
const log = createLogger('useResource');

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
  const requestIdRef = useRef(0);
  const controllerRef = useRef(null);
  // The loader is usually an inline closure over `deps`; keeping the latest one
  // in a ref lets `reload` stay stable while always calling the current loader.
  const loaderRef = useRef(loader);
  useLayoutEffect(() => {
    loaderRef.current = loader;
  });

  // Fetches without touching the status first; stale results are dropped.
  const load = useCallback(async () => {
    const id = ++requestIdRef.current;
    controllerRef.current?.abort();
    const { signal } = (controllerRef.current = new AbortController());

    try {
      const data = await loaderRef.current({ signal });
      if (id !== requestIdRef.current) {
        return false;
      }
      setState({ data, status: data == null ? 'not-found' : 'loaded' });
      return data != null;
    } catch (error) {
      if (id !== requestIdRef.current) {
        return false;
      }
      log.error('reload', error);
      const notFound = error?.response?.status === 404;
      setState((previous) => ({
        data: notFound ? null : previous.data,
        status: notFound ? 'not-found' : 'error',
      }));
      return false;
    }
  }, []);

  const reload = useCallback(
    ({ silent = false } = {}) => {
      if (!silent) {
        setState((previous) => (previous.status === 'loading' ? previous : { ...previous, status: 'loading' }));
      }
      return load();
    },
    [load],
  );

  // New deps: drop the old data right away (during render, not in the effect).
  const [loadedDeps, setLoadedDeps] = useState(deps);
  if (deps.length !== loadedDeps.length || deps.some((dep, index) => !Object.is(dep, loadedDeps[index]))) {
    setLoadedDeps(deps);
    setState(LOADING);
  }

  useEffect(() => {
    load();
    return () => {
      requestIdRef.current += 1;
      controllerRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `deps` are the caller's loader inputs
  }, [load, ...deps]);

  return { data: state.data, status: state.status, reload };
}
