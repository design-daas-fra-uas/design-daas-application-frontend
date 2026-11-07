import { useState } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import BackLink from '../../../components/BackLink';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';

import Header from '../../../components/header';

import { daasClient } from '../../../api/client';
import { createLogger } from '../../../utils/logger';
import RequestAlert from '../../../components/RequestAlert';
import useRequestAlert from '../../../hooks/useRequestAlert';
import ViewerFrame from '../../../components/ViewerFrame';
import { ROUTES } from '../../../routes';
import { SUBMIT_HANDLED_BY_FORM } from '../../../utils/formik';
const log = createLogger('SettingsTasks');

function SettingsTasks() {
  const [viewerRequest, setViewerRequest] = useState(null);
  const [tasksStartPreparedID, setTasksStartPreparedID] = useState('');
  const [tasksGetID, setTasksGetID] = useState('');
  const [tasksGetData, setTasksGetData] = useState({});
  const [tasksGetDataSuccess, setTasksGetDataSuccess] = useState(false);
  const [tasksStopIDTask, setTasksStopIDTask] = useState('');
  const [tasksStopIDObject, setTasksStopIDObject] = useState('');
  const [tasksStopIDInstance, setTasksStopIDInstance] = useState('');
  const [tasksStatusCurrent, setTasksStatusCurrent] = useState([]);
  const [tasksStatusFinalize, setTasksStatusFinalize] = useState([]);
  const [tasksStatusSuccess, setTasksStatusSuccess] = useState(false);
  const [tasksListIDObject, setTasksListIDObject] = useState('');
  const [tasksListIDInstance, setTasksListIDInstance] = useState('');
  const [tasksListState, setTasksListState] = useState('all');
  const [tasksListData, setTasksListData] = useState([]);
  const [tasksListSubmit, setTasksListSubmit] = useState(false);
  const { requestAlert, showRequestAlert } = useRequestAlert();
  const { t } = useTranslation();

  const startPrepared = (event) => {
    event.preventDefault();

    daasClient
      .post('/tasks/start_prepared', {
        id_object: tasksStartPreparedID,
      })
      .then((response) => {
        if (response.status === 200 && response.data.response_code === 200) {
          setViewerRequest({
            url: response.data.response_url,
          });

          showRequestAlert(true);
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          showRequestAlert(false);
        }
      })
      .catch((e) => {
        log.error('startPrepared failed', e);
        showRequestAlert(false);
      });
  };

  const getData = (event) => {
    event.preventDefault();

    daasClient
      .post('/tasks/get', {
        id_task: tasksGetID,
      })
      .then((response) => {
        if (response.status === 200 && response.data.response_code === 200) {
          showRequestAlert(true);
          setTasksGetDataSuccess(true);
          setTasksGetData(response.data.response_data);
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          showRequestAlert(false);
          setTasksGetDataSuccess(false);
          setTasksGetData({});
        }
      })
      .catch((e) => {
        log.error('getData failed', e);
        showRequestAlert(false);
        setTasksGetDataSuccess(false);
        setTasksGetData({});
      });
  };

  const stopTask = (event) => {
    event.preventDefault();

    daasClient
      .post('/tasks/stop', {
        id_task: tasksStopIDTask,
        id_object: tasksStopIDObject,
        id_instance: tasksStopIDInstance,
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
        log.error('stopTask failed', e);
        showRequestAlert(false);
      });
  };

  const statusTasks = (event) => {
    event.preventDefault();

    daasClient
      .post('/tasks/status', {})
      .then((response) => {
        if (response.status === 200 && response.data.response_code === 200) {
          showRequestAlert(true);
          setTasksStatusCurrent(response.data.response_data.current);
          setTasksStatusFinalize(response.data.response_data.finalized);
          setTasksStatusSuccess(true);
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          showRequestAlert(false);
          setTasksStatusCurrent([]);
          setTasksStatusFinalize([]);
          setTasksStatusSuccess(false);
        }
      })
      .catch((e) => {
        log.error('statusTasks failed', e);
        showRequestAlert(false);
        setTasksStatusCurrent([]);
        setTasksStatusFinalize([]);
        setTasksStatusSuccess(false);
      });
  };

  const listTask = (event) => {
    event.preventDefault();

    daasClient
      .post('/tasks/list', {
        id_object: tasksListIDObject,
        id_instance: tasksListIDInstance,
        state: tasksListState,
      })
      .then((response) => {
        if (response.status === 200 && response.data.response_code === 200) {
          showRequestAlert(true);
          setTasksListData(response.data.response_data);
          setTasksListSubmit(true);
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          showRequestAlert(false);
          setTasksListData([]);
          setTasksListSubmit(false);
        }
      })
      .catch((e) => {
        log.error('listTask failed', e);
        showRequestAlert(false);
        setTasksListData([]);
        setTasksListSubmit(false);
      });
  };

  const changeTasksStartPreparedID = (event) => {
    setTasksStartPreparedID(event.target.value);
  };

  const changeTasksGetID = (event) => {
    setTasksGetID(event.target.value);
  };

  const changeTasksStopIDTask = (event) => {
    setTasksStopIDTask(event.target.value);
  };

  const changeTasksStopIDObject = (event) => {
    setTasksStopIDObject(event.target.value);
  };

  const changeTasksStopIDInstance = (event) => {
    setTasksStopIDInstance(event.target.value);
  };

  const changeTasksListIDObject = (event) => {
    setTasksListIDObject(event.target.value);
  };

  const changeTasksListIDInstance = (event) => {
    setTasksListIDInstance(event.target.value);
  };

  const changeTasksListState = (event) => {
    setTasksListState(event.target.value);
  };

  const startPreparedSchema = Yup.object().shape({
    id_object: Yup.string().required('ID object invalid'),
  });

  const getTaskSchema = Yup.object().shape({
    id_task: Yup.string().required('ID task invalid'),
  });

  const stopSchema = Yup.object().shape({
    id_task: Yup.string().required('ID task invalid'),
    id_object: Yup.string().required('ID object invalid'),
    id_instance: Yup.string().required('ID instance invalid'),
  });

  const statusSchema = Yup.object().shape({});

  const listSchema = Yup.object().shape({
    id_task: Yup.string().required('ID task invalid'),
    id_object: Yup.string().required('ID object invalid'),
    state: Yup.string().required('State invalid'),
  });

  return (
    <>
      <Header />
      <ReactBootstrap.Container id="monitoring">
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
            <div>
              <h2>{t('tasks')}</h2>
            </div>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>
        <ReactBootstrap.Tabs defaultActiveKey="start-tasks" id="all-tasks-types">
          <ReactBootstrap.Tab eventKey="start-tasks" title={t('start-tasks')}>
            <Formik
              initialValues={{
                id_object: '',
              }}
              validationSchema={startPreparedSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {({ errors, touched }) => (
                <Form onSubmit={startPrepared} id="form-task-start">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-object-task-start">{t('vm-id-object')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-object-task-start"
                        name="vm-id-object-task-start"
                        value={tasksStartPreparedID}
                        onChange={changeTasksStartPreparedID}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-object-task-start')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={tasksStartPreparedID.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
            <ReactBootstrap.Row>
              <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <ViewerFrame request={viewerRequest} />
              </ReactBootstrap.Col>
            </ReactBootstrap.Row>
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="get-tasks" title={t('get-tasks')}>
            <Formik
              initialValues={{
                id_task: '',
              }}
              validationSchema={getTaskSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {({ errors, touched }) => (
                <Form onSubmit={getData} id="form-task-get">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-task-get">{t('vm-id-task')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-task-get"
                        name="vm-id-task-get"
                        value={tasksGetID}
                        onChange={changeTasksGetID}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-task-get')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={tasksGetID.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
            {tasksGetDataSuccess ? (
              <ReactBootstrap.Row>
                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                  id_instance
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                  {tasksGetData.id_instance}
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                  id_object
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                  {tasksGetData.id_object}
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                  id_owner
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                  {tasksGetData.id_owner}
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                  id_task
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                  {tasksGetData.id_task}
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                  result
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                  {tasksGetData.result}
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                  task_purpose
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                  {tasksGetData.task_purpose}
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                  task_state
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                  {tasksGetData.task_state}
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                  task_type
                </ReactBootstrap.Col>
                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                  {tasksGetData.task_type}
                </ReactBootstrap.Col>
              </ReactBootstrap.Row>
            ) : (
              <></>
            )}
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="stop-tasks" title={t('stop-tasks')}>
            <Formik
              initialValues={{
                id_task: '',
                id_object: '',
                id_instance: '',
              }}
              validationSchema={stopSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {({ errors, touched }) => (
                <Form onSubmit={stopTask} id="form-task-stop">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-task-stop">{t('vm-id-task')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-task-stop"
                        name="vm-id-task-stop"
                        value={tasksStopIDTask}
                        onChange={changeTasksStopIDTask}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-task-stop')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-object-task-stop">{t('vm-id-object')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-object-task-stop"
                        name="vm-id-object-task-stop"
                        value={tasksStopIDObject}
                        onChange={changeTasksStopIDObject}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-object-task-stop')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-instance-task-stop">{t('vm-id-instance')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-instance-task-stop"
                        name="vm-id-instance-task-stop"
                        value={tasksStopIDInstance}
                        onChange={changeTasksStopIDInstance}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-instance-task-stop')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={
                          tasksStopIDTask.length > 0 && tasksStopIDObject.length > 0 && tasksStopIDInstance.length > 0
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
          <ReactBootstrap.Tab eventKey="status-tasks" title={t('status-tasks')}>
            <Formik initialValues={{}} validationSchema={statusSchema} onSubmit={SUBMIT_HANDLED_BY_FORM}>
              {({ errors, touched }) => (
                <Form onSubmit={statusTasks} id="form-task-status">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button type="submit" variant="primary" id="submit">
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
            {tasksStatusSuccess ? (
              <ReactBootstrap.Row>
                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                  <h3>{t('current-task')}</h3>
                </ReactBootstrap.Col>
              </ReactBootstrap.Row>
            ) : (
              <></>
            )}
            {tasksStatusSuccess ? (
              tasksStatusCurrent.length > 0 ? (
                tasksStatusCurrent.map((taskStatusData) => {
                  return (
                    <>
                      <ReactBootstrap.Row>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          id_instance
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {taskStatusData.id_instance}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          id_object
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {taskStatusData.id_object}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          id_owner
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {taskStatusData.id_owner}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          id_task
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {taskStatusData.id_task}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          result
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {taskStatusData.result}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          task_purpose
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {taskStatusData.task_purpose}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          task_state
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {taskStatusData.task_state}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          task_type
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {taskStatusData.task_type}
                        </ReactBootstrap.Col>
                      </ReactBootstrap.Row>
                    </>
                  );
                })
              ) : (
                <>{t('no-data-available')}</>
              )
            ) : (
              <></>
            )}
            {tasksStatusSuccess ? (
              <ReactBootstrap.Row>
                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                  <h3 className="text-normal">{t('finalize-task')}</h3>
                </ReactBootstrap.Col>
              </ReactBootstrap.Row>
            ) : (
              <></>
            )}
            {tasksStatusSuccess ? (
              tasksStatusFinalize.length > 0 ? (
                tasksStatusFinalize.map((taskStatusData) => {
                  return (
                    <>
                      <ReactBootstrap.Row>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          id_instance
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {taskStatusData.id_instance}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          id_object
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {taskStatusData.id_object}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          id_owner
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {taskStatusData.id_owner}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          id_task
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {taskStatusData.id_task}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          result
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {taskStatusData.result}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          task_purpose
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {taskStatusData.task_purpose}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          task_state
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {taskStatusData.task_state}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          task_type
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {taskStatusData.task_type}
                        </ReactBootstrap.Col>
                      </ReactBootstrap.Row>
                    </>
                  );
                })
              ) : (
                <>{t('no-data-available')}</>
              )
            ) : (
              <></>
            )}
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="list-tasks" title={t('list-tasks')}>
            <Formik
              initialValues={{
                id_object: '',
                id_instance: '',
                state: '',
              }}
              validationSchema={listSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {({ errors, touched }) => (
                <Form onSubmit={listTask} id="form-task-list">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-object-task-list">{t('vm-id-object')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-object-task-list"
                        name="vm-id-object-task-list"
                        value={tasksListIDObject}
                        onChange={changeTasksListIDObject}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-object-task-list')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-instance-task-list">{t('vm-id-instance')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-instance-task-list"
                        name="vm-id-instance-task-list"
                        value={tasksListIDInstance}
                        onChange={changeTasksListIDInstance}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-instance-task-list')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-state-task-list">{t('state-task')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <select
                        id="vm-state-task-list"
                        name="vm-state-task-list"
                        value={tasksListState}
                        onChange={changeTasksListState}
                      >
                        <option value="all">{t('all-tasks')}</option>
                        <option value="running">{t('running-tasks')}</option>
                        <option value="final">{t('final-tasks')}</option>
                      </select>
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-state-task-list')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={tasksListState.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
            {tasksListSubmit ? (
              tasksListData.length > 0 ? (
                tasksListData.map((listData) => {
                  return (
                    <ReactBootstrap.Row>
                      <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-left">
                        id_instance
                      </ReactBootstrap.Col>
                      <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-left">
                        {listData.id_instance}
                      </ReactBootstrap.Col>
                      <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-left">
                        id_object
                      </ReactBootstrap.Col>
                      <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-left">
                        {listData.id_object}
                      </ReactBootstrap.Col>
                      <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-left">
                        id_owner
                      </ReactBootstrap.Col>
                      <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-left">
                        {listData.id_owner}
                      </ReactBootstrap.Col>
                      <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-left">
                        purpose
                      </ReactBootstrap.Col>
                      <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-left">
                        {listData.purpose}
                      </ReactBootstrap.Col>
                      <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-left">
                        result
                      </ReactBootstrap.Col>
                      <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-left">
                        {listData.result}
                      </ReactBootstrap.Col>
                      <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-left">
                        state
                      </ReactBootstrap.Col>
                      <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-left">
                        {listData.state}
                      </ReactBootstrap.Col>
                      <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-left">
                        taskid
                      </ReactBootstrap.Col>
                      <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-left">
                        {listData.taskid}
                      </ReactBootstrap.Col>
                      <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-left">
                        tasktype
                      </ReactBootstrap.Col>
                      <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-left">
                        {listData.tasktype}
                      </ReactBootstrap.Col>
                    </ReactBootstrap.Row>
                  );
                })
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

export default SettingsTasks;
