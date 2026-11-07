import { useState } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import BackLink from '../../../components/BackLink';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import Header from '../../../components/header';

import LoadingSpinner from '../../../assets/animation/loadingspinner.svg';

import { daasClient } from '../../../api/client';
import { createLogger } from '../../../utils/logger';
import RequestAlert from '../../../components/RequestAlert';
import useRequestAlert from '../../../hooks/useRequestAlert';
import ViewerFrame from '../../../components/ViewerFrame';
import { ROUTES } from '../../../routes';
import { SUBMIT_HANDLED_BY_FORM } from '../../../utils/formik';
const log = createLogger('SettingsConnection');

function SettingsConnection() {
  const [viewerRequest, setViewerRequest] = useState(null);
  const [vmIDConnection, setVMIDConnection] = useState('');
  const [vmIDConnectionEnv, setVMIDConnectionEnv] = useState('');
  const [vmIDConnectionContype, setVMIDConnectionContype] = useState('');
  const [vmIDDisconnection, setVMIDDisconnection] = useState('');
  const [vmIDDisconnectionEnv, setVMIDDisconnectionEnv] = useState('');
  const [viewerURL, setViewerURL] = useState('');
  const [vmStartConnectionSubmit, setVMStartConnectionSubmit] = useState(false);
  const { requestAlert, showRequestAlert } = useRequestAlert();
  const [loadingSpinnerShow, setLoadingSpinnerShow] = useState(false);
  const [loadingSpinnerShowSubmit, setLoadingSpinnerShowSubmit] = useState(false);
  const { t } = useTranslation();

  const viewerConnection = (event) => {
    event.preventDefault();

    daasClient
      .post('/viewer/connect', {
        id: vmIDConnection,
        id_env: vmIDConnectionEnv,
        contype: vmIDConnectionContype,
      })
      .then((response) => {
        setLoadingSpinnerShow(true);
        setLoadingSpinnerShowSubmit(true);
        if (response.status === 200 && response.data.response_code === 200) {
          setViewerRequest({
            url: response.data.response_url,
          });

          showRequestAlert(true);

          setViewerURL(response.data.response_url);

          setLoadingSpinnerShow(false);
          setLoadingSpinnerShowSubmit(false);
          setVMStartConnectionSubmit(true);
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          showRequestAlert(false);

          setLoadingSpinnerShow(false);
          setLoadingSpinnerShowSubmit(false);
          setVMStartConnectionSubmit(false);
        }
      })
      .catch((e) => {
        log.error('viewerConnection failed', e);
        showRequestAlert(false);

        setLoadingSpinnerShow(false);
        setLoadingSpinnerShowSubmit(false);
        setVMStartConnectionSubmit(false);
      });
  };

  const viewerDisconnection = (event) => {
    event.preventDefault();

    daasClient
      .post('/viewer/disconnect', {
        id: vmIDDisconnection,
        id_env: vmIDDisconnectionEnv,
      })
      .then((response) => {
        if (response.status === 200 && response.data.response_code === 200) {
          showRequestAlert(true);
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          showRequestAlert(false);
        }
      })
      .catch((e) => {
        log.error('viewerDisconnection failed', e);
        showRequestAlert(false);
      });
  };

  const changeVMIDConnection = (event) => {
    setVMIDConnection(event.target.value);
  };
  const changeVMIDConnectionEnv = (event) => {
    setVMIDConnectionEnv(event.target.value);
  };
  const changeVMIDConnectionContype = (event) => {
    setVMIDConnectionContype(event.target.value);
  };
  const changeVMIDDisconnection = (event) => {
    setVMIDDisconnection(event.target.value);
  };
  const changeVMIDDisconnectionEnv = (event) => {
    setVMIDDisconnectionEnv(event.target.value);
  };

  const connectionViewerSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    id_env: Yup.string().required('ID Environment invalid'),
    contype: Yup.string().required('Contype invalid'),
  });

  const disconnectionViewerSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    id_env: Yup.string().required('ID Environment invalid'),
  });

  return (
    <>
      <Header />
      <ReactBootstrap.Container id="settingsOverviewConnectionViewer" fluid={true}>
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
            <div>
              <h2>{t('viewer-check')}</h2>
            </div>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>
        <ReactBootstrap.Tabs defaultActiveKey="viewer-connection" id="all-connection-types">
          <ReactBootstrap.Tab eventKey="viewer-connection" title={t('viewer-connection')}>
            <Formik
              initialValues={{
                id: '',
                id_env: '',
                contype: '',
              }}
              validationSchema={connectionViewerSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={viewerConnection} id="form-viewer-connection">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id"
                        name="vm-id"
                        value={vmIDConnection}
                        onChange={changeVMIDConnection}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-env">{t('vm-env')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-env"
                        name="vm-env"
                        value={vmIDConnectionEnv}
                        onChange={changeVMIDConnectionEnv}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-env')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-contype">{t('viewer-contype')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <select
                        id="vm-contype"
                        name="vm-contype"
                        value={vmIDConnectionContype}
                        onChange={changeVMIDConnectionContype}
                      >
                        <option value="sysvnc">System VNC</option>
                        <option value="instvnc">Instance VNC</option>
                        <option value="rdp">RDP</option>
                      </select>
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-contype')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDConnection.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
            {loadingSpinnerShowSubmit ? (
              <>
                {loadingSpinnerShow ? (
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <img src={LoadingSpinner} alt="Loading spinner" className="loading-spinner" />
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
            {vmStartConnectionSubmit ? (
              <>
                <ReactBootstrap.Row>
                  <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div>URL: {viewerURL}</div>
                  </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Row>
                  <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <ViewerFrame request={viewerRequest} />
                  </ReactBootstrap.Col>
                </ReactBootstrap.Row>
              </>
            ) : (
              <></>
            )}
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="viewer-disconnection" title={t('viewer-disconnection')}>
            <Formik
              initialValues={{
                id: '',
                id_env: '',
              }}
              validationSchema={disconnectionViewerSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={viewerDisconnection} id="form-viewer-disconnection">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-disconnect">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-disconnect"
                        name="vm-id-disconnect"
                        value={vmIDDisconnection}
                        onChange={changeVMIDDisconnection}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-disconnect')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-env-disconnect">{t('vm-env')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-env-disconnect"
                        name="vm-env-disconnect"
                        value={vmIDDisconnectionEnv}
                        onChange={changeVMIDDisconnectionEnv}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-env-disconnect')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDDisconnection.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
          </ReactBootstrap.Tab>
        </ReactBootstrap.Tabs>
        {loadingSpinnerShowSubmit ? (
          <>
            {loadingSpinnerShow ? (
              <ReactBootstrap.Row>
                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <img src={LoadingSpinner} alt="Loading spinner" className="loading-spinner" />
                </ReactBootstrap.Col>
              </ReactBootstrap.Row>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <RequestAlert alert={requestAlert} />
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>
        <ReactBootstrap.Row>
          <BackLink to={ROUTES.admin.root} />
        </ReactBootstrap.Row>
      </ReactBootstrap.Container>
    </>
  );
}

export default SettingsConnection;
