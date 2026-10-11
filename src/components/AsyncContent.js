import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// Renders the loading / error / not-found / empty states of a `useResource`
// status and the children only once the data is loaded. children may be a
// function so it is only evaluated when the data is available.
function AsyncContent({ status, onRetry, isEmpty = false, notFoundText, children }) {
  const { t } = useTranslation();

  if (status === 'loading') {
    return (
      <p role="status" aria-busy="true">
        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
        {t('loading', 'Loading...')}
      </p>
    );
  }

  if (status === 'not-found') {
    return <p role="alert">{notFoundText ?? t('not-found', 'Not found.')}</p>;
  }

  if (status === 'error') {
    return (
      <Alert variant="danger" role="alert">
        {t('load-error', 'Could not load the data. Please try again.')}
        {onRetry && (
          <>
            {' '}
            <Button variant="link" className="p-0 align-baseline" onClick={onRetry}>
              {t('retry', 'Retry')}
            </Button>
          </>
        )}
      </Alert>
    );
  }

  if (isEmpty) {
    return <p>{t('no-entries', 'No entries found.')}</p>;
  }

  return <>{typeof children === 'function' ? children() : children}</>;
}

export default AsyncContent;