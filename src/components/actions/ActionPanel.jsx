import { useState } from 'react';

import LoadingSpinner from '../../assets/animation/loadingspinner.svg';
import ViewerFrame from '../ViewerFrame';
import ActionForm from './ActionForm';
import ResultView from './ResultView';
import useDaasAction from './useDaasAction';

// URL of the started viewer, plus the viewer itself unless the action has a
// `connectField` checkbox that was left unticked.
function ViewerResult({ action, result }) {
  const connected = !action.connectField || result.values[action.connectField];
  return (
    <>
      <p className="result-url">URL: {result.data.url}</p>
      {connected && <ViewerFrame request={result.data} />}
    </>
  );
}

// Form of one action plus what its last successful request returned.
function ActionPanel({ action, showRequestAlert, disabled }) {
  const { result, run } = useDaasAction(action, showRequestAlert);
  const [pending, setPending] = useState(false);

  const submit = async (values) => {
    setPending(true);
    try {
      await run(values);
    } finally {
      setPending(false);
    }
  };

  let output = null;
  if (pending && action.result === 'viewer') {
    output = <img src={LoadingSpinner} alt="Loading..." className="loading-spinner" />;
  } else if (result) {
    output =
      action.result === 'viewer' ? <ViewerResult action={action} result={result} /> : <ResultView data={result.data} />;
  }

  return (
    <>
      <ActionForm
        id={`form-${action.key}`}
        fields={action.fields || []}
        onSubmit={submit}
        submitLabel={action.submitLabel}
        disabled={disabled}
      />
      {output && <div className="action-result">{output}</div>}
    </>
  );
}

export default ActionPanel;
