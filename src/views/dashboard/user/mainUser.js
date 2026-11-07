import { useEffect, useState } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { getSession } from '../../../api/session';
import { requestApplication } from '../../../api/users';
import { Field, Form, Formik } from 'formik';
import Header from '../../../components/header';
import { ROUTES } from '../../../routes';
import {
  requestApplicationAdminSchema,
  createAppSchema,
  updateAppSchema,
  createFileSchema,
  updateFileSchema,
  phasesBaseimageCreateContainerSchema,
  phasesBaseimageCreateVMSchema,
  phasesBaseimageCloneSchema,
  vmDataSchema,
  containerDataSchema,
} from './mainUserSchemas';

import { daasClient, isDaasSuccess } from '../../../api/client';
import { getRole } from '../../../auth/tokenManager';
import { filterBySearch, getCurrentUserId, ownedBy } from './dashboardData';
import { createLogger } from '../../../utils/logger';
import RequestAlert from '../../../components/RequestAlert';
import useRequestAlert from '../../../hooks/useRequestAlert';
import { useNavigate } from 'react-router-dom';
import { SUBMIT_HANDLED_BY_FORM } from '../../../utils/formik';
const log = createLogger('MainUser');

// Per-page selections that must not survive a visit to the dashboard.
const VIEWER_SELECTION_KEYS = [
  'application-viewer-id',
  'environment-viewer-id',
  'object-viewer-id',
  'selected-environment-id',
  'selected-environment-name',
  'selected-instance-id',
  'selected-instance-env-name',
  'selected-connection-index',
  'selected-object-id',
  'selected-object-env-name',
  'selected-object-state',
  'object-id-instance',
];

const bindValue = (setter) => (event) => setter(event.target.value);

// "used/max (Max)"; the backend stores "no limit" as a negative max (-1)
const formatUsage = (used, max, t) => (Number(max) < 0 ? `${used} (${t('no-limit')})` : `${used}/${max} (Max)`);

function MainUser() {
  const navigate = useNavigate();
  const [ownApplication, setOwnApplication] = useState([]);
  const [ownFiles, setOwnFiles] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [dashboardInfo, setDashboardInfo] = useState({});
  const [availableEnvironmentValue, setAvailableEnvironmentValue] = useState();
  const [availableObjectValue, setAvailableObjectValue] = useState();
  const [applicationModal, setApplicationModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [fileModal, setFileModal] = useState(false);
  const [fileDetailsModal, setFileDetailsModal] = useState(false);
  const [detailFileInfo, setDetailFileInfo] = useState({});
  const [requestMessage, setRequestMessage] = useState('');
  const [connectionDataNewer, setConnectionDataNewer] = useState([]);
  const [vmPhasesIDBaseimageCreate, setVMIDPhasesBaseimageCreate] = useState('');
  const [vmPhasesObjectTypeBaseimageCreate, setVMObjectTypePhasesBaseimageCreate] = useState('');
  const [vmPhasesNameBaseimageCreate, setVMNamePhasesBaseimageCreate] = useState('');
  const [vmPhasesRootImageBaseimageCreate, setVMRootImagePhasesBaseimageCreate] = useState('x11vnc');
  const [vmPhasesDockerfileBaseimageCreate, setVMDockerfilePhasesBaseimageCreate] = useState();
  const [vmPhasesCephPublicBaseimageCreateChecked, setVMCephPublicPhasesBaseimageCreateChecked] = useState(false);
  const [vmPhasesCephSharedBaseimageCreateChecked, setVMCephSharedPhasesBaseimageCreateChecked] = useState(false);
  const [vmPhasesCephUserBaseimageCreateChecked, setVMCephUserPhasesBaseimageCreateChecked] = useState(false);
  const [vmPhasesNameVMBaseimageCreate, setVMNameVMPhasesBaseimageCreate] = useState('');
  const [vmPhasesOSTypeBaseimageCreate, setVMOSTypePhasesBaseimageCreate] = useState('win10');
  const [vmPhasesCoresBaseimageCreate, setVMCoresPhasesBaseimageCreate] = useState('');
  const [vmPhasesMemorySizeBaseimageCreate, setVMMemorySizePhasesBaseimageCreate] = useState('');
  const [vmPhasesDiskSizeBaseimageCreate, setVMDiskSizePhasesBaseimageCreate] = useState('');
  const [vmPhasesKeyboardBaseimageCreate, setVMKeyboardPhasesBaseimageCreate] = useState('');
  const [vmPhasesCephPoolBaseimageCreateChecked, setVMCephPoolPhasesBaseimageCreateChecked] = useState(false);
  const [vmResolutionPhasesBaseimageCreate, setVMResolutionPhasesBaseimageCreate] = useState('');
  const [vmContypePhasesBaseimageCreate, setVMContypePhasesBaseimageCreate] = useState('sysvnc');
  const [vmResizePhasesBaseimageCreate, setVMResizePhasesBaseimageCreate] = useState('none');
  const [vmScalePhasesBaseimageCreateChecked, setVMScalePhasesBaseimageCreateChecked] = useState(false);
  const [vmPhasesIDBaseimageClone, setVMIDPhasesBaseimageClone] = useState('');
  const [vmPhasesNameBaseimageClone, setVMNamePhasesBaseimageClone] = useState('');
  const [vmPhasesNewIDBaseimageClone, setVMNewIDPhasesBaseimageClone] = useState('');
  const [vmCreateUpdateAppID, setVMCreateUpdateAppID] = useState('');
  const [vmCreateUpdateAppName, setVMCreateUpdateAppName] = useState('');
  const [vmCreateUpdateAppIDFile, setVMCreateUpdateAppIDFile] = useState('');
  const [vmCreateUpdateAppIDTemplate, setVMCreateUpdateAppIDTemplate] = useState('');
  const [vmCreateUpdateAppOSType, setVMCreateUpdateAppOSType] = useState('win10');
  const [vmCreateUpdateAppInstaller, setVMCreateUpdateAppInstaller] = useState('');
  const [vmCreateUpdateAppInstallerARGS, setVMCreateUpdateAppInstallerARGS] = useState('');
  const [vmCreateUpdateAppInstallerType, setVMCreateUpdateAppInstallerType] = useState('none');
  const [vmCreateUpdateAppTarget, setVMCreateUpdateAppTarget] = useState('');
  const [vmCreateUpdateAppTargetARGS, setVMCreateUpdateAppTargetARGS] = useState('');
  const [vmCreateUpdateAppVersion, setVMCreateUpdateAppVersion] = useState('');
  const [vmFileUploadAppID, setVMFileUploadAppID] = useState('');
  const [vmFileUploadAppName, setVMFileUploadAppName] = useState('');
  const [vmFileUploadAppPath, setVMFileUploadAppPath] = useState('');
  const [vmFileUploadAppOSType, setVMFileUploadAppOSType] = useState('win10');
  const [vmFileUploadAppVersion, setVMFileUploadAppVersion] = useState('');
  const [vmFileUploadAppSelectFile, setVMFileUploadAppSelectFile] = useState('');
  const [searchText, setSearchText] = useState('');
  const [applications, setApplications] = useState([]);
  const [searchTextShared, setSearchTextShared] = useState('');
  const [allAvailableInstances, setAllAvailableInstances] = useState([]);
  const { requestAlert, showRequestAlert } = useRequestAlert();
  const { t } = useTranslation();

  // Reloads everything the dashboard lists: applications, files, instances and connections.
  const fetchDashboardInfo = () =>
    daasClient
      .post('/monitoring/dashboard_info', {})
      .then((response) => {
        if (!isDaasSuccess(response)) {
          log.warn('Dashboard info returned an error', response.data);
          return;
        }
        const info = response.data.response_data.dashboardinfo;
        const userId = getCurrentUserId();
        setDashboardInfo(info);
        setApplications(info.available_applications);
        setAllAvailableInstances(info.available_instances);
        setConnectionDataNewer(info.available_connections);
        setOwnApplication(ownedBy(info.available_applications, userId));
        setOwnFiles(ownedBy(info.available_files, userId));
        setSharedFiles(ownedBy(info.available_files, 0));
      })
      .catch((e) => {
        log.error('Loading dashboard info failed', e);
      });

  const refreshDashboard = (event) => {
    event.preventDefault();

    fetchDashboardInfo();
  };

  const goToMonitoring = () => {
    navigate(ROUTES.user.monitoring);
  };

  const closeInfoModal = () => {
    setInfoModal(false);
  };

  const closeApplicationModal = () => {
    setApplicationModal(false);
    setRequestMessage('');
  };

  const closeRequestModal = () => {
    setRequestModal(false);
    setRequestMessage('');
  };

  const closeFileModal = () => {
    setFileModal(false);
    setRequestMessage('');
  };

  const closeFileDetailsModal = () => {
    setFileDetailsModal(false);
    setRequestMessage('');
  };

  const getFileDetailsModal = (id) => {
    setFileDetailsModal(true);

    daasClient
      .post('/files/get', {
        id: id,
      })
      .then((response) => {
        if (response.status === 200 && response.data.response_code === 200) {
          showRequestAlert(true);

          setDetailFileInfo(response.data.response_data);
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          showRequestAlert(false);

          setDetailFileInfo({});
        }
      })
      .catch((e) => {
        log.error('getFileDetailsModal failed', e);
        showRequestAlert(false);

        setDetailFileInfo({});
      });
  };

  const changeRequestMessage = bindValue(setRequestMessage);

  // Forget selections from previous visits, then load the user's id (needed
  // to tell own and shared items apart) before the dashboard data.
  useEffect(() => {
    VIEWER_SELECTION_KEYS.forEach((key) => localStorage.setItem(key, ''));

    getSession()
      .then((session) => {
        localStorage.setItem('userDataID', session.user_id);
        localStorage.setItem('userDataName', session.name);
      })
      .catch((e) => log.error('Loading the user session failed', e))
      .finally(fetchDashboardInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  const startObject = (event, id, env, state) => {
    event.preventDefault();

    if (state === 'environment-create' || state === 'environment-final') {
      daasClient
        .post('/phases/environment_start', {
          id: id,
          name: env,
          connect: 'on',
        })
        .then((response) => {
          if (response.status === 200 && response.data.response_code === 200) {
            showRequestAlert(true);

            fetchDashboardInfo();

            localStorage.setItem('object-id-instance', response.data.id_instance);

            localStorage.setItem('connection-env', response.data.response_url);

            setTimeout(() => {
              navigate(ROUTES.user.connectionRun);
            }, 2000);
          }
          if (response.status === 200 && response.data.response_code !== 200) {
            showRequestAlert(false);
          }
        })
        .catch((e) => {
          log.error('startObject failed', e);
          showRequestAlert(false);
        });
    } else if (state === 'baseimage-create' || state === 'baseimage-final') {
      daasClient
        .post('/phases/baseimage_start', {
          id: id,
          connect: 'on',
        })
        .then((response) => {
          if (response.status === 200 && response.data.response_code === 200) {
            showRequestAlert(true);

            fetchDashboardInfo();

            localStorage.setItem('object-id-instance', response.data.id_instance);

            localStorage.setItem('connection-env', response.data.response_url);

            setTimeout(() => {
              navigate(ROUTES.user.connectionRun);
            }, 2000);
          }
          if (response.status === 200 && response.data.response_code !== 200) {
            showRequestAlert(false);
          }
        })
        .catch((e) => {
          log.error('startObject failed', e);
          showRequestAlert(false);
        });
    } else {
      log.warn(`Unknown object state "${state}"`);
    }
  };

  const stopObject = (event, id, env, state) => {
    event.preventDefault();

    if (state === 'environment-create' || state === 'environment-final') {
      daasClient
        .post('/phases/environment_stop', {
          id: localStorage.getItem('object-id-instance'),
          name: env,
          force: 'on',
        })
        .then((response) => {
          if (response.status === 200 && response.data.response_code === 200) {
            showRequestAlert(true);

            localStorage.setItem('object-id-instance', '');
            fetchDashboardInfo();
          }
          if (response.status === 200 && response.data.response_code !== 200) {
            showRequestAlert(false);
          }
        })
        .catch((e) => {
          log.error('stopObject failed', e);
          showRequestAlert(false);
        });
    } else if (state === 'baseimage-create' || state === 'baseimage-final') {
      daasClient
        .post('/phases/baseimage_stop', {
          id_instance: localStorage.getItem('object-id-instance'),
          force: 'on',
        })
        .then((response) => {
          if (response.status === 200 && response.data.response_code === 200) {
            showRequestAlert(true);

            localStorage.setItem('object-id-instance', '');
            fetchDashboardInfo();
          }
          if (response.status === 200 && response.data.response_code !== 200) {
            showRequestAlert(false);
          }
        })
        .catch((e) => {
          log.error('stopObject failed', e);
          showRequestAlert(false);
        });
    } else {
      log.warn(`Unknown object state "${state}"`);
    }
  };

  const deleteObject = (event, id, env, state) => {
    event.preventDefault();

    if (state === 'environment-create' || state === 'environment-final') {
      daasClient
        .post('/phases/environment_delete', {
          id: id,
          name: env,
          connect: 'on',
        })
        .then((response) => {
          if (response.status === 200 && response.data.response_code === 200) {
            daasClient
              .post('/phases/baseimage_delete', {
                id: id,
                connect: 'on',
              })
              .then((response) => {
                if (response.status === 200 && response.data.response_code === 200) {
                  showRequestAlert(true);

                  fetchDashboardInfo();
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                  showRequestAlert(false);

                  fetchDashboardInfo();
                }
              })
              .catch((e) => {
                log.error('deleteObject failed', e);
                showRequestAlert(false);
              });
          }
          if (response.status === 200 && response.data.response_code !== 200) {
            daasClient
              .post('/phases/baseimage_delete', {
                id: id,
                connect: 'on',
              })
              .then((response) => {
                if (response.status === 200 && response.data.response_code === 200) {
                  showRequestAlert(true);

                  fetchDashboardInfo();
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                  showRequestAlert(false);

                  fetchDashboardInfo();
                }
              })
              .catch((e) => {
                log.error('deleteObject failed', e);
                showRequestAlert(false);
              });
          }
        })
        .catch((e) => {
          log.error('deleteObject failed', e);
          showRequestAlert(false);
        });
    } else if (state === 'baseimage-create' || state === 'baseimage-final') {
      daasClient
        .post('/phases/baseimage_delete', {
          id: id,
          connect: 'on',
        })
        .then((response) => {
          if (response.status === 200 && response.data.response_code === 200) {
            showRequestAlert(true);

            fetchDashboardInfo();

            localStorage.setItem('test', '');
          }
          if (response.status === 200 && response.data.response_code !== 200) {
            showRequestAlert(false);
          }
        })
        .catch((e) => {
          log.error('deleteObject failed', e);
          showRequestAlert(false);
        });
    } else {
      log.warn(`Unknown object state "${state}"`);
    }
  };

  const applicationData = (dataID, selectOption) => {
    localStorage.setItem('app-data', dataID);
    localStorage.setItem('app-data-option', selectOption);

    fetchDashboardInfo();

    setTimeout(() => {
      navigate(ROUTES.user.applicationRun);
    }, 2000);
  };

  const environmentData = (objectID, selectEnv, modeType) => {
    localStorage.setItem('env-object-id', objectID);
    localStorage.setItem('env-name', selectEnv);

    localStorage.setItem('environment-type-mode', modeType);

    fetchDashboardInfo();

    setTimeout(() => {
      navigate(ROUTES.user.environmentRun);
    }, 2000);
  };

  const environmentDataStop = (objectID, selectEnv) => {
    localStorage.setItem('env-object-id', objectID);
    localStorage.setItem('env-name', selectEnv);

    daasClient
      .post('/phases/environment_stop', {
        id: objectID,
        name: selectEnv,
        force: 'on',
      })
      .then((response) => showRequestAlert(isDaasSuccess(response)))
      .catch((e) => {
        log.error('Stopping environment failed', e);
        showRequestAlert(false);
      })
      .finally(fetchDashboardInfo);
  };

  const environmentDataEdit = (objectID, selectEnv, selectName, modeType, selectApps, selectTasks, selectTarget) => {
    localStorage.setItem('env-object-id', objectID);
    localStorage.setItem('env-name', selectEnv);
    localStorage.setItem('env-name-object', selectName);
    localStorage.setItem('environment-type-mode', modeType);
    localStorage.setItem('env-apps', selectApps);
    localStorage.setItem('env-tasks', selectTasks);
    localStorage.setItem('env-target', selectTarget);

    fetchDashboardInfo();

    setTimeout(() => {
      localStorage.setItem('expert-mode-baseimage', 'true');
      navigate(ROUTES.user.expertEnvironmentEdit);
    }, 2000);
  };

  const environmentDataDelete = (event, objectID, selectEnv) => {
    daasClient
      .post('/phases/environment_delete', {
        id: objectID,
        name: selectEnv,
      })
      .then((response) => {
        if (response.status === 200 && response.data.response_code === 200) {
          showRequestAlert(true);

          fetchDashboardInfo();
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          showRequestAlert(false);
        }
      })
      .catch((e) => {
        log.error('environmentDataDelete failed', e);
        showRequestAlert(false);
      });
  };

  const objectData = (objectID, selectEnv, stateObject) => {
    localStorage.setItem('object-id', objectID);
    localStorage.setItem('object-env-name', selectEnv);
    localStorage.setItem('object-state', stateObject);

    fetchDashboardInfo();

    setTimeout(() => {
      navigate(ROUTES.user.expertBaseImage);
    }, 2000);
  };

  // The selects carry the chosen object as JSON; remember it (and its running
  // instance, if any) for the start/stop/delete actions.
  const changeAvailableObjectValue = (event) => {
    const { value } = event.target;
    setAvailableObjectValue(value);
    const object = value ? JSON.parse(value) : null;
    const instance = object && allAvailableInstances.find((item) => item.id_object === object.id_object);

    localStorage.setItem('object-id-instance', instance ? instance.id_instance : '');
    localStorage.setItem('selected-object-id', object ? object.id_object : '');
    localStorage.setItem('selected-object-env-name', object ? object.id_user : '');
    localStorage.setItem('selected-object-state', object ? object.object_state : '');
  };

  const changeAvailableEnvironmentValue = (event) => {
    const { value } = event.target;
    setAvailableEnvironmentValue(value);
    const environment = value ? JSON.parse(value) : null;

    localStorage.setItem('selected-environment-id', environment ? environment.id_object : '');
    localStorage.setItem('selected-environment-name', environment ? environment.name : '');
    localStorage.setItem('selected-environment-name-object', environment ? environment.name_object : '');
    localStorage.setItem(
      'selected-environment-name-object-env-apps',
      environment ? JSON.stringify(environment.env_apps[0]) : '',
    );
    localStorage.setItem(
      'selected-environment-name-object-env-tasks',
      environment ? JSON.stringify(environment.env_tasks[0]) : '',
    );
    localStorage.setItem(
      'selected-environment-name-object-env-target',
      environment ? JSON.stringify(environment.env_target) : '',
    );
  };

  const requestApplicationAdmin = (event) => {
    event.preventDefault();

    requestApplication(requestMessage, localStorage.getItem('language'))
      .then(() => {
        showRequestAlert(true);
        setApplicationModal(false);
        setRequestMessage('');
      })
      .catch((e) => {
        log.error('Requesting an application failed', e);
        showRequestAlert(false);
      });
  };

  const adminDashboardDetail = () => {
    navigate(ROUTES.admin.root);
  };

  const changeVMCreateUpdateAppID = bindValue(setVMCreateUpdateAppID);

  const changeVMCreateUpdateAppName = bindValue(setVMCreateUpdateAppName);

  const changeVMCreateUpdateAppIDFile = bindValue(setVMCreateUpdateAppIDFile);

  const changeVMCreateUpdateAppIDTemplate = bindValue(setVMCreateUpdateAppIDTemplate);

  const changeVMCreateUpdateAppOSType = bindValue(setVMCreateUpdateAppOSType);

  const changeVMCreateUpdateAppInstaller = bindValue(setVMCreateUpdateAppInstaller);

  const changeVMCreateUpdateAppInstallerARGS = bindValue(setVMCreateUpdateAppInstallerARGS);

  const changeVMCreateUpdateAppInstallerType = bindValue(setVMCreateUpdateAppInstallerType);

  const changeVMCreateUpdateAppTarget = bindValue(setVMCreateUpdateAppTarget);

  const changeVMCreateUpdateAppTargetARGS = bindValue(setVMCreateUpdateAppTargetARGS);

  const changeVMCreateUpdateAppVersion = bindValue(setVMCreateUpdateAppVersion);

  const changeVMFileUploadAppID = bindValue(setVMFileUploadAppID);

  const changeVMFileUploadAppName = bindValue(setVMFileUploadAppName);

  const changeVMFileUploadAppPath = bindValue(setVMFileUploadAppPath);

  const changeVMFileUploadAppOSType = bindValue(setVMFileUploadAppOSType);

  const changeVMFileUploadAppVersion = bindValue(setVMFileUploadAppVersion);

  const changeVMFileUploadAppSelectFile = (event) => {
    if (event.target.files) {
      setVMFileUploadAppSelectFile(event.target.files[0]);
    }
  };

  const changeVMPhasesIDBaseimageCreate = bindValue(setVMIDPhasesBaseimageCreate);

  const changeVMPhasesObjectTypeBaseimageCreate = bindValue(setVMObjectTypePhasesBaseimageCreate);

  const changeVMPhasesNameBaseimageCreate = bindValue(setVMNamePhasesBaseimageCreate);

  const changeVMPhasesRootImageBaseimageCreate = bindValue(setVMRootImagePhasesBaseimageCreate);

  const changeVMPhasesDockerfileBaseimageCreate = (event) => {
    if (event.target.files) {
      setVMDockerfilePhasesBaseimageCreate(event.target.files[0]);
    }
  };

  const changeVMPhasesCephPublicBaseimageCreate = () =>
    setVMCephPublicPhasesBaseimageCreateChecked((checked) => !checked);

  const changeVMPhasesCephSharedBaseimageCreate = () =>
    setVMCephSharedPhasesBaseimageCreateChecked((checked) => !checked);

  const changeVMPhasesCephUserBaseimageCreate = () => setVMCephUserPhasesBaseimageCreateChecked((checked) => !checked);

  const changeVMPhasesNameVMBaseimageCreate = bindValue(setVMNameVMPhasesBaseimageCreate);

  const changeVMPhasesOSTypeBaseimageCreate = bindValue(setVMOSTypePhasesBaseimageCreate);

  const changeVMPhasesCoresBaseimageCreate = bindValue(setVMCoresPhasesBaseimageCreate);

  const changeVMPhasesMemorySizeBaseimageCreate = bindValue(setVMMemorySizePhasesBaseimageCreate);

  const changeVMPhasesDiskSizeBaseimageCreate = bindValue(setVMDiskSizePhasesBaseimageCreate);

  const changeVMPhasesKeyboardBaseimageCreate = bindValue(setVMKeyboardPhasesBaseimageCreate);

  const changeVMPhasesCephPoolBaseimageCreate = () => setVMCephPoolPhasesBaseimageCreateChecked((checked) => !checked);

  const changeVMResolutionPhasesBaseimageCreate = bindValue(setVMResolutionPhasesBaseimageCreate);

  const changeVMContypePhasesBaseimageCreate = bindValue(setVMContypePhasesBaseimageCreate);

  const changeVMResizePhasesBaseimageCreate = bindValue(setVMResizePhasesBaseimageCreate);

  const changeVMScalePhasesBaseimageCreateChecked = () => setVMScalePhasesBaseimageCreateChecked((checked) => !checked);

  const changeVMPhasesIDBaseimageClone = bindValue(setVMIDPhasesBaseimageClone);

  const changeVMPhasesNameBaseimageClone = bindValue(setVMNamePhasesBaseimageClone);

  const changeVMPhasesNewIDBaseimageClone = bindValue(setVMNewIDPhasesBaseimageClone);

  const visibleApplications = filterBySearch(applications, searchText);
  const visibleSharedApplications = filterBySearch(applications, searchTextShared);

  const phasesBaseimageCreate = (event) => {
    event.preventDefault();

    const vmData = {
      id: vmPhasesIDBaseimageCreate,
      obj_type: 'vm',
      name: vmPhasesNameVMBaseimageCreate,
      os_type: vmPhasesOSTypeBaseimageCreate,
      cores: vmPhasesCoresBaseimageCreate,
      memsize: vmPhasesMemorySizeBaseimageCreate,
      disksize: vmPhasesDiskSizeBaseimageCreate,
      kb: vmPhasesKeyboardBaseimageCreate,
      ceph_pool: vmPhasesCephPoolBaseimageCreateChecked ? 'on' : '',
      ceph_public: vmPhasesCephPublicBaseimageCreateChecked ? 'on' : '',
      ceph_shared: vmPhasesCephSharedBaseimageCreateChecked ? 'on' : '',
      ceph_user: vmPhasesCephUserBaseimageCreateChecked ? 'on' : '',
      viewer_resolution: vmResolutionPhasesBaseimageCreate,
      viewer_contype: vmContypePhasesBaseimageCreate,
      viewer_resize: vmResizePhasesBaseimageCreate,
      viewer_scale: vmScalePhasesBaseimageCreateChecked ? 'on' : '',
    };

    const containerData = {
      id: vmPhasesIDBaseimageCreate,
      obj_type: 'container',
      name: vmPhasesNameBaseimageCreate,
      rootimage: vmPhasesRootImageBaseimageCreate,
      cores: vmPhasesCoresBaseimageCreate,
      memsize: vmPhasesMemorySizeBaseimageCreate,
      disksize: vmPhasesDiskSizeBaseimageCreate,
      dockerfile: vmPhasesDockerfileBaseimageCreate,
      ceph_public: vmPhasesCephPublicBaseimageCreateChecked ? 'on' : '',
      ceph_shared: vmPhasesCephSharedBaseimageCreateChecked ? 'on' : '',
      ceph_user: vmPhasesCephUserBaseimageCreateChecked ? 'on' : '',
      viewer_resolution: vmResolutionPhasesBaseimageCreate,
      viewer_contype: vmContypePhasesBaseimageCreate,
      viewer_resize: vmResizePhasesBaseimageCreate,
      viewer_scale: vmScalePhasesBaseimageCreateChecked ? 'on' : '',
    };

    const validData = vmPhasesObjectTypeBaseimageCreate === 'vm' ? vmData : containerData;

    daasClient
      .post('/phases/baseimage_create', validData)
      .then((response) => {
        if (response.status === 200 && response.data.response_code === 200) {
          showRequestAlert(true);

          fetchDashboardInfo();
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          showRequestAlert(false);
        }
      })
      .catch((e) => {
        log.error('phasesBaseimageCreate failed', e);
        showRequestAlert(false);
      });
  };

  const phasesBaseimageClone = (event) => {
    event.preventDefault();

    daasClient
      .post('/phases/baseimage_clone', {
        id: vmPhasesIDBaseimageClone,
        newid: vmPhasesNewIDBaseimageClone,
        name: vmPhasesNameBaseimageClone,
      })
      .then((response) => {
        if (response.status === 200 && response.data.response_code === 200) {
          showRequestAlert(true);

          fetchDashboardInfo();
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          showRequestAlert(false);
        }
      })
      .catch((e) => {
        log.error('phasesBaseimageClone failed', e);
        showRequestAlert(false);
      });
  };

  const submitApp = (endpoint) => (event) => {
    event.preventDefault();

    daasClient
      .post(endpoint, {
        id: vmCreateUpdateAppID,
        name: vmCreateUpdateAppName,
        id_file: vmCreateUpdateAppIDFile,
        id_template: vmCreateUpdateAppIDTemplate,
        os_type: vmCreateUpdateAppOSType,
        installer: vmCreateUpdateAppInstaller,
        installer_args: vmCreateUpdateAppInstallerARGS,
        installer_type: vmCreateUpdateAppInstallerType,
        target: vmCreateUpdateAppTarget,
        target_args: vmCreateUpdateAppTargetARGS,
        version: vmCreateUpdateAppVersion,
      })
      .then((response) => {
        if (response.status === 200 && response.data.response_code === 200) {
          showRequestAlert(true);

          fetchDashboardInfo();
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          showRequestAlert(false);
        }
      })
      .catch((e) => {
        log.error('submitApp failed', e);
        showRequestAlert(false);
      });
  };

  const createApp = submitApp('/apps/create');

  const updateApp = submitApp('/apps/update');

  const submitFile = (endpoint) => (event) => {
    event.preventDefault();

    daasClient
      .post(endpoint, {
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

          fetchDashboardInfo();
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          showRequestAlert(false);
        }
      })
      .catch((e) => {
        log.error('submitFile failed', e);
        showRequestAlert(false);
      });
  };

  const createFile = submitFile('/files/create');

  const updateFile = submitFile('/files/update');

  const renderAppForm = (mode, validationSchema, onSubmit) => (
    <Formik
      initialValues={{
        id: '',
        name: '',
        id_file: '',
        id_template: '',
        os_type: '',
        installer: '',
        installer_args: '',
        installer_type: '',
        target: '',
        target_args: '',
        version: '',
      }}
      validationSchema={validationSchema}
      onSubmit={SUBMIT_HANDLED_BY_FORM}
    >
      {({ errors, touched }) => (
        <Form onSubmit={onSubmit} id="form-apps-tools">
          <ReactBootstrap.Row>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <label htmlFor={`${mode}-app-id`}>{t('vm-id')}</label>
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Field
                type="text"
                id={`${mode}-app-id`}
                name={`${mode}-app-id`}
                value={vmCreateUpdateAppID}
                onChange={changeVMCreateUpdateAppID}
              />
            </ReactBootstrap.Col>
            <div className="error-text">{t(`error-${mode}-app-id`)}</div>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <label htmlFor={`${mode}-app-name`}>{t('app-create-update-name')}</label>
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Field
                type="text"
                id={`${mode}-app-name`}
                name={`${mode}-app-name`}
                value={vmCreateUpdateAppName}
                onChange={changeVMCreateUpdateAppName}
              />
            </ReactBootstrap.Col>
            <div className="error-text">{t(`error-${mode}-app-name`)}</div>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <label htmlFor={`${mode}-app-id-file`}>{t('app-create-update-file')}</label>
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Field
                type="text"
                id={`${mode}-app-id-file`}
                name={`${mode}-app-id-file`}
                value={vmCreateUpdateAppIDFile}
                onChange={changeVMCreateUpdateAppIDFile}
              />
            </ReactBootstrap.Col>
            <div className="error-text">{t(`error-${mode}-app-id-file`)}</div>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <label htmlFor={`${mode}-app-id-template`}>{t('app-create-update-template')}</label>
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Field
                type="text"
                id={`${mode}-app-id-template`}
                name={`${mode}-app-id-template`}
                value={vmCreateUpdateAppIDTemplate}
                onChange={changeVMCreateUpdateAppIDTemplate}
              />
            </ReactBootstrap.Col>
            <div className="error-text">{t(`error-${mode}-app-id-template`)}</div>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <label htmlFor={`${mode}-app-os-type`}>{t('app-create-update-os-type')}</label>
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <select
                id={`${mode}-app-os-type`}
                name={`${mode}-app-os-type`}
                value={vmCreateUpdateAppOSType}
                onChange={changeVMCreateUpdateAppOSType}
              >
                <option value="win10">Windows 10</option>
                <option value="win11">Windows 11</option>
                <option value="l26">Debian 12</option>
              </select>
            </ReactBootstrap.Col>
            <div className="error-text">{t(`error-${mode}-app-os-type`)}</div>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <label htmlFor={`${mode}-app-installer`}>{t('app-create-update-installer')}</label>
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Field
                type="text"
                id={`${mode}-app-installer`}
                name={`${mode}-app-installer`}
                value={vmCreateUpdateAppInstaller}
                onChange={changeVMCreateUpdateAppInstaller}
              />
            </ReactBootstrap.Col>
            <div className="error-text">{t(`error-${mode}-app-installer`)}</div>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <label htmlFor={`${mode}-app-installer-args`}>{t('app-create-update-installer-args')}</label>
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Field
                type="text"
                id={`${mode}-app-installer-args`}
                name={`${mode}-app-installer-args`}
                value={vmCreateUpdateAppInstallerARGS}
                onChange={changeVMCreateUpdateAppInstallerARGS}
              />
            </ReactBootstrap.Col>
            <div className="error-text">{t(`error-${mode}-app-installer-args`)}</div>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <label htmlFor={`${mode}-app-installer-type`}>{t('app-create-update-installer-type')}</label>
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <select
                id={`${mode}-app-installer-type`}
                name={`${mode}-app-installer-type`}
                value={vmCreateUpdateAppInstallerType}
                onChange={changeVMCreateUpdateAppInstallerType}
              >
                <option value="None">{t('app-installer-none')}</option>
                <option value="exec_cmd">{t('app-installer-execute-command')}</option>
                <option value="os_install">{t('app-installer-os-install')}</option>
                <option value="os_uninstall">{t('app-installer-os-uninstall')}</option>
              </select>
            </ReactBootstrap.Col>
            <div className="error-text">{t(`error-${mode}-app-installer-type`)}</div>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <label htmlFor={`${mode}-app-target`}>{t('app-create-update-target')}</label>
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Field
                type="text"
                id={`${mode}-app-target`}
                name={`${mode}-app-target`}
                value={vmCreateUpdateAppTarget}
                onChange={changeVMCreateUpdateAppTarget}
              />
            </ReactBootstrap.Col>
            <div className="error-text">{t(`error-${mode}-app-target`)}</div>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <label htmlFor={`${mode}-app-target-args`}>{t('app-create-update-target-args')}</label>
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Field
                type="text"
                id={`${mode}-app-target-args`}
                name={`${mode}-app-target-args`}
                value={vmCreateUpdateAppTargetARGS}
                onChange={changeVMCreateUpdateAppTargetARGS}
              />
            </ReactBootstrap.Col>
            <div className="error-text">{t(`error-${mode}-app-target-args`)}</div>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <label htmlFor={`${mode}-app-version`}>{t('app-create-update-version')}</label>
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Field
                type="text"
                id={`${mode}-app-version`}
                name={`${mode}-app-version`}
                value={vmCreateUpdateAppVersion}
                onChange={changeVMCreateUpdateAppVersion}
              />
            </ReactBootstrap.Col>
            <div className="error-text">{t(`error-${mode}-app-version`)}</div>
          </ReactBootstrap.Row>
          <ReactBootstrap.Row>
            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <ReactBootstrap.Button
                type="submit"
                variant="primary"
                id="submit"
                disabled={
                  vmCreateUpdateAppID.length > 0 &&
                  vmCreateUpdateAppName.length > 0 &&
                  vmCreateUpdateAppOSType.length > 0 &&
                  vmCreateUpdateAppInstallerType.length > 0 &&
                  vmCreateUpdateAppTarget.length > 0 &&
                  vmCreateUpdateAppVersion.length > 0
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
  );

  const renderFileForm = (mode, validationSchema, onSubmit) => (
    <Formik
      initialValues={{
        id: '',
        filename: '',
        filepath: '',
        os_type: '',
        version: '',
        file: '',
      }}
      validationSchema={validationSchema}
      onSubmit={SUBMIT_HANDLED_BY_FORM}
    >
      {({ errors, touched }) => (
        <Form onSubmit={onSubmit} id="form-apps-tools">
          <ReactBootstrap.Row>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <label htmlFor={`${mode}-file-id`}>{t('vm-id')}</label>
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Field
                type="text"
                id={`${mode}-file-id`}
                name={`${mode}-file-id`}
                value={vmFileUploadAppID}
                onChange={changeVMFileUploadAppID}
              />
            </ReactBootstrap.Col>
            <div className="error-text">{t(`error-${mode}-file-id`)}</div>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <label htmlFor={`${mode}-file-name`}>{t('file-create-update-name')}</label>
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Field
                type="text"
                id={`${mode}-file-name`}
                name={`${mode}-file-name`}
                value={vmFileUploadAppName}
                onChange={changeVMFileUploadAppName}
              />
            </ReactBootstrap.Col>
            <div className="error-text">{t(`error-${mode}-file-name`)}</div>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <label htmlFor={`${mode}-file-path`}>{t('file-create-update-path')}</label>
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Field
                type="text"
                id={`${mode}-file-path`}
                name={`${mode}-file-path`}
                value={vmFileUploadAppPath}
                onChange={changeVMFileUploadAppPath}
              />
            </ReactBootstrap.Col>
            <div className="error-text">{t(`error-${mode}-file-path`)}</div>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <label htmlFor={`${mode}-file-os-type`}>{t('file-create-update-os-type')}</label>
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <select
                id={`${mode}-file-os-type`}
                name={`${mode}-file-os-type`}
                value={vmFileUploadAppOSType}
                onChange={changeVMFileUploadAppOSType}
              >
                <option value="win10">Windows 10</option>
                <option value="win11">Windows 11</option>
                <option value="l26">Debian 12</option>
              </select>
            </ReactBootstrap.Col>
            <div className="error-text">{t(`error-${mode}-file-os-type`)}</div>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <label htmlFor={`${mode}-file-version`}>{t('file-create-update-version')}</label>
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Field
                type="text"
                id={`${mode}-file-version`}
                name={`${mode}-file-version`}
                value={vmFileUploadAppVersion}
                onChange={changeVMFileUploadAppVersion}
              />
            </ReactBootstrap.Col>
            <div className="error-text">{t(`error-${mode}-file-version`)}</div>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <label htmlFor={`${mode}-file-file`}>{t('file-create-update-file')}</label>
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <input
                type="file"
                id={`${mode}-file-file`}
                name={`${mode}-file-file`}
                onChange={changeVMFileUploadAppSelectFile}
              />
            </ReactBootstrap.Col>
            <div className="error-text">{t(`error-${mode}-file-file`)}</div>
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
  );

  return (
    <>
      <Header connections={connectionDataNewer} />
      <ReactBootstrap.Container id="dashboardUser">
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
            <h2>{t('overview')}</h2>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>
        {getRole() === 'admin' ? (
          <>
            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
              <>
                <ReactBootstrap.Button type="submit" variant="primary" onClick={adminDashboardDetail}>
                  {t('go-to-admin-dashboard')}
                </ReactBootstrap.Button>
              </>
            </ReactBootstrap.Col>
          </>
        ) : (
          <></>
        )}
        {Object.keys(dashboardInfo).length > 0 ? (
          <ReactBootstrap.Row id="dashboard_info_details">
            {/*<>
                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                  {
                    !detailViewButton ? (
                      <>
                        <ReactBootstrap.Button
                            type="submit"
                            variant="primary"
                            onClick={() => setDetailViewButton(true)}>
                          {t('show-detail-user-view')}
                        </ReactBootstrap.Button>
                      </>
                    ) : (
                      <>
                        <ReactBootstrap.Button
                            type="submit"
                            variant="primary"
                            onClick={() => setDetailViewButton(false)}>
                          {t('hide-detail-user-view')}
                        </ReactBootstrap.Button>
                      </>
                    )
                  }
                </ReactBootstrap.Col>
              </>*/}
            {
              <>
                <ReactBootstrap.Row>
                  <ReactBootstrap.Col xs={12} sm={12} md={6} lg={4} xl={4} className="text-center">
                    <div>
                      {t('count-vm-max')}{' '}
                      {formatUsage(
                        dashboardInfo.utilized_ressources.object_vms,
                        dashboardInfo.available_ressources.vm_max,
                        t,
                      )}
                    </div>
                  </ReactBootstrap.Col>
                  <ReactBootstrap.Col xs={12} sm={12} md={6} lg={4} xl={4} className="text-center">
                    <div>
                      {t('count-container-max')}{' '}
                      {formatUsage(
                        dashboardInfo.utilized_ressources.object_images,
                        dashboardInfo.available_ressources.container_max,
                        t,
                      )}
                    </div>
                  </ReactBootstrap.Col>
                  <ReactBootstrap.Col xs={12} sm={12} md={6} lg={4} xl={4} className="text-center">
                    <div>
                      {t('count-objects-max')}{' '}
                      {formatUsage(
                        dashboardInfo.utilized_ressources.objects,
                        dashboardInfo.available_ressources.obj_max,
                        t,
                      )}
                    </div>
                  </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                  <h3>{t('available_objects')}</h3>
                </ReactBootstrap.Col>
                {dashboardInfo.available_objects.length > 0 ? (
                  <>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                      <div>
                        <select
                          id="available-object"
                          name="available-object"
                          value={availableObjectValue}
                          onChange={changeAvailableObjectValue}
                        >
                          <option value="">{t('no-object')}</option>
                          {dashboardInfo.available_objects.map((appObject, index) => {
                            return (
                              <>
                                <option value={JSON.stringify(appObject)}>{t('name-text') + appObject.id_user}</option>
                              </>
                            );
                          })}
                        </select>
                      </div>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={3} lg={3} xl={3} className="text-center">
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        disabled={availableObjectValue === undefined || availableObjectValue === '' ? true : false}
                        onClick={(event) =>
                          startObject(
                            event,
                            localStorage.getItem('selected-object-id'),
                            localStorage.getItem('selected-object-env-name'),
                            localStorage.getItem('selected-object-state'),
                          )
                        }
                      >
                        {t('start-mode')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={3} lg={3} xl={3} className="text-center">
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        disabled={
                          localStorage.getItem('object-id-instance') === undefined ||
                          localStorage.getItem('object-id-instance') === ''
                            ? true
                            : false
                        }
                        onClick={(event) =>
                          stopObject(
                            event,
                            localStorage.getItem('selected-object-id'),
                            localStorage.getItem('selected-object-env-name'),
                            localStorage.getItem('selected-object-state'),
                          )
                        }
                      >
                        {t('stop-mode')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={3} lg={3} xl={3} className="text-center">
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        disabled={availableObjectValue === undefined || availableObjectValue === '' ? true : false}
                        onClick={() =>
                          objectData(
                            localStorage.getItem('selected-object-id'),
                            localStorage.getItem('selected-object-env-name'),
                            localStorage.getItem('selected-object-state'),
                          )
                        }
                      >
                        {t('edit-headline')} ({t('expert-mode')})
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={3} lg={3} xl={3} className="text-center">
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        disabled={availableObjectValue === undefined || availableObjectValue === '' ? true : false}
                        onClick={(event) =>
                          deleteObject(
                            event,
                            localStorage.getItem('selected-object-id'),
                            localStorage.getItem('selected-object-env-name'),
                            localStorage.getItem('selected-object-state'),
                          )
                        }
                      >
                        {t('delete-mode')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </>
                ) : (
                  <>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                      {t('no-data-available')}
                    </ReactBootstrap.Col>
                  </>
                )}
                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                  <h3>{t('available_environments')}</h3>
                </ReactBootstrap.Col>
                {dashboardInfo.available_environments.length > 0 ? (
                  <>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                      <div>
                        <select
                          id="available-environments"
                          name="available-environments"
                          value={availableEnvironmentValue}
                          onChange={changeAvailableEnvironmentValue}
                        >
                          <option value="">{t('no-environment')}</option>
                          {dashboardInfo.available_environments.map((appEnv, index) => {
                            return (
                              <>
                                <option value={JSON.stringify(appEnv)}>
                                  {t('id-text') +
                                    appEnv.id_env +
                                    ', ' +
                                    t('name-text') +
                                    appEnv.name +
                                    ', ' +
                                    t('object-text') +
                                    appEnv.id_object}
                                </option>
                              </>
                            );
                          })}
                        </select>
                      </div>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col
                      xs={12}
                      sm={12}
                      md={3}
                      lg={3}
                      xl={3}
                      className="text-center button-dashboard-update"
                    >
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        disabled={
                          availableEnvironmentValue === undefined || availableEnvironmentValue === '' ? true : false
                        }
                        onClick={() =>
                          environmentData(
                            localStorage.getItem('selected-environment-id'),
                            localStorage.getItem('selected-environment-name'),
                            'start',
                          )
                        }
                      >
                        {t('start-headline')}
                      </ReactBootstrap.Button>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        disabled={
                          availableEnvironmentValue === undefined || availableEnvironmentValue === '' ? true : false
                        }
                        onClick={() =>
                          environmentData(
                            localStorage.getItem('selected-environment-id'),
                            localStorage.getItem('selected-environment-name'),
                            'run',
                          )
                        }
                      >
                        {t('run-headline')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={3} lg={3} xl={3} className="text-center">
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        disabled={
                          availableEnvironmentValue === undefined || availableEnvironmentValue === '' ? true : false
                        }
                        onClick={() =>
                          environmentDataStop(
                            localStorage.getItem('selected-environment-id'),
                            localStorage.getItem('selected-environment-name'),
                          )
                        }
                      >
                        {t('stop-headline')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={3} lg={3} xl={3} className="text-center">
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        disabled={
                          availableEnvironmentValue === undefined || availableEnvironmentValue === '' ? true : false
                        }
                        onClick={() =>
                          environmentDataEdit(
                            localStorage.getItem('selected-environment-id'),
                            localStorage.getItem('selected-environment-name'),
                            localStorage.getItem('selected-environment-name-object'),
                            'edit',
                            localStorage.getItem('selected-environment-name-object-env-apps'),
                            localStorage.getItem('selected-environment-name-object-env-tasks'),
                            localStorage.getItem('selected-environment-name-object-env-target'),
                          )
                        }
                      >
                        {t('edit-headline')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={3} lg={3} xl={3} className="text-center">
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        disabled={
                          availableEnvironmentValue === undefined || availableEnvironmentValue === '' ? true : false
                        }
                        onClick={(event) =>
                          environmentDataDelete(
                            event,
                            localStorage.getItem('selected-environment-id'),
                            localStorage.getItem('selected-environment-name'),
                          )
                        }
                      >
                        {t('delete-headline')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </>
                ) : (
                  <>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                      {t('no-data-available')}
                    </ReactBootstrap.Col>
                  </>
                )}
                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                  <h3>{t('available_applications')}</h3>
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                  <input
                    style={{ marginLeft: 5 }}
                    type="text"
                    placeholder={t('search-text-placeholder')}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </ReactBootstrap.Col>
                <div className="scrollbar-menu-apps-main">
                  {visibleApplications.length > 0 ? (
                    visibleApplications.map((appData) => {
                      return (
                        <>
                          {appData.id_owner === Number(localStorage.getItem('userDataID')) ? (
                            <>
                              <div className="text-center">
                                <div>{appData.name}</div>
                                <div className="icon-main">
                                  {appData.os_type === 'win10' || appData.os_type === 'win11' ? (
                                    <span>
                                      <i class="fa-brands fa-microsoft fa-xl icon-brands"></i>
                                    </span>
                                  ) : appData.os_type === 'l26vm' || appData.os_type === 'l26' ? (
                                    <span>
                                      <i className="fa-brands fa-linux fa-xl icon-brands"></i>
                                    </span>
                                  ) : (
                                    <></>
                                  )}
                                  {appData.object_type === 'vm' ? (
                                    <span>
                                      <i class="fa-solid fa-server fa-xl icon-brands"></i>
                                    </span>
                                  ) : appData.object_type === 'container' ? (
                                    <span>
                                      <i className="fa-brands fa-docker fa-xl icon-brands"></i>
                                    </span>
                                  ) : (
                                    <></>
                                  )}
                                  {appData.id_file !== '' ? (
                                    <span>
                                      <i class="fa-solid fa-file fa-xl icon-brands"></i>
                                    </span>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                                <div className="text-center">
                                  <ReactBootstrap.Button
                                    type="submit"
                                    variant="primary"
                                    onClick={() => applicationData(appData.id_app, 'clone')}
                                    disabled={appData.id_template === '' ? true : false}
                                  >
                                    {t('clone-headline')}
                                  </ReactBootstrap.Button>
                                </div>
                                <div className="text-center">
                                  <ReactBootstrap.Button
                                    type="submit"
                                    variant="primary"
                                    onClick={() => applicationData(appData.id_app, 'create')}
                                  >
                                    {t('create-headline')}
                                  </ReactBootstrap.Button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      );
                    })
                  ) : (
                    <>
                      <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                        {t('no-data-available')}
                      </ReactBootstrap.Col>
                    </>
                  )}
                  {ownApplication.length === 0 ? (
                    <>
                      <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                        {t('no-data-available')}
                      </ReactBootstrap.Col>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            }
          </ReactBootstrap.Row>
        ) : (
          <>
            <ReactBootstrap.Row>
              <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                {t('no-data-available')}
              </ReactBootstrap.Col>
            </ReactBootstrap.Row>
          </>
        )}
        <div className="bottom-footer-fix-refresh" onClick={refreshDashboard}>
          <i className="fa-solid fa-arrows-rotate"></i>
        </div>
        <div className="bottom-footer-fix" onClick={() => setApplicationModal(true)}>
          <i className="fa-solid fa-circle-plus"></i>
        </div>
        <div className="bottom-footer-fix-info" onClick={() => setInfoModal(true)}>
          <i className="fa-solid fa-circle-info"></i>
        </div>
        <div className="bottom-footer-fix-contact" onClick={() => setRequestModal(true)}>
          <i className="fa-solid fa-envelope"></i>
        </div>
        <div className="bottom-footer-fix-file" onClick={() => setFileModal(true)}>
          <i className="fa-solid fa-file"></i>
        </div>
        {getRole() === 'user' ? (
          <div className="bottom-footer-fix-monitoring" onClick={goToMonitoring}>
            <i className="fa-solid fa-gear"></i>
          </div>
        ) : (
          <></>
        )}
        {/* Modal for infos */}
        <ReactBootstrap.Modal
          show={infoModal}
          onHide={closeInfoModal}
          size="md"
          aria-labelledby="contained-modal-title-vcenter-info"
          centered
          id="info-details"
        >
          <ReactBootstrap.Modal.Header closeButton>
            <ReactBootstrap.Modal.Title>{t('info-detail')}</ReactBootstrap.Modal.Title>
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body>
            <ReactBootstrap.Row>
              <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                <div>
                  <h2>{t('clone-headline')}</h2>
                </div>
              </ReactBootstrap.Col>
              <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                <div>{t('clone-content')}</div>
              </ReactBootstrap.Col>
              <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                <div>
                  <h2>{t('create-headline')}</h2>
                </div>
              </ReactBootstrap.Col>
              <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                <div>{t('create-content')}</div>
              </ReactBootstrap.Col>
              <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                <div>
                  <h2>{t('icon-headline')}</h2>
                </div>
              </ReactBootstrap.Col>
              <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                <div>
                  <span>
                    <i className="fa-brands fa-microsoft fa-xl"></i>
                  </span>
                  <span className="info-text-space">{t('windows-text')}</span>
                </div>
              </ReactBootstrap.Col>
              <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                <div>
                  <span>
                    <i className="fa-brands fa-linux fa-xl"></i>
                  </span>
                  <span className="info-text-space">{t('linux-text')}</span>
                </div>
              </ReactBootstrap.Col>
              <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                <div>
                  <span>
                    <i className="fa-solid fa-server fa-xl"></i>
                  </span>
                  <span className="info-text-space">{t('vm-text')}</span>
                </div>
              </ReactBootstrap.Col>
              <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                <div>
                  <span>
                    <i className="fa-brands fa-docker fa-xl"></i>
                  </span>
                  <span className="info-text-space">{t('docker-text')}</span>
                </div>
              </ReactBootstrap.Col>
              <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                <div>
                  <span>
                    <i className="fa-solid fa-file fa-xl"></i>
                  </span>
                  <span className="info-text-space">{t('file-text')}</span>
                </div>
              </ReactBootstrap.Col>
            </ReactBootstrap.Row>
          </ReactBootstrap.Modal.Body>
        </ReactBootstrap.Modal>
        {/* Modal for apps */}
        <ReactBootstrap.Modal
          show={applicationModal}
          onHide={closeApplicationModal}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          id="user-app-complete"
        >
          <ReactBootstrap.Modal.Header closeButton>
            <ReactBootstrap.Modal.Title>{t('create-update-share-data')}</ReactBootstrap.Modal.Title>
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body>
            <ReactBootstrap.Tabs defaultActiveKey="app-shared" id="user-app-view">
              <ReactBootstrap.Tab eventKey="app-shared" title={t('app-shared')}>
                <ReactBootstrap.Row>
                  <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                    <input
                      style={{ marginLeft: 5 }}
                      type="text"
                      placeholder={t('search-text-placeholder')}
                      value={searchTextShared}
                      onChange={(e) => setSearchTextShared(e.target.value)}
                    />
                  </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Row>
                  {visibleSharedApplications.length > 0 ? (
                    visibleSharedApplications.map((dataShared) => {
                      return (
                        <>
                          {dataShared.id_owner === 0 ? (
                            <>
                              <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                                <div>
                                  <div>
                                    <span className="fw-bold">{t('environment-name') + ': '}</span>
                                    <span>{dataShared.name}</span>
                                  </div>
                                </div>
                              </ReactBootstrap.Col>
                              <ReactBootstrap.Col xs={4} sm={4} md={4} lg={4} xl={4} className="text-center">
                                {dataShared.os_type === 'win10' || dataShared.os_type === 'win11' ? (
                                  <i class="fa-brands fa-microsoft fa-xl"></i>
                                ) : dataShared.os_type === 'l26vm' || dataShared.os_type === 'l26' ? (
                                  <i className="fa-brands fa-linux fa-xl"></i>
                                ) : (
                                  <></>
                                )}
                              </ReactBootstrap.Col>
                              <ReactBootstrap.Col xs={4} sm={4} md={4} lg={4} xl={4} className="text-center">
                                {dataShared.object_type === 'vm' ? (
                                  <i class="fa-solid fa-server fa-xl"></i>
                                ) : dataShared.object_type === 'container' ? (
                                  <i className="fa-brands fa-docker fa-xl"></i>
                                ) : (
                                  <></>
                                )}
                              </ReactBootstrap.Col>
                              <ReactBootstrap.Col xs={4} sm={4} md={4} lg={4} xl={4} className="text-center">
                                {dataShared.id_file !== '' ? <i class="fa-solid fa-file fa-xl"></i> : <></>}
                              </ReactBootstrap.Col>
                              <ReactBootstrap.Row className="border_apps_bottom">
                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-center">
                                  <ReactBootstrap.Button
                                    type="submit"
                                    variant="primary"
                                    onClick={() => applicationData(dataShared.id_app, 'clone')}
                                    disabled={dataShared.id_template === '' ? true : false}
                                  >
                                    {t('clone-headline')}
                                  </ReactBootstrap.Button>
                                </ReactBootstrap.Col>
                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-center">
                                  <ReactBootstrap.Button
                                    type="submit"
                                    variant="primary"
                                    onClick={() => applicationData(dataShared.id_app, 'create')}
                                  >
                                    {t('create-headline')}
                                  </ReactBootstrap.Button>
                                </ReactBootstrap.Col>
                              </ReactBootstrap.Row>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      );
                    })
                  ) : (
                    <>{t('no-data-available')}</>
                  )}
                </ReactBootstrap.Row>
              </ReactBootstrap.Tab>
              <ReactBootstrap.Tab eventKey="create-new-object" title={t('create-new-object')}>
                <Formik
                  initialValues={vmPhasesObjectTypeBaseimageCreate === 'vm' ? vmDataSchema : containerDataSchema}
                  validationSchema={
                    vmPhasesObjectTypeBaseimageCreate === 'vm'
                      ? phasesBaseimageCreateVMSchema
                      : phasesBaseimageCreateContainerSchema
                  }
                  onSubmit={SUBMIT_HANDLED_BY_FORM}
                >
                  {({ errors, touched }) => (
                    <Form onSubmit={phasesBaseimageCreate} id="form-phases-baseimage-create">
                      <ReactBootstrap.Row>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          <label htmlFor="vm-id-phases-baseimage-create">{t('vm-id')}</label>
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          <Field
                            type="text"
                            id="vm-id-phases-baseimage-create"
                            name="vm-id-phases-baseimage-create"
                            value={vmPhasesIDBaseimageCreate}
                            onChange={changeVMPhasesIDBaseimageCreate}
                          />
                        </ReactBootstrap.Col>
                        <div className="error-text">{t('error-vm-id-phases-baseimage-create')}</div>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          <label htmlFor="vm-type-phases-baseimage-create">{t('vm-object-type')}</label>
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          <select
                            id="vm-type-phases-baseimage-create"
                            name="vm-type-phases-baseimage-create"
                            value={vmPhasesObjectTypeBaseimageCreate}
                            onChange={changeVMPhasesObjectTypeBaseimageCreate}
                          >
                            <option value=""></option>
                            <option value="vm">VM</option>
                            <option value="container">Container</option>
                          </select>
                        </ReactBootstrap.Col>
                        <div className="error-text">{t('error-vm-type-phases-baseimage-create')}</div>
                        {vmPhasesObjectTypeBaseimageCreate === 'vm' ? (
                          <>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-name-vm-phases-baseimage-create">{t('vm-name')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-name-vm-phases-baseimage-create"
                                name="vm-name-vm-phases-baseimage-create"
                                value={vmPhasesNameVMBaseimageCreate}
                                onChange={changeVMPhasesNameVMBaseimageCreate}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-name-vm-phases-baseimage-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-os-type-phases-baseimage-create">{t('vm-os-type')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <select
                                id="vm-os-type-phases-baseimage-create"
                                name="vm-os-type-phases-baseimage-create"
                                value={vmPhasesOSTypeBaseimageCreate}
                                onChange={changeVMPhasesOSTypeBaseimageCreate}
                              >
                                <option value="win10">Windows 10</option>
                                <option value="win11">Windows 11</option>
                                <option value="l26">Linux - Debian 12</option>
                              </select>
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-os-type-phases-baseimage-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-cores-phases-baseimage-create">{t('vm-cores')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-cores-phases-baseimage-create"
                                name="vm-cores-phases-baseimage-create"
                                value={vmPhasesCoresBaseimageCreate}
                                onChange={changeVMPhasesCoresBaseimageCreate}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-cores-phases-baseimage-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-memory-size-phases-baseimage-create">{t('vm-memory-size')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-memory-size-phases-baseimage-create"
                                name="vm-memory-size-phases-baseimage-create"
                                value={vmPhasesMemorySizeBaseimageCreate}
                                onChange={changeVMPhasesMemorySizeBaseimageCreate}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-memory-size-phases-baseimage-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-disk-size-phases-baseimage-create">{t('vm-disk-size')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-disk-size-phases-baseimage-create"
                                name="vm-disk-size-phases-baseimage-create"
                                value={vmPhasesDiskSizeBaseimageCreate}
                                onChange={changeVMPhasesDiskSizeBaseimageCreate}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-disk-size-phases-baseimage-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-keyboard-language-phases-baseimage-create">
                                {t('vm-keyboard-language')}
                              </label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-keyboard-language-phases-baseimage-create"
                                name="vm-keyboard-language-phases-baseimage-create"
                                value={vmPhasesKeyboardBaseimageCreate}
                                onChange={changeVMPhasesKeyboardBaseimageCreate}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-keyboard-language-phases-baseimage-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-ceph-pool-phases-baseimage-create">{t('vm-ceph-pool')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <input
                                type="checkbox"
                                id="vm-ceph-pool-phases-baseimage-create"
                                name="vm-ceph-pupoolblic-phases-baseimage-create"
                                checked={vmPhasesCephPoolBaseimageCreateChecked}
                                onChange={changeVMPhasesCephPoolBaseimageCreate}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-ceph-pool-phases-environment-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-ceph-public-phases-baseimage-create">{t('vm-ceph-public')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <input
                                type="checkbox"
                                id="vm-ceph-public-phases-baseimage-create"
                                name="vm-ceph-public-phases-baseimage-create"
                                checked={vmPhasesCephPublicBaseimageCreateChecked}
                                onChange={changeVMPhasesCephPublicBaseimageCreate}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-ceph-public-phases-environment-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-ceph-shared-phases-baseimage-create">{t('vm-ceph-shared')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <input
                                type="checkbox"
                                id="vm-ceph-shared-phases-baseimage-create"
                                name="vm-ceph-shared-phases-baseimage-create"
                                checked={vmPhasesCephSharedBaseimageCreateChecked}
                                onChange={changeVMPhasesCephSharedBaseimageCreate}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-ceph-shared-phases-environment-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-ceph-user-phases-baseimage-create">{t('vm-ceph-user')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <input
                                type="checkbox"
                                id="vm-ceph-user-phases-baseimage-create"
                                name="vm-ceph-user-phases-baseimage-create"
                                checked={vmPhasesCephUserBaseimageCreateChecked}
                                onChange={changeVMPhasesCephUserBaseimageCreate}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-ceph-user-phases-environment-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-resolution-phases-environment-create">{t('vm-resolution')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-resolution-phases-environment-create"
                                name="vm-resolution-phases-environment-create"
                                value={vmResolutionPhasesBaseimageCreate}
                                onChange={changeVMResolutionPhasesBaseimageCreate}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-resolution-phases-environment-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-contype-phases-environment-create">{t('vm-contype')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <select
                                id="vm-contype-phases-environment-create"
                                name="vm-contype-phases-environment-create"
                                value={vmContypePhasesBaseimageCreate}
                                onChange={changeVMContypePhasesBaseimageCreate}
                              >
                                <option value="sysvnc">System VNC (Proxmox default)</option>
                                <option value="instvnc">Instance VNC (Docker default)</option>
                                <option value="rdp">RDP (Windows only)</option>
                              </select>
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-contype-phases-environment-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-resize-phases-environment-create">{t('vm-resize')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <select
                                id="vm-resize-phases-environment-create"
                                name="vm-resize-phases-environment-create"
                                value={vmResizePhasesBaseimageCreate}
                                onChange={changeVMResizePhasesBaseimageCreate}
                              >
                                <option value="none">None (Do nothing)</option>
                                <option value="semi">Semi (Allow instance)</option>
                                <option value="full">Full (Enforce JS)</option>
                              </select>
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-resize-phases-environment-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-scale-phases-environment-create">{t('vm-scale')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <input
                                type="checkbox"
                                id="vm-scale-phases-environment-create"
                                name="vm-scale-phases-environment-create"
                                checked={vmScalePhasesBaseimageCreateChecked}
                                onChange={changeVMScalePhasesBaseimageCreateChecked}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-scale-phases-environment-create')}</div>
                          </>
                        ) : vmPhasesObjectTypeBaseimageCreate === 'container' ? (
                          <>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-name-phases-baseimage-create">{t('vm-name')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-name-phases-baseimage-create"
                                name="vm-name-phases-baseimage-create"
                                value={vmPhasesNameBaseimageCreate}
                                onChange={changeVMPhasesNameBaseimageCreate}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-name-phases-baseimage-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-root-image-phases-baseimage-create">{t('vm-root-image')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <select
                                id="vm-root-image-phases-baseimage-create"
                                name="vm-root-image-phases-baseimage-create"
                                value={vmPhasesRootImageBaseimageCreate}
                                onChange={changeVMPhasesRootImageBaseimageCreate}
                              >
                                <option value="x11vnc">x11vnc</option>
                                <option value="wine">wine</option>
                              </select>
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-root-image-phases-baseimage-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-cores-phases-baseimage-create">{t('vm-cores')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-cores-phases-baseimage-create"
                                name="vm-cores-phases-baseimage-create"
                                value={vmPhasesCoresBaseimageCreate}
                                onChange={changeVMPhasesCoresBaseimageCreate}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-cores-phases-baseimage-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-memory-size-phases-baseimage-create">{t('vm-memory-size')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-memory-size-phases-baseimage-create"
                                name="vm-memory-size-phases-baseimage-create"
                                value={vmPhasesMemorySizeBaseimageCreate}
                                onChange={changeVMPhasesMemorySizeBaseimageCreate}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-memory-size-phases-baseimage-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-disk-size-phases-baseimage-create">{t('vm-disk-size')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-disk-size-phases-baseimage-create"
                                name="vm-disk-size-phases-baseimage-create"
                                value={vmPhasesDiskSizeBaseimageCreate}
                                onChange={changeVMPhasesDiskSizeBaseimageCreate}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-disk-size-phases-baseimage-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-dockerfile-phases-baseimage-create">{t('vm-dockerfile')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <input
                                type="file"
                                id="vm-dockerfile-phases-baseimage-create"
                                name="vm-dockerfile-phases-baseimage-create"
                                onChange={changeVMPhasesDockerfileBaseimageCreate}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-dockerfile-phases-baseimage-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-ceph-public-phases-baseimage-create">{t('vm-ceph-public')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <input
                                type="checkbox"
                                id="vm-ceph-public-phases-baseimage-create"
                                name="vm-ceph-public-phases-baseimage-create"
                                checked={vmPhasesCephPublicBaseimageCreateChecked}
                                onChange={changeVMPhasesCephPublicBaseimageCreate}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-ceph-public-phases-environment-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-ceph-shared-phases-baseimage-create">{t('vm-ceph-shared')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <input
                                type="checkbox"
                                id="vm-ceph-shared-phases-baseimage-create"
                                name="vm-ceph-shared-phases-baseimage-create"
                                checked={vmPhasesCephSharedBaseimageCreateChecked}
                                onChange={changeVMPhasesCephSharedBaseimageCreate}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-ceph-shared-phases-environment-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-ceph-user-phases-baseimage-create">{t('vm-ceph-user')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <input
                                type="checkbox"
                                id="vm-ceph-user-phases-baseimage-create"
                                name="vm-ceph-user-phases-baseimage-create"
                                checked={vmPhasesCephUserBaseimageCreateChecked}
                                onChange={changeVMPhasesCephUserBaseimageCreate}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-ceph-user-phases-environment-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-resolution-phases-environment-create">{t('vm-resolution')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <Field
                                type="text"
                                id="vm-resolution-phases-environment-create"
                                name="vm-resolution-phases-environment-create"
                                value={vmResolutionPhasesBaseimageCreate}
                                onChange={changeVMResolutionPhasesBaseimageCreate}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-resolution-phases-environment-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-contype-phases-environment-create">{t('vm-contype')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <select
                                id="vm-contype-phases-environment-create"
                                name="vm-contype-phases-environment-create"
                                value={vmContypePhasesBaseimageCreate}
                                onChange={changeVMContypePhasesBaseimageCreate}
                              >
                                <option value="sysvnc">System VNC (Proxmox default)</option>
                                <option value="instvnc">Instance VNC (Docker default)</option>
                                <option value="rdp">RDP (Windows only)</option>
                              </select>
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-contype-phases-environment-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-resize-phases-environment-create">{t('vm-resize')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <select
                                id="vm-resize-phases-environment-create"
                                name="vm-resize-phases-environment-create"
                                value={vmResizePhasesBaseimageCreate}
                                onChange={changeVMResizePhasesBaseimageCreate}
                              >
                                <option value="none">None (Do nothing)</option>
                                <option value="semi">Semi (Allow instance)</option>
                                <option value="full">Full (Enforce JS)</option>
                              </select>
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-resize-phases-environment-create')}</div>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <label htmlFor="vm-scale-phases-environment-create">{t('vm-scale')}</label>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                              <input
                                type="checkbox"
                                id="vm-scale-phases-environment-create"
                                name="vm-scale-phases-environment-create"
                                checked={vmScalePhasesBaseimageCreateChecked}
                                onChange={changeVMScalePhasesBaseimageCreateChecked}
                              />
                            </ReactBootstrap.Col>
                            <div className="error-text">{t('error-vm-scale-phases-environment-create')}</div>
                          </>
                        ) : (
                          <></>
                        )}
                      </ReactBootstrap.Row>
                      {vmPhasesObjectTypeBaseimageCreate === 'vm' ? (
                        <ReactBootstrap.Row>
                          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ReactBootstrap.Button
                              type="submit"
                              variant="primary"
                              id="submit"
                              disabled={
                                vmPhasesIDBaseimageCreate.length > 0 &&
                                vmPhasesObjectTypeBaseimageCreate !== '' &&
                                vmPhasesMemorySizeBaseimageCreate.length > 0 &&
                                vmPhasesDiskSizeBaseimageCreate.length > 0 &&
                                /*vmPhasesDockerfileBaseimageCreate &&*/ ((vmPhasesNameBaseimageCreate.length > 0 &&
                                  vmPhasesRootImageBaseimageCreate.length > 0) ||
                                  (vmPhasesNameVMBaseimageCreate.length > 0 &&
                                    vmPhasesOSTypeBaseimageCreate.length > 0 &&
                                    vmPhasesCoresBaseimageCreate.length > 0 &&
                                    vmPhasesMemorySizeBaseimageCreate.length > 0 &&
                                    vmPhasesDiskSizeBaseimageCreate.length > 0 &&
                                    vmPhasesKeyboardBaseimageCreate.length > 0))
                                  ? false
                                  : true
                              }
                            >
                              {t('submit')}
                            </ReactBootstrap.Button>
                          </ReactBootstrap.Col>
                        </ReactBootstrap.Row>
                      ) : (
                        <ReactBootstrap.Row>
                          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ReactBootstrap.Button
                              type="submit"
                              variant="primary"
                              id="submit"
                              disabled={
                                vmPhasesIDBaseimageCreate.length > 0 &&
                                vmPhasesObjectTypeBaseimageCreate !== '' &&
                                vmPhasesCoresBaseimageCreate.length > 0 &&
                                vmPhasesMemorySizeBaseimageCreate.length > 0 &&
                                vmPhasesDiskSizeBaseimageCreate.length > 0 &&
                                /*vmPhasesDockerfileBaseimageCreate &&*/ ((vmPhasesNameBaseimageCreate.length > 0 &&
                                  vmPhasesRootImageBaseimageCreate.length > 0) ||
                                  (vmPhasesNameVMBaseimageCreate.length > 0 &&
                                    vmPhasesOSTypeBaseimageCreate.length > 0 &&
                                    vmPhasesKeyboardBaseimageCreate.length > 0))
                                  ? false
                                  : true
                              }
                            >
                              {t('submit')}
                            </ReactBootstrap.Button>
                          </ReactBootstrap.Col>
                        </ReactBootstrap.Row>
                      )}
                    </Form>
                  )}
                </Formik>
              </ReactBootstrap.Tab>
              <ReactBootstrap.Tab eventKey="clone-new-object" title={t('clone-new-object')}>
                <Formik
                  initialValues={{
                    id: '',
                    newid: '',
                    name: '',
                  }}
                  validationSchema={phasesBaseimageCloneSchema}
                  onSubmit={SUBMIT_HANDLED_BY_FORM}
                >
                  {({ errors, touched }) => (
                    <Form onSubmit={phasesBaseimageClone} id="form-phases-baseimage-clone">
                      <ReactBootstrap.Row>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          <label htmlFor="vm-id-phases-baseimage-clone">{t('vm-id')}</label>
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          <Field
                            type="text"
                            id="vm-id-phases-baseimage-clone"
                            name="vm-id-phases-baseimage-clone"
                            value={vmPhasesIDBaseimageClone}
                            onChange={changeVMPhasesIDBaseimageClone}
                          />
                        </ReactBootstrap.Col>
                        <div className="error-text">{t('error-vm-id-phases-baseimage-clone')}</div>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          <label htmlFor="vm-newid-phases-baseimage-clone">{t('vm-new-id')}</label>
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          <Field
                            type="text"
                            id="vm-newid-phases-baseimage-clone"
                            name="vm-newid-phases-baseimage-clone"
                            value={vmPhasesNewIDBaseimageClone}
                            onChange={changeVMPhasesNewIDBaseimageClone}
                          />
                        </ReactBootstrap.Col>
                        <div className="error-text">{t('error-vm-newid-phases-baseimage-clone')}</div>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          <label htmlFor="vm-name-phases-baseimage-clone">{t('vm-name')}</label>
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          <Field
                            type="text"
                            id="vm-name-phases-baseimage-clone"
                            name="vm-name-phases-baseimage-clone"
                            value={vmPhasesNameBaseimageClone}
                            onChange={changeVMPhasesNameBaseimageClone}
                          />
                        </ReactBootstrap.Col>
                        <div className="error-text">{t('error-vm-name-phases-baseimage-clone')}</div>
                      </ReactBootstrap.Row>
                      <ReactBootstrap.Row>
                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                          <ReactBootstrap.Button
                            type="submit"
                            variant="primary"
                            id="submit"
                            disabled={
                              vmPhasesIDBaseimageClone.length > 0 &&
                              vmPhasesNewIDBaseimageClone.length > 0 &&
                              vmPhasesNameBaseimageClone.length > 0
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
              <ReactBootstrap.Tab eventKey="app-create" title={t('app-create')}>
                {renderAppForm('create', createAppSchema, createApp)}
              </ReactBootstrap.Tab>
              <ReactBootstrap.Tab eventKey="app-update" title={t('app-update')}>
                {renderAppForm('update', updateAppSchema, updateApp)}
              </ReactBootstrap.Tab>
              <ReactBootstrap.Tab eventKey="file-create" title={t('file-create')}>
                {renderFileForm('create', createFileSchema, createFile)}
              </ReactBootstrap.Tab>
              <ReactBootstrap.Tab eventKey="file-update" title={t('file-update')}>
                {renderFileForm('update', updateFileSchema, updateFile)}
              </ReactBootstrap.Tab>
            </ReactBootstrap.Tabs>
          </ReactBootstrap.Modal.Body>
        </ReactBootstrap.Modal>
        <ReactBootstrap.Modal
          show={requestModal}
          onHide={closeRequestModal}
          size="md"
          aria-labelledby="contained-modal-title-vcenter-request"
          centered
          id="request-app-complete"
        >
          <ReactBootstrap.Modal.Header closeButton>
            <ReactBootstrap.Modal.Title>{t('request-app')}</ReactBootstrap.Modal.Title>
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body>
            <Formik
              initialValues={{}}
              validationSchema={requestApplicationAdminSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {({ errors, touched }) => (
                <Form onSubmit={requestApplicationAdmin} id="form-main-user-request">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <label htmlFor="request-message">{t('request-message')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <input
                        type="text"
                        id="request-message"
                        name="request-message"
                        value={requestMessage}
                        onChange={changeRequestMessage}
                      />
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={requestMessage.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
          </ReactBootstrap.Modal.Body>
        </ReactBootstrap.Modal>
        <ReactBootstrap.Modal
          show={fileModal}
          onHide={closeFileModal}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter-file"
          centered
          id="all-files-view"
        >
          <ReactBootstrap.Modal.Header closeButton>
            <ReactBootstrap.Modal.Title>{t('all-available-files')}</ReactBootstrap.Modal.Title>
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body>
            <ReactBootstrap.Tabs defaultActiveKey="own-files" id="files-view">
              <ReactBootstrap.Tab eventKey="own-files" title={t('own-files')}>
                {ownFiles.length > 0 ? (
                  <>
                    {ownFiles.map((ownFileData) => {
                      return (
                        <ReactBootstrap.Row>
                          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                            {t('details-files-name') + ': ' + ownFileData.id}
                          </ReactBootstrap.Col>
                          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ReactBootstrap.Button
                              type="submit"
                              variant="primary"
                              id="submit"
                              onClick={() => getFileDetailsModal(ownFileData.id)}
                            >
                              {t('details-files')}
                            </ReactBootstrap.Button>
                          </ReactBootstrap.Col>
                        </ReactBootstrap.Row>
                      );
                    })}
                  </>
                ) : (
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                      {t('no-data-available')}
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                )}
              </ReactBootstrap.Tab>
              <ReactBootstrap.Tab eventKey="shared-files" title={t('shared-files')}>
                {sharedFiles.length > 0 ? (
                  <>
                    {sharedFiles.map((sharedFileData) => {
                      return (
                        <ReactBootstrap.Row>
                          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                            {t('details-files-name') + ': ' + sharedFileData.id}
                          </ReactBootstrap.Col>
                          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <ReactBootstrap.Button
                              type="submit"
                              variant="primary"
                              id="submit"
                              onClick={() => getFileDetailsModal(sharedFileData.id)}
                            >
                              {t('details-files')}
                            </ReactBootstrap.Button>
                          </ReactBootstrap.Col>
                        </ReactBootstrap.Row>
                      );
                    })}
                  </>
                ) : (
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                      {t('no-data-available')}
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                )}
              </ReactBootstrap.Tab>
            </ReactBootstrap.Tabs>
          </ReactBootstrap.Modal.Body>
        </ReactBootstrap.Modal>
        <ReactBootstrap.Modal
          show={fileDetailsModal}
          onHide={closeFileDetailsModal}
          size="md"
          aria-labelledby="contained-modal-title-vcenter-file-details"
          centered
          id="all-files-details-view"
        >
          <ReactBootstrap.Modal.Header closeButton>
            <ReactBootstrap.Modal.Title>{t('details-files')}</ReactBootstrap.Modal.Title>
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body>
            {Object.keys(detailFileInfo).length === 0 && detailFileInfo.constructor === Object ? (
              <ReactBootstrap.Row>
                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                  {t('no-data-available')}
                </ReactBootstrap.Col>
              </ReactBootstrap.Row>
            ) : (
              <ReactBootstrap.Row>
                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                  {t('details-files-id') + ': ' + detailFileInfo.id}
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left text-detail-path">
                  {t('details-files-localpath') + ': ' + detailFileInfo.localpath}
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                  {t('details-files-name') + ': ' + detailFileInfo.name}
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                  {t('details-files-os-type') + ': ' + detailFileInfo.os_type}
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left text-detail-path">
                  {t('details-files-remotepath') + ': ' + detailFileInfo.remotepath}
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                  {t('details-files-version') + ': ' + detailFileInfo.version}
                </ReactBootstrap.Col>
              </ReactBootstrap.Row>
            )}
          </ReactBootstrap.Modal.Body>
        </ReactBootstrap.Modal>
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <RequestAlert alert={requestAlert} />
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>
      </ReactBootstrap.Container>
    </>
  );
}

export default MainUser;
