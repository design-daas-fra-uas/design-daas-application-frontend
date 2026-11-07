import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';

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
      <Row>
        <Col xs={12}>URL: {result.data.url}</Col>
      </Row>
      {connected && (
        <Row>
          <Col xs={12}>
            <ViewerFrame request={result.data} />
          </Col>
        </Row>
      )}
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
      {output && (
        <Row>
          <Col xs={12}>{output}</Col>
        </Row>
      )}
    </>
  );
}

export default ActionPanel;
