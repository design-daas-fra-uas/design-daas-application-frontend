import { useCallback, useEffect, useRef, useState } from 'react';

import { daasClient, isDaasSuccess } from '../../../api/client';
import { createLogger } from '../../../utils/logger';
import { CATEGORIES, EMPTY_MONITORING, SCOPES } from './monitoringConfig';

const log = createLogger('Monitoring');

// Loads every monitoring category of one scope in parallel. A failing
// category falls back to its empty value; the others still show.
export const fetchMonitoring = async (scopeName, ownerId) => {
  const scope = SCOPES[scopeName];
  const results = await Promise.all(
    CATEGORIES.map(async ({ key, endpoint, path, empty, global }) => {
      try {
        const body = global && scopeName === 'owner' ? {} : scope.body(ownerId);
        const response = await daasClient.post(`${scope.prefix}/${endpoint}`, body);
        if (!isDaasSuccess(response)) {
          log.warn(`${scope.prefix}/${endpoint} returned code ${response.data?.response_code}`);
          return [key, empty, false];
        }
        const data = response.data.response_data;
        return [key, (path ? data?.[path] : data) ?? empty, true];
      } catch (error) {
        log.error(`Loading ${key} monitoring failed`, error);
        return [key, empty, false];
      }
    }),
  );
  return {
    data: Object.fromEntries(results.map(([key, value]) => [key, value])),
    ok: results.every(([, , ok]) => ok),
  };
};

// `load` is triggered on mount when `autoLoad` is set, otherwise on demand
// (e.g. after an owner id was entered). Results of an outdated request are dropped.
export default function useMonitoring(scopeName, { autoLoad = true } = {}) {
  const [data, setData] = useState(EMPTY_MONITORING);
  const [loaded, setLoaded] = useState(false);
  const requestIdRef = useRef(0);

  const load = useCallback(
    async (ownerId) => {
      const id = ++requestIdRef.current;
      const result = await fetchMonitoring(scopeName, ownerId);
      if (id === requestIdRef.current) {
        setData(result.data);
        setLoaded(true);
      }
      return result.ok;
    },
    [scopeName],
  );

  useEffect(() => {
    if (autoLoad) {
      load();
    }
    return () => {
      requestIdRef.current += 1;
    };
  }, [autoLoad, load]);

  return { data, loaded, load };
}
