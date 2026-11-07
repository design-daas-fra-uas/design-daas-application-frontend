import { useTranslation } from 'react-i18next';

// Banner for the state returned by `useRequestAlert`.
function RequestAlert({ alert }) {
  const { t } = useTranslation();

  if (!alert.visible) {
    return null;
  }
  return (
    <div className={alert.success ? 'request-success-alert' : 'request-fail-alert'} role="status">
      {alert.success ? t('request-successful') : t('request-failed')}
    </div>
  );
}

export default RequestAlert;
