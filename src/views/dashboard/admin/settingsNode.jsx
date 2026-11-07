import { useState } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import BackLink from '../../../components/BackLink';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import Header from '../../../components/header';

import { daasClient } from '../../../api/client';
import { createLogger } from '../../../utils/logger';
import RequestAlert from '../../../components/RequestAlert';
import useRequestAlert from '../../../hooks/useRequestAlert';
import { ROUTES } from '../../../routes';
import { SUBMIT_HANDLED_BY_FORM } from '../../../utils/formik';
const log = createLogger('SettingsNode');

function SettingsNode() {
  const [vmIDConfigDHCP, setVMIDConfigDHCP] = useState('');
  const [vmIDConfigDHCPEnv, setVMIDConfigDHCPEnv] = useState('');
  const [vmIDConfigIptables, setVMIDConfigIptables] = useState('');
  const [vmIDConfigIptablesEnv, setVMIDConfigIptablesEnv] = useState('');
  const { requestAlert, showRequestAlert } = useRequestAlert();
  const { t } = useTranslation();

  const dhcpVirtualEnvironment = (event) => {
    event.preventDefault();

    daasClient
      .post('/node/vmconfigure_dhcp', {
        id: vmIDConfigDHCP,
        id_env: vmIDConfigDHCPEnv,
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
        log.error('dhcpVirtualEnvironment failed', e);
        showRequestAlert(false);
      });
  };

  const iptablesVirtualEnvironment = (event) => {
    event.preventDefault();

    daasClient
      .post('/node/vmconfigure_iptables', {
        id: vmIDConfigIptables,
        id_env: vmIDConfigIptablesEnv,
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
        log.error('iptablesVirtualEnvironment failed', e);
        showRequestAlert(false);
      });
  };

  const changeVMIDConfigDHCP = (event) => {
    setVMIDConfigDHCP(event.target.value);
  };
  const changeVMIDConfigDHCPEnv = (event) => {
    setVMIDConfigDHCPEnv(event.target.value);
  };
  const changeVMIDConfigIptables = (event) => {
    setVMIDConfigIptables(event.target.value);
  };
  const changeVMIDConfigIptablesEnv = (event) => {
    setVMIDConfigIptablesEnv(event.target.value);
  };

  const dhcpVMSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    id_env: Yup.string().required('ID Environment invalid'),
  });

  const iptablesVMSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    id_env: Yup.string().required('ID Environment invalid'),
  });

  return (
    <>
      <Header />
      <ReactBootstrap.Container id="settingsOverviewConfigurationVirtualEnvironment" fluid={true}>
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
            <div>
              <h2>
                {t('vm-node-dhcp')} / {t('vm-node-iptables')}
              </h2>
            </div>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>
        <ReactBootstrap.Tabs defaultActiveKey="node-dhcp" id="all-config-node">
          <ReactBootstrap.Tab eventKey="node-dhcp" title={t('vm-node-dhcp')}>
            <Formik
              initialValues={{
                id: '',
                id_env: '',
              }}
              validationSchema={dhcpVMSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={dhcpVirtualEnvironment} id="form-node-dhcp">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id"
                        name="vm-id"
                        value={vmIDConfigDHCP}
                        onChange={changeVMIDConfigDHCP}
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
                        value={vmIDConfigDHCPEnv}
                        onChange={changeVMIDConfigDHCPEnv}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-env')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDConfigDHCP.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="node-iptables" title={t('vm-node-iptables')}>
            <Formik
              initialValues={{
                id: '',
                id_env: '',
              }}
              validationSchema={iptablesVMSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={iptablesVirtualEnvironment} id="form-node-iptables">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-ip">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-ip"
                        name="vm-id-ip"
                        value={vmIDConfigIptables}
                        onChange={changeVMIDConfigIptables}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-ip')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-env-ip">{t('vm-env')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-env-ip"
                        name="vm-env-ip"
                        value={vmIDConfigIptablesEnv}
                        onChange={changeVMIDConfigIptablesEnv}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-env-ip')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDConfigIptables.length > 0 ? false : true}
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

export default SettingsNode;
