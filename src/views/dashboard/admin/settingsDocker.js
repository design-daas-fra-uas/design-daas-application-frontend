import { useState } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import {useMediaQuery} from "react-responsive";

import {DEVELOPMENT, TEST, LIVE, USERNAME, PASSWORD, DEVELOPMENT_INTERN, TEST_INTERN, LIVE_INTERN, URL_SYSTEM} from "../../../constants/constants";

import Header from "../../../components/header";
import LoadingSpinner from "../../../assets/animation/loadingspinner.svg";

function SettingsDocker() {
    const params = useParams(); // Example: {params.id}
    const [vmDataDockerDaemonInfo, setVMDataDockerDaemonInfo] = useState("");
    const [vmDataDockerDaemonInfoSubmit, setVMDataDockerDaemonInfoSubmit] = useState(false);
    const [vmIDDockerImageInspect, setVMIDDockerImageInspect] = useState("");
    const [vmDataDockerImageInspect, setVMDataDockerImageInspect] = useState({});
    const [vmDataDockerImageInspectSubmit, setVMDataDockerImageInspectSubmit] = useState(false);
    const [vmImageDockerList, setVMImageDockerList] = useState({});
    const [vmImageDockerListSubmit, setVMImageDockerListSubmit] = useState(false);
    const [vmIDDockerImageCreate, setVMIDDockerImageCreate] = useState("");
    const [vmNameDockerImageCreate, setVMNameDockerImageCreate] = useState("");
    const [vmDockerfile, setVMDockerfile] = useState();
    const [vmCoresDockerImageCreate, setVMCoresDockerImageCreate] = useState("");
    const [vmMemsizeDockerImageCreate, setVMMemsizeDockerImageCreate] = useState("");
    const [vmDisksizeDockerImageCreate, setVMDisksizeDockerImageCreate] = useState("");
    const [vmCephPublicDockerImageCreate, setVMCephPublicDockerImageCreate] = useState("");
    const [vmCephSharedDockerImageCreate, setVMCephSharedDockerImageCreate] = useState("");
    const [vmCephUserDockerImageCreate, setVMCephUserDockerImageCreate] = useState("");
    const [vmCephPublicDockerImageCreateChecked, setVMCephPublicDockerImageCreateChecked] = useState(false);
    const [vmCephSharedDockerImageCreateChecked, setVMCephSharedDockerImageCreateChecked] = useState(false);
    const [vmCephUserDockerImageCreateChecked, setVMCephUserDockerImageCreateChecked] = useState(false);
    const [vmResolutionDockerImageCreate, setVMResolutionDockerImageCreate] = useState("");
    const [vmContypeDockerImageCreate, setVMContypeDockerImageCreate] = useState("sysvnc");
    const [vmResizeDockerImageCreate, setVMResizeDockerImageCreate] = useState("none");
    const [vmScaleDockerImageCreate, setVMScaleDockerImageCreate] = useState("");
    const [vmScaleDockerImageCreateChecked, setVMScaleDockerImageCreateChecked] = useState(false);
    const [vmIDDockerImageCreateRoot, setVMIDDockerImageCreateRoot] = useState("");
    const [vmNameDockerImageCreateRoot, setVMNameDockerImageCreateRoot] = useState("");
    const [vmRootImage, setVMRootImage] = useState("x11vnc");
    const [vmCoresDockerImageCreateRoot, setVMCoresDockerImageCreateRoot] = useState("");
    const [vmMemsizeDockerImageCreateRoot, setVMMemsizeDockerImageCreateRoot] = useState("");
    const [vmDisksizeDockerImageCreateRoot, setVMDisksizeDockerImageCreateRoot] = useState("");
    const [vmCephPublicDockerImageCreateRoot, setVMCephPublicDockerImageCreateRoot] = useState("");
    const [vmCephSharedDockerImageCreateRoot, setVMCephSharedDockerImageCreateRoot] = useState("");
    const [vmCephUserDockerImageCreateRoot, setVMCephUserDockerImageCreateRoot] = useState("");
    const [vmCephPublicDockerImageCreateRootChecked, setVMCephPublicDockerImageCreateRootChecked] = useState(false);
    const [vmCephSharedDockerImageCreateRootChecked, setVMCephSharedDockerImageCreateRootChecked] = useState(false);
    const [vmCephUserDockerImageCreateRootChecked, setVMCephUserDockerImageCreateRootChecked] = useState(false);
    const [vmResolutionDockerImageCreateRoot, setVMResolutionDockerImageCreateRoot] = useState("");
    const [vmContypeDockerImageCreateRoot, setVMContypeDockerImageCreateRoot] = useState("sysvnc");
    const [vmResizeDockerImageCreateRoot, setVMResizeDockerImageCreateRoot] = useState("none");
    const [vmScaleDockerImageCreateRoot, setVMScaleDockerImageCreateRoot] = useState("");
    const [vmScaleDockerImageCreateRootChecked, setVMScaleDockerImageCreateRootChecked] = useState(false);
    const [vmIDDockerImageClone, setVMIDDockerImageClone] = useState("");
    const [vmNewIDDockerImageClone, setVMNewIDDockerImageClone] = useState("");
    const [vmNameDockerImageClone, setVMNameDockerImageClone] = useState("");
    const [vmIDDockerImageDelete, setVMIDDockerImageDelete] = useState("");
    const [vmIDDockerImageBuild, setVMIDDockerImageBuild] = useState("");
    const [vmIDDockerContainerStart, setVMIDDockerContainerStart] = useState("");
    const [vmENVDockerContainerStart, setVMENVDockerContainerStart] = useState("");
    const [vmConnectDockerContainerStart, setVMConnectDockerContainerStart] = useState("");
    const [vmConnectDockerContainerStartChecked, setVMConnectDockerContainerStartChecked] = useState(false);
    const [vmIDInstanceDockerContainerStop, setVMIDInstanceDockerContainerStop] = useState("");
    const [vmKillDockerContainerStop, setVMKillDockerContainerStop] = useState("");
    const [vmKillDockerContainerStopChecked, setVMKillDockerContainerStopChecked] = useState(false);
    const [vmSubmitDockerContainerList, setVMSubmitDockerContainerList] = useState(false);
    const [vmDataDockerContainerList, setVMDataDockerContainerList] = useState([]);
    const [vmPhasesDockerListCheckedUserText, setVMPhasesDockerListCheckedUserText] = useState("");
    const [vmPhasesDockerListCheckedUser, setVMPhasesDockerListCheckedUser] = useState(false);
    const [vmPhasesDockerListCheckedDaasText, setVMPhasesDockerListCheckedDaasText] = useState("");
    const [vmPhasesDockerListCheckedDaas, setVMPhasesDockerListCheckedDaas] = useState(false);
    const [vmPhasesDockerListCheckedDetailsText, setVMPhasesDockerListCheckedDetailsText] = useState("");
    const [vmPhasesDockerListCheckedDetails, setVMPhasesDockerListCheckedDetails] = useState(false);
    const [vmIDDockerContainerLogs, setVMIDDockerContainerLogs] = useState("");
    const [vmDataDockerContainerLogs, setVMDataDockerContainerLogs] = useState("");
    const [vmDataDockerContainerLogsSubmit, setVMDataDockerContainerLogsSubmit] = useState(false);
    const [vmStartDockerSubmit, setVMStartDockerSubmit] = useState(false);
    const [viewerURL, setViewerURL] = useState("");
    const [requestAlert, setRequestAlert] = useState(false);
    const [requestAlertMessage, setRequestAlertMessage] = useState(false);
    const [loadingSpinnerShow, setLoadingSpinnerShow] = useState(false);
    const [loadingSpinnerShowSubmit, setLoadingSpinnerShowSubmit] = useState(false);
    const { t, i18n } = useTranslation();

    const isNotDesktop = useMediaQuery({
        query: '(max-width: 1200px)'
    })

    const dockerDaemonInfo = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/container/daemon_info', {}, {
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
                    setVMDataDockerDaemonInfoSubmit(true);
                    setVMDataDockerDaemonInfo(response.data.sys_log);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(false);
                    setVMDataDockerDaemonInfoSubmit(false);
                    setVMDataDockerDaemonInfo("");

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
                setVMDataDockerDaemonInfoSubmit(false);
                setVMDataDockerDaemonInfo("");

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

    const dockerInspectInfo = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/container/image_inspect', {
            id: vmIDDockerImageInspect,
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
                    setVMDataDockerImageInspectSubmit(true);
                    setVMDataDockerImageInspect(response.data.response_data);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(false);
                    setVMDataDockerImageInspectSubmit(false);
                    setVMDataDockerImageInspect({});

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
                setVMDataDockerImageInspectSubmit(false);
                setVMDataDockerImageInspect({});

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

    const dockerImageList = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/container/image_list', {
            onlyuser: 'on',
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
                    setVMImageDockerList(response.data.response_data);
                    setVMImageDockerListSubmit(true);
                    setRequestAlert(true);
                    setRequestAlertMessage(true);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                        setVMImageDockerListSubmit(false);
                    }, 2000);
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                    setVMImageDockerList([]);
                    setRequestAlert(true);
                    setRequestAlertMessage(false);
                    setVMImageDockerListSubmit(false);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                        setVMImageDockerListSubmit(false);
                    }, 2000);
                }
            })
            .catch(e => {
                console.log(e)
                setVMImageDockerList([]);
                setRequestAlert(true);
                setRequestAlertMessage(false);
                setVMImageDockerListSubmit(false);

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                    setVMImageDockerListSubmit(false);
                }, 2000);
            });
    }

    const dockerImageCreate = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/container/image_create', {
            id: vmIDDockerImageCreate,
            name: vmNameDockerImageCreate,
            dockerfile: vmDockerfile,
            ceph_public: vmCephUserDockerImageCreateChecked ? "on" : "", // vmCephPublicDockerImageCreate,
            ceph_shared: vmCephUserDockerImageCreateChecked ? "on" : "", // vmCephSharedDockerImageCreate,
            ceph_user: vmCephUserDockerImageCreateChecked ? "on" : "", // vmCephUserDockerImageCreate,
            viewer_resolution: vmResolutionDockerImageCreate,
            viewer_contype: vmContypeDockerImageCreate,
            viewer_resize: vmResizeDockerImageCreate,
            viewer_scale: vmScaleDockerImageCreateChecked ? "on" : "", // vmScaleDockerImageCreate,
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

    const dockerImageCreateRoot = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/container/image_create_root', {
            id: vmIDDockerImageCreateRoot,
            name: vmNameDockerImageCreateRoot,
            rootimage: vmRootImage,
            ceph_public: vmCephPublicDockerImageCreateRootChecked ? "on" : "", // vmCephPublicDockerImageCreateRoot,
            ceph_shared: vmCephSharedDockerImageCreateRootChecked ? "on" : "", // vmCephSharedDockerImageCreateRoot,
            ceph_user: vmCephUserDockerImageCreateRootChecked ? "on" : "", // vmCephUserDockerImageCreateRoot,
            viewer_resolution: vmResolutionDockerImageCreateRoot,
            viewer_contype: vmContypeDockerImageCreateRoot,
            viewer_resize: vmResizeDockerImageCreateRoot,
            viewer_scale: vmScaleDockerImageCreateRootChecked ? "on" : "", // vmScaleDockerImageCreateRoot,
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

    const dockerImageClone = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/container/image_clone', {
            id: vmIDDockerImageClone,
            newid: vmNewIDDockerImageClone,
            name: vmNameDockerImageClone,
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

    const dockerImageDelete = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/container/image_delete', {
            id: vmIDDockerImageDelete,
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

    const dockerImageBuild = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/container/image_build', {
            id: vmIDDockerImageBuild,
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

    const dockerContainerStart = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/container/container_start', {
            id: vmIDDockerContainerStart,
            id_env: vmENVDockerContainerStart,
            connect: vmConnectDockerContainerStartChecked ? "on" : "", // vmConnectDockerContainerStart,
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
                setLoadingSpinnerShow(true);
                setLoadingSpinnerShowSubmit(true);
                if (response.status === 200 && response.data.response_code === 200) {

                    let xhr = new XMLHttpRequest();

                    function handler() {
                        if (this.readyState === this.DONE) {
                            if (this.status === 200) {
                                console.log(this);
                                console.log(this.responseURL);
                                //let dataURL = URL.createObjectURL(new Blob([this.responseURL]));
                                document.getElementById("viewer-desktop").srcdoc = this.response; // this.responseURL
                            } else {
                                console.error('not loaded');
                            }
                        }
                    }

                    xhr.open('GET', response.data.response_url);
                    xhr.onreadystatechange = handler;
                    //xhr.responseType = 'blob';
                    xhr.setRequestHeader('Authorization', localStorage.getItem('userToken'));
                    xhr.setRequestHeader('Access-Control-Allow-Origin', URL_SYSTEM);
                    xhr.setRequestHeader('Access-Control-Allow-Headers', URL_SYSTEM);
                    xhr.send();

                    /*window.addEventListener("message", (event) => {
                        if (event.data.type === "DaaSCustomReloadEvent") {
                            console.log("Received data from iframe:", event.data.data);
                            doRequest();
                        }
                    });
                    function doRequest(){
                        let xhr = new XMLHttpRequest();
                        function handler() {
                            if (this.readyState === this.DONE) {
                                console.log(this);
                                console.log(this.responseURL);
                                document.getElementById("viewer-desktop").srcdoc = this.response;
                            }
                        }
                        xhr.open('GET', response.data.response_url);
                        xhr.onreadystatechange = handler;
                        //xhr.responseType = 'blob';
                        xhr.setRequestHeader('Authorization', localStorage.getItem('userToken'));
                        xhr.setRequestHeader('Access-Control-Allow-Origin', URL_SYSTEM);
                        xhr.setRequestHeader('Access-Control-Allow-Headers', URL_SYSTEM);
                        xhr.send();
                    }*/

                    setRequestAlert(true);
                    setRequestAlertMessage(true);
                    setViewerURL(response.data.response_url);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                    console.log(response.data.response_url)

                    setLoadingSpinnerShow(false);
                    setLoadingSpinnerShowSubmit(false);
                    setVMStartDockerSubmit(true);
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(false);
                    setViewerURL("");

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);

                    setLoadingSpinnerShow(false);
                    setLoadingSpinnerShowSubmit(false);
                    setVMStartDockerSubmit(false);
                }
            })
            .catch(e => {
                console.log(e)
                setRequestAlert(true);
                setRequestAlertMessage(false);
                setViewerURL("");

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);

                setLoadingSpinnerShow(false);
                setLoadingSpinnerShowSubmit(false);
                setVMStartDockerSubmit(false);
            });
    }

  const dockerContainerStop = (event) => {
    event.preventDefault();

        axios.post(DEVELOPMENT + '/container/container_stop', {
            id_instance: vmIDInstanceDockerContainerStop,
            kill: vmKillDockerContainerStopChecked ? "on" : "", // vmKillDockerContainerStop,
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

  const dockerContainerList = (event) => {
    event.preventDefault();

        axios.post(DEVELOPMENT + '/container/container_list', {
            onlyuser: vmPhasesDockerListCheckedUser ? "on" : "",
            onlydaas: vmPhasesDockerListCheckedDaas ? "on" : "",
            detailed: vmPhasesDockerListCheckedDetails ? "on" : "",
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
                if (response.status === 200 && response.data.response_code === 0) {
                    setRequestAlert(true);
                    setRequestAlertMessage(true);
                    setVMSubmitDockerContainerList(true);
                    setVMDataDockerContainerList(response.data.response_data);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 10000);

                    setTimeout(() => {
                        setVMSubmitDockerContainerList(false);
                    }, 10000);
                }
                if (response.status === 200 && response.data.response_code !== 0) {
                    setRequestAlert(true);
                    setRequestAlertMessage(false);
                    setVMSubmitDockerContainerList(true);
                    setVMDataDockerContainerList([]);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 10000);

                    setTimeout(() => {
                        setVMSubmitDockerContainerList(false);
                    }, 10000);
                }
            })
            .catch(e => {
                console.log(e)
                setRequestAlert(true);
                setRequestAlertMessage(false);
                setVMSubmitDockerContainerList(true);
                setVMDataDockerContainerList([]);

        setTimeout(() => {
          setVMSubmitDockerContainerList(false);
        }, 10000);
      });
  };

  const dockerContainerLogs = (event) => {
    event.preventDefault();

        axios.post(DEVELOPMENT + '/container/container_logs', {
            id: vmIDDockerContainerLogs,
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
                    setVMDataDockerContainerLogsSubmit(true);
                    setVMDataDockerContainerLogs(response.data.sys_log);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(false);
                    setVMDataDockerContainerLogsSubmit(false);
                    setVMDataDockerContainerLogs("");

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

    const changeVMMemsizeDockerImageCreate = event => {
        setVMMemsizeDockerImageCreate(event.target.value);
    };

    const changeVMDisksizeDockerImageCreate = event => {
        setVMDisksizeDockerImageCreate(event.target.value);
    };

    const changeVMCephPublicDockerImageCreate = event => {
        setVMCephPublicDockerImageCreate(event.target.value);
    };

    const checkChangeVMCephPublicDockerImageCreate = () => {
        setVMCephPublicDockerImageCreateChecked(!vmCephPublicDockerImageCreateChecked)

        if (vmCephPublicDockerImageCreateChecked) {
            setVMCephPublicDockerImageCreate("on");
        } else {
            setVMCephPublicDockerImageCreate("");
        }
    }

    const changeVMCephSharedDockerImageCreate = event => {
        setVMCephSharedDockerImageCreate(event.target.value);
    };

    const checkChangeVMCephSharedDockerImageCreate = () => {
        setVMCephSharedDockerImageCreateChecked(!vmCephSharedDockerImageCreateChecked)

        if (vmCephSharedDockerImageCreateChecked) {
            setVMCephSharedDockerImageCreate("on");
        } else {
            setVMCephSharedDockerImageCreate("");
        }
    }

    const changeVMCephUserDockerImageCreate = event => {
        setVMCephUserDockerImageCreate(event.target.value);
    };

    const checkChangeVMCephUserDockerImageCreate = () => {
        setVMCephUserDockerImageCreateChecked(!vmCephUserDockerImageCreateChecked)

        if (vmCephUserDockerImageCreateChecked) {
            setVMCephUserDockerImageCreate("on");
        } else {
            setVMCephUserDockerImageCreate("");
        }
    }

    const changeVMResolutionDockerImageCreate = event => {
        setVMResolutionDockerImageCreate(event.target.value);
    };
    const changeVMContypeDockerImageCreate = event => {
        setVMContypeDockerImageCreate(event.target.value);
    };
    const changeVMResizeDockerImageCreate = event => {
        setVMResizeDockerImageCreate(event.target.value);
    };
    const changeVMScaleDockerImageCreate = event => {
        setVMScaleDockerImageCreate(event.target.value);
    };
    const changeVMScaleDockerImageCreateChecked = () => {
        setVMScaleDockerImageCreateChecked(!vmScaleDockerImageCreateChecked)

        if (vmScaleDockerImageCreateChecked) {
            setVMScaleDockerImageCreate("on");
        } else {
            setVMScaleDockerImageCreate("");
        }
    };

    const changeVMIDDockerImageCreateRoot = event => {
        setVMIDDockerImageCreateRoot(event.target.value);
    };

    const changeVMNameDockerImageCreateRoot = event => {
        setVMNameDockerImageCreateRoot(event.target.value);
    };

    const changeVMRootImage = event => {
        setVMRootImage(event.target.value);
    };

    const changeVMCoresDockerImageCreateRoot = event => {
        setVMCoresDockerImageCreateRoot(event.target.value);
    };

    const changeVMMemsizeDockerImageCreateRoot = event => {
        setVMMemsizeDockerImageCreateRoot(event.target.value);
    };

    const changeVMDisksizeDockerImageCreateRoot = event => {
        setVMDisksizeDockerImageCreateRoot(event.target.value);
    };

    const changeVMCephPublicDockerImageCreateRoot = event => {
        setVMCephPublicDockerImageCreateRoot(event.target.value);
    };
    const checkChangeVMCephPublicDockerImageCreateRoot = () => {
        setVMCephPublicDockerImageCreateRootChecked(!vmCephPublicDockerImageCreateRootChecked)

        if (vmCephPublicDockerImageCreateRootChecked) {
            setVMCephPublicDockerImageCreateRoot("on");
        } else {
            setVMCephPublicDockerImageCreateRoot("");
        }
    }

    const changeVMCephSharedDockerImageCreateRoot = event => {
        setVMCephSharedDockerImageCreateRoot(event.target.value);
    };
    const checkChangeVMCephSharedDockerImageCreateRoot = () => {
        setVMCephSharedDockerImageCreateRootChecked(!vmCephSharedDockerImageCreateRootChecked)

        if (vmCephSharedDockerImageCreateRootChecked) {
            setVMCephSharedDockerImageCreateRoot("on");
        } else {
            setVMCephSharedDockerImageCreateRoot("");
        }
    }

    const changeVMCephUserDockerImageCreateRoot = event => {
        setVMCephUserDockerImageCreateRoot(event.target.value);
    };
    const checkChangeVMCephUserDockerImageCreateRoot = () => {
        setVMCephUserDockerImageCreateRootChecked(!vmCephUserDockerImageCreateRootChecked)

        if (vmCephUserDockerImageCreateRootChecked) {
            setVMCephUserDockerImageCreateRoot("on");
        } else {
            setVMCephUserDockerImageCreateRoot("");
        }
    }

    const changeVMResolutionDockerImageCreateRoot = event => {
        setVMResolutionDockerImageCreateRoot(event.target.value);
    };
    const changeVMContypeDockerImageCreateRoot = event => {
        setVMContypeDockerImageCreateRoot(event.target.value);
    };
    const changeVMResizeDockerImageCreateRoot = event => {
        setVMResizeDockerImageCreateRoot(event.target.value);
    };
    const changeVMScaleDockerImageCreateRoot = event => {
        setVMScaleDockerImageCreateRoot(event.target.value);
    };
    const changeVMScaleDockerImageCreateRootChecked = () => {
        setVMScaleDockerImageCreateRootChecked(!vmScaleDockerImageCreateRootChecked)

        if (vmScaleDockerImageCreateRootChecked) {
            setVMScaleDockerImageCreateRoot("on");
        } else {
            setVMScaleDockerImageCreateRoot("");
        }
    };

    const changeVMIDDockerImageClone = event => {
        setVMIDDockerImageClone(event.target.value);
    };

    const changeVMNewIDDockerImageClone = event => {
        setVMNewIDDockerImageClone(event.target.value);
    };

    const changeVMNameDockerImageClone = event => {
        setVMNameDockerImageClone(event.target.value);
    };

    const changeVMIDDockerImageDelete = event => {
        setVMIDDockerImageDelete(event.target.value);
    };

    const changeVMIDDockerImageBuild = event => {
        setVMIDDockerImageBuild(event.target.value);
    };

    const changeVMIDDockerContainerStart = event => {
        setVMIDDockerContainerStart(event.target.value);
    };

    const changeVMENVDockerContainerStart = event => {
        setVMENVDockerContainerStart(event.target.value);
    };

    const changeVMConnectDockerContainerStart = event => {
        setVMConnectDockerContainerStart(event.target.value);
    };

    const checkChangeVMConnectDockerContainerStart = () => {
        setVMConnectDockerContainerStartChecked(!vmConnectDockerContainerStartChecked)

        if (vmConnectDockerContainerStartChecked) {
            setVMConnectDockerContainerStart("on");
        } else {
            setVMConnectDockerContainerStart("");
        }
    }

    const changeVMIDInstanceDockerContainerStop = event => {
        setVMIDInstanceDockerContainerStop(event.target.value);
    };

    const changeVMKillDockerContainerStop = event => {
        setVMKillDockerContainerStop(event.target.value);
    };
    const checkChangeVMKillDockerContainerStop = () => {
        setVMKillDockerContainerStopChecked(!vmKillDockerContainerStopChecked)

        if (vmKillDockerContainerStopChecked) {
            setVMKillDockerContainerStop("on");
        } else {
            setVMKillDockerContainerStop("");
        }
    }

    const changeVMIDDockerContainerLogs = event => {
        setVMIDDockerContainerLogs(event.target.value);
    };

    const changeVMPhasesDockerListCheckedUser = event => {
        setVMPhasesDockerListCheckedUser(!vmPhasesDockerListCheckedUser)

        if (vmPhasesDockerListCheckedUser) {
            setVMPhasesDockerListCheckedUserText("on");
        } else {
            setVMPhasesDockerListCheckedUserText("");
        }
    };

    const changeVMPhasesDockerListCheckedDaas = event => {
        setVMPhasesDockerListCheckedDaas(!vmPhasesDockerListCheckedDaas)

        if (vmPhasesDockerListCheckedDaas) {
            setVMPhasesDockerListCheckedDaasText("on");
        } else {
            setVMPhasesDockerListCheckedDaasText("");
        }
    };

    const changeVMPhasesDockerListCheckedDetails = event => {
        setVMPhasesDockerListCheckedDetails(!vmPhasesDockerListCheckedDetails)

        if (vmPhasesDockerListCheckedDetails) {
            setVMPhasesDockerListCheckedDetailsText("on");
        } else {
            setVMPhasesDockerListCheckedDetailsText("");
        }
    };

    const backToDashboard = () => {
        window.location.href = "/dashboard/admin";
    };

    const openNewTab = () => {
        window.open({viewerURL}, "_blank").focus();
    };

    const openNewWindow = () => {
        window.open({viewerURL}, "DESIGN - Viewer", "fullscreen=yes");
    };

    const dockerDaemonInfoSchema = Yup.object().shape({});

    const dockerInspectInfoSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
    });

    const dockerImageListSchema = Yup.object().shape({});

    const dockerImageCreateSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        name: Yup.string()
            .required('Name invalid'),
        dockerfile: Yup.mixed()
            .required('Dockerfile invalid'),
        cores: Yup.string()
            .required('Cores invalid'),
        memsize: Yup.string()
            .required('Memory size invalid'),
        disksize: Yup.string()
            .required('Disk size invalid'),
        ceph_public: Yup.string()
            .required('Ceph public invalid'),
        ceph_shared: Yup.string()
            .required('Ceph shared invalid'),
        ceph_user: Yup.string()
            .required('Ceph user invalid'),
        viewer_resolution: Yup.string()
            .required('Resolution invalid'),
        viewer_contype: Yup.string()
            .required('Contype invalid'),
        viewer_resize: Yup.string()
            .required('Resize invalid'),
        viewer_scale: Yup.string()
            .required('Scale invalid'),
    });

    const dockerImageCreateRootSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        name: Yup.string()
            .required('Name invalid'),
        rootimage: Yup.string()
            .required('Root image invalid'),
        cores: Yup.string()
            .required('Cores invalid'),
        memsize: Yup.string()
            .required('Memory size invalid'),
        disksize: Yup.string()
            .required('Disk size invalid'),
        ceph_public: Yup.string()
            .required('Ceph public invalid'),
        ceph_shared: Yup.string()
            .required('Ceph shared invalid'),
        ceph_user: Yup.string()
            .required('Ceph user invalid'),
        viewer_resolution: Yup.string()
            .required('Resolution invalid'),
        viewer_contype: Yup.string()
            .required('Contype invalid'),
        viewer_resize: Yup.string()
            .required('Resize invalid'),
        viewer_scale: Yup.string()
            .required('Scale invalid'),
    });

    const dockerImageCloneSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        newid: Yup.string()
            .required('New ID invalid'),
        name: Yup.string()
            .required('Name invalid'),
    });

    const dockerImageDeleteSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
    });

    const dockerImageBuildSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
    });

    const dockerContainerStartSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        id_env: Yup.string()
            .required('ID Environment invalid'),
        connect: Yup.string()
            .required('Connection invalid'),
    });

    const dockerContainerStopSchema = Yup.object().shape({
        id_instance: Yup.string()
            .required('ID instance invalid'),
        kill: Yup.string()
            .required('Kill process invalid'),
    });

    const dockerContainerListSchema = Yup.object().shape({
        onlyuser: Yup.string()
            .required('Credentials are invalid'),
    });

    const dockerContainerLogsSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
    });

    return (
        <>
            <Header/>
            <ReactBootstrap.Container id="settingsOverviewDocker" fluid={true}>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                        <div>
                            <h2>
                                {t('vm-docker')}
                            </h2>
                        </div>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Tabs defaultActiveKey="docker-daemon-info" id="all-config-docker">
                    <ReactBootstrap.Tab eventKey="docker-daemon-info" title={t('vm-docker-daemon-info')}>
                        <Formik
                            initialValues={{}}
                            validationSchema={dockerDaemonInfoSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={dockerDaemonInfo} id="form-docker-daemon-info">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={false}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                        {
                            vmDataDockerDaemonInfoSubmit ? (
                                <>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            {vmDataDockerDaemonInfo}
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </>
                            ) : (
                                <></>
                            )
                        }
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="docker-image-inspect" title={t('vm-docker-image-inspect')}>
                        <Formik
                            initialValues={{
                                id: "",
                            }}
                            validationSchema={dockerInspectInfoSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={dockerInspectInfo} id="form-docker-image-inspect">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-docker-image-inspect">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-docker-image-inspect" name="vm-id-docker-image-inspect" value={vmIDDockerImageInspect} onChange={changeVMIDDockerImageInspect}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-docker-image-inspect')}
                                            {/*<ErrorMessage name="vm-id-docker-image-inspect">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDDockerImageInspect.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                        {
                            vmDataDockerImageInspectSubmit ? (
                                <ReactBootstrap.Row id="form-docker-image-inspect">
                                    {
                                        vmDataDockerImageInspect !== undefined
                                            ? (
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
                                                        <pre>
                                                            {JSON.stringify(vmDataDockerImageInspect.stateinfo, null, 3)}
                                                        </pre>
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
                                            )
                                            : (
                                                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    {t('no-data-available')}
                                                </ReactBootstrap.Col>
                                            )
                                    }
                                </ReactBootstrap.Row>
                            ) : (
                                <></>
                            )
                        }
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="docker-image-list" title={t('vm-docker-image-list')}>
                        <Formik
                            initialValues={{}}
                            validationSchema={dockerImageListSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={dockerImageList} id="form-docker-image-list">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={false}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                        {
                            vmImageDockerListSubmit ? (
                                <ReactBootstrap.Row id="form-docker-image-list">
                                    {
                                        vmImageDockerList.length > 0
                                            ? (
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
                                                    )
                                                })
                                            )
                                            : (
                                                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    {t('no-data-available')}
                                                </ReactBootstrap.Col>
                                            )
                                    }
                                </ReactBootstrap.Row>
                            ) : (
                                <></>
                            )
                        }
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
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={dockerImageCreate} id="form-docker-image-create">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-docker-image-create">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-docker-image-create" name="vm-id-docker-image-create" value={vmIDDockerImageCreate} onChange={changeVMIDDockerImageCreate}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-docker-image-create')}
                                            {/*<ErrorMessage name="vm-id-docker-image-create">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-name-docker-image-create">{t('vm-name')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-name-docker-image-create" name="vm-name-docker-image-create" value={vmNameDockerImageCreate} onChange={changeVMNameDockerImageCreate}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-name-docker-image-create')}
                                            {/*<ErrorMessage name="vm-name-docker-image-create">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-dockerfile-docker-image-create">{t('vm-dockerfile')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input type="file" id="vm-dockerfile-docker-image-create" name="vm-dockerfile-docker-image-create" onChange={changeVMDockerfile}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-dockerfile-docker-image-create')}
                                            {/*<ErrorMessage name="vm-dockerfile-docker-image-create">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label
                                                htmlFor="vm-cores-docker-image-create">{t('vm-cores')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-cores-docker-image-create"
                                                   name="vm-cores-docker-image-create"
                                                   value={vmCoresDockerImageCreate}
                                                   onChange={changeVMCoresDockerImageCreate}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-cores-docker-image-create')}
                                            {/*<ErrorMessage name="vm-cores-docker-image-create">
                                                        </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label
                                                htmlFor="vm-memory-size-docker-image-create">{t('vm-memory-size')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text"
                                                   id="vm-memory-size-docker-image-create"
                                                   name="vm-memory-size-docker-image-create"
                                                   value={vmMemsizeDockerImageCreate}
                                                   onChange={changeVMMemsizeDockerImageCreate}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-memory-size-docker-image-create')}
                                            {/*<ErrorMessage name="vm-memory-size-docker-image-create">
                                                        </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label
                                                htmlFor="vm-disk-size-docker-image-create">{t('vm-disk-size')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text"
                                                   id="vm-disk-size-docker-image-create"
                                                   name="vm-disk-size-docker-image-create"
                                                   value={vmDisksizeDockerImageCreate}
                                                   onChange={changeVMDisksizeDockerImageCreate}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-disk-size-docker-image-create')}
                                            {/*<ErrorMessage name="vm-disk-size-docker-image-create">
                                                        </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-ceph-public-docker-image-create">{t('vm-ceph-public')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-ceph-public-docker-image-create"
                                                name="vm-ceph-public-docker-image-create"
                                                value={vmCephPublicDockerImageCreate}
                                                checked={vmCephPublicDockerImageCreateChecked}
                                                onChange={checkChangeVMCephPublicDockerImageCreate}
                                            />
                                            {/*<Field type="text" id="vm-ceph-public-docker-image-create" name="vm-ceph-public-docker-image-create" value={vmCephPublicDockerImageCreate} onChange={changeVMCephPublicDockerImageCreate}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-ceph-public-docker-image-create')}
                                            {/*<ErrorMessage name="vm-ceph-public-docker-image-create">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-ceph-shared-docker-image-create">{t('vm-ceph-shared')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-ceph-shared-docker-image-create"
                                                name="vm-ceph-shared-docker-image-create"
                                                value={vmCephSharedDockerImageCreate}
                                                checked={vmCephSharedDockerImageCreateChecked}
                                                onChange={checkChangeVMCephSharedDockerImageCreate}
                                            />
                                            {/*<Field type="text" id="vm-ceph-shared-docker-image-create" name="vm-ceph-shared-docker-image-create" value={vmCephSharedDockerImageCreate} onChange={changeVMCephSharedDockerImageCreate}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-ceph-shared-docker-image-create')}
                                            {/*<ErrorMessage name="vm-ceph-shared-docker-image-create">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-ceph-user-docker-image-create">{t('vm-ceph-user')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-ceph-user-docker-image-create"
                                                name="vm-ceph-user-docker-image-create"
                                                value={vmCephUserDockerImageCreate}
                                                checked={vmCephUserDockerImageCreateChecked}
                                                onChange={checkChangeVMCephUserDockerImageCreate}
                                            />
                                            {/*<Field type="text" id="vm-ceph-user-docker-image-create" name="vm-ceph-user-docker-image-create" value={vmCephUserDockerImageCreate} onChange={changeVMCephUserDockerImageCreate}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-ceph-user-docker-image-create')}
                                            {/*<ErrorMessage name="vm-ceph-user-docker-image-create">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-resolution-docker-image-create">{t('vm-resolution')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-resolution-docker-image-create" name="vm-resolution-docker-image-create" value={vmResolutionDockerImageCreate} onChange={changeVMResolutionDockerImageCreate}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-resolution-docker-image-create')}
                                            {/*<ErrorMessage name="vm-resolution-docker-image-create">
                                        </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-contype-docker-image-create">{t('vm-contype')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <select id="vm-contype-docker-image-create" name="vm-contype-docker-image-create" value={vmContypeDockerImageCreate} onChange={changeVMContypeDockerImageCreate}>
                                                <option value="sysvnc">System VNC (Proxmox default)</option>
                                                <option value="instvnc">Instance VNC (Docker default)</option>
                                                <option value="rdp">RDP (Windows only)</option>
                                            </select>
                                            {/*<Field type="text" id="vm-contype-docker-image-create" name="vm-contype-docker-image-create" value={vmContypeDockerImageCreate} onChange={changeVMContypeDockerImageCreate}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-contype-docker-image-create')}
                                            {/*<ErrorMessage name="vm-contype-docker-image-create">
                                        </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-resize-docker-image-create">{t('vm-resize')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <select id="vm-resize-docker-image-create" name="vm-resize-docker-image-create" value={vmResizeDockerImageCreate} onChange={changeVMResizeDockerImageCreate}>
                                                <option value="none">None (Do nothing)</option>
                                                <option value="semi">Semi (Allow instance)</option>
                                                <option value="full">Full (Enforce JS)</option>
                                            </select>
                                            {/*<Field type="text" id="vm-resize-docker-image-create" name="vm-resize-docker-image-create" value={vmResizeDockerImageCreate} onChange={changeVMResizeDockerImageCreate}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-resize-docker-image-create')}
                                            {/*<ErrorMessage name="vm-resize-docker-image-create">
                                        </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-scale-docker-image-create">{t('vm-scale')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-scale-docker-image-create"
                                                name="vm-scale-docker-image-create"
                                                value={vmScaleDockerImageCreate}
                                                checked={vmScaleDockerImageCreateChecked}
                                                onChange={changeVMScaleDockerImageCreateChecked}
                                            />
                                            {/*<Field type="text" id="vm-scale-docker-image-create" name="vm-scale-docker-image-create" value={vmScaleDockerImageCreate} onChange={changeVMScaleDockerImageCreate}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-scale-docker-image-create')}
                                            {/*<ErrorMessage name="vm-scale-docker-image-create">
                                        </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDDockerImageCreate.length > 0 && vmNameDockerImageCreate.length > 0 && vmCoresDockerImageCreate.length > 0 && vmMemsizeDockerImageCreate.length > 0 && vmDisksizeDockerImageCreate.length > 0 ? false : true}>
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
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={dockerImageCreateRoot} id="form-docker-image-create-root">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-docker-image-create-root">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-docker-image-create-root" name="vm-id-docker-image-create-root" value={vmIDDockerImageCreateRoot} onChange={changeVMIDDockerImageCreateRoot}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-docker-image-create-root')}
                                            {/*<ErrorMessage name="vm-id-docker-image-create-root">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-name-docker-image-create-root">{t('vm-name')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-name-docker-image-create-root" name="vm-name-docker-image-create-root" value={vmNameDockerImageCreateRoot} onChange={changeVMNameDockerImageCreateRoot}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-name-docker-image-create-root')}
                                            {/*<ErrorMessage name="vm-name-docker-image-create-root">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-root-image-docker-image-create-root">{t('vm-root-image')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <select id="vm-root-image-docker-image-create-root" name="vm-root-image-docker-image-create-root" value={vmRootImage} onChange={changeVMRootImage}>
                                                <option value="x11vnc">x11vnc</option>
                                                <option value="wine">wine</option>
                                            </select>
                                            {/*<Field type="text" id="vm-root-image-docker-image-create-root" name="vm-root-image-docker-image-create-root" value={vmRootImage} onChange={changeVMRootImage}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-root-image-docker-image-create-root')}
                                            {/*<ErrorMessage name="vm-root-image-docker-image-create-root">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label
                                                htmlFor="vm-cores-docker-image-create-root">{t('vm-cores')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-cores-docker-image-create-root"
                                                   name="vm-cores-docker-image-create-root"
                                                   value={vmCoresDockerImageCreateRoot}
                                                   onChange={changeVMCoresDockerImageCreateRoot}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-cores-docker-image-create-root')}
                                            {/*<ErrorMessage name="vm-cores-docker-image-create-root">
                                                        </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label
                                                htmlFor="vm-memory-size-docker-image-create-root">{t('vm-memory-size')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text"
                                                   id="vm-memory-size-docker-image-create-root"
                                                   name="vm-memory-size-docker-image-create-root"
                                                   value={vmMemsizeDockerImageCreateRoot}
                                                   onChange={changeVMMemsizeDockerImageCreateRoot}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-memory-size-docker-image-create-root')}
                                            {/*<ErrorMessage name="vm-memory-size-docker-image-create-root">
                                                        </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label
                                                htmlFor="vm-disk-size-docker-image-create-root">{t('vm-disk-size')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text"
                                                   id="vm-disk-size-docker-image-create-root"
                                                   name="vm-disk-size-docker-image-create-root"
                                                   value={vmDisksizeDockerImageCreateRoot}
                                                   onChange={changeVMDisksizeDockerImageCreateRoot}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-disk-size-docker-image-create-root')}
                                            {/*<ErrorMessage name="vm-disk-size-docker-image-create-root">
                                                        </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-ceph-public-docker-image-create-root">{t('vm-ceph-public')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-ceph-public-docker-image-create-root"
                                                name="vm-ceph-public-docker-image-create-root"
                                                value={vmCephPublicDockerImageCreateRoot}
                                                checked={vmCephPublicDockerImageCreateRootChecked}
                                                onChange={checkChangeVMCephPublicDockerImageCreateRoot}
                                            />
                                            {/*<Field type="text" id="vm-ceph-public-docker-image-create-root" name="vm-ceph-public-docker-image-create-root" value={vmCephPublicDockerImageCreateRoot} onChange={changeVMCephPublicDockerImageCreateRoot}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-ceph-public-docker-image-create-root')}
                                            {/*<ErrorMessage name="vm-ceph-public-docker-image-create-root">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-ceph-shared-docker-image-create-root">{t('vm-ceph-shared')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-ceph-shared-docker-image-create-root"
                                                name="vm-ceph-shared-docker-image-create-root"
                                                value={vmCephSharedDockerImageCreateRoot}
                                                checked={vmCephSharedDockerImageCreateRootChecked}
                                                onChange={checkChangeVMCephSharedDockerImageCreateRoot}
                                            />
                                            {/*<Field type="text" id="vm-ceph-shared-docker-image-create-root" name="vm-ceph-shared-docker-image-create-root" value={vmCephSharedDockerImageCreateRoot} onChange={changeVMCephSharedDockerImageCreateRoot}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-ceph-shared-docker-image-create-root')}
                                            {/*<ErrorMessage name="vm-ceph-shared-docker-image-create-root">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-ceph-user-docker-image-create-root">{t('vm-ceph-user')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-ceph-user-docker-image-create-root"
                                                name="vm-ceph-user-docker-image-create-root"
                                                value={vmCephUserDockerImageCreateRoot}
                                                checked={vmCephUserDockerImageCreateRootChecked}
                                                onChange={checkChangeVMCephUserDockerImageCreateRoot}
                                            />
                                            {/*<Field type="text" id="vm-ceph-user-docker-image-create-root" name="vm-ceph-user-docker-image-create-root" value={vmCephUserDockerImageCreateRoot} onChange={changeVMCephUserDockerImageCreateRoot}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-ceph-user-docker-image-create-root')}
                                            {/*<ErrorMessage name="vm-ceph-user-docker-image-create-root">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-resolution-docker-image-create-root">{t('vm-resolution')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-resolution-docker-image-create-root" name="vm-resolution-docker-image-create-root" value={vmResolutionDockerImageCreateRoot} onChange={changeVMResolutionDockerImageCreateRoot}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-resolution-docker-image-create-root')}
                                            {/*<ErrorMessage name="vm-resolution-docker-image-create-root">
                                        </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-contype-docker-image-create-root">{t('vm-contype')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <select id="vm-contype-docker-image-create-root" name="vm-contype-docker-image-create-root" value={vmContypeDockerImageCreateRoot} onChange={changeVMContypeDockerImageCreateRoot}>
                                                <option value="sysvnc">System VNC (Proxmox default)</option>
                                                <option value="instvnc">Instance VNC (Docker default)</option>
                                                <option value="rdp">RDP (Windows only)</option>
                                            </select>
                                            {/*<Field type="text" id="vm-contype-docker-image-create-root" name="vm-contype-docker-image-create-root" value={vmContypeDockerImageCreateRoot} onChange={changeVMContypeDockerImageCreateRoot}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-contype-docker-image-create-root')}
                                            {/*<ErrorMessage name="vm-contype-docker-image-create-root">
                                        </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-resize-docker-image-create-root">{t('vm-resize')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <select id="vm-resize-docker-image-create-root" name="vm-resize-docker-image-create-root" value={vmResizeDockerImageCreateRoot} onChange={changeVMResizeDockerImageCreateRoot}>
                                                <option value="none">None (Do nothing)</option>
                                                <option value="semi">Semi (Allow instance)</option>
                                                <option value="full">Full (Enforce JS)</option>
                                            </select>
                                            {/*<Field type="text" id="vm-resize-docker-image-create-root" name="vm-resize-docker-image-create-root" value={vmResizeDockerImageCreateRoot} onChange={changeVMResizeDockerImageCreateRoot}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-resize-docker-image-create-root')}
                                            {/*<ErrorMessage name="vm-resize-docker-image-create-root">
                                        </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-scale-docker-image-create-root">{t('vm-scale')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-scale-docker-image-create-root"
                                                name="vm-scale-docker-image-create-root"
                                                value={vmScaleDockerImageCreateRoot}
                                                checked={vmScaleDockerImageCreateRootChecked}
                                                onChange={changeVMScaleDockerImageCreateRootChecked}
                                            />
                                            {/*<Field type="text" id="vm-scale-docker-image-create-root" name="vm-scale-docker-image-create-root" value={vmScaleDockerImageCreateRoot} onChange={changeVMScaleDockerImageCreateRoot}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-scale-docker-image-create-root')}
                                            {/*<ErrorMessage name="vm-scale-docker-image-create-root">
                                        </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDDockerImageCreateRoot.length > 0 && vmNameDockerImageCreateRoot.length > 0 && vmRootImage.length > 0 && vmCoresDockerImageCreateRoot.length > 0 && vmMemsizeDockerImageCreateRoot.length > 0 && vmDisksizeDockerImageCreateRoot.length > 0 ? false : true}>
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
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={dockerImageClone} id="form-docker-image-clone">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-docker-image-clone">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-docker-image-clone" name="vm-id-docker-image-clone" value={vmIDDockerImageClone} onChange={changeVMIDDockerImageClone}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-docker-image-clone')}
                                            {/*<ErrorMessage name="vm-id-docker-image-clone">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-new-id-docker-image-clone">{t('vm-new-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-new-id-docker-image-clone" name="vm-new-id-docker-image-clone" value={vmNewIDDockerImageClone} onChange={changeVMNewIDDockerImageClone}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-new-id-docker-image-clone')}
                                            {/*<ErrorMessage name="vm-new-id-docker-image-clone">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-name-docker-image-clone">{t('vm-name')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-name-docker-image-clone" name="vm-name-docker-image-clone" value={vmNameDockerImageClone} onChange={changeVMNameDockerImageClone}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-name-docker-image-clone')}
                                            {/*<ErrorMessage name="vm-name-docker-image-clone">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDDockerImageClone.length > 0 && vmNewIDDockerImageClone.length > 0 && vmNameDockerImageClone.length > 0 ? false : true}>
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
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={dockerImageDelete} id="form-docker-image-delete">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-docker-image-delete">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-docker-image-delete" name="vm-id-docker-image-delete" value={vmIDDockerImageDelete} onChange={changeVMIDDockerImageDelete}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-docker-image-delete')}
                                            {/*<ErrorMessage name="vm-id-docker-image-delete">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDDockerImageDelete.length > 0 ? false : true}>
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
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={dockerImageBuild} id="form-docker-image-build">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-docker-image-build">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-docker-image-build" name="vm-id-docker-image-build" value={vmIDDockerImageBuild} onChange={changeVMIDDockerImageBuild}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-docker-image-build')}
                                            {/*<ErrorMessage name="vm-id-docker-image-build">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDDockerImageBuild.length > 0 ? false : true}>
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
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={dockerContainerStart} id="form-docker-container-start">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-docker-container-start">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-docker-container-start" name="vm-id-docker-container-start" value={vmIDDockerContainerStart} onChange={changeVMIDDockerContainerStart}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-docker-container-start')}
                                            {/*<ErrorMessage name="vm-id-docker-container-start">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-env-docker-container-start">{t('vm-env')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-env-docker-container-start" name="vm-env-docker-container-start" value={vmENVDockerContainerStart} onChange={changeVMENVDockerContainerStart}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-env-docker-container-start')}
                                            {/*<ErrorMessage name="vm-env-docker-container-start">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-connect-docker-container-start">{t('vm-connect')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-kill-docker-container-start"
                                                name="vm-kill-docker-container-start"
                                                value={vmConnectDockerContainerStart}
                                                checked={vmConnectDockerContainerStartChecked}
                                                onChange={checkChangeVMConnectDockerContainerStart}
                                            />
                                            {/*<Field type="text" id="vm-connect-docker-container-start" name="vm-connect-docker-container-start" value={vmConnectDockerContainerStart} onChange={changeVMConnectDockerContainerStart}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-connect-docker-container-start')}
                                            {/*<ErrorMessage name="vm-connect-docker-container-start">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDDockerContainerStart.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                        {
                            loadingSpinnerShowSubmit ? (
                                <>
                                    {
                                        loadingSpinnerShow ? (
                                            <ReactBootstrap.Row>
                                                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <img src={LoadingSpinner} alt="Loading spinner" className="loading-spinner" />
                                                </ReactBootstrap.Col>
                                            </ReactBootstrap.Row>
                                        ) : (
                                            <></>
                                        )
                                    }
                                </>
                            ) : (
                                <></>
                            )
                        }
                        {
                            vmStartDockerSubmit ? (
                                <>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <div>
                                                URL: {viewerURL}
                                            </div>
                                        </ReactBootstrap.Col>
                                        {/*<ReactBootstrap.Col xs={12} sm={12} md={6} lg={3} xl={3}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={false}
                                                onClick={openNewTab}>
                                                {t('new-tab')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={3} xl={3}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={false}
                                                onClick={openNewWindow}>
                                                {t('new-window')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>*/}
                                    </ReactBootstrap.Row>
                                    {
                                        vmConnectDockerContainerStartChecked ? (
                                            <>
                                                <ReactBootstrap.Row>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <iframe
                                                            id="viewer-desktop"
                                                            //allowFullscreen={true}
                                                            title="DESIGN - Desktop viewer"
                                                            sandbox="allow-scripts allow-same-origin"
                                                            name="sandbox"
                                                        ></iframe>
                                                    </ReactBootstrap.Col>
                                                </ReactBootstrap.Row>
                                            </>
                                        ) : (
                                            <></>
                                        )
                                    }
                                </>
                            ) : (
                                <></>
                            )
                        }
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="docker-container-stop" title={t('vm-docker-container-stop')}>
                        <Formik
                            initialValues={{
                                id_instance: '',
                                kill: '',
                            }}
                            validationSchema={dockerContainerStopSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={dockerContainerStop} id="form-docker-container-stop">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-docker-container-stop">{t('vm-id-instance')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-docker-container-stop" name="vm-id-docker-container-stop" value={vmIDInstanceDockerContainerStop} onChange={changeVMIDInstanceDockerContainerStop}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-docker-container-stop')}
                                            {/*<ErrorMessage name="vm-id-docker-container-stop">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-kill-docker-container-stop">{t('vm-kill')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-kill-docker-container-stop"
                                                name="vm-kill-docker-container-stop"
                                                value={vmKillDockerContainerStop}
                                                checked={vmKillDockerContainerStopChecked}
                                                onChange={checkChangeVMKillDockerContainerStop}
                                            />
                                            {/*<Field type="text" id="vm-kill-docker-container-stop" name="vm-kill-docker-container-stop" value={vmKillDockerContainerStop} onChange={changeVMKillDockerContainerStop}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-kill-docker-container-stop')}
                                            {/*<ErrorMessage name="vm-kill-docker-container-stop">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDInstanceDockerContainerStop.length > 0 ? false : true}>
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
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
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
                                                value={vmPhasesDockerListCheckedUserText}
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
                                                value={vmPhasesDockerListCheckedDaasText}
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
                                                value={vmPhasesDockerListCheckedDetailsText}
                                                checked={vmPhasesDockerListCheckedDetails}
                                                onChange={changeVMPhasesDockerListCheckedDetails}
                                            />
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={false}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                        {
                            vmSubmitDockerContainerList ? (
                                <ReactBootstrap.Row id="list-status-vm">
                                    {
                                        vmDataDockerContainerList.length > 0
                                            ? (
                                                vmDataDockerContainerList.map(data => {
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
                                                    )
                                                })
                                            )
                                            : (
                                                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    {t('no-data-available')}
                                                </ReactBootstrap.Col>
                                            )
                                    }
                                </ReactBootstrap.Row>
                            ) : (
                                <></>
                            )
                        }
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="docker-container-log" title={t('vm-docker-container-log')}>
                        <Formik
                            initialValues={{
                                id: '',
                            }}
                            validationSchema={dockerContainerLogsSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={dockerContainerLogs} id="form-docker-container-logs">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-docker-container-logs">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-docker-container-logs" name="vm-id-docker-container-logs" value={vmIDDockerContainerLogs} onChange={changeVMIDDockerContainerLogs}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-docker-container-logs')}
                                            {/*<ErrorMessage name="vm-id-docker-container-logs">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDDockerContainerLogs.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                        {
                            vmDataDockerContainerLogsSubmit ? (
                                <>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            {vmDataDockerContainerLogs}
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </>
                            ) : (
                                <></>
                            )
                        }
                    </ReactBootstrap.Tab>
                </ReactBootstrap.Tabs>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <div className={requestAlert ? "show-alert" : "hide-alert"}>
                            <div className={requestAlertMessage ? "request-success-alert" : "request-fail-alert"}>
                                {requestAlertMessage ? t('request-successful') : t('request-failed')}
                            </div>
                        </div>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={4} xl={4}>
                        <div className="link-daas-design" onClick={backToDashboard}>
                            <div>
                                {t('back-link')}
                            </div>
                        </div>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
            </ReactBootstrap.Container>
        </>
    );
}

export default SettingsDocker;
