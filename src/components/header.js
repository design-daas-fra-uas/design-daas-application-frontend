import { useEffect, useState } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';

import Logo from './../assets/images/png/DESIGNLogoColouredWhiteFont.png';
import { daasClient, isDaasSuccess } from '../api/client';
import { getAccessToken, logout } from '../auth/tokenManager';
import { changeLanguage } from '../i18n';
import { ROUTES } from '../routes';
import { createLogger } from '../utils/logger';

const log = createLogger('Header');

const { Container, Nav, NavDropdown, Navbar } = ReactBootstrap;

// Top navigation: home, the user's open viewer connections, language and logout.
// Pages that already load the connections pass them in; otherwise they are fetched here.
function Header({ connections: providedConnections }) {
  const { t } = useTranslation();
  const [loadedConnections, setConnections] = useState([]);
  const connections = providedConnections ?? loadedConnections;
  const isLoggedIn = Boolean(getAccessToken());
  const isSmall = useMediaQuery({ query: '(max-width: 767px)' });

  useEffect(() => {
    if (!isLoggedIn || providedConnections) {
      return undefined;
    }
    let active = true;
    daasClient
      .post('/monitoring/dashboard_info', {})
      .then((response) => {
        if (active && isDaasSuccess(response)) {
          setConnections(response.data.response_data.dashboardinfo.available_connections || []);
        }
      })
      .catch((error) => log.error('Loading open connections failed', error));
    return () => {
      active = false;
    };
  }, [isLoggedIn, providedConnections]);

  const openConnection = (connection) => {
    localStorage.setItem('connection-object-id', connection.id_inst);
    localStorage.setItem('connection-env', connection.viewer_url);
    // A full page load, so the viewer restarts even when this page is already open.
    window.location.assign(ROUTES.user.connectionRun);
  };

  return (
    <Navbar expand="lg" fixed="top" variant="dark">
      <Container fluid className={isSmall ? 'header-small' : ''}>
        <Navbar.Brand>
          <img src={Logo} alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="justify-content-end" style={{ width: '100%' }}>
            {isLoggedIn && (
              <>
                <Nav.Link href={ROUTES.dashboard}>{t('home')}</Nav.Link>
                <NavDropdown title={t('available_connections')} id="basic-nav-dropdown">
                  {connections.length > 0 ? (
                    connections.map((connection) => (
                      <NavDropdown.Item key={connection.id_inst} as="button" onClick={() => openConnection(connection)}>
                        {t('url-text') + connection.viewer_url}
                      </NavDropdown.Item>
                    ))
                  ) : (
                    <NavDropdown.Item as="span">{t('no-data-available')}</NavDropdown.Item>
                  )}
                </NavDropdown>
              </>
            )}
            <NavDropdown title={t('language')} id="basic-nav-dropdown-additional">
              <NavDropdown.Item as="button" onClick={() => changeLanguage('en')}>
                EN
              </NavDropdown.Item>
              <NavDropdown.Item as="button" onClick={() => changeLanguage('de')}>
                DE
              </NavDropdown.Item>
            </NavDropdown>
            {isLoggedIn && (
              <Nav.Link as="button" onClick={() => logout(ROUTES.login)}>
                {t('logout')}
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
