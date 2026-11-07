import { Fragment, useEffect, useState } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { getSession } from '../../../api/session';
import { requestApplication } from '../../../api/users';
import Header from '../../../components/header';
import { ROUTES } from '../../../routes';
import ActionPanel from '../../../components/actions/ActionPanel';
import {
  APP_FIELDS,
  BASEIMAGE_CLONE_FIELDS,
  BASEIMAGE_CREATE_FIELDS,
  FILE_FIELDS,
} from '../../../components/actions/forms';

import { daasClient, isDaasSuccess } from '../../../api/client';
import { getRole } from '../../../auth/tokenManager';
import { filterBySearch, getCurrentUserId, ownedBy } from './dashboardData';
import { createLogger } from '../../../utils/logger';
import RequestAlert from '../../../components/RequestAlert';
import useRequestAlert from '../../../hooks/useRequestAlert';
import { useNavigate } from 'react-router';
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

  const visibleApplications = filterBySearch(applications, searchText);
  const visibleSharedApplications = filterBySearch(applications, searchTextShared);

  // Create/clone/upload forms of the "create" modal; every success reloads the dashboard.
  const dashboardAction = (key, endpoint, fields) => ({ key, endpoint, fields, onSuccess: fetchDashboardInfo });
  const createObjectAction = dashboardAction('create-object', '/phases/baseimage_create', BASEIMAGE_CREATE_FIELDS);
  const cloneObjectAction = dashboardAction('clone-object', '/phases/baseimage_clone', BASEIMAGE_CLONE_FIELDS);
  const createAppAction = dashboardAction('create-app', '/apps/create', APP_FIELDS);
  const updateAppAction = dashboardAction('update-app', '/apps/update', APP_FIELDS);
  const createFileAction = dashboardAction('create-file', '/files/create', FILE_FIELDS);
  const updateFileAction = dashboardAction('update-file', '/files/update', FILE_FIELDS);

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
                          {dashboardInfo.available_objects.map((appObject) => (
                            <option key={appObject.id} value={JSON.stringify(appObject)}>
                              {t('name-text') + appObject.id_user}
                            </option>
                          ))}
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
                          {dashboardInfo.available_environments.map((appEnv) => {
                            return (
                              <Fragment key={`${appEnv.id_object}-${appEnv.id_env}`}>
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
                              </Fragment>
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
                        <Fragment key={appData.id_app}>
                          {appData.id_owner === Number(localStorage.getItem('userDataID')) ? (
                            <>
                              <div className="text-center">
                                <div>{appData.name}</div>
                                <div className="icon-main">
                                  {appData.os_type === 'win10' || appData.os_type === 'win11' ? (
                                    <span>
                                      <i className="fa-brands fa-microsoft fa-xl icon-brands"></i>
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
                                      <i className="fa-solid fa-server fa-xl icon-brands"></i>
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
                                      <i className="fa-solid fa-file fa-xl icon-brands"></i>
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
                        </Fragment>
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
                        <Fragment key={dataShared.id_app}>
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
                                  <i className="fa-brands fa-microsoft fa-xl"></i>
                                ) : dataShared.os_type === 'l26vm' || dataShared.os_type === 'l26' ? (
                                  <i className="fa-brands fa-linux fa-xl"></i>
                                ) : (
                                  <></>
                                )}
                              </ReactBootstrap.Col>
                              <ReactBootstrap.Col xs={4} sm={4} md={4} lg={4} xl={4} className="text-center">
                                {dataShared.object_type === 'vm' ? (
                                  <i className="fa-solid fa-server fa-xl"></i>
                                ) : dataShared.object_type === 'container' ? (
                                  <i className="fa-brands fa-docker fa-xl"></i>
                                ) : (
                                  <></>
                                )}
                              </ReactBootstrap.Col>
                              <ReactBootstrap.Col xs={4} sm={4} md={4} lg={4} xl={4} className="text-center">
                                {dataShared.id_file !== '' ? <i className="fa-solid fa-file fa-xl"></i> : <></>}
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
                        </Fragment>
                      );
                    })
                  ) : (
                    <>{t('no-data-available')}</>
                  )}
                </ReactBootstrap.Row>
              </ReactBootstrap.Tab>
              <ReactBootstrap.Tab eventKey="create-new-object" title={t('create-new-object')}>
                <ActionPanel action={createObjectAction} showRequestAlert={showRequestAlert} />
              </ReactBootstrap.Tab>
              <ReactBootstrap.Tab eventKey="clone-new-object" title={t('clone-new-object')}>
                <ActionPanel action={cloneObjectAction} showRequestAlert={showRequestAlert} />
              </ReactBootstrap.Tab>
              <ReactBootstrap.Tab eventKey="app-create" title={t('app-create')}>
                <ActionPanel action={createAppAction} showRequestAlert={showRequestAlert} />
              </ReactBootstrap.Tab>
              <ReactBootstrap.Tab eventKey="app-update" title={t('app-update')}>
                <ActionPanel action={updateAppAction} showRequestAlert={showRequestAlert} />
              </ReactBootstrap.Tab>
              <ReactBootstrap.Tab eventKey="file-create" title={t('file-create')}>
                <ActionPanel action={createFileAction} showRequestAlert={showRequestAlert} />
              </ReactBootstrap.Tab>
              <ReactBootstrap.Tab eventKey="file-update" title={t('file-update')}>
                <ActionPanel action={updateFileAction} showRequestAlert={showRequestAlert} />
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
            <form onSubmit={requestApplicationAdmin} id="form-main-user-request">
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
            </form>
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
                        <ReactBootstrap.Row key={ownFileData.id}>
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
                        <ReactBootstrap.Row key={sharedFileData.id}>
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
