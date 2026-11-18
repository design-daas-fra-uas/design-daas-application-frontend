import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import { getRole } from '../auth/tokenManager';
import ErrorState from '../components/ErrorState';
import Header from '../components/header';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { ROUTES } from '../routes';

function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Logged-in users go back to their dashboard, everyone else to the login
  const home = getRole() ? ROUTES.dashboard : ROUTES.login;
  useDocumentTitle(t('Error-Title'));

  return (
    <>
      <Header />
      <Container as="main" id="error" className="page page-narrow">
        <ErrorState
          icon="fa-compass"
          tone="info"
          headingLevel="h1"
          title={t('Error-Title')}
          actions={
            <>
              <Button variant="primary" onClick={() => navigate(home)}>
                <i className="fa-solid fa-house me-2" aria-hidden="true" />
                {t(getRole() ? 'back-to-dashboard' : 'back-link')}
              </Button>
              <Button variant="outline-primary" onClick={() => navigate(-1)}>
                <i className="fa-solid fa-arrow-left me-2" aria-hidden="true" />
                {t('back-link')}
              </Button>
            </>
          }
        >
          <p>{t('Error-text-one')}</p>
          <p className="error-state-code">404 · {window.location.pathname}</p>
        </ErrorState>
      </Container>
    </>
  );
}

export default NotFound;
