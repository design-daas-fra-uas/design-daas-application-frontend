import { useState } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import BackLink from '../../../components/BackLink';
import { useTranslation } from 'react-i18next';
import Header from '../../../components/header';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { daasClient } from '../../../api/client';
import { createLogger } from '../../../utils/logger';
import RequestAlert from '../../../components/RequestAlert';
import useRequestAlert from '../../../hooks/useRequestAlert';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../routes';
import { SUBMIT_HANDLED_BY_FORM } from '../../../utils/formik';
const log = createLogger('ObjectBaseImageSetup');

function ObjectBaseImageSetup() {
  const navigate = useNavigate();
  const objectID = localStorage.getItem('object-id');
  const objectENVName = localStorage.getItem('object-env-name');
  const [vmPhasesIDCFGTarget, setVMPhasesIDCFGTarget] = useState(objectID);
  const [vmPhasesNameCFGTarget, setVMPhasesNameCFGTarget] = useState('');
  const [vmPhasesCommandCFGTarget, setVMPhasesCommandCFGTarget] = useState('');
  const [vmPhasesArgumentsCFGTarget, setVMPhasesArgumentsCFGTarget] = useState('');
  const [vmPhasesIDCFGApplist, setVMPhasesIDCFGApplist] = useState(objectID);
  const [vmPhasesNameCFGApplist, setVMPhasesNameCFGApplist] = useState('');
  const [vmPhasesCommandCFGApplist, setVMPhasesCommandCFGApplist] = useState('');
  const [vmPhasesArgumentsCFGApplist, setVMPhasesArgumentsCFGApplist] = useState('');
  const [vmPhasesIDCFGTasklist, setVMPhasesIDCFGTasklist] = useState(objectID);
  const [vmPhasesTypeCFGTasklist, setVMPhasesTypeCFGTasklist] = useState('exec_cmd');
  const [vmPhasesCommandCFGTasklist, setVMPhasesCommandCFGTasklist] = useState('');
  const [vmPhasesArgumentsCFGTasklist, setVMPhasesArgumentsCFGTasklist] = useState('');
  const { requestAlert, showRequestAlert } = useRequestAlert();
  const { t } = useTranslation();

  const objectBaseimageFinalize = (event) => {
    event.preventDefault();

    daasClient
      .post('/phases/baseimage_finalize', {
        id: objectID,
      })
      .then((response) => {
        if (response.status === 200 && response.data.response_code === 200) {
          showRequestAlert(true);

          setTimeout(() => {
            localStorage.setItem('expert-mode-baseimage', 'true');
            navigate(ROUTES.user.expertEnvironment);
          }, 3000);
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          showRequestAlert(false);
        }
      })
      .catch((e) => {
        log.error('objectBaseimageFinalize failed', e);
        showRequestAlert(false);
      });
  };

  const phasesCFGTasklist = (event) => {
    event.preventDefault();

    daasClient
      .post('/phases/cfg_tasklist', {
        id: objectID,
        env: '',
        tasklist:
          '[{"type":"' +
          vmPhasesTypeCFGTasklist +
          '","cmd":"' +
          vmPhasesCommandCFGTasklist +
          '","args":"' +
          vmPhasesArgumentsCFGTasklist +
          '"}]',
        type: vmPhasesTypeCFGTasklist,
        cmd: vmPhasesCommandCFGTasklist,
        args: vmPhasesArgumentsCFGTasklist,
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
        log.error('phasesCFGTasklist failed', e);
        showRequestAlert(false);
      });
  };

  const phasesCFGApplist = (event) => {
    event.preventDefault();

    daasClient
      .post('/phases/cfg_applist', {
        id: objectID,
        env: '',
        applist:
          '[{"name":"' +
          vmPhasesNameCFGApplist +
          '","cmd":"' +
          vmPhasesCommandCFGApplist +
          '","args":"' +
          vmPhasesArgumentsCFGApplist +
          '"}]',
        cmd: vmPhasesCommandCFGApplist,
        args: vmPhasesArgumentsCFGApplist,
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
        log.error('phasesCFGApplist failed', e);
        showRequestAlert(false);
      });
  };

  const phasesCFGTarget = (event) => {
    event.preventDefault();

    daasClient
      .post('/phases/cfg_set_target', {
        id: objectID,
        env: '',
        target:
          '{"name":"' +
          vmPhasesNameCFGTarget +
          '","cmd":"' +
          vmPhasesCommandCFGTarget +
          '","args":"' +
          vmPhasesArgumentsCFGTarget +
          '"}',
        name: vmPhasesNameCFGTarget,
        cmd: vmPhasesCommandCFGTarget,
        args: vmPhasesArgumentsCFGTarget,
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
        log.error('phasesCFGTarget failed', e);
        showRequestAlert(false);
      });
  };

  const changeVMPhasesIDCFGTarget = (event) => {
    setVMPhasesIDCFGTarget(event.target.value);
  };

  const changeVMPhasesENVCFGTarget = (event) => {};

  const changeVMPhasesNameCFGTarget = (event) => {
    setVMPhasesNameCFGTarget(event.target.value);
  };

  const changeVMPhasesCommandCFGTarget = (event) => {
    setVMPhasesCommandCFGTarget(event.target.value);
  };

  const changeVMPhasesArgumentsCFGTarget = (event) => {
    setVMPhasesArgumentsCFGTarget(event.target.value);
  };

  const changeVMPhasesIDCFGApplist = (event) => {
    setVMPhasesIDCFGApplist(event.target.value);
  };

  const changeVMPhasesENVCFGApplist = (event) => {};

  const changeVMPhasesNameCFGApplist = (event) => {
    setVMPhasesNameCFGApplist(event.target.value);
  };

  const changeVMPhasesCommandCFGApplist = (event) => {
    setVMPhasesCommandCFGApplist(event.target.value);
  };

  const changeVMPhasesArgumentsCFGApplist = (event) => {
    setVMPhasesArgumentsCFGApplist(event.target.value);
  };

  const changeVMPhasesIDCFGTasklist = (event) => {
    setVMPhasesIDCFGTasklist(event.target.value);
  };

  const changeVMPhasesENVCFGTasklist = (event) => {};

  const changeVMPhasesTypeCFGTasklist = (event) => {
    setVMPhasesTypeCFGTasklist(event.target.value);
  };

  const changeVMPhasesCommandCFGTasklist = (event) => {
    setVMPhasesCommandCFGTasklist(event.target.value);
  };

  const changeVMPhasesArgumentsCFGTasklist = (event) => {
    setVMPhasesArgumentsCFGTasklist(event.target.value);
  };

  const objectBaseimageFinalizeSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
  });

  const phasesCFGTargetSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    env: Yup.string().required('Name invalid'),
    target: Yup.string().required('Target invalid'),
    name: Yup.string().required('Name invalid'),
    cmd: Yup.string().required('Command invalid'),
    args: Yup.string().required('Arguments invalid'),
  });

  const phasesCFGApplistSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    env: Yup.string().required('Name invalid'),
    applist: Yup.string().required('Application list invalid'),
    cmd: Yup.string().required('Command invalid'),
    args: Yup.string().required('Arguments invalid'),
  });

  const phasesCFGTasklistSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    env: Yup.string().required('Environment invalid'),
    tasklist: Yup.string().required('Application list invalid'),
    type: Yup.string().required('Type invalid'),
    cmd: Yup.string().required('Command invalid'),
    args: Yup.string().required('Arguments invalid'),
  });

  return (
    <>
      <Header />
      <ReactBootstrap.Container fluid={true} id="objectBaseImageSetup">
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
            <h3>{t('title-baseimage-create')}</h3>
          </ReactBootstrap.Col>
          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
            {t('object-available')}
          </ReactBootstrap.Col>
          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <ReactBootstrap.Button type="submit" variant="primary" id="submit" disabled={true}>
              {t('button-baseimage-create')}
            </ReactBootstrap.Button>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
            <h3>{t('title-baseimage-settings')}</h3>
          </ReactBootstrap.Col>
          <ReactBootstrap.Accordion>
            <ReactBootstrap.Accordion.Item eventKey="0">
              <ReactBootstrap.Accordion.Header>{t('app-step-one')}</ReactBootstrap.Accordion.Header>
              <ReactBootstrap.Accordion.Body>
                <ReactBootstrap.Row>
                  <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                    <h4>{t('app-step-one')}</h4>
                  </ReactBootstrap.Col>
                  <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Formik
                      initialValues={{
                        id: '',
                        env: '',
                        tasklist: '',
                        type: '',
                        cmd: '',
                        arg: '',
                      }}
                      validationSchema={phasesCFGTasklistSchema}
                      onSubmit={SUBMIT_HANDLED_BY_FORM}
                    >
                      {({ errors, touched }) => (
                        <Form onSubmit={phasesCFGTasklist} id="form-phases-cfg-tasklist">
                          <ReactBootstrap.Row>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-id-phases-cfg-tasklist">{t('vm-id')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-id-phases-cfg-tasklist"
                                name="vm-id-phases-cfg-tasklist"
                                value={objectID}
                                onChange={changeVMPhasesIDCFGTasklist}
                                disabled={true}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-id-phases-cfg-tasklist')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-env-phases-cfg-tasklist">{t('vm-env')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-env-phases-cfg-tasklist"
                                name="vm-env-phases-cfg-tasklist"
                                value={objectENVName}
                                onChange={changeVMPhasesENVCFGTasklist}
                                disabled={true}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-env-phases-cfg-tasklist')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-type-phases-cfg-tasklist">{t('vm-type')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <select
                                id="vm-name-phases-cfg-tasklist"
                                name="vm-name-phases-cfg-tasklist"
                                value={vmPhasesTypeCFGTasklist}
                                onChange={changeVMPhasesTypeCFGTasklist}
                              >
                                <option value="exec_cmd">{t('execute-command')}</option>
                                <option value="os_install">{t('os-install')}</option>
                                <option value="os_uninstall">{t('os-uninstall')}</option>
                              </select>
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-type-phases-cfg-tasklist')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-command-phases-cfg-tasklist">{t('vm-command')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-command-phases-cfg-tasklist"
                                name="vm-command-phases-cfg-tasklist"
                                value={vmPhasesCommandCFGTasklist}
                                onChange={changeVMPhasesCommandCFGTasklist}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-command-phases-cfg-tasklist')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-arguments-phases-cfg-tasklist">{t('vm-arguments')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-arguments-phases-cfg-tasklist"
                                name="vm-arguments-phases-cfg-tasklist"
                                value={vmPhasesArgumentsCFGTasklist}
                                onChange={changeVMPhasesArgumentsCFGTasklist}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-arguments-phases-cfg-tasklist')}</div>
                          </ReactBootstrap.Row>
                          <ReactBootstrap.Row>
                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                              <ReactBootstrap.Button
                                type="submit"
                                variant="primary"
                                id="submit"
                                disabled={
                                  vmPhasesIDCFGTasklist.length > 0 &&
                                  vmPhasesTypeCFGTasklist.length > 0 &&
                                  vmPhasesCommandCFGTasklist.length > 0
                                    ? false
                                    : true
                                }
                              >
                                {t('submit')}
                              </ReactBootstrap.Button>
                            </ReactBootstrap.Col>
                          </ReactBootstrap.Row>
                        </Form>
                      )}
                    </Formik>
                  </ReactBootstrap.Col>
                </ReactBootstrap.Row>
              </ReactBootstrap.Accordion.Body>
            </ReactBootstrap.Accordion.Item>
            <ReactBootstrap.Accordion.Item eventKey="1">
              <ReactBootstrap.Accordion.Header>{t('app-step-two')}</ReactBootstrap.Accordion.Header>
              <ReactBootstrap.Accordion.Body>
                <ReactBootstrap.Row>
                  <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                    <h4>{t('app-step-two')}</h4>
                  </ReactBootstrap.Col>
                  <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Formik
                      initialValues={{
                        id: '',
                        env: '',
                        applist: '',
                        cmd: '',
                        arg: '',
                      }}
                      validationSchema={phasesCFGApplistSchema}
                      onSubmit={SUBMIT_HANDLED_BY_FORM}
                    >
                      {({ errors, touched }) => (
                        <Form onSubmit={phasesCFGApplist} id="form-phases-cfg-applist">
                          <ReactBootstrap.Row>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-id-phases-cfg-applist">{t('vm-id')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-id-phases-cfg-applist"
                                name="vm-id-phases-cfg-applist"
                                value={objectID}
                                onChange={changeVMPhasesIDCFGApplist}
                                disabled={true}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-id-phases-cfg-applist')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-env-phases-cfg-applist">{t('vm-env')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-env-phases-cfg-applist"
                                name="vm-env-phases-cfg-applist"
                                value={objectENVName}
                                onChange={changeVMPhasesENVCFGApplist}
                                disabled={true}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-env-phases-cfg-applist')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-name-phases-cfg-applist">{t('vm-name')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-name-phases-cfg-applist"
                                name="vm-name-phases-cfg-applist"
                                value={vmPhasesNameCFGApplist}
                                onChange={changeVMPhasesNameCFGApplist}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-name-phases-cfg-applist')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-command-phases-cfg-applist">{t('vm-command')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-command-phases-cfg-applist"
                                name="vm-command-phases-cfg-applist"
                                value={vmPhasesCommandCFGApplist}
                                onChange={changeVMPhasesCommandCFGApplist}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-command-phases-cfg-applist')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-arguments-phases-cfg-applist">{t('vm-arguments')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-arguments-phases-cfg-applist"
                                name="vm-arguments-phases-cfg-applist"
                                value={vmPhasesArgumentsCFGApplist}
                                onChange={changeVMPhasesArgumentsCFGApplist}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-arguments-phases-cfg-applist')}</div>
                          </ReactBootstrap.Row>
                          <ReactBootstrap.Row>
                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                              <ReactBootstrap.Button
                                type="submit"
                                variant="primary"
                                id="submit"
                                disabled={
                                  vmPhasesIDCFGApplist.length > 0 &&
                                  vmPhasesNameCFGApplist.length > 0 &&
                                  vmPhasesCommandCFGApplist.length > 0
                                    ? false
                                    : true
                                }
                              >
                                {t('submit')}
                              </ReactBootstrap.Button>
                            </ReactBootstrap.Col>
                          </ReactBootstrap.Row>
                        </Form>
                      )}
                    </Formik>
                  </ReactBootstrap.Col>
                </ReactBootstrap.Row>
              </ReactBootstrap.Accordion.Body>
            </ReactBootstrap.Accordion.Item>
            <ReactBootstrap.Accordion.Item eventKey="2">
              <ReactBootstrap.Accordion.Header>{t('app-step-three')}</ReactBootstrap.Accordion.Header>
              <ReactBootstrap.Accordion.Body>
                <ReactBootstrap.Row>
                  <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                    <h4>{t('app-step-three')}</h4>
                  </ReactBootstrap.Col>
                  <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Formik
                      initialValues={{
                        id: '',
                        env: '',
                        target: '',
                        name: '',
                        cmd: '',
                        arg: '',
                      }}
                      validationSchema={phasesCFGTargetSchema}
                      onSubmit={SUBMIT_HANDLED_BY_FORM}
                    >
                      {({ errors, touched }) => (
                        <Form onSubmit={phasesCFGTarget} id="form-phases-cfg-target">
                          <ReactBootstrap.Row>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-id-phases-cfg-target">{t('vm-id')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-id-phases-cfg-target"
                                name="vm-id-phases-cfg-target"
                                value={objectID}
                                onChange={changeVMPhasesIDCFGTarget}
                                disabled={true}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-id-phases-cfg-target')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-env-phases-cfg-target">{t('vm-env')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-env-phases-cfg-target"
                                name="vm-env-phases-cfg-target"
                                value={objectENVName}
                                onChange={changeVMPhasesENVCFGTarget}
                                disabled={true}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-env-phases-cfg-target')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-name-phases-cfg-target">{t('vm-name')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-name-phases-cfg-target"
                                name="vm-name-phases-cfg-target"
                                value={vmPhasesNameCFGTarget}
                                onChange={changeVMPhasesNameCFGTarget}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-name-phases-cfg-target')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-command-phases-cfg-target">{t('vm-command')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-command-phases-cfg-target"
                                name="vm-command-phases-cfg-target"
                                value={vmPhasesCommandCFGTarget}
                                onChange={changeVMPhasesCommandCFGTarget}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-command-phases-cfg-target')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-arguments-phases-cfg-target">{t('vm-arguments')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-arguments-phases-cfg-target"
                                name="vm-arguments-phases-cfg-target"
                                value={vmPhasesArgumentsCFGTarget}
                                onChange={changeVMPhasesArgumentsCFGTarget}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-arguments-phases-cfg-target')}</div>
                          </ReactBootstrap.Row>
                          <ReactBootstrap.Row>
                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                              <ReactBootstrap.Button
                                type="submit"
                                variant="primary"
                                id="submit"
                                disabled={
                                  vmPhasesIDCFGTarget.length > 0 &&
                                  vmPhasesNameCFGTarget.length > 0 &&
                                  vmPhasesCommandCFGTarget.length > 0
                                    ? false
                                    : true
                                }
                              >
                                {t('submit')}
                              </ReactBootstrap.Button>
                            </ReactBootstrap.Col>
                          </ReactBootstrap.Row>
                        </Form>
                      )}
                    </Formik>
                  </ReactBootstrap.Col>
                </ReactBootstrap.Row>
              </ReactBootstrap.Accordion.Body>
            </ReactBootstrap.Accordion.Item>
          </ReactBootstrap.Accordion>
        </ReactBootstrap.Row>
        <Formik
          initialValues={{
            id: '',
          }}
          validationSchema={objectBaseimageFinalizeSchema}
          onSubmit={SUBMIT_HANDLED_BY_FORM}
        >
          {({ errors, touched }) => (
            <Form onSubmit={objectBaseimageFinalize} id="expert-mode-object-finalize">
              <ReactBootstrap.Row>
                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                  <h3>{t('title-baseimage-finalize')}</h3>
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                  {t('button-baseimage-finalize-info-text')}
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <ReactBootstrap.Button type="submit" variant="primary" id="submit">
                    {t('button-baseimage-finalize')}
                  </ReactBootstrap.Button>
                </ReactBootstrap.Col>
              </ReactBootstrap.Row>
            </Form>
          )}
        </Formik>
      </ReactBootstrap.Container>
      <ReactBootstrap.Container className="user-app-env-view">
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <RequestAlert alert={requestAlert} />
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>
        <ReactBootstrap.Row>
          <BackLink to={ROUTES.dashboard} />
        </ReactBootstrap.Row>
      </ReactBootstrap.Container>
    </>
  );
}

export default ObjectBaseImageSetup;
