import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Header from '../../../components/header';

function StartEnvironment() {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <ReactBootstrap.Container id="environmentStart" className="page">
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
            <h2 className="page-title">{t('overview')}</h2>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>
      </ReactBootstrap.Container>
    </>
  );
}

export default StartEnvironment;
