import { useCallback } from 'react';

import { createLogger } from '../../../../utils/logger';

const log = createLogger('UserDashboard');

// Runs a dashboard request and reports it in the request banner. Resolves to
// the request's result, or undefined when it failed.
export default function useDashboardRequest(showRequestAlert) {
  return useCallback(
    async (name, request) => {
      try {
        const result = await request();
        showRequestAlert(true);
        return result;
      } catch (error) {
        log.error(`${name} failed`, error);
        showRequestAlert(false);
        return undefined;
      }
    },
    [showRequestAlert],
  );
}
