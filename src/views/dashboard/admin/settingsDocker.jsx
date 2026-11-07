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
const log = createLogger('SettingsDocker');

function SettingsDocker() {
  const [viewerRequest, setViewerRequest] = useState(null);
  const [vmDataDockerDaemonInfo, setVMDataDockerDaemonInfo] = useState('');
  const [vmDataDockerDaemonInfoSubmit, setVMDataDockerDaemonInfoSubmit] = useState(false);
  const [vmIDDockerImageInspect, setVMIDDockerImageInspect] = useState('');
  const [vmDataDockerImageInspect, setVMDataDockerImageInspect] = useState({});
  const [vmDataDockerImageInspectSubmit, setVMDataDockerImageInspectSubmit] = useState(false);
  const [vmImageDockerList, setVMImageDockerList] = useState({});
  const [vmImageDockerListSubmit, setVMImageDockerListSubmit] = useState(false);
  const [vmIDDockerImageCreate, setVMIDDockerImageCreate] = useState('');
  const [vmNameDockerImageCreate, setVMNameDockerImageCreate] = useState('');
  const [vmDockerfile, setVMDockerfile] = useState();
  const [vmCoresDockerImageCreate, setVMCoresDockerImageCreate] = useState('');
  const [vmMemsizeDockerImageCreate, setVMMemsizeDockerImageCreate] = useState('');
  const [vmDisksizeDockerImageCreate, setVMDisksizeDockerImageCreate] = useState('');
  const [vmCephPublicDockerImageCreateChecked, setVMCephPublicDockerImageCreateChecked] = useState(false);
  const [vmCephSharedDockerImageCreateChecked, setVMCephSharedDockerImageCreateChecked] = useState(false);
  const [vmCephUserDockerImageCreateChecked, setVMCephUserDockerImageCreateChecked] = useState(false);
  const [vmResolutionDockerImageCreate, setVMResolutionDockerImageCreate] = useState('');
  const [vmContypeDockerImageCreate, setVMContypeDockerImageCreate] = useState('sysvnc');
  const [vmResizeDockerImageCreate, setVMResizeDockerImageCreate] = useState('none');
  const [vmScaleDockerImageCreateChecked, setVMScaleDockerImageCreateChecked] = useState(false);
  const [vmIDDockerImageCreateRoot, setVMIDDockerImageCreateRoot] = useState('');
  const [vmNameDockerImageCreateRoot, setVMNameDockerImageCreateRoot] = useState('');
  const [vmRootImage, setVMRootImage] = useState('x11vnc');
  const [vmCoresDockerImageCreateRoot, setVMCoresDockerImageCreateRoot] = useState('');
  const [vmMemsizeDockerImageCreateRoot, setVMMemsizeDockerImageCreateRoot] = useState('');
  const [vmDisksizeDockerImageCreateRoot, setVMDisksizeDockerImageCreateRoot] = useState('');
  const [vmCephPublicDockerImageCreateRootChecked, setVMCephPublicDockerImageCreateRootChecked] = useState(false);
  const [vmCephSharedDockerImageCreateRootChecked, setVMCephSharedDockerImageCreateRootChecked] = useState(false);
  const [vmCephUserDockerImageCreateRootChecked, setVMCephUserDockerImageCreateRootChecked] = useState(false);
  const [vmResolutionDockerImageCreateRoot, setVMResolutionDockerImageCreateRoot] = useState('');
  const [vmContypeDockerImageCreateRoot, setVMContypeDockerImageCreateRoot] = useState('sysvnc');
  const [vmResizeDockerImageCreateRoot, setVMResizeDockerImageCreateRoot] = useState('none');
  const [vmScaleDockerImageCreateRootChecked, setVMScaleDockerImageCreateRootChecked] = useState(false);
  const [vmIDDockerImageClone, setVMIDDockerImageClone] = useState('');
  const [vmNewIDDockerImageClone, setVMNewIDDockerImageClone] = useState('');
  const [vmNameDockerImageClone, setVMNameDockerImageClone] = useState('');
  const [vmIDDockerImageDelete, setVMIDDockerImageDelete] = useState('');
  const [vmIDDockerImageBuild, setVMIDDockerImageBuild] = useState('');
  const [vmIDDockerContainerStart, setVMIDDockerContainerStart] = useState('');
  const [vmENVDockerContainerStart, setVMENVDockerContainerStart] = useState('');
  const [vmConnectDockerContainerStartChecked, setVMConnectDockerContainerStartChecked] = useState(false);
  const [vmIDInstanceDockerContainerStop, setVMIDInstanceDockerContainerStop] = useState('');
  const [vmKillDockerContainerStopChecked, setVMKillDockerContainerStopChecked] = useState(false);
  const [vmSubmitDockerContainerList, setVMSubmitDockerContainerList] = useState(false);
  const [vmDataDockerContainerList, setVMDataDockerContainerList] = useState([]);
  const [vmPhasesDockerListCheckedUser, setVMPhasesDockerListCheckedUser] = useState(false);
  const [vmPhasesDockerListCheckedDaas, setVMPhasesDockerListCheckedDaas] = useState(false);
  const [vmPhasesDockerListCheckedDetails, setVMPhasesDockerListCheckedDetails] = useState(false);
  const [vmIDDockerContainerLogs, setVMIDDockerContainerLogs] = useState('');
  const [vmDataDockerContainerLogs, setVMDataDockerContainerLogs] = useState('');
  const [vmDataDockerContainerLogsSubmit, setVMDataDockerContainerLogsSubmit] = useState(false);
  const [vmStartDockerSubmit, setVMStartDockerSubmit] = useState(false);
  const [viewerURL, setViewerURL] = useState('');
  const { requestAlert, showRequestAlert } = useRequestAlert();
  const [loadingSpinnerShow, setLoadingSpinnerShow] = useState(false);
  const [loadingSpinnerShowSubmit, setLoadingSpinnerShowSubmit] = useState(false);
  const { t } = useTranslation();

  const dockerDaemonInfo = (event) => {
    event.preventDefault();

    daasClient
      .post('/container/daemon_info', {})
      .then((response) => {
        if (response.status === 200 && response.data.response_code === 200) {
          showRequestAlert(true);
          setVMDataDockerDaemonInfoSubmit(true);
          setVMDataDockerDaemonInfo(response.data.sys_log);
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          showRequestAlert(false);
          setVMDataDockerDaemonInfoSubmit(false);
          setVMDataDockerDaemonInfo('');
        }
      })
      .catch((e) => {
        log.error('dockerDaemonInfo failed', e);
        showRequestAlert(false);
        setVMDataDockerDaemonInfoSubmit(false);
        setVMDataDockerDaemonInfo('');
      });
  };

  const dockerInspectInfo = (event) => {
    event.preventDefault();

    daasClient
      .post('/container/image_inspect', {
        id: vmIDDockerImageInspect,
      })
      .then((response) => {
        if (response.status === 200 && response.data.response_code === 200) {
          showRequestAlert(true);
          setVMDataDockerImageInspectSubmit(true);
          setVMDataDockerImageInspect(response.data.response_data);
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          showRequestAlert(false);
          setVMDataDockerImageInspectSubmit(false);
          setVMDataDockerImageInspect({});
        }
      })
      .catch((e) => {
        log.error('dockerInspectInfo failed', e);
        showRequestAlert(false);
        setVMDataDockerImageInspectSubmit(false);
        setVMDataDockerImageInspect({});
      });
  };

  const dockerImageList = (event) => {
    event.preventDefault();

    daasClient
      .post('/container/image_list', {
        onlyuser: 'on',
      })
      .then((response) => {
        if (response.status === 200 && response.data.response_code === 200) {
          setVMImageDockerList(response.data.response_data);
          setVMImageDockerListSubmit(true);
          showRequestAlert(true);

          setTimeout(() => {
            setVMImageDockerListSubmit(false);
          }, 2000);
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          setVMImageDockerList([]);
          showRequestAlert(false);
          setVMImageDockerListSubmit(false);

          setTimeout(() => {
            setVMImageDockerListSubmit(false);
          }, 2000);
        }
      })
      .catch((e) => {
        log.error('dockerImageList failed', e);
        setVMImageDockerList([]);
        showRequestAlert(false);
        setVMImageDockerListSubmit(false);

        setTimeout(() => {
          setVMImageDockerListSubmit(false);
        }, 2000);
      });
  };

  const dockerImageCreate = (event) => {
    event.preventDefault();

    daasClient
      .post('/container/image_create', {
        id: vmIDDockerImageCreate,
        name: vmNameDockerImageCreate,
        dockerfile: vmDockerfile,
        ceph_public: vmCephPublicDockerImageCreateChecked ? 'on' : '',
        ceph_shared: vmCephSharedDockerImageCreateChecked ? 'on' : '',
        ceph_user: vmCephUserDockerImageCreateChecked ? 'on' : '',
        viewer_resolution: vmResolutionDockerImageCreate,
        viewer_contype: vmContypeDockerImageCreate,
        viewer_resize: vmResizeDockerImageCreate,
        viewer_scale: vmScaleDockerImageCreateChecked ? 'on' : '',
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
        log.error('dockerImageCreate failed', e);
        showRequestAlert(false);
      });
  };

  const dockerImageCreateRoot = (event) => {
    event.preventDefault();

    daasClient
      .post('/container/image_create_root', {
        id: vmIDDockerImageCreateRoot,
        name: vmNameDockerImageCreateRoot,
        rootimage: vmRootImage,
        ceph_public: vmCephPublicDockerImageCreateRootChecked ? 'on' : '',
        ceph_shared: vmCephSharedDockerImageCreateRootChecked ? 'on' : '',
        ceph_user: vmCephUserDockerImageCreateRootChecked ? 'on' : '',
        viewer_resolution: vmResolutionDockerImageCreateRoot,
        viewer_contype: vmContypeDockerImageCreateRoot,
        viewer_resize: vmResizeDockerImageCreateRoot,
        viewer_scale: vmScaleDockerImageCreateRootChecked ? 'on' : '',
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
        log.error('dockerImageCreateRoot failed', e);
        showRequestAlert(false);
      });
  };

  const dockerImageClone = (event) => {
    event.preventDefault();

    daasClient
      .post('/container/image_clone', {
        id: vmIDDockerImageClone,
        newid: vmNewIDDockerImageClone,
        name: vmNameDockerImageClone,
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
        log.error('dockerImageClone failed', e);
        showRequestAlert(false);
      });
  };

  const dockerImageDelete = (event) => {
    event.preventDefault();

    daasClient
      .post('/container/image_delete', {
        id: vmIDDockerImageDelete,
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
        log.error('dockerImageDelete failed', e);
        showRequestAlert(false);
      });
  };

  const dockerImageBuild = (event) => {
    event.preventDefault();

    daasClient
      .post('/container/image_build', {
        id: vmIDDockerImageBuild,
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
        log.error('dockerImageBuild failed', e);
        showRequestAlert(false);
      });
  };

  const dockerContainerStart = (event) => {
    event.preventDefault();

    daasClient
      .post('/container/container_start', {
        id: vmIDDockerContainerStart,
        id_env: vmENVDockerContainerStart,
        connect: vmConnectDockerContainerStartChecked ? 'on' : '',
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

          log.debug('Container started, viewer URL', response.data.response_url);

          setLoadingSpinnerShow(false);
          setLoadingSpinnerShowSubmit(false);
          setVMStartDockerSubmit(true);
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          showRequestAlert(false);
          setViewerURL('');

          setLoadingSpinnerShow(false);
          setLoadingSpinnerShowSubmit(false);
          setVMStartDockerSubmit(false);
        }
      })
      .catch((e) => {
        log.error('dockerContainerStart failed', e);
        showRequestAlert(false);
        setViewerURL('');

        setLoadingSpinnerShow(false);
        setLoadingSpinnerShowSubmit(false);
        setVMStartDockerSubmit(false);
      });
  };

  const dockerContainerStop = (event) => {
    event.preventDefault();

    daasClient
      .post('/container/container_stop', {
        id_instance: vmIDInstanceDockerContainerStop,
        kill: vmKillDockerContainerStopChecked ? 'on' : '',
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
        log.error('dockerContainerStop failed', e);
        showRequestAlert(false);
      });
  };

  const dockerContainerList = (event) => {
    event.preventDefault();

    daasClient
      .post('/container/container_list', {
        onlyuser: vmPhasesDockerListCheckedUser ? 'on' : '',
        onlydaas: vmPhasesDockerListCheckedDaas ? 'on' : '',
        detailed: vmPhasesDockerListCheckedDetails ? 'on' : '',
      })
      .then((response) => {
        if (response.status === 200 && response.data.response_code === 0) {
          showRequestAlert(true);
          setVMSubmitDockerContainerList(true);
          setVMDataDockerContainerList(response.data.response_data);

          setTimeout(() => {
            setVMSubmitDockerContainerList(false);
          }, 10000);
        }
        if (response.status === 200 && response.data.response_code !== 0) {
          showRequestAlert(false);
          setVMSubmitDockerContainerList(true);
          setVMDataDockerContainerList([]);

          setTimeout(() => {
            setVMSubmitDockerContainerList(false);
          }, 10000);
        }
      })
      .catch((e) => {
        log.error('dockerContainerList failed', e);
        showRequestAlert(false);
        setVMSubmitDockerContainerList(true);
        setVMDataDockerContainerList([]);

        setTimeout(() => {
          setVMSubmitDockerContainerList(false);
        }, 10000);
      });
  };

  const dockerContainerLogs = (event) => {
    event.preventDefault();

    daasClient
      .post('/container/container_logs', {
        id: vmIDDockerContainerLogs,
      })
      .then((response) => {
        if (response.status === 200 && response.data.response_code === 200) {
          showRequestAlert(true);
          setVMDataDockerContainerLogsSubmit(true);
          setVMDataDockerContainerLogs(response.data.sys_log);
        }
        if (response.status === 200 && response.data.response_code !== 200) {
          showRequestAlert(false);
          setVMDataDockerContainerLogsSubmit(false);
          setVMDataDockerContainerLogs('');
        }
      })
      .catch((e) => {
        log.error('dockerContainerLogs failed', e);
        showRequestAlert(false);
        setVMDataDockerContainerLogsSubmit(false);

        setVMDataDockerContainerLogs('');
      });
  };

  const changeVMIDDockerImageInspect = (event) => {
    setVMIDDockerImageInspect(event.target.value);
  };

  const changeVMIDDockerImageCreate = (event) => {
    setVMIDDockerImageCreate(event.target.value);
  };

  const changeVMNameDockerImageCreate = (event) => {
    setVMNameDockerImageCreate(event.target.value);
  };

  const changeVMDockerfile = (event) => {
    if (event.target.files) {
      setVMDockerfile(event.target.files[0]);
    }
  };

  const changeVMCoresDockerImageCreate = (event) => {
    setVMCoresDockerImageCreate(event.target.value);
  };

  const changeVMMemsizeDockerImageCreate = (event) => {
    setVMMemsizeDockerImageCreate(event.target.value);
  };

  const changeVMDisksizeDockerImageCreate = (event) => {
    setVMDisksizeDockerImageCreate(event.target.value);
  };

  const checkChangeVMCephPublicDockerImageCreate = () => setVMCephPublicDockerImageCreateChecked((checked) => !checked);

  const checkChangeVMCephSharedDockerImageCreate = () => setVMCephSharedDockerImageCreateChecked((checked) => !checked);

  const checkChangeVMCephUserDockerImageCreate = () => setVMCephUserDockerImageCreateChecked((checked) => !checked);

  const changeVMResolutionDockerImageCreate = (event) => {
    setVMResolutionDockerImageCreate(event.target.value);
  };
  const changeVMContypeDockerImageCreate = (event) => {
    setVMContypeDockerImageCreate(event.target.value);
  };
  const changeVMResizeDockerImageCreate = (event) => {
    setVMResizeDockerImageCreate(event.target.value);
  };
  const changeVMScaleDockerImageCreateChecked = () => setVMScaleDockerImageCreateChecked((checked) => !checked);

  const changeVMIDDockerImageCreateRoot = (event) => {
    setVMIDDockerImageCreateRoot(event.target.value);
  };

  const changeVMNameDockerImageCreateRoot = (event) => {
    setVMNameDockerImageCreateRoot(event.target.value);
  };

  const changeVMRootImage = (event) => {
    setVMRootImage(event.target.value);
  };

  const changeVMCoresDockerImageCreateRoot = (event) => {
    setVMCoresDockerImageCreateRoot(event.target.value);
  };

  const changeVMMemsizeDockerImageCreateRoot = (event) => {
    setVMMemsizeDockerImageCreateRoot(event.target.value);
  };

  const changeVMDisksizeDockerImageCreateRoot = (event) => {
    setVMDisksizeDockerImageCreateRoot(event.target.value);
  };

  const checkChangeVMCephPublicDockerImageCreateRoot = () =>
    setVMCephPublicDockerImageCreateRootChecked((checked) => !checked);

  const checkChangeVMCephSharedDockerImageCreateRoot = () =>
    setVMCephSharedDockerImageCreateRootChecked((checked) => !checked);

  const checkChangeVMCephUserDockerImageCreateRoot = () =>
    setVMCephUserDockerImageCreateRootChecked((checked) => !checked);

  const changeVMResolutionDockerImageCreateRoot = (event) => {
    setVMResolutionDockerImageCreateRoot(event.target.value);
  };
  const changeVMContypeDockerImageCreateRoot = (event) => {
    setVMContypeDockerImageCreateRoot(event.target.value);
  };
  const changeVMResizeDockerImageCreateRoot = (event) => {
    setVMResizeDockerImageCreateRoot(event.target.value);
  };
  const changeVMScaleDockerImageCreateRootChecked = () => setVMScaleDockerImageCreateRootChecked((checked) => !checked);

  const changeVMIDDockerImageClone = (event) => {
    setVMIDDockerImageClone(event.target.value);
  };

  const changeVMNewIDDockerImageClone = (event) => {
    setVMNewIDDockerImageClone(event.target.value);
  };

  const changeVMNameDockerImageClone = (event) => {
    setVMNameDockerImageClone(event.target.value);
  };

  const changeVMIDDockerImageDelete = (event) => {
    setVMIDDockerImageDelete(event.target.value);
  };

  const changeVMIDDockerImageBuild = (event) => {
    setVMIDDockerImageBuild(event.target.value);
  };

  const changeVMIDDockerContainerStart = (event) => {
    setVMIDDockerContainerStart(event.target.value);
  };

  const changeVMENVDockerContainerStart = (event) => {
    setVMENVDockerContainerStart(event.target.value);
  };

  const checkChangeVMConnectDockerContainerStart = () => setVMConnectDockerContainerStartChecked((checked) => !checked);

  const changeVMIDInstanceDockerContainerStop = (event) => {
    setVMIDInstanceDockerContainerStop(event.target.value);
  };

  const checkChangeVMKillDockerContainerStop = () => setVMKillDockerContainerStopChecked((checked) => !checked);

  const changeVMIDDockerContainerLogs = (event) => {
    setVMIDDockerContainerLogs(event.target.value);
  };

  const changeVMPhasesDockerListCheckedUser = () => setVMPhasesDockerListCheckedUser((checked) => !checked);

  const changeVMPhasesDockerListCheckedDaas = () => setVMPhasesDockerListCheckedDaas((checked) => !checked);

  const changeVMPhasesDockerListCheckedDetails = () => setVMPhasesDockerListCheckedDetails((checked) => !checked);

  const dockerDaemonInfoSchema = Yup.object().shape({});

  const dockerInspectInfoSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
  });

  const dockerImageListSchema = Yup.object().shape({});

  const dockerImageCreateSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    name: Yup.string().required('Name invalid'),
    dockerfile: Yup.mixed().required('Dockerfile invalid'),
    cores: Yup.string().required('Cores invalid'),
    memsize: Yup.string().required('Memory size invalid'),
    disksize: Yup.string().required('Disk size invalid'),
    ceph_public: Yup.string().required('Ceph public invalid'),
    ceph_shared: Yup.string().required('Ceph shared invalid'),
    ceph_user: Yup.string().required('Ceph user invalid'),
    viewer_resolution: Yup.string().required('Resolution invalid'),
    viewer_contype: Yup.string().required('Contype invalid'),
    viewer_resize: Yup.string().required('Resize invalid'),
    viewer_scale: Yup.string().required('Scale invalid'),
  });

  const dockerImageCreateRootSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    name: Yup.string().required('Name invalid'),
    rootimage: Yup.string().required('Root image invalid'),
    cores: Yup.string().required('Cores invalid'),
    memsize: Yup.string().required('Memory size invalid'),
    disksize: Yup.string().required('Disk size invalid'),
    ceph_public: Yup.string().required('Ceph public invalid'),
    ceph_shared: Yup.string().required('Ceph shared invalid'),
    ceph_user: Yup.string().required('Ceph user invalid'),
    viewer_resolution: Yup.string().required('Resolution invalid'),
    viewer_contype: Yup.string().required('Contype invalid'),
    viewer_resize: Yup.string().required('Resize invalid'),
    viewer_scale: Yup.string().required('Scale invalid'),
  });

  const dockerImageCloneSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    newid: Yup.string().required('New ID invalid'),
    name: Yup.string().required('Name invalid'),
  });

  const dockerImageDeleteSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
  });

  const dockerImageBuildSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
  });

  const dockerContainerStartSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
    id_env: Yup.string().required('ID Environment invalid'),
    connect: Yup.string().required('Connection invalid'),
  });

  const dockerContainerStopSchema = Yup.object().shape({
    id_instance: Yup.string().required('ID instance invalid'),
    kill: Yup.string().required('Kill process invalid'),
  });

  const dockerContainerListSchema = Yup.object().shape({
    onlyuser: Yup.string().required('Credentials are invalid'),
  });

  const dockerContainerLogsSchema = Yup.object().shape({
    id: Yup.string().required('ID invalid'),
  });

  return (
    <>
      <Header />
      <ReactBootstrap.Container id="settingsOverviewDocker" fluid={true}>
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
            <div>
              <h2>{t('vm-docker')}</h2>
            </div>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>
        <ReactBootstrap.Tabs defaultActiveKey="docker-daemon-info" id="all-config-docker">
          <ReactBootstrap.Tab eventKey="docker-daemon-info" title={t('vm-docker-daemon-info')}>
            <Formik initialValues={{}} validationSchema={dockerDaemonInfoSchema} onSubmit={SUBMIT_HANDLED_BY_FORM}>
              {() => (
                <Form onSubmit={dockerDaemonInfo} id="form-docker-daemon-info">
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
            {vmDataDockerDaemonInfoSubmit ? (
              <>
                <ReactBootstrap.Row>
                  <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    {vmDataDockerDaemonInfo}
                  </ReactBootstrap.Col>
                </ReactBootstrap.Row>
              </>
            ) : (
              <></>
            )}
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="docker-image-inspect" title={t('vm-docker-image-inspect')}>
            <Formik
              initialValues={{
                id: '',
              }}
              validationSchema={dockerInspectInfoSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={dockerInspectInfo} id="form-docker-image-inspect">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-docker-image-inspect">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-docker-image-inspect"
                        name="vm-id-docker-image-inspect"
                        value={vmIDDockerImageInspect}
                        onChange={changeVMIDDockerImageInspect}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-docker-image-inspect')}</div>
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDDockerImageInspect.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
            {vmDataDockerImageInspectSubmit ? (
              <ReactBootstrap.Row id="form-docker-image-inspect">
                {vmDataDockerImageInspect !== undefined ? (
                  <>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      ceph_public:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.ceph_public}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      ceph_shared:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.ceph_shared}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      ceph_user:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.ceph_user}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      environments:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.environments}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      extra_args:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.extra_args}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      id:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.id}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      id_docker:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.id_docker}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      id_owner:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.id_owner}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      id_proxmox:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.id_proxmox}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      id_user:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.id_user}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      object_apps:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.object_apps}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      object_state:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.object_state}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      object_storage:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.object_storage}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      object_target:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.object_target}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      object_tasks:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.object_tasks}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      object_type:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.object_type}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      os_installer:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.os_installer}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      os_password:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.os_password}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      os_type:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.os_type}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      os_username:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.os_username}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      os_wine:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.os_wine}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      stateinfo:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="image-list-object">
                      <pre>{JSON.stringify(vmDataDockerImageInspect.stateinfo, null, 3)}</pre>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      vnc_password:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.vnc_password}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      vnc_port_instance:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.vnc_port_instance}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      vnc_port_system:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.vnc_port_system}
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      vnc_username:
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      {vmDataDockerImageInspect.vnc_username}
                    </ReactBootstrap.Col>
                  </>
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
          <ReactBootstrap.Tab eventKey="docker-image-list" title={t('vm-docker-image-list')}>
            <Formik initialValues={{}} validationSchema={dockerImageListSchema} onSubmit={SUBMIT_HANDLED_BY_FORM}>
              {() => (
                <Form onSubmit={dockerImageList} id="form-docker-image-list">
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
            {vmImageDockerListSubmit ? (
              <ReactBootstrap.Row id="form-docker-image-list">
                {vmImageDockerList.length > 0 ? (
                  vmImageDockerList.map((data) => {
                    return (
                      <>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          DaaS - ID:
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {data.daas_id}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          DaaS - Name:
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {data.daas_name}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          DaaS - Object:
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {data.daas_object}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          DaaS - Owner:
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {data.daas_owner}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          DaaS - Type:
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {data.daas_type}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          Name:
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {data.name}
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
          <ReactBootstrap.Tab eventKey="docker-image-create" title={t('vm-docker-image-create')}>
            <Formik
              initialValues={{
                id: '',
                name: '',
                dockerfile: '',
                cores: '',
                memsize: '',
                disksize: '',
                ceph_public: '',
                ceph_shared: '',
                ceph_user: '',
                viewer_contype: '',
                viewer_resolution: '',
                viewer_resize: '',
                viewer_scale: '',
              }}
              validationSchema={dockerImageCreateSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={dockerImageCreate} id="form-docker-image-create">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-docker-image-create">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-docker-image-create"
                        name="vm-id-docker-image-create"
                        value={vmIDDockerImageCreate}
                        onChange={changeVMIDDockerImageCreate}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-docker-image-create')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-name-docker-image-create">{t('vm-name')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-name-docker-image-create"
                        name="vm-name-docker-image-create"
                        value={vmNameDockerImageCreate}
                        onChange={changeVMNameDockerImageCreate}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-name-docker-image-create')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-dockerfile-docker-image-create">{t('vm-dockerfile')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="file"
                        id="vm-dockerfile-docker-image-create"
                        name="vm-dockerfile-docker-image-create"
                        onChange={changeVMDockerfile}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-dockerfile-docker-image-create')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-cores-docker-image-create">{t('vm-cores')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-cores-docker-image-create"
                        name="vm-cores-docker-image-create"
                        value={vmCoresDockerImageCreate}
                        onChange={changeVMCoresDockerImageCreate}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-cores-docker-image-create')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-memory-size-docker-image-create">{t('vm-memory-size')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-memory-size-docker-image-create"
                        name="vm-memory-size-docker-image-create"
                        value={vmMemsizeDockerImageCreate}
                        onChange={changeVMMemsizeDockerImageCreate}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-memory-size-docker-image-create')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-disk-size-docker-image-create">{t('vm-disk-size')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-disk-size-docker-image-create"
                        name="vm-disk-size-docker-image-create"
                        value={vmDisksizeDockerImageCreate}
                        onChange={changeVMDisksizeDockerImageCreate}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-disk-size-docker-image-create')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-ceph-public-docker-image-create">{t('vm-ceph-public')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="checkbox"
                        id="vm-ceph-public-docker-image-create"
                        name="vm-ceph-public-docker-image-create"
                        checked={vmCephPublicDockerImageCreateChecked}
                        onChange={checkChangeVMCephPublicDockerImageCreate}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-ceph-public-docker-image-create')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-ceph-shared-docker-image-create">{t('vm-ceph-shared')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="checkbox"
                        id="vm-ceph-shared-docker-image-create"
                        name="vm-ceph-shared-docker-image-create"
                        checked={vmCephSharedDockerImageCreateChecked}
                        onChange={checkChangeVMCephSharedDockerImageCreate}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-ceph-shared-docker-image-create')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-ceph-user-docker-image-create">{t('vm-ceph-user')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="checkbox"
                        id="vm-ceph-user-docker-image-create"
                        name="vm-ceph-user-docker-image-create"
                        checked={vmCephUserDockerImageCreateChecked}
                        onChange={checkChangeVMCephUserDockerImageCreate}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-ceph-user-docker-image-create')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-resolution-docker-image-create">{t('vm-resolution')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-resolution-docker-image-create"
                        name="vm-resolution-docker-image-create"
                        value={vmResolutionDockerImageCreate}
                        onChange={changeVMResolutionDockerImageCreate}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-resolution-docker-image-create')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-contype-docker-image-create">{t('vm-contype')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <select
                        id="vm-contype-docker-image-create"
                        name="vm-contype-docker-image-create"
                        value={vmContypeDockerImageCreate}
                        onChange={changeVMContypeDockerImageCreate}
                      >
                        <option value="sysvnc">System VNC (Proxmox default)</option>
                        <option value="instvnc">Instance VNC (Docker default)</option>
                        <option value="rdp">RDP (Windows only)</option>
                      </select>
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-contype-docker-image-create')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-resize-docker-image-create">{t('vm-resize')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <select
                        id="vm-resize-docker-image-create"
                        name="vm-resize-docker-image-create"
                        value={vmResizeDockerImageCreate}
                        onChange={changeVMResizeDockerImageCreate}
                      >
                        <option value="none">None (Do nothing)</option>
                        <option value="semi">Semi (Allow instance)</option>
                        <option value="full">Full (Enforce JS)</option>
                      </select>
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-resize-docker-image-create')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-scale-docker-image-create">{t('vm-scale')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="checkbox"
                        id="vm-scale-docker-image-create"
                        name="vm-scale-docker-image-create"
                        checked={vmScaleDockerImageCreateChecked}
                        onChange={changeVMScaleDockerImageCreateChecked}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-scale-docker-image-create')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={
                          vmIDDockerImageCreate.length > 0 &&
                          vmNameDockerImageCreate.length > 0 &&
                          vmCoresDockerImageCreate.length > 0 &&
                          vmMemsizeDockerImageCreate.length > 0 &&
                          vmDisksizeDockerImageCreate.length > 0
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
          <ReactBootstrap.Tab eventKey="docker-image-create-root" title={t('vm-docker-image-create-root')}>
            <Formik
              initialValues={{
                id: '',
                name: '',
                rootimage: '',
                cores: '',
                memsize: '',
                disksize: '',
                ceph_public: '',
                ceph_shared: '',
                ceph_user: '',
                viewer_contype: '',
                viewer_resolution: '',
                viewer_resize: '',
                viewer_scale: '',
              }}
              validationSchema={dockerImageCreateRootSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={dockerImageCreateRoot} id="form-docker-image-create-root">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-docker-image-create-root">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-docker-image-create-root"
                        name="vm-id-docker-image-create-root"
                        value={vmIDDockerImageCreateRoot}
                        onChange={changeVMIDDockerImageCreateRoot}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-docker-image-create-root')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-name-docker-image-create-root">{t('vm-name')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-name-docker-image-create-root"
                        name="vm-name-docker-image-create-root"
                        value={vmNameDockerImageCreateRoot}
                        onChange={changeVMNameDockerImageCreateRoot}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-name-docker-image-create-root')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-root-image-docker-image-create-root">{t('vm-root-image')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <select
                        id="vm-root-image-docker-image-create-root"
                        name="vm-root-image-docker-image-create-root"
                        value={vmRootImage}
                        onChange={changeVMRootImage}
                      >
                        <option value="x11vnc">x11vnc</option>
                        <option value="wine">wine</option>
                      </select>
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-root-image-docker-image-create-root')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-cores-docker-image-create-root">{t('vm-cores')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-cores-docker-image-create-root"
                        name="vm-cores-docker-image-create-root"
                        value={vmCoresDockerImageCreateRoot}
                        onChange={changeVMCoresDockerImageCreateRoot}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-cores-docker-image-create-root')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-memory-size-docker-image-create-root">{t('vm-memory-size')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-memory-size-docker-image-create-root"
                        name="vm-memory-size-docker-image-create-root"
                        value={vmMemsizeDockerImageCreateRoot}
                        onChange={changeVMMemsizeDockerImageCreateRoot}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-memory-size-docker-image-create-root')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-disk-size-docker-image-create-root">{t('vm-disk-size')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-disk-size-docker-image-create-root"
                        name="vm-disk-size-docker-image-create-root"
                        value={vmDisksizeDockerImageCreateRoot}
                        onChange={changeVMDisksizeDockerImageCreateRoot}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-disk-size-docker-image-create-root')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-ceph-public-docker-image-create-root">{t('vm-ceph-public')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="checkbox"
                        id="vm-ceph-public-docker-image-create-root"
                        name="vm-ceph-public-docker-image-create-root"
                        checked={vmCephPublicDockerImageCreateRootChecked}
                        onChange={checkChangeVMCephPublicDockerImageCreateRoot}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-ceph-public-docker-image-create-root')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-ceph-shared-docker-image-create-root">{t('vm-ceph-shared')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="checkbox"
                        id="vm-ceph-shared-docker-image-create-root"
                        name="vm-ceph-shared-docker-image-create-root"
                        checked={vmCephSharedDockerImageCreateRootChecked}
                        onChange={checkChangeVMCephSharedDockerImageCreateRoot}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-ceph-shared-docker-image-create-root')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-ceph-user-docker-image-create-root">{t('vm-ceph-user')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="checkbox"
                        id="vm-ceph-user-docker-image-create-root"
                        name="vm-ceph-user-docker-image-create-root"
                        checked={vmCephUserDockerImageCreateRootChecked}
                        onChange={checkChangeVMCephUserDockerImageCreateRoot}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-ceph-user-docker-image-create-root')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-resolution-docker-image-create-root">{t('vm-resolution')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-resolution-docker-image-create-root"
                        name="vm-resolution-docker-image-create-root"
                        value={vmResolutionDockerImageCreateRoot}
                        onChange={changeVMResolutionDockerImageCreateRoot}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-resolution-docker-image-create-root')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-contype-docker-image-create-root">{t('vm-contype')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <select
                        id="vm-contype-docker-image-create-root"
                        name="vm-contype-docker-image-create-root"
                        value={vmContypeDockerImageCreateRoot}
                        onChange={changeVMContypeDockerImageCreateRoot}
                      >
                        <option value="sysvnc">System VNC (Proxmox default)</option>
                        <option value="instvnc">Instance VNC (Docker default)</option>
                        <option value="rdp">RDP (Windows only)</option>
                      </select>
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-contype-docker-image-create-root')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-resize-docker-image-create-root">{t('vm-resize')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <select
                        id="vm-resize-docker-image-create-root"
                        name="vm-resize-docker-image-create-root"
                        value={vmResizeDockerImageCreateRoot}
                        onChange={changeVMResizeDockerImageCreateRoot}
                      >
                        <option value="none">None (Do nothing)</option>
                        <option value="semi">Semi (Allow instance)</option>
                        <option value="full">Full (Enforce JS)</option>
                      </select>
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-resize-docker-image-create-root')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-scale-docker-image-create-root">{t('vm-scale')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="checkbox"
                        id="vm-scale-docker-image-create-root"
                        name="vm-scale-docker-image-create-root"
                        checked={vmScaleDockerImageCreateRootChecked}
                        onChange={changeVMScaleDockerImageCreateRootChecked}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-scale-docker-image-create-root')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={
                          vmIDDockerImageCreateRoot.length > 0 &&
                          vmNameDockerImageCreateRoot.length > 0 &&
                          vmRootImage.length > 0 &&
                          vmCoresDockerImageCreateRoot.length > 0 &&
                          vmMemsizeDockerImageCreateRoot.length > 0 &&
                          vmDisksizeDockerImageCreateRoot.length > 0
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
          <ReactBootstrap.Tab eventKey="docker-image-clone" title={t('vm-docker-image-clone')}>
            <Formik
              initialValues={{
                id: '',
                newid: '',
                name: '',
              }}
              validationSchema={dockerImageCloneSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={dockerImageClone} id="form-docker-image-clone">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-docker-image-clone">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-docker-image-clone"
                        name="vm-id-docker-image-clone"
                        value={vmIDDockerImageClone}
                        onChange={changeVMIDDockerImageClone}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-docker-image-clone')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-new-id-docker-image-clone">{t('vm-new-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-new-id-docker-image-clone"
                        name="vm-new-id-docker-image-clone"
                        value={vmNewIDDockerImageClone}
                        onChange={changeVMNewIDDockerImageClone}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-new-id-docker-image-clone')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-name-docker-image-clone">{t('vm-name')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-name-docker-image-clone"
                        name="vm-name-docker-image-clone"
                        value={vmNameDockerImageClone}
                        onChange={changeVMNameDockerImageClone}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-name-docker-image-clone')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={
                          vmIDDockerImageClone.length > 0 &&
                          vmNewIDDockerImageClone.length > 0 &&
                          vmNameDockerImageClone.length > 0
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
          <ReactBootstrap.Tab eventKey="docker-image-delete" title={t('vm-docker-image-delete')}>
            <Formik
              initialValues={{
                id: '',
              }}
              validationSchema={dockerImageDeleteSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={dockerImageDelete} id="form-docker-image-delete">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-docker-image-delete">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-docker-image-delete"
                        name="vm-id-docker-image-delete"
                        value={vmIDDockerImageDelete}
                        onChange={changeVMIDDockerImageDelete}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-docker-image-delete')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDDockerImageDelete.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="docker-image-build" title={t('vm-docker-image-build')}>
            <Formik
              initialValues={{
                id: '',
              }}
              validationSchema={dockerImageBuildSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={dockerImageBuild} id="form-docker-image-build">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-docker-image-build">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-docker-image-build"
                        name="vm-id-docker-image-build"
                        value={vmIDDockerImageBuild}
                        onChange={changeVMIDDockerImageBuild}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-docker-image-build')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDDockerImageBuild.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="docker-container-start" title={t('vm-docker-container-start')}>
            <Formik
              initialValues={{
                id: '',
                id_env: '',
                connect: '',
              }}
              validationSchema={dockerContainerStartSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={dockerContainerStart} id="form-docker-container-start">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-docker-container-start">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-docker-container-start"
                        name="vm-id-docker-container-start"
                        value={vmIDDockerContainerStart}
                        onChange={changeVMIDDockerContainerStart}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-docker-container-start')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-env-docker-container-start">{t('vm-env')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-env-docker-container-start"
                        name="vm-env-docker-container-start"
                        value={vmENVDockerContainerStart}
                        onChange={changeVMENVDockerContainerStart}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-env-docker-container-start')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-connect-docker-container-start">{t('vm-connect')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="checkbox"
                        id="vm-kill-docker-container-start"
                        name="vm-kill-docker-container-start"
                        checked={vmConnectDockerContainerStartChecked}
                        onChange={checkChangeVMConnectDockerContainerStart}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-connect-docker-container-start')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDDockerContainerStart.length > 0 ? false : true}
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
            {vmStartDockerSubmit ? (
              <>
                <ReactBootstrap.Row>
                  <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div>URL: {viewerURL}</div>
                  </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                {vmConnectDockerContainerStartChecked ? (
                  <>
                    <ReactBootstrap.Row>
                      <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <ViewerFrame request={viewerRequest} />
                      </ReactBootstrap.Col>
                    </ReactBootstrap.Row>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="docker-container-stop" title={t('vm-docker-container-stop')}>
            <Formik
              initialValues={{
                id_instance: '',
                kill: '',
              }}
              validationSchema={dockerContainerStopSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={dockerContainerStop} id="form-docker-container-stop">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-docker-container-stop">{t('vm-id-instance')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-docker-container-stop"
                        name="vm-id-docker-container-stop"
                        value={vmIDInstanceDockerContainerStop}
                        onChange={changeVMIDInstanceDockerContainerStop}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-docker-container-stop')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-kill-docker-container-stop">{t('vm-kill')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="checkbox"
                        id="vm-kill-docker-container-stop"
                        name="vm-kill-docker-container-stop"
                        checked={vmKillDockerContainerStopChecked}
                        onChange={checkChangeVMKillDockerContainerStop}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-kill-docker-container-stop')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDInstanceDockerContainerStop.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
          </ReactBootstrap.Tab>
          <ReactBootstrap.Tab eventKey="docker-container-list" title={t('vm-docker-container-list')}>
            <Formik
              initialValues={{
                onlyuser: '',
              }}
              validationSchema={dockerContainerListSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={dockerContainerList} id="form-docker-container-list">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-docker-list-user">{t('object-list-user')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="checkbox"
                        id="vm-docker-list-user"
                        name="vm-docker-list-user"
                        checked={vmPhasesDockerListCheckedUser}
                        onChange={changeVMPhasesDockerListCheckedUser}
                      />
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-docker-list-daas">{t('object-list-daas')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="checkbox"
                        id="vm-docker-list-daas"
                        name="vm-docker-list-daas"
                        checked={vmPhasesDockerListCheckedDaas}
                        onChange={changeVMPhasesDockerListCheckedDaas}
                      />
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-docker-list-detailed">{t('object-list-detailed')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <input
                        type="checkbox"
                        id="vm-docker-list-detailed"
                        name="vm-docker-list-detailed"
                        checked={vmPhasesDockerListCheckedDetails}
                        onChange={changeVMPhasesDockerListCheckedDetails}
                      />
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button type="submit" variant="primary" id="submit" disabled={false}>
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
            {vmSubmitDockerContainerList ? (
              <ReactBootstrap.Row id="list-status-vm">
                {vmDataDockerContainerList.length > 0 ? (
                  vmDataDockerContainerList.map((data) => {
                    return (
                      <>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          daas_name:
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {data.daas_name}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          daas_object:
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {String(data.daas_object)}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          daas_owner:
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {data.daas_owner}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          daas_type:
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {data.daas_type}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          image:
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {data.image}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          name:
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {data.name}
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          status:
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          {data.status}
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
          <ReactBootstrap.Tab eventKey="docker-container-log" title={t('vm-docker-container-log')}>
            <Formik
              initialValues={{
                id: '',
              }}
              validationSchema={dockerContainerLogsSchema}
              onSubmit={SUBMIT_HANDLED_BY_FORM}
            >
              {() => (
                <Form onSubmit={dockerContainerLogs} id="form-docker-container-logs">
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <label htmlFor="vm-id-docker-container-logs">{t('vm-id')}</label>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Field
                        type="text"
                        id="vm-id-docker-container-logs"
                        name="vm-id-docker-container-logs"
                        value={vmIDDockerContainerLogs}
                        onChange={changeVMIDDockerContainerLogs}
                      />
                    </ReactBootstrap.Col>
                    <div className="error-text">{t('error-vm-id-docker-container-logs')}</div>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ReactBootstrap.Button
                        type="submit"
                        variant="primary"
                        id="submit"
                        disabled={vmIDDockerContainerLogs.length > 0 ? false : true}
                      >
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
            {vmDataDockerContainerLogsSubmit ? (
              <>
                <ReactBootstrap.Row>
                  <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    {vmDataDockerContainerLogs}
                  </ReactBootstrap.Col>
                </ReactBootstrap.Row>
              </>
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

export default SettingsDocker;
