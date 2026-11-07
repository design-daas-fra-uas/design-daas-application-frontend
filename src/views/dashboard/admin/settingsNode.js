import { useState } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import Header from '../../../components/header';

import Header from "../../../components/header";

function SettingsNode() {
    const params = useParams(); // Example: {params.id}
    const [vmIDConfigDHCP, setVMIDConfigDHCP] = useState("");
    const [vmIDConfigDHCPEnv, setVMIDConfigDHCPEnv] = useState("");
    const [vmIDConfigIptables, setVMIDConfigIptables] = useState("");
    const [vmIDConfigIptablesEnv, setVMIDConfigIptablesEnv] = useState("");
    const [requestAlert, setRequestAlert] = useState(false);
    const [requestAlertMessage, setRequestAlertMessage] = useState(false);
    const { t, i18n } = useTranslation();

    const isNotDesktop = useMediaQuery({
        query: '(max-width: 1200px)'
    })

    const dhcpVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/node/vmconfigure_dhcp', {
            id: vmIDConfigDHCP,
            id_env: vmIDConfigDHCPEnv,
        }, {
            headers: {
                'Authorization': localStorage.getItem('userToken'),
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': URL_SYSTEM,
                'Access-Control-Allow-Headers': URL_SYSTEM,
            },
            // withCredentials: true,
        })
            .then(response => {
                console.log(response);
                if (response.status === 200 && response.data.response_code === 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(true);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(false);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
            })
            .catch(e => {
                console.log(e)
                setRequestAlert(true);
                setRequestAlertMessage(false);

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

  const iptablesVirtualEnvironment = (event) => {
    event.preventDefault();

        axios.post(DEVELOPMENT + '/node/vmconfigure_iptables', {
            id: vmIDConfigIptables,
            id_env: vmIDConfigIptablesEnv,
        }, {
            headers: {
                'Authorization': localStorage.getItem('userToken'),
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': URL_SYSTEM,
                'Access-Control-Allow-Headers': URL_SYSTEM,
            },
            // withCredentials: true,
        })
            .then(response => {
                console.log(response);
                if (response.status === 200 && response.data.response_code === 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(true);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(false);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
            })
            .catch(e => {
                console.log(e)
                setRequestAlert(true);
                setRequestAlertMessage(false);

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

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

    const backToDashboard = () => {
        window.location.href = "/dashboard/admin";
    };

    const dhcpVMSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        id_env: Yup.string()
            .required('ID Environment invalid'),
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
              {({ errors, touched }) => (
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
              {({ errors, touched }) => (
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
