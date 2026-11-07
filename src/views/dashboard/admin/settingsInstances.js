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
const log = createLogger('SettingsInstances');

function SettingsInstances() {
  const [vmIDApp, setVMIDApp] = useState('');
  const [vmENVApp, setVMENVApp] = useState('');
  const [vmCMDApp, setVMCMDApp] = useState('');
  const [vmARGSApp, setVMARGSApp] = useState('');
  const [vmIDCommand, setVMIDCommand] = useState('');
  const [vmENVCommand, setVMENVCommand] = useState('');
  const [vmCMDCommand, setVMCMDCommand] = useState('');
  const [vmARGSCommand, setVMARGSCommand] = useState('');
  const [vmIDSSH, setVMIDSSH] = useState('');
  const [vmENVSSH, setVMENVSSH] = useState('');
  const [vmCMDSSH, setVMCMDSSH] = useState('');
  const [vmARGSSSH, setVMARGSSSH] = useState('');
  const [vmIDAction, setVMIDAction] = useState('');
  const [vmENVAction, setVMENVAction] = useState('');
  const [vmCMDAction, setVMCMDAction] = useState('');
  const [vmARGSAction, setVMARGSAction] = useState('');
  const [vmIDResize, setVMIDResize] = useState('');
  const [vmENVResize, setVMENVResize] = useState('');
  const [vmCMDResize, setVMCMDResize] = useState('');
  const [vmARGSResize, setVMARGSResize] = useState('');
  const [vmIDOSPackage, setVMIDOSPackage] = useState('');
  const [vmENVOSPackage, setVMENVOSPackage] = useState('');
  const [vmCMDOSPackage, setVMCMDOSPackage] = useState('');
  const [vmARGSOSPackage, setVMARGSOSPackage] = useState('');
  const [vmIDUpload, setVMIDUpload] = useState('');
  const [vmENVUpload, setVMENVUpload] = useState('');
  const [vmFileUpload, setVMFileUpload] = useState({});
  const [isCheckedExecuteUpload, setIsCheckedExecuteUpload] = useState(false);
  const [vmIDMount, setVMIDMount] = useState('');
  const [vmENVMount, setVMENVMount] = useState('');
  const [vmCommandMount, setVMCommandMount] = useState('mount');
  const [vmCephPublicChecked, setVMCephPublicChecked] = useState(false);
  const [vmCephSharedChecked, setVMCephSharedChecked] = useState(false);
  const [vmCephUserChecked, setVMCephUserChecked] = useState(false);
  const [vmIDConnectionICMP, setVMIDConnectionICMP] = useState('');
  const [vmENVConnectionICMP, setVMENVConnectionICMP] = useState('');
  const [vmIDConnectionSSH, setVMIDConnectionSSH] = useState('');
  const [vmENVConnectionSSH, setVMENVConnectionSSH] = useState('');
  const [vmInstanceList, setVMInstanceList] = useState([]);
  const [vmInstanceListSubmit, setVMInstanceListSubmit] = useState(false);
  const [vmIDRoundtrip, setVMIDRoundtrip] = useState('');
  const [vmENVRoundtrip, setVMENVRoundtrip] = useState('');
  const [vmIterationRoundtrip, setVMIterationRoundtrip] = useState('');
  const [vmNameRoundtrip, setVMNameRoundtrip] = useState('');
  const [vmCMDRoundtrip, setVMCMDRoundtrip] = useState('');
  const [vmARGSRoundtrip, setVMARGSRoundtrip] = useState('');
  const { requestAlert, showRequestAlert } = useRequestAlert();
  const { t } = useTranslation();

  const appInstanceVirtualEnvironment = (event) => {
    event.preventDefault();

    daasClient
      .post('/inst/vminvoke_app', {
        id: vmIDApp,
        id_env: vmENVApp,
        cmd: vmCMDApp,
        args: vmARGSApp,
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
        log.error('appInstanceVirtualEnvironment failed', e);
        showRequestAlert(false);
      });
  };

  const commandInstanceVirtualEnvironment = (event) => {
    event.preventDefault();

    daasClient
      .post('/inst/vminvoke_cmd', {
        id: vmIDCommand,
        id_env: vmENVCommand,
        cmd: vmCMDCommand,
        args: vmARGSCommand,
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
        log.error('commandInstanceVirtualEnvironment failed', e);
        showRequestAlert(false);
      });
  };

  const sshInstanceVirtualEnvironment = (event) => {
    event.preventDefault();

    daasClient
      .post('/inst/vminvoke_ssh', {
        id: vmIDSSH,
        id_env: vmENVSSH,
        cmd: vmCMDSSH,
        args: vmARGSSSH,
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
        log.error('sshInstanceVirtualEnvironment failed', e);
        showRequestAlert(false);
      });
  };

  const actionInstanceVirtualEnvironment = (event) => {
    event.preventDefault();

    daasClient
      .post('/inst/vminvoke_action', {
        id: vmIDAction,
        id_env: vmENVAction,
        cmd: vmCMDAction,
        args: vmARGSAction,
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
        log.error('actionInstanceVirtualEnvironment failed', e);
        showRequestAlert(false);
      });
  };

  const resizeInstanceVirtualEnvironment = (event) => {
    event.preventDefault();

    daasClient
      .post('/inst/vminvoke_resolution', {
        id: vmIDResize,
        id_env: vmENVResize,
        cmd: vmCMDResize,
        args: vmARGSResize,
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
        log.error('resizeInstanceVirtualEnvironment failed', e);
        showRequestAlert(false);
      });
  };

  const osPackageInstanceVirtualEnvironment = (event) => {
    event.preventDefault();

    daasClient
      .post('/inst/vminvoke_ospackage', {
        id: vmIDOSPackage,
        id_env: vmENVOSPackage,
        cmd: vmCMDOSPackage,
        args: vmARGSOSPackage,
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
        log.error('osPackageInstanceVirtualEnvironment failed', e);
        showRequestAlert(false);
      });
  };

  const uploadInstanceVirtualEnvironment = (event) => {
    event.preventDefault();

    daasClient
      .post('/inst/vminvoke_upload', {
        id: vmIDUpload,
        id_env: vmENVUpload,
        file: vmFileUpload,
        execute: isCheckedExecuteUpload ? 'on' : '',
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
        log.error('uploadInstanceVirtualEnvironment failed', e);
        showRequestAlert(false);
      });
  };

  const mountInstanceVirtualEnvironment = (event) => {
    event.preventDefault();

    daasClient
      .post('/inst/vminvoke_cephfs', {
        id: vmIDMount,
        id_env: vmENVMount,
        cmd: vmCommandMount,
        ceph_public: vmCephPublicChecked ? 'on' : '',
        ceph_shared: vmCephSharedChecked ? 'on' : '',
        ceph_user: vmCephUserChecked ? 'on' : '',
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
        log.error('mountInstanceVirtualEnvironment failed', e);
        showRequestAlert(false);
      });
  };

  const connectionICMPInstanceVirtualEnvironment = (event) => {
    event.preventDefault();

    daasClient
      .post('/inst/connection_test_icmp', {
        id: vmIDConnectionICMP,
        id_env: vmENVConnectionICMP,
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
        log.error('connectionICMPInstanceVirtualEnvironment failed', e);
        showRequestAlert(false);
      });
  };

  const connectionSSHInstanceVirtualEnvironment = (event) => {
    event.preventDefault();

    daasClient
      .post('/inst/connection_test_ssh', {
        id: vmIDConnectionSSH,
        id_env: vmENVConnectionSSH,
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
        log.error('connectionSSHInstanceVirtualEnvironment failed', e);
        showRequestAlert(false);
      });
  };

  const instanceList = (event) => {
    event.preventDefault();

    daasClient
      .post('/inst/list', {})
      .then((response) => {
        if (response.status === 200 && response.data.response_code === 200) {
          showRequestAlert(true);
          setVMInstanceList(response.data.response_data);
          setVMInstanceListSubmit(true);
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          showRequestAlert(false);
          setVMInstanceList([]);
          setVMInstanceListSubmit(false);
        }
      })
      .catch((e) => {
        log.error('instanceList failed', e);
        showRequestAlert(false);
        setVMInstanceList([]);
        setVMInstanceListSubmit(false);
      });
  };

  const roundtripInstances = (event) => {
    event.preventDefault();

    daasClient
      .post('/tests/measure_rtt', {
        id: vmIDRoundtrip,
        id_env: vmENVRoundtrip,
        iter: vmIterationRoundtrip,
        name: vmNameRoundtrip,
        cmd: vmCMDRoundtrip,
        args: vmARGSRoundtrip,
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
        log.error('roundtripInstances failed', e);
        showRequestAlert(false);
      });
  };

  const changeVMIDApp = (event) => {
    setVMIDApp(event.target.value);
  };

  const changeVMENVApp = (event) => {
    setVMENVApp(event.target.value);
  };

  const changeVMCMDApp = (event) => {
    setVMCMDApp(event.target.value);
  };

  const changeVMARGSApp = (event) => {
    setVMARGSApp(event.target.value);
  };

  const changeVMIDCommand = (event) => {
    setVMIDCommand(event.target.value);
  };

  const changeVMENVCommand = (event) => {
    setVMENVCommand(event.target.value);
  };

  const changeVMCMDCommand = (event) => {
    setVMCMDCommand(event.target.value);
  };

  const changeVMARGSCommand = (event) => {
    setVMARGSCommand(event.target.value);
  };

  const changeVMIDSSH = (event) => {
    setVMIDSSH(event.target.value);
  };

  const changeVMENVSSH = (event) => {
    setVMENVSSH(event.target.value);
  };

  const changeVMCMDSSH = (event) => {
    setVMCMDSSH(event.target.value);
  };

  const changeVMARGSSSH = (event) => {
    setVMARGSSSH(event.target.value);
  };

  const changeVMIDAction = (event) => {
    setVMIDAction(event.target.value);
  };

  const changeVMENVAction = (event) => {
    setVMENVAction(event.target.value);
  };

  const changeVMCMDAction = (event) => {
    setVMCMDAction(event.target.value);
  };

  const changeVMARGSAction = (event) => {
    setVMARGSAction(event.target.value);
  };

  const changeVMIDResize = (event) => {
    setVMIDResize(event.target.value);
  };

  const changeVMENVResize = (event) => {
    setVMENVResize(event.target.value);
  };

  const changeVMCMDResize = (event) => {
    setVMCMDResize(event.target.value);
  };

  const changeVMARGSResize = (event) => {
    setVMARGSResize(event.target.value);
  };

  const changeVMIDOSPackage = (event) => {
    setVMIDOSPackage(event.target.value);
  };

  const changeVMENVOSPackage = (event) => {
    setVMENVOSPackage(event.target.value);
  };

  const changeVMCMDOSPackage = (event) => {
    setVMCMDOSPackage(event.target.value);
  };

  const changeVMARGSOSPackage = (event) => {
    setVMARGSOSPackage(event.target.value);
  };

  const changeVMIDUpload = (event) => {
    setVMIDUpload(event.target.value);
  };

  const changeVMENVUpload = (event) => {
    setVMENVUpload(event.target.value);
  };

  const changeVMFileUpload = (event) => {
    if (event.target.files) {
      setVMFileUpload(event.target.files[0]);
    }
  };

  const checkChangeVMExecuteUpload = () => setIsCheckedExecuteUpload((checked) => !checked);

  const changeVMIDMount = (event) => {
    setVMIDMount(event.target.value);
  };

  const changeVMENVMount = (event) => {
    setVMENVMount(event.target.value);
  };

  const changeVMCommandMount = (event) => {
    setVMCommandMount(event.target.value);
  };

  const checkChangeVMCephPublic = () => setVMCephPublicChecked((checked) => !checked);

  const checkChangeVMCephShared = () => setVMCephSharedChecked((checked) => !checked);

  const checkChangeVMCephUser = () => setVMCephUserChecked((checked) => !checked);

  const changeVMIDConnectionICMP = (event) => {
    setVMIDConnectionICMP(event.target.value);
  };

  const changeVMENVConnectionICMP = (event) => {
    setVMENVConnectionICMP(event.target.value);
  };

  const changeVMIDConnectionSSH = (event) => {
    setVMIDConnectionSSH(event.target.value);
  };

  const changeVMENVConnectionSSH = (event) => {
    setVMENVConnectionSSH(event.target.value);
  };

  const changeVMIDRoundtrip = (event) => {
    setVMIDRoundtrip(event.target.value);
  };

  const changeVMENVRoundtrip = (event) => {
    setVMENVRoundtrip(event.target.value);
  };

  const changeVMIterationRoundtrip = (event) => {
    setVMIterationRoundtrip(event.target.value);
  };

  const changeVMNameRoundtrip = (event) => {
    setVMNameRoundtrip(event.target.value);
  };

  const changeVMCMDRoundtrip = (event) => {
    setVMCMDRoundtrip(event.target.value);
  };

  const changeVMARGSRoundtrip = (event) => {
    setVMARGSRoundtrip(event.target.value);
  };

  const appInstanceSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    id_env: Yup.string().required('Environment invalid'),
    cmd: Yup.string().required('Command invalid'),
    args: Yup.string(),
  });

  const commandInstanceSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    id_env: Yup.string().required('Environment invalid'),
    cmd: Yup.string().required('Command invalid'),
    args: Yup.string(),
  });

  const sshInstanceSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    id_env: Yup.string().required('Environment invalid'),
    cmd: Yup.string().required('Command invalid'),
    args: Yup.string(),
  });

  const actionInstanceSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    id_env: Yup.string().required('Environment invalid'),
    cmd: Yup.string().required('Command invalid'),
    args: Yup.string(),
  });

  const resizeInstanceSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    id_env: Yup.string().required('Environment invalid'),
    cmd: Yup.string().required('Command invalid'),
    args: Yup.string(),
  });

  const osPackageInstanceSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    id_env: Yup.string().required('Environment invalid'),
    cmd: Yup.string().required('Command invalid'),
    args: Yup.string(),
  });

  const uploadInstanceSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    id_env: Yup.string().required('Environment invalid'),
    file: Yup.string().required('file invalid'),
    execute: Yup.string().required('Execute invalid'),
  });

  const mountInstanceSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    id_env: Yup.string().required('Environment invalid'),
    ceph_public: Yup.string().required('Ceph public invalid'),
    ceph_shared: Yup.string().required('Ceph shared invalid'),
    ceph_user: Yup.string().required('Ceph user invalid'),
  });

  const connectionICMPInstanceSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    id_env: Yup.string().required('Environment invalid'),
  });

  const connectionSSHInstanceSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    id_env: Yup.string().required('Environment invalid'),
  });

  const instanceListSchema = Yup.object().shape({});

  const roundtripInstanceSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    id_env: Yup.string().required('Environment invalid'),
    iter: Yup.string().required('Iteration invalid'),
    name: Yup.string().required('Name invalid'),
    cmd: Yup.string().required('Command invalid'),
    args: Yup.string().required('Arguments invalid'),
  });

  return (
    <>
      <Header />
      <ReactBootstrap.Container id="settingsOverviewInstanceVirtualEnvironment" fluid={true}>
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
            <div>
              <h2>{t('vm-instance')}</h2>
            </div>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>
        <ReactBootstrap.Tabs defaultActiveKey="instance-app" id="all-config-instance">
          <ReactBootstrap.Tab eventKey="instance-app" title={t('vm-instance-app')}>
            <Formik
              initialValues={{
                id: '',
                id_env: '',
                cmd: '',
                args: '',
              }}
              validationSchema={appInstanceSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {({ errors, touched }) => (
                <Form onSubmit={appInstanceVirtualEnvironment} id="form-instance-app">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-app">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field type="text" id="vm-id-app" name="vm-id-app" value={vmIDApp} onChange={changeVMIDApp} />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-app')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-env-app">{t('vm-env')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field type="text" id="vm-env-app" name="vm-env-app" value={vmENVApp} onChange={changeVMENVApp} />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-env-app')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-cmd-app">{t('vm-instance-command')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field type="text" id="vm-cmd-app" name="vm-cmd-app" value={vmCMDApp} onChange={changeVMCMDApp} />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-cmd-app')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-args-app">{t('vm-instance-arguments')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-args-app"
                        name="vm-args-app"
                        value={vmARGSApp}
                        onChange={changeVMARGSApp}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-args-app')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDApp.length > 0 && vmCMDApp.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="instance-cmd" title={t('vm-instance-command')}>
            <Formik
              initialValues={{
                id: '',
                id_env: '',
                cmd: '',
                args: '',
              }}
              validationSchema={commandInstanceSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {({ errors, touched }) => (
                <Form onSubmit={commandInstanceVirtualEnvironment} id="form-instance-command">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-command">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-command"
                        name="vm-id-command"
                        value={vmIDCommand}
                        onChange={changeVMIDCommand}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-command')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-env-command">{t('vm-env')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-env-command"
                        name="vm-env-command"
                        value={vmENVCommand}
                        onChange={changeVMENVCommand}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-env-command')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-cmd-command">{t('vm-instance-command')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-cmd-command"
                        name="vm-cmd-command"
                        value={vmCMDCommand}
                        onChange={changeVMCMDCommand}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-cmd-command')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-args-command">{t('vm-instance-arguments')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-args-command"
                        name="vm-args-command"
                        value={vmARGSCommand}
                        onChange={changeVMARGSCommand}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-args-command')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDCommand.length > 0 && vmCMDCommand.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="instance-ssh" title={t('vm-instance-ssh')}>
            <Formik
              initialValues={{
                id: '',
                id_env: '',
                cmd: '',
                args: '',
              }}
              validationSchema={sshInstanceSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {({ errors, touched }) => (
                <Form onSubmit={sshInstanceVirtualEnvironment} id="form-instance-ssh">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-ssh">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field type="text" id="vm-id-ssh" name="vm-id-ssh" value={vmIDSSH} onChange={changeVMIDSSH} />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-ssh')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-env-ssh">{t('vm-env')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field type="text" id="vm-env-ssh" name="vm-env-ssh" value={vmENVSSH} onChange={changeVMENVSSH} />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-env-ssh')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-cmd-ssh">{t('vm-instance-command')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field type="text" id="vm-cmd-ssh" name="vm-cmd-ssh" value={vmCMDSSH} onChange={changeVMCMDSSH} />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-cmd-ssh')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-args-ssh">{t('vm-instance-arguments')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-args-ssh"
                        name="vm-args-ssh"
                        value={vmARGSSSH}
                        onChange={changeVMARGSSSH}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-args-ssh')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDSSH.length > 0 && vmCMDSSH.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="instance-status" title={t('vm-instance-status')}>
            <Formik
              initialValues={{
                id: '',
                id_env: '',
                cmd: '',
                args: '',
              }}
              validationSchema={actionInstanceSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {({ errors, touched }) => (
                <Form onSubmit={actionInstanceVirtualEnvironment} id="form-instance-action">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-status">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-status"
                        name="vm-id-status"
                        value={vmIDAction}
                        onChange={changeVMIDAction}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-status')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-env-action">{t('vm-env')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-env-action"
                        name="vm-env-ssh"
                        value={vmENVAction}
                        onChange={changeVMENVAction}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-env-action')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-cmd-status">{t('vm-instance-command')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-cmd-status"
                        name="vm-cmd-status"
                        value={vmCMDAction}
                        onChange={changeVMCMDAction}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-cmd-status')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-args-status">{t('vm-instance-arguments')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-args-status"
                        name="vm-args-status"
                        value={vmARGSAction}
                        onChange={changeVMARGSAction}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-args-status')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDAction.length > 0 && vmCMDAction.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="instance-resize" title={t('vm-instance-resize')}>
            <Formik
              initialValues={{
                id: '',
                id_env: '',
                cmd: '',
                args: '',
              }}
              validationSchema={resizeInstanceSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {({ errors, touched }) => (
                <Form onSubmit={resizeInstanceVirtualEnvironment} id="form-instance-resize">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-resize">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-resize"
                        name="vm-id-resize"
                        value={vmIDResize}
                        onChange={changeVMIDResize}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-resize')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-env-resize">{t('vm-env')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-env-resize"
                        name="vm-env-resize"
                        value={vmENVResize}
                        onChange={changeVMENVResize}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-env-resize')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-cmd-resize">{t('vm-instance-command')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-cmd-resize"
                        name="vm-cmd-resize"
                        value={vmCMDResize}
                        onChange={changeVMCMDResize}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-cmd-resize')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-args-resize">{t('vm-instance-arguments')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-args-resize"
                        name="vm-args-resize"
                        value={vmARGSResize}
                        onChange={changeVMARGSResize}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-args-resize')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDResize.length > 0 && vmCMDResize.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="instance-os-package" title={t('vm-instance-os-package')}>
            <Formik
              initialValues={{
                id: '',
                id_env: '',
                cmd: '',
                args: '',
              }}
              validationSchema={osPackageInstanceSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {({ errors, touched }) => (
                <Form onSubmit={osPackageInstanceVirtualEnvironment} id="form-instance-resize">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-os-package">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-os-package"
                        name="vm-id-os-package"
                        value={vmIDOSPackage}
                        onChange={changeVMIDOSPackage}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-os-package')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-env-os-package">{t('vm-env')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-env-os-package"
                        name="vm-env-os-package"
                        value={vmENVOSPackage}
                        onChange={changeVMENVOSPackage}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-env-os-package')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-cmd-os-package">{t('vm-instance-command')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-cmd-os-package"
                        name="vm-cmd-os-package"
                        value={vmCMDOSPackage}
                        onChange={changeVMCMDOSPackage}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-cmd-os-package')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-args-os-package">{t('vm-instance-arguments')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-args-os-package"
                        name="vm-args-os-package"
                        value={vmARGSOSPackage}
                        onChange={changeVMARGSOSPackage}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-args-os-package')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDOSPackage.length > 0 && vmCMDOSPackage.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="instance-upload" title={t('vm-instance-upload')}>
            <Formik
              initialValues={{
                id: '',
                id_env: '',
                file: '',
                execute: '',
              }}
              validationSchema={uploadInstanceSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {({ errors, touched }) => (
                <Form onSubmit={uploadInstanceVirtualEnvironment} id="form-instance-upload">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-upload">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-upload"
                        name="vm-id-upload"
                        value={vmIDUpload}
                        onChange={changeVMIDUpload}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-upload')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-env-upload">{t('vm-env')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-env-upload"
                        name="vm-env-upload"
                        value={vmENVUpload}
                        onChange={changeVMENVUpload}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-env-upload')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-file-upload">{t('vm-file')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input id="vm-file-upload" name="vm-file-upload" type="file" onChange={changeVMFileUpload} />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-file-upload')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-execute-upload">{t('vm-execute')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="checkbox"
                        id="vm-execute-upload"
                        name="vm-execute-upload"
                        checked={isCheckedExecuteUpload}
                        onChange={checkChangeVMExecuteUpload}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-execute-upload')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDUpload.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="instance-mount" title={t('vm-instance-mount-ceph')}>
            <Formik
              initialValues={{
                id: '',
                id_env: '',
                ceph_public: '',
                ceph_shared: '',
                ceph_user: '',
              }}
              validationSchema={mountInstanceSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {({ errors, touched }) => (
                <Form onSubmit={mountInstanceVirtualEnvironment} id="form-instance-mount">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-mount">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-mount"
                        name="vm-id-mount"
                        value={vmIDMount}
                        onChange={changeVMIDMount}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-mount')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-env-mount">{t('vm-env')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-env-mount"
                        name="vm-env-mount"
                        value={vmENVMount}
                        onChange={changeVMENVMount}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-env-mount')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-command-mount">{t('vm-command')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <select
                        id="vm-command-mount"
                        name="vm-command-mount"
                        value={vmCommandMount}
                        onChange={changeVMCommandMount}
                      >
                        <option value="mount">{t('mount')}</option>
                        <option value="unmount">{t('unmount')}</option>
                      </select>
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-command-mount')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-ceph-public">{t('vm-ceph-public')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="checkbox"
                        id="vm-ceph-public"
                        name="vm-ceph-public"
                        checked={vmCephPublicChecked}
                        onChange={checkChangeVMCephPublic}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-ceph-public')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-ceph-shared">{t('vm-ceph-shared')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="checkbox"
                        id="vm-ceph-shared"
                        name="vm-ceph-shared"
                        checked={vmCephSharedChecked}
                        onChange={checkChangeVMCephShared}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-ceph-shared')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-ceph-user">{t('vm-ceph-user')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="checkbox"
                        id="vm-ceph-user"
                        name="vm-ceph-user"
                        checked={vmCephUserChecked}
                        onChange={checkChangeVMCephUser}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-ceph-user')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDMount.length > 0 && vmCommandMount.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="instance-list" title={t('vm-instance-list')}>
            <Formik initialValues={{}} validationSchema={instanceListSchema} onSubmit={SUBMIT_HANDLED_BY_FORM}>
              {({ errors, touched }) => (
                <Form onSubmit={instanceList} id="form-instance-list">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button type="submit" variant="primary" id="submit" disabled={false}>
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
            {vmInstanceListSubmit ? (
              <ReactBootstrap.Row id="form-instance-list">
                {vmInstanceList.length > 0 ? (
                  vmInstanceList.map((data) => {
                    return (
                      <>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          Env:
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {data.env}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          Instance:
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {data.instance}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          Name:
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {data.name}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          Object:
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {data.object}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          Viewer - URL:
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {data.viewer_url === '' ? '-' : data.viewer_url}
                        </ReactBootstrap.Col>
                      </>
                    );
                  })
                ) : (
                  <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    {t('no-data-available')}
                  </ReactBootstrap.Col>
                )}
              </ReactBootstrap.Row>
            ) : (
              <></>
            )}
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="instance-connection-icmp" title={t('vm-instance-connection-icmp')}>
            <Formik
              initialValues={{
                id: '',
                id_env: '',
              }}
              validationSchema={connectionICMPInstanceSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {({ errors, touched }) => (
                <Form onSubmit={connectionICMPInstanceVirtualEnvironment} id="form-instance-connection-icmp">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-connection-icmp">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-connection-icmp"
                        name="vm-id-connection-icmp"
                        value={vmIDConnectionICMP}
                        onChange={changeVMIDConnectionICMP}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-connection-icmp')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-env-connection-icmp">{t('vm-env')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-env-connection-icmp"
                        name="vm-env-connection-icmp"
                        value={vmENVConnectionICMP}
                        onChange={changeVMENVConnectionICMP}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-env-connection-icmp')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDConnectionICMP.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="instance-connection-ssh" title={t('vm-instance-connection-ssh')}>
            <Formik
              initialValues={{
                id: '',
                id_env: '',
              }}
              validationSchema={connectionSSHInstanceSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {({ errors, touched }) => (
                <Form onSubmit={connectionSSHInstanceVirtualEnvironment} id="form-instance-connection-ssh">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-connection-ssh">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-connection-ssh"
                        name="vm-id-connection-ssh"
                        value={vmIDConnectionSSH}
                        onChange={changeVMIDConnectionSSH}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-connection-ssh')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-env-connection-ssh">{t('vm-env')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-env-connection-ssh"
                        name="vm-env-connection-ssh"
                        value={vmENVConnectionSSH}
                        onChange={changeVMENVConnectionSSH}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-env-connection-ssh')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDConnectionSSH.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="instance-roundtrip" title={t('vm-instance-roundtrip')}>
            <Formik
              initialValues={{
                id: '',
                id_env: '',
                iter: '',
                name: '',
                cmd: '',
                args: '',
              }}
              validationSchema={roundtripInstanceSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {({ errors, touched }) => (
                <Form onSubmit={roundtripInstances} id="form-instance-roundtrip">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-roundtrip">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-roundtrip"
                        name="vm-id-roundtrip"
                        value={vmIDRoundtrip}
                        onChange={changeVMIDRoundtrip}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-roundtrip')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-env-roundtrip">{t('vm-env')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-env-roundtrip"
                        name="vm-env-roundtrip"
                        value={vmENVRoundtrip}
                        onChange={changeVMENVRoundtrip}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-env-roundtrip')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-iteration-roundtrip">{t('vm-iteration')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-iteration-roundtrip"
                        name="vm-iteration-roundtrip"
                        value={vmIterationRoundtrip}
                        onChange={changeVMIterationRoundtrip}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-iteration-roundtrip')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-name-roundtrip">{t('vm-name')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-name-roundtrip"
                        name="vm-name-roundtrip"
                        value={vmNameRoundtrip}
                        onChange={changeVMNameRoundtrip}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-name-roundtrip')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-command-roundtrip">{t('vm-command')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-command-roundtrip"
                        name="vm-command-roundtrip"
                        value={vmCMDRoundtrip}
                        onChange={changeVMCMDRoundtrip}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-command-roundtrip')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-arguments-roundtrip">{t('vm-arguments')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-arguments-roundtrip"
                        name="vm-arguments-roundtrip"
                        value={vmARGSRoundtrip}
                        onChange={changeVMARGSRoundtrip}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-arguments-roundtrip')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDRoundtrip.length > 0 ? false : true}
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

export default SettingsInstances;
