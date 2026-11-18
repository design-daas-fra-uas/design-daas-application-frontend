import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import { deniedActionKey, requestPath } from '../api/denied';
import { ROUTES } from '../routes';
import ErrorState from './ErrorState';

// "You have no permission to <action>. Please ask an administrator." for a
// request the endpoint permissions denied (see api/denied.js). The action is
// taken from the request, or given as `actionKey` (a `denied-action-*` suffix).
// `actions` replaces the default buttons (back to the dashboard, retry).
function PermissionDenied({ error, actionKey, onRetry, showHome = true, actions, className }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const key = actionKey ?? deniedActionKey(error);
  const path = requestPath(error);
  const status = error?.response?.status;

  const defaultActions = (
    <>
      {showHome && (
        <Button variant="primary" onClick={() => navigate(ROUTES.dashboard)}>
          <i className="fa-solid fa-house me-2" aria-hidden="true" />
          {t('back-to-dashboard')}
        </Button>
      )}
      {onRetry && (
        <Button variant="outline-primary" onClick={() => onRetry()}>
          <i className="fa-solid fa-arrows-rotate me-2" aria-hidden="true" />
          {t('retry')}
        </Button>
      )}
    </>
  );

  return (
    <ErrorState
      icon="fa-user-lock"
      tone="warning"
      title={t('permission-denied-title')}
      actions={actions ?? defaultActions}
      className={className}
    >
      <p>{t('permission-denied-text', { action: t(`denied-action-${key}`) })}</p>
      <p className="error-state-hint">{t('permission-denied-hint')}</p>
      {path && (
        <p className="error-state-code">
          {status ? `${status} · ` : ''}
          {path}
        </p>
      )}
    </ErrorState>
  );
}

export default PermissionDenied;
