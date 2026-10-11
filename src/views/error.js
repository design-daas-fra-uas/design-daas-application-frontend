import React from 'react';
import { Link } from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Header from '../components/header';

function NotFound() {
  const { t, i18n } = useTranslation();
  return (
    <>
      <Header />
      <ReactBootstrap.Container id="error">
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <div>
              <div>
                <h2>
                  Error - 404
                </h2>
              </div>
              <div>
                <h2>
                  {t('Error-Title')}
                </h2>
              </div>
            </div>
            <div>
              <div>
                {t('Error-text-one')}
              </div>
              <div>
                {t('Error-text-two')}
              </div>
            </div>
            <div>
              <div>
                <Link to="/">
                  {t('back-link')}
                </Link>
              </div>
            </div>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>
      </ReactBootstrap.Container>
        </>
  );
}

export default NotFound;
