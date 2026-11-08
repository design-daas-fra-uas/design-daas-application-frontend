import { useCallback } from 'react';

import { describeError } from '../../../../api/errors';
import { createLogger } from '../../../../utils/logger';

const log = createLogger('UserDashboard');

// Runs a dashboard request and reports it, with its name and on failure the
// backend's reason, in the request alert. Resolves to the request's result,
// or undefined when it failed.
export default function useDashboardRequest(showRequestAlert) {
  return useCallback(
    async (name, request) => {
      try {
        const result = await request();
        showRequestAlert(true, name);
        return result;
      } catch (error) {
        log.error(`${name} failed`, error);
        showRequestAlert(false, `${name}: ${describeError(error)}`);
        return undefined;
      }
    },
    [showRequestAlert],
  );
}
