import { useCallback, useState } from 'react';

import { daasClient, isDaasSuccess } from '../../api/client';
import { describeError, describeResponse } from '../../api/errors';
import { createLogger } from '../../utils/logger';
import { toParams } from './fields';

const log = createLogger('DaasAction');

// What a successful response shows under the form, per `action.result`.
const RESULT = {
  data: (response) => response.data.response_data,
  log: (response) => response.data.sys_log,
  viewer: (response) => ({ url: response.data.response_url }),
};

// Sends the form of a config-driven action (see ActionPage) to the DaaS backend.
//
// `action` fields used here:
// - `endpoint`: POST path; the body is the visible fields plus the static `params`,
//   or `body(params, values)` when the request needs a different shape;
// - `result`: 'data' | 'log' | 'viewer' (what to keep from a successful response);
// - `isSuccess(response)`: overrides the usual `response_code === 200` check;
// - `onSuccess({ values, response })`: runs after a successful request.
export default function useDaasAction(action, showRequestAlert) {
  const [result, setResult] = useState(null);

  const run = useCallback(
    async (values) => {
      const params = { ...action.params, ...toParams(action.fields || [], values) };
      const body = action.body ? action.body(params, values) : params;
      setResult(null);
      try {
        const response = await daasClient.post(action.endpoint, body);
        const success = (action.isSuccess || isDaasSuccess)(response);
        if (!success) {
          log.warn(`${action.endpoint} was rejected`, response.data);
          showRequestAlert(false, `${action.endpoint}: ${describeResponse(response)}`);
          return;
        }
        showRequestAlert(true, action.endpoint);
        if (action.result) {
          setResult({ data: RESULT[action.result](response), values });
        }
        await action.onSuccess?.({ values, response });
      } catch (error) {
        log.error(`${action.endpoint} failed`, error);
        showRequestAlert(false, `${action.endpoint}: ${describeError(error)}`);
      }
    },
    [action, showRequestAlert],
  );

  return { result, run };
}
