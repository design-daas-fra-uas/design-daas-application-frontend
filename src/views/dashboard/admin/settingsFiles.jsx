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
const log = createLogger('SettingsFiles');

function SettingsFiles() {
  const [vmChoiceList, setVMChoiceList] = useState('user');
  const [vmChoiceListResult, setVMChoiceListResult] = useState({});
  const [vmChoiceListSubmit, setVMChoiceListSubmit] = useState(false);
  const [vmGetFileID, setVMGetFileID] = useState('');
  const [vmGetAppResult, setVMGetAppResult] = useState({});
  const [vmGetAppSubmit, setVMGetAppSubmit] = useState(false);
  const [vmDeleteAllID, setVMDeleteAllID] = useState('');
  const [vmDeleteID, setVMDeleteID] = useState('');
  const [vmFileUploadAppID, setVMFileUploadAppID] = useState('');
  const [vmFileUploadAppName, setVMFileUploadAppName] = useState('');
  const [vmFileUploadAppPath, setVMFileUploadAppPath] = useState('');
  const [vmFileUploadAppOSType, setVMFileUploadAppOSType] = useState('win10');
  const [vmFileUploadAppVersion, setVMFileUploadAppVersion] = useState('');
  const [vmFileUploadAppSelectFile, setVMFileUploadAppSelectFile] = useState('');
  const { requestAlert, showRequestAlert } = useRequestAlert();
  const { t } = useTranslation();

  const createFile = (event) => {
    event.preventDefault();

    daasClient
      .post('/files/create', {
        id: vmFileUploadAppID,
        filename: vmFileUploadAppName,
        filepath: vmFileUploadAppPath,
        os_type: vmFileUploadAppOSType,
        version: vmFileUploadAppVersion,
        file: vmFileUploadAppSelectFile,
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
        log.error('createFile failed', e);
        showRequestAlert(false);
      });
  };

  const createSharedFile = (event) => {
    event.preventDefault();

    daasClient
      .post('/files/create_shared', {
        id: vmFileUploadAppID,
        filename: vmFileUploadAppName,
        filepath: vmFileUploadAppPath,
        os_type: vmFileUploadAppOSType,
        version: vmFileUploadAppVersion,
        file: vmFileUploadAppSelectFile,
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
        log.error('createSharedFile failed', e);
        showRequestAlert(false);
      });
  };

  const updateFile = (event) => {
    event.preventDefault();

    daasClient
      .post('/files/update', {
        id: vmFileUploadAppID,
        filename: vmFileUploadAppName,
        filepath: vmFileUploadAppPath,
        os_type: vmFileUploadAppOSType,
        version: vmFileUploadAppVersion,
        file: vmFileUploadAppSelectFile,
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
        log.error('updateFile failed', e);
        showRequestAlert(false);
      });
  };

  const updateSharedFile = (event) => {
    event.preventDefault();

    daasClient
      .post('/files/update_shared', {
        id: vmFileUploadAppID,
        filename: vmFileUploadAppName,
        filepath: vmFileUploadAppPath,
        os_type: vmFileUploadAppOSType,
        version: vmFileUploadAppVersion,
        file: vmFileUploadAppSelectFile,
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
        log.error('updateSharedFile failed', e);
        showRequestAlert(false);
      });
  };

  const getFile = (event) => {
    event.preventDefault();

    daasClient
      .post('/files/get', {
        id: vmGetFileID,
      })
      .then((response) => {
        if (response.status === 200 && response.data.response_code === 200) {
          showRequestAlert(true);
          setVMGetAppResult(response.data.response_data);
          setVMGetAppSubmit(true);
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          showRequestAlert(false);
          setVMGetAppResult({});
          setVMGetAppSubmit(true);
        }
      })
      .catch((e) => {
        log.error('getFile failed', e);
        showRequestAlert(false);
        setVMGetAppResult({});
        setVMGetAppSubmit(true);
      });
  };

  const deleteFile = (event) => {
    event.preventDefault();

    daasClient
      .post('/files/delete', {
        id: vmDeleteID,
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
        log.error('deleteFile failed', e);
        showRequestAlert(false);
      });
  };

  const deleteSharedFile = (event) => {
    event.preventDefault();

    daasClient
      .post('/files/delete_shared', {
        id: vmDeleteAllID,
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
        log.error('deleteSharedFile failed', e);
        showRequestAlert(false);
      });
  };

  const fileList = (event) => {
    event.preventDefault();

    daasClient
      .post('/files/list', {
        choice: vmChoiceList,
      })
      .then((response) => {
        if (response.status === 200 && response.data.response_code === 200) {
          showRequestAlert(true);
          setVMChoiceListResult(response.data.response_data);
          setVMChoiceListSubmit(true);
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          showRequestAlert(false);
          setVMChoiceListResult({});
          setVMChoiceListSubmit(true);
        }
      })
      .catch((e) => {
        log.error('fileList failed', e);
        showRequestAlert(false);
        setVMChoiceListResult({});
        setVMChoiceListSubmit(true);
      });
  };

  const changeVMFileUploadAppID = (event) => {
    setVMFileUploadAppID(event.target.value);
  };

  const changeVMFileUploadAppName = (event) => {
    setVMFileUploadAppName(event.target.value);
  };

  const changeVMFileUploadAppPath = (event) => {
    setVMFileUploadAppPath(event.target.value);
  };

  const changeVMFileUploadAppOSType = (event) => {
    setVMFileUploadAppOSType(event.target.value);
  };

  const changeVMFileUploadAppVersion = (event) => {
    setVMFileUploadAppVersion(event.target.value);
  };

  const changeVMFileUploadAppSelectFile = (event) => {
    if (event.target.files) {
      setVMFileUploadAppSelectFile(event.target.files[0]);
    }
  };

  const changeVMGetFileID = (event) => {
    setVMGetFileID(event.target.value);
  };

  const changeVMDeleteID = (event) => {
    setVMDeleteID(event.target.value);
  };

  const changeVMDeleteAllID = (event) => {
    setVMDeleteAllID(event.target.value);
  };

  const changeVMChoiceList = (event) => {
    setVMChoiceList(event.target.value);
  };

  const createFileSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    filename: Yup.string().required('Name invalid'),
    filepath: Yup.string().required('Path invalid'),
    os_type: Yup.string().required('OS Type invalid'),
    version: Yup.string().required('Version invalid'),
    file: Yup.string().required('File invalid'),
  });

  const createSharedFileSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    filename: Yup.string().required('Name invalid'),
    filepath: Yup.string().required('Path invalid'),
    os_type: Yup.string().required('OS Type invalid'),
    version: Yup.string().required('Version invalid'),
    file: Yup.string().required('File invalid'),
  });

  const updateFileSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    filename: Yup.string().required('Name invalid'),
    filepath: Yup.string().required('Path invalid'),
    os_type: Yup.string().required('OS Type invalid'),
    version: Yup.string().required('Version invalid'),
    file: Yup.string().required('File invalid'),
  });

  const updateSharedFileSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    filename: Yup.string().required('Name invalid'),
    filepath: Yup.string().required('Path invalid'),
    os_type: Yup.string().required('OS Type invalid'),
    version: Yup.string().required('Version invalid'),
    file: Yup.string().required('File invalid'),
  });

  const getFileSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
  });

  const deleteFileSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
  });

  const deleteSharedFileSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
  });

  const fileListSchema = Yup.object().shape({
    choice: Yup.string().required('Choice invalid'),
  });

  return (
    <>
      <Header />
      <ReactBootstrap.Container id="settingsOverviewFiles" fluid={true}>
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
            <div>
              <h2>{t('file-configuration')}</h2>
            </div>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>
        <ReactBootstrap.Tabs defaultActiveKey="file-create" id="all-config-file">
          <ReactBootstrap.Tab eventKey="file-create" title={t('file-create')}>
            <Formik
              initialValues={{
                id: '',
                filename: '',
                filepath: '',
                os_type: '',
                version: '',
                file: '',
              }}
              validationSchema={createFileSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={createFile} id="form-apps-tools">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="create-file-id">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="create-file-id"
                        name="create-file-id"
                        value={vmFileUploadAppID}
                        onChange={changeVMFileUploadAppID}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-create-file-id')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="create-file-name">{t('file-create-update-name')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="create-file-name"
                        name="create-file-name"
                        value={vmFileUploadAppName}
                        onChange={changeVMFileUploadAppName}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-create-file-name')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="create-file-path">{t('file-create-update-path')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="create-file-path"
                        name="create-file-path"
                        value={vmFileUploadAppPath}
                        onChange={changeVMFileUploadAppPath}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-create-file-path')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="create-file-os-type">{t('file-create-update-os-type')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <select
                        id="create-file-os-type"
                        name="create-file-os-type"
                        value={vmFileUploadAppOSType}
                        onChange={changeVMFileUploadAppOSType}
                      >
                        <option value="win10">Windows 10</option>
                        <option value="win11">Windows 11</option>
                        <option value="l26">Debian 12</option>
                      </select>
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-create-file-os-type')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="create-file-version">{t('file-create-update-version')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="create-file-version"
                        name="create-file-version"
                        value={vmFileUploadAppVersion}
                        onChange={changeVMFileUploadAppVersion}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-create-file-version')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="create-file-file">{t('file-create-update-file')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="file"
                        id="create-file-file"
                        name="create-file-file"
                        onChange={changeVMFileUploadAppSelectFile}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-create-file-file')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={
                          vmFileUploadAppID.length > 0 &&
                          vmFileUploadAppName.length > 0 &&
                          vmFileUploadAppOSType.length > 0 &&
                          vmFileUploadAppVersion.length > 0 &&
                          vmFileUploadAppPath.length > 0 &&
                          vmFileUploadAppSelectFile !== ''
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
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="file-create-shared" title={t('file-create-shared')}>
            <Formik
              initialValues={{
                id: '',
                filename: '',
                filepath: '',
                os_type: '',
                version: '',
                file: '',
              }}
              validationSchema={createSharedFileSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={createSharedFile} id="form-apps-tools">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="create-shared-file-id">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="create-shared-file-id"
                        name="create-shared-file-id"
                        value={vmFileUploadAppID}
                        onChange={changeVMFileUploadAppID}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-create-shared-file-id')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="create-shared-file-name">{t('file-create-update-name')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="create-shared-file-name"
                        name="create-shared-file-name"
                        value={vmFileUploadAppName}
                        onChange={changeVMFileUploadAppName}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-create-shared-file-name')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="create-shared-file-path">{t('file-create-update-path')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="create-shared-file-path"
                        name="create-shared-file-path"
                        value={vmFileUploadAppPath}
                        onChange={changeVMFileUploadAppPath}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-create-shared-file-path')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="create-shared-file-os-type">{t('file-create-update-os-type')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <select
                        id="create-shared-file-os-type"
                        name="create-shared-file-os-type"
                        value={vmFileUploadAppOSType}
                        onChange={changeVMFileUploadAppOSType}
                      >
                        <option value="win10">Windows 10</option>
                        <option value="win11">Windows 11</option>
                        <option value="l26">Debian 12</option>
                      </select>
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-create-shared-file-os-type')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="create-shared-file-version">{t('file-create-update-version')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="create-shared-file-version"
                        name="create-shared-file-version"
                        value={vmFileUploadAppVersion}
                        onChange={changeVMFileUploadAppVersion}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-create-shared-file-version')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="create-shared-file-file">{t('file-create-update-file')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="file"
                        id="create-shared-file-file"
                        name="create-shared-file-file"
                        onChange={changeVMFileUploadAppSelectFile}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-create-shared-file-file')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={
                          vmFileUploadAppID.length > 0 &&
                          vmFileUploadAppName.length > 0 &&
                          vmFileUploadAppOSType.length > 0 &&
                          vmFileUploadAppVersion.length &&
                          vmFileUploadAppPath.length > 0 &&
                          vmFileUploadAppSelectFile !== ''
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
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="file-update" title={t('file-update')}>
            <Formik
              initialValues={{
                id: '',
                filename: '',
                filepath: '',
                os_type: '',
                version: '',
                file: '',
              }}
              validationSchema={updateFileSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={updateFile} id="form-apps-tools">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="update-file-id">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="update-file-id"
                        name="update-file-id"
                        value={vmFileUploadAppID}
                        onChange={changeVMFileUploadAppID}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-update-file-id')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="update-file-name">{t('file-create-update-name')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="update-file-name"
                        name="update-file-name"
                        value={vmFileUploadAppName}
                        onChange={changeVMFileUploadAppName}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-update-file-name')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="update-file-path">{t('file-create-update-path')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="update-file-path"
                        name="update-file-path"
                        value={vmFileUploadAppPath}
                        onChange={changeVMFileUploadAppPath}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-update-file-path')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="update-file-os-type">{t('file-create-update-os-type')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <select
                        id="update-file-os-type"
                        name="update-file-os-type"
                        value={vmFileUploadAppOSType}
                        onChange={changeVMFileUploadAppOSType}
                      >
                        <option value="win10">Windows 10</option>
                        <option value="win11">Windows 11</option>
                        <option value="l26">Debian 12</option>
                      </select>
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-update-file-os-type')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="update-file-version">{t('file-create-update-version')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="update-file-version"
                        name="update-file-version"
                        value={vmFileUploadAppVersion}
                        onChange={changeVMFileUploadAppVersion}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-update-file-version')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="update-file-file">{t('file-create-update-file')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="file"
                        id="update-file-file"
                        name="update-file-file"
                        onChange={changeVMFileUploadAppSelectFile}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-update-file-file')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={
                          vmFileUploadAppID.length > 0 &&
                          vmFileUploadAppName.length > 0 &&
                          vmFileUploadAppOSType.length > 0 &&
                          vmFileUploadAppVersion.length > 0 &&
                          vmFileUploadAppPath.length > 0 &&
                          vmFileUploadAppSelectFile !== ''
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
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="file-update-shared" title={t('file-update-shared')}>
            <Formik
              initialValues={{
                id: '',
                filename: '',
                filepath: '',
                os_type: '',
                version: '',
                file: '',
              }}
              validationSchema={updateSharedFileSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={updateSharedFile} id="form-apps-tools">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="update-shared-file-id">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="update-shared-file-id"
                        name="update-shared-file-id"
                        value={vmFileUploadAppID}
                        onChange={changeVMFileUploadAppID}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-update-shared-file-id')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="update-shared-file-name">{t('file-create-update-name')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="update-shared-file-name"
                        name="update-shared-file-name"
                        value={vmFileUploadAppName}
                        onChange={changeVMFileUploadAppName}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-update-shared-file-name')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="update-shared-file-path">{t('file-create-update-path')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="update-shared-file-path"
                        name="update-shared-file-path"
                        value={vmFileUploadAppPath}
                        onChange={changeVMFileUploadAppPath}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-update-shared-file-path')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="update-shared-file-os-type">{t('file-create-update-os-type')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <select
                        id="update-shared-file-os-type"
                        name="update-shared-file-os-type"
                        value={vmFileUploadAppOSType}
                        onChange={changeVMFileUploadAppOSType}
                      >
                        <option value="win10">Windows 10</option>
                        <option value="win11">Windows 11</option>
                        <option value="l26">Debian 12</option>
                      </select>
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-update-shared-file-os-type')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="update-shared-file-version">{t('file-create-update-version')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="update-shared-file-version"
                        name="update-shared-file-version"
                        value={vmFileUploadAppVersion}
                        onChange={changeVMFileUploadAppVersion}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-update-shared-file-version')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="update-shared-file-file">{t('file-create-update-file')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="file"
                        id="update-shared-file-file"
                        name="update-shared-file-file"
                        onChange={changeVMFileUploadAppSelectFile}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-update-shared-file-file')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={
                          vmFileUploadAppID.length > 0 &&
                          vmFileUploadAppName.length > 0 &&
                          vmFileUploadAppOSType.length > 0 &&
                          vmFileUploadAppVersion.length > 0 &&
                          vmFileUploadAppPath.length > 0 &&
                          vmFileUploadAppSelectFile !== ''
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
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="get-file" title={t('file-get')}>
            <Formik
              initialValues={{
                id: '',
              }}
              validationSchema={getFileSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={getFile} id="form-apps-tools">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="file-get-id">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="file-get-id"
                        name="file-get-id"
                        value={vmGetFileID}
                        onChange={changeVMGetFileID}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-file-get-id')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmGetFileID.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
            {vmGetAppSubmit ? (
              vmGetAppResult.length > 0 ? (
                <>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <pre>{JSON.stringify(vmGetAppResult, null, 3)}</pre>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </>
              ) : (
                <>{t('no-data-available')}</>
              )
            ) : (
              <></>
            )}
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="file-delete" title={t('file-delete')}>
            <Formik
              initialValues={{
                id: '',
              }}
              validationSchema={deleteFileSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={deleteFile} id="form-apps-tools">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="delete-id">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="delete-id"
                        name="delete-id"
                        value={vmDeleteID}
                        onChange={changeVMDeleteID}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-delete-id')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmDeleteID.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="file-delete-shared" title={t('file-delete-shared')}>
            <Formik
              initialValues={{
                id: '',
              }}
              validationSchema={deleteSharedFileSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={deleteSharedFile} id="form-apps-tools">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="delete-all-id">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="delete-all-id"
                        name="delete-all-id"
                        value={vmDeleteAllID}
                        onChange={changeVMDeleteAllID}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-delete-all-id')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmDeleteAllID.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="file-list" title={t('file-list')}>
            <Formik
              initialValues={{
                choice: '',
              }}
              validationSchema={fileListSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={fileList} id="form-apps-tools">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="choice-list">{t('choice-list')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <select id="choice-list" name="choice-list" value={vmChoiceList} onChange={changeVMChoiceList}>
                        <option value="user">{t('user-select')}</option>
                        <option value="shared">{t('shared-select')}</option>
                        <option value="both">{t('both-select')}</option>
                      </select>
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-choice-list')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmChoiceList.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
            {vmChoiceListSubmit ? (
              vmChoiceListResult.length > 0 ? (
                <>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <pre>{JSON.stringify(vmChoiceListResult, null, 3)}</pre>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </>
              ) : (
                <>{t('no-data-available')}</>
              )
            ) : (
              <></>
            )}
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

export default SettingsFiles;
