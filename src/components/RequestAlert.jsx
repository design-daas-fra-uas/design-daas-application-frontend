import { useTranslation } from 'react-i18next';

// Centered alert for the state returned by `useRequestAlert`: the outcome,
// plus what was done or why it failed when known.
function RequestAlert({ alert }) {
  const { t } = useTranslation();

  if (!alert.visible) {
    return null;
  }
  return (
    <div
      className={alert.success ? 'request-success-alert' : 'request-fail-alert'}
      role={alert.success ? 'status' : 'alert'}
    >
      <strong>{alert.success ? t('request-successful') : t('request-failed')}</strong>
      {alert.message && <div className="request-alert-message">{alert.message}</div>}
    </div>
  );
}

export default RequestAlert;
