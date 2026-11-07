import { useState } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import BackLink from '../../../components/BackLink';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import {
    DEVELOPMENT,
    TEST,
    LIVE,
    USERNAME,
    PASSWORD,
    DEVELOPMENT_INTERN,
    TEST_INTERN,
    LIVE_INTERN,
    URL_SYSTEM,
    URL_SYSTEM_WITHOUT_PORT
} from "../../../constants/constants";

import Header from "../../../components/header";

import DockerExample from "../../../assets/Dockerfile.design";
import LoadingSpinner from "../../../assets/animation/loadingspinner.svg";
import { createLogger } from '../../../utils/logger';

function SettingsPhases() {
    const params = useParams(); // Example: {params.id}
    const [vmPhasesIDBaseimageCreate, setVMIDPhasesBaseimageCreate] = useState("");
    const [vmPhasesObjectTypeBaseimageCreate, setVMObjectTypePhasesBaseimageCreate] = useState("");
    const [vmPhasesNameBaseimageCreate, setVMNamePhasesBaseimageCreate] = useState("");
    const [vmPhasesRootImageBaseimageCreate, setVMRootImagePhasesBaseimageCreate] = useState("x11vnc");
    const [vmPhasesDockerfileBaseimageCreate, setVMDockerfilePhasesBaseimageCreate] = useState();
    const [vmPhasesCephPublicBaseimageCreate, setVMCephPublicPhasesBaseimageCreate] = useState("");
    const [vmPhasesCephPublicBaseimageCreateChecked, setVMCephPublicPhasesBaseimageCreateChecked] = useState(false);
    const [vmPhasesCephSharedBaseimageCreate, setVMCephSharedPhasesBaseimageCreate] = useState("");
    const [vmPhasesCephSharedBaseimageCreateChecked, setVMCephSharedPhasesBaseimageCreateChecked] = useState(false);
    const [vmPhasesCephUserBaseimageCreate, setVMCephUserPhasesBaseimageCreate] = useState("");
    const [vmPhasesCephUserBaseimageCreateChecked, setVMCephUserPhasesBaseimageCreateChecked] = useState(false);
    const [vmPhasesNameVMBaseimageCreate, setVMNameVMPhasesBaseimageCreate] = useState("");
    const [vmPhasesOSTypeBaseimageCreate, setVMOSTypePhasesBaseimageCreate] = useState("win10");
    const [vmPhasesCoresBaseimageCreate, setVMCoresPhasesBaseimageCreate] = useState("");
    const [vmPhasesMemorySizeBaseimageCreate, setVMMemorySizePhasesBaseimageCreate] = useState("");
    const [vmPhasesDiskSizeBaseimageCreate, setVMDiskSizePhasesBaseimageCreate] = useState("");
    const [vmPhasesKeyboardBaseimageCreate, setVMKeyboardPhasesBaseimageCreate] = useState("");
    const [vmPhasesCephPoolBaseimageCreate, setVMCephPoolPhasesBaseimageCreate] = useState("");
    const [vmPhasesCephPoolBaseimageCreateChecked, setVMCephPoolPhasesBaseimageCreateChecked] = useState(false);
    const [vmResolutionPhasesBaseimageCreate, setVMResolutionPhasesBaseimageCreate] = useState("");
    const [vmContypePhasesBaseimageCreate, setVMContypePhasesBaseimageCreate] = useState("sysvnc");
    const [vmResizePhasesBaseimageCreate, setVMResizePhasesBaseimageCreate] = useState("none");
    const [vmScalePhasesBaseimageCreate, setVMScalePhasesBaseimageCreate] = useState("");
    const [vmScalePhasesBaseimageCreateChecked, setVMScalePhasesBaseimageCreateChecked] = useState(false);
    const [vmPhasesIDBaseimageClone, setVMIDPhasesBaseimageClone] = useState("");
    const [vmPhasesNameBaseimageClone, setVMNamePhasesBaseimageClone] = useState("");
    const [vmPhasesNewIDBaseimageClone, setVMNewIDPhasesBaseimageClone] = useState("");
    const [vmPhasesIDBaseimageCreateFromApp, setVMIDPhasesBaseimageCreateFromApp] = useState("");
    const [vmPhasesNameBaseimageCreateFromApp, setVMNamePhasesBaseimageCreateFromApp] = useState("");
    const [vmPhasesAPPIDBaseimageCreateFromApp, setVMAPPIDPhasesBaseimageCreateFromApp] = useState("");
    const [vmPhasesENVBaseimageCreateFromApp, setVMENVPhasesBaseimageCreateFromApp] = useState("");
    const [vmRunPhasesBaseimageCreateFromApp, setVMRunPhasesBaseimageCreateFromApp] = useState("");
    const [vmRunPhasesBaseimageCreateFromAppChecked, setVMRunPhasesBaseimageCreateFromAppChecked] = useState(false);
    const [vmPhasesIDBaseimageCloneFromApp, setVMIDPhasesBaseimageCloneFromApp] = useState("");
    const [vmPhasesNameBaseimageCloneFromApp, setVMNamePhasesBaseimageCloneFromApp] = useState("");
    const [vmPhasesAPPIDBaseimageCloneFromApp, setVMAPPIDPhasesBaseimageCloneFromApp] = useState("");
    const [vmPhasesNewIDBaseimageCloneFromApp, setVMNewIDPhasesBaseimageCloneFromApp] = useState("");
    const [vmPhasesENVBaseimageCloneFromApp, setVMENVPhasesBaseimageCloneFromApp] = useState("");
    const [vmRunPhasesBaseimageCloneFromApp, setVMRunPhasesBaseimageCloneFromApp] = useState("");
    const [vmRunPhasesBaseimageCloneFromAppChecked, setVMRunPhasesBaseimageCloneFromAppChecked] = useState(false);
    const [vmPhasesIDBaseimageFinalize, setVMIDPhasesBaseimageFinalize] = useState("");
    const [vmPhasesIDBaseimageDelete, setVMIDPhasesBaseimageDelete] = useState("");
    const [vmPhasesIDBaseimageStart, setVMIDPhasesBaseimageStart] = useState("");
    const [vmPhasesConnectBaseimageStart, setVMConnectPhasesBaseimageStart] = useState("");
    const [vmPhasesConnectBaseimageStartChecked, setVMConnectPhasesBaseimageStartChecked] = useState(false);
    const [vmPhasesIDBaseimageStop, setVMIDPhasesBaseimageStop] = useState("");
    const [vmPhasesConnectBaseimageStop, setVMConnectPhasesBaseimageStop] = useState("");
    const [vmPhasesConnectBaseimageStopChecked, setVMConnectPhasesBaseimageStopChecked] = useState(false);
    const [vmPhasesIDCFGTarget, setVMPhasesIDCFGTarget] = useState("");
    const [vmPhasesENVCFGTarget, setVMPhasesENVCFGTarget] = useState("");
    const [vmPhasesTargetCFGTarget, setVMPhasesTargetCFGTarget] = useState("");
    const [vmPhasesNameCFGTarget, setVMPhasesNameCFGTarget] = useState("");
    const [vmPhasesCommandCFGTarget, setVMPhasesCommandCFGTarget] = useState("");
    const [vmPhasesArgumentsCFGTarget, setVMPhasesArgumentsCFGTarget] = useState("");
    const [vmPhasesIDCFGApplist, setVMPhasesIDCFGApplist] = useState("");
    const [vmPhasesENVCFGApplist, setVMPhasesENVCFGApplist] = useState("");
    const [vmPhasesApplistCFGApplist, setVMPhasesApplistCFGApplist] = useState("");
    const [vmPhasesNameCFGApplist, setVMPhasesNameCFGApplist] = useState("");
    const [vmPhasesCommandCFGApplist, setVMPhasesCommandCFGApplist] = useState("");
    const [vmPhasesArgumentsCFGApplist, setVMPhasesArgumentsCFGApplist] = useState("");
    const [vmPhasesIDCFGTasklist, setVMPhasesIDCFGTasklist] = useState("");
    const [vmPhasesENVCFGTasklist, setVMPhasesENVCFGTasklist] = useState("");
    const [vmPhasesTasklistCFGTasklist, setVMPhasesTasklistCFGTasklist] = useState("");
    const [vmPhasesTypeCFGTasklist, setVMPhasesTypeCFGTasklist] = useState("");
    const [vmPhasesCommandCFGTasklist, setVMPhasesCommandCFGTasklist] = useState("");
    const [vmPhasesArgumentsCFGTasklist, setVMPhasesArgumentsCFGTasklist] = useState("");
    const [vmPhasesDockerfileEnvironmentCreate, setVMPhasesDockerfileEnvironmentCreate] = useState();
    const [vmPhasesIDCFGFromApp, setVMPhasesIDCFGFromApp] = useState("");
    const [vmPhasesAPPIDCFGFromApp, setVMPhasesAPPIDCFGFromApp] = useState("");
    const [vmPhasesENVCFGFromApp, setVMPhasesENVCFGFromApp] = useState("");
    const [vmPhasesIDEnvironmentCreate, setVMIDPhasesEnvironmentCreate] = useState("");
    const [vmPhasesNameEnvironmentCreate, setVMNamePhasesEnvironmentCreate] = useState("");
    const [vmPhasesDataEnvironmentCreate, setVMPhasesDataEnvironmentCreate] = useState({});
    const [vmPhasesSubmitEnvironmentCreate, setVMPhasesSubmitEnvironmentCreate] = useState(false);
    const [vmPhasesIDEnvironmentFinalize, setVMIDPhasesEnvironmentFinalize] = useState("");
    const [vmPhasesNameEnvironmentFinalize, setVMNamePhasesEnvironmentFinalize] = useState("");
    const [vmPhasesIDEnvironmentDelete, setVMIDPhasesEnvironmentDelete] = useState("");
    const [vmPhasesNameEnvironmentDelete, setVMNamePhasesEnvironmentDelete] = useState("");
    const [vmPhasesIDEnvironmentGet, setVMIDPhasesEnvironmentGet] = useState("");
    const [vmPhasesNameEnvironmentGet, setVMNamePhasesEnvironmentGet] = useState("");
    const [vmPhasesDataEnvironmentGet, setVMPhasesDataEnvironmentGet] = useState({});
    const [vmPhasesSubmitEnvironmentGet, setVMPhasesSubmitEnvironmentGet] = useState(false);
    const [vmPhasesIDEnvironmentsGet, setVMIDPhasesEnvironmentsGet] = useState("");
    const [vmPhasesDataEnvironmentGets, setVMPhasesDataEnvironmentGets] = useState([]);
    const [vmPhasesSubmitEnvironmentGets, setVMPhasesSubmitEnvironmentGets] = useState(false);
    const [vmPhasesIDEnvironmentStart, setVMIDPhasesEnvironmentStart] = useState("");
    const [vmPhasesNameEnvironmentStart, setVMNamePhasesEnvironmentStart] = useState("");
    const [vmPhasesConnectEnvironmentStart, setVMConnectPhasesEnvironmentStart] = useState("");
    const [vmPhasesConnectEnvironmentStartChecked, setVMConnectPhasesEnvironmentStartChecked] = useState(false);
    const [vmPhasesIDEnvironmentStop, setVMIDPhasesEnvironmentStop] = useState("");
    const [vmPhasesNameEnvironmentStop, setVMNamePhasesEnvironmentStop] = useState("");
    const [vmPhasesConnectEnvironmentStop, setVMConnectPhasesEnvironmentStop] = useState("");
    const [vmPhasesConnectEnvironmentStopChecked, setVMConnectPhasesEnvironmentStopChecked] = useState(false);
    const [vmPhasesIDEnvironmentRun, setVMIDPhasesEnvironmentRun] = useState("");
    const [vmPhasesNameEnvironmentRun, setVMNamePhasesEnvironmentRun] = useState("");
    const [vmPhasesConnectEnvironmentRun, setVMConnectPhasesEnvironmentRun] = useState("");
    const [vmPhasesConnectEnvironmentRunChecked, setVMConnectPhasesEnvironmentRunChecked] = useState(false);
    const [vmPhasesIDObjectStatus, setVMPhasesIDObjectStatus] = useState("");
    const [vmPhasesObjectStatus, setVMPhasesObjectStatus] = useState({});
    const [vmPhasesObjectStatusSubmit, setVMPhasesObjectStatusSubmit] = useState(false);
    const [vmPhasesObjectList, setVMPhasesObjectList] = useState([]);
    const [vmPhasesObjectListSubmit, setVMPhasesObjectListSubmit] = useState(false);
    const [vmPhasesObjectListCheckedUserText, setVMPhasesObjectListCheckedUserText] = useState("");
    const [vmPhasesObjectListCheckedUser, setVMPhasesObjectListCheckedUser] = useState(false);
    const [vmPhasesObjectListCheckedDaasText, setVMPhasesObjectListCheckedDaasText] = useState("");
    const [vmPhasesObjectListCheckedDaas, setVMPhasesObjectListCheckedDaas] = useState(false);
    const [vmPhasesObjectListCheckedDetailsText, setVMPhasesObjectListCheckedDetailsText] = useState("");
    const [vmPhasesObjectListCheckedDetails, setVMPhasesObjectListCheckedDetails] = useState(false);
    const [vmStartBaseImageSubmit, setVMStartBaseImageSubmit] = useState(false);
    const [vmStartEnvironmentSubmit, setVMStartEnvironmentSubmit] = useState(false);
    const [vmRunEnvironmentSubmit, setVMRunEnvironmentSubmit] = useState(false);
    const [viewerURL, setViewerURL] = useState("");
    const [requestAlert, setRequestAlert] = useState(false);
    const [requestAlertMessage, setRequestAlertMessage] = useState(false);
    const [loadingSpinnerShow, setLoadingSpinnerShow] = useState(false);
    const [loadingSpinnerShowSubmit, setLoadingSpinnerShowSubmit] = useState(false);
    const { t, i18n } = useTranslation();

    const isNotDesktop = useMediaQuery({
        query: '(max-width: 1200px)'
    })

    const phasesBaseimageCreate = (event) => {
        event.preventDefault();

        const vmData = {
            id: vmPhasesIDBaseimageCreate,
            obj_type: "vm",
            name: vmPhasesNameVMBaseimageCreate,
            os_type: vmPhasesOSTypeBaseimageCreate,
            cores: vmPhasesCoresBaseimageCreate,
            memsize: vmPhasesMemorySizeBaseimageCreate,
            disksize: vmPhasesDiskSizeBaseimageCreate,
            kb: vmPhasesKeyboardBaseimageCreate,
            ceph_pool: vmPhasesCephPoolBaseimageCreateChecked ? "on" : "",
            ceph_public: vmPhasesCephPublicBaseimageCreateChecked ? "on" : "",
            ceph_shared: vmPhasesCephSharedBaseimageCreateChecked ? "on" : "",
            ceph_user: vmPhasesCephUserBaseimageCreateChecked ? "on" : "",
            viewer_resolution: vmResolutionPhasesBaseimageCreate,
            viewer_contype: vmContypePhasesBaseimageCreate,
            viewer_resize: vmResizePhasesBaseimageCreate,
            viewer_scale: vmScalePhasesBaseimageCreateChecked ? "on" : "", // vmScalePhasesBaseimageCreate,
        };

        const containerData = {
            id: vmPhasesIDBaseimageCreate,
            obj_type: "container",
            name: vmPhasesNameBaseimageCreate,
            rootimage: vmPhasesRootImageBaseimageCreate,
            cores: vmPhasesCoresBaseimageCreate,
            memsize: vmPhasesMemorySizeBaseimageCreate,
            disksize: vmPhasesDiskSizeBaseimageCreate,
            dockerfile: vmPhasesDockerfileBaseimageCreate,
            ceph_public: vmPhasesCephPublicBaseimageCreateChecked ? "on" : "",
            ceph_shared: vmPhasesCephSharedBaseimageCreateChecked ? "on" : "",
            ceph_user: vmPhasesCephUserBaseimageCreateChecked ? "on" : "",
            viewer_resolution: vmResolutionPhasesBaseimageCreate,
            viewer_contype: vmContypePhasesBaseimageCreate,
            viewer_resize: vmResizePhasesBaseimageCreate,
            viewer_scale: vmScalePhasesBaseimageCreateChecked ? "on" : "", // vmScalePhasesBaseimageCreate,
        };

        const validData = vmPhasesObjectTypeBaseimageCreate === "vm" ? vmData : containerData;

        axios.post(DEVELOPMENT + '/phases/baseimage_create', validData, {
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

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

    const phasesBaseimageClone = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/baseimage_clone', {
            id: vmPhasesIDBaseimageClone,
            newid: vmPhasesNewIDBaseimageClone,
            name: vmPhasesNameBaseimageClone,
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

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

    const phasesBaseimageCreateFromApp = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/baseimage_create_from_app', {
            id: vmPhasesIDBaseimageCreateFromApp,
            appid: vmPhasesAPPIDBaseimageCreateFromApp,
            name: vmPhasesNameBaseimageCreateFromApp,
            env: vmPhasesENVBaseimageCreateFromApp,
            run: vmRunPhasesBaseimageCreateFromAppChecked ? "on" : "",
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

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

    const phasesBaseimageCloneFromApp = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/baseimage_clone_from_app', {
            id: vmPhasesIDBaseimageCloneFromApp,
            appid: vmPhasesAPPIDBaseimageCloneFromApp,
            newid: vmPhasesNewIDBaseimageCloneFromApp,
            name: vmPhasesNameBaseimageCloneFromApp,
            env: vmPhasesENVBaseimageCloneFromApp,
            run: vmRunPhasesBaseimageCloneFromAppChecked ? "on" : "",
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

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

    const phasesBaseimageFinalize = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/baseimage_finalize', {
            id: vmPhasesIDBaseimageFinalize,
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

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

    const phasesBaseimageDelete = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/baseimage_delete', {
            id: vmPhasesIDBaseimageDelete,
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

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

    const phasesBaseimageStart = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/baseimage_start', {
            id: vmPhasesIDBaseimageStart,
            connect: vmPhasesConnectBaseimageStartChecked ? "on" : "",
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
                    setVMStartBaseImageSubmit(true);
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
                    setVMStartBaseImageSubmit(false);
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
                setVMStartBaseImageSubmit(false);
            });
    }

    const phasesBaseimageStop = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/baseimage_stop', {
            id_instance: vmPhasesIDBaseimageStop,
            force: vmPhasesConnectBaseimageStopChecked ? "on" : "",
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

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

    const phasesCFGFromApp = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/cfg_from_application', {
            id: vmPhasesIDCFGFromApp,
            appid: vmPhasesAPPIDCFGFromApp,
            env: vmPhasesENVCFGFromApp,
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

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

    const phasesCFGTasklist = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/cfg_tasklist', {
            id: vmPhasesIDCFGTasklist,
            env: vmPhasesENVCFGTasklist,
            tasklist: "[{\"type\":\"" + vmPhasesTypeCFGTasklist + "\",\"cmd\":\"" + vmPhasesCommandCFGTasklist + "\",\"args\":\"" + vmPhasesArgumentsCFGTasklist + "\"}]",
            // `{'type': ${vmPhasesTypeCFGTasklist}, 'cmd': ${vmPhasesCommandCFGTasklist}, 'args': ${vmPhasesArgumentsCFGTasklist}}`,
            type: vmPhasesTypeCFGTasklist,
            cmd: vmPhasesCommandCFGTasklist,
            args: vmPhasesArgumentsCFGTasklist,
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

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

    const phasesCFGApplist = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/cfg_applist', {
            id: vmPhasesIDCFGApplist,
            env: vmPhasesENVCFGApplist,
            applist: "[{\"name\":\"" + vmPhasesNameCFGApplist + "\",\"cmd\":\"" + vmPhasesCommandCFGApplist + "\",\"args\":\"" + vmPhasesArgumentsCFGApplist + "\"}]",
            cmd: vmPhasesCommandCFGApplist,
            args: vmPhasesArgumentsCFGApplist,
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

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

    const phasesCFGTarget = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/cfg_set_target', {
            id: vmPhasesIDCFGTarget,
            env: vmPhasesENVCFGTarget,
            target: "{\"name\":\"" + vmPhasesNameCFGTarget + "\",\"cmd\":\"" + vmPhasesCommandCFGTarget + "\",\"args\":\"" + vmPhasesArgumentsCFGTarget + "\"}",
            // `{'name': ${String(vmPhasesNameCFGTarget)}, 'cmd': ${String(vmPhasesCommandCFGTarget)}, 'args': ${String(vmPhasesArgumentsCFGTarget)}}`,
            name: vmPhasesNameCFGTarget,
            cmd: vmPhasesCommandCFGTarget,
            args: vmPhasesArgumentsCFGTarget,
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

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

    const phasesEnvironmentCreate = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/environment_create', {
            id: vmPhasesIDEnvironmentCreate,
            name: vmPhasesNameEnvironmentCreate,
            dockerfile: vmPhasesDockerfileEnvironmentCreate === undefined ? "" : vmPhasesDockerfileEnvironmentCreate,
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
                    setVMPhasesSubmitEnvironmentCreate(true);
                    setVMPhasesDataEnvironmentCreate(response.data.response_data);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(false);
                    setVMPhasesSubmitEnvironmentCreate(true);
                    setVMPhasesDataEnvironmentCreate({});

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

    const phasesEnvironmentFinalize = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/environment_finalize', {
            id: vmPhasesIDEnvironmentFinalize,
            name: vmPhasesNameEnvironmentFinalize,
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

    const phasesEnvironmentDelete = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/environment_delete', {
            id: vmPhasesIDEnvironmentDelete,
            name: vmPhasesNameEnvironmentDelete,
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

    const phasesEnvironmentGet = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/environment_get', {
            id: vmPhasesIDEnvironmentGet,
            name: vmPhasesNameEnvironmentGet,
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
                    setVMPhasesSubmitEnvironmentGet(true);
                    setVMPhasesDataEnvironmentGet(response.data.response_data);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(false);
                    setVMPhasesSubmitEnvironmentGet(true);
                    setVMPhasesDataEnvironmentGet({});

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

    const phasesEnvironmentsGet = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/environments_get', {
            id: vmPhasesIDEnvironmentsGet,
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
                    setVMPhasesSubmitEnvironmentGets(true);
                    setVMPhasesDataEnvironmentGets(response.data.response_data);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(false);
                    setVMPhasesSubmitEnvironmentGets(true);
                    setVMPhasesDataEnvironmentGets([]);

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

    const phasesEnvironmentStart = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/environment_start', {
            id: vmPhasesIDEnvironmentStart,
            name: vmPhasesNameEnvironmentStart,
            connect: vmPhasesConnectEnvironmentStartChecked ? "on" : "", // vmPhasesConnectEnvironmentStart,
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
                    setVMStartEnvironmentSubmit(true);
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
                    setVMStartEnvironmentSubmit(false);
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
                setVMStartEnvironmentSubmit(false);
            });
    }

    const phasesEnvironmentStop = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/environment_stop', {
            id: vmPhasesIDEnvironmentStop,
            name: vmPhasesNameEnvironmentStop,
            force: vmPhasesConnectEnvironmentStopChecked ? "on" : "", // vmPhasesConnectEnvironmentStop,
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

    const phasesEnvironmentRun = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/environment_run', {
            id: vmPhasesIDEnvironmentRun,
            env: vmPhasesNameEnvironmentRun,
            connect: vmPhasesConnectEnvironmentRunChecked ? "on" : "", // vmPhasesConnectEnvironmentRun,
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
                    setLoadingSpinnerShow(false);
                    setLoadingSpinnerShowSubmit(false);
                    setVMRunEnvironmentSubmit(true);
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
                    setVMRunEnvironmentSubmit(false);
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
                setVMRunEnvironmentSubmit(false);
            });
    }

    const phasesObjectStatus = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/object_status', {
            id: vmPhasesIDObjectStatus,
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
                    setVMPhasesObjectStatusSubmit(true);
                    setVMPhasesObjectStatus(response.data.response_data);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(false);
                    setVMPhasesObjectStatusSubmit(true);
                    setVMPhasesObjectStatus({});

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
                setVMPhasesObjectStatus({});

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

    const phasesObjectList = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/phases/object_list', {
            onlyuser: vmPhasesObjectListCheckedUser ? "on" : "",
            onlydaas: vmPhasesObjectListCheckedDaas ? "on" : "",
            detailed: vmPhasesObjectListCheckedDetails ? "on" : "",
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
                    setVMPhasesObjectListSubmit(true);
                    setVMPhasesObjectList(response.data.response_data);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(false);
                    setVMPhasesObjectListSubmit(true);
                    setVMPhasesObjectList([]);

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
                setVMPhasesObjectListSubmit(true);
                setVMPhasesObjectList([]);

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

    const changeVMPhasesIDObjectStatus = event => {
        setVMPhasesIDObjectStatus(event.target.value);
    };

    const changeVMPhasesIDEnvironmentCreate = event => {
        setVMIDPhasesEnvironmentCreate(event.target.value);
    };

    const changeVMPhasesNameEnvironmentCreate = event => {
        setVMNamePhasesEnvironmentCreate(event.target.value);
    };

    const changeVMPhasesDockerfileEnvironmentCreate = event => {
        if (event.target.files) {
            setVMPhasesDockerfileEnvironmentCreate(event.target.files[0]);
        }
    };

    const changeVMPhasesIDEnvironmentFinalize = event => {
        setVMIDPhasesEnvironmentFinalize(event.target.value);
    };

    const changeVMPhasesNameEnvironmentFinalize = event => {
        setVMNamePhasesEnvironmentFinalize(event.target.value);
    };

    const changeVMPhasesIDEnvironmentDelete = event => {
        setVMIDPhasesEnvironmentDelete(event.target.value);
    };

    const changeVMPhasesNameEnvironmentDelete = event => {
        setVMNamePhasesEnvironmentDelete(event.target.value);
    };

    const changeVMPhasesIDEnvironmentGet = event => {
        setVMIDPhasesEnvironmentGet(event.target.value);
    };

    const changeVMPhasesNameEnvironmentGet = event => {
        setVMNamePhasesEnvironmentGet(event.target.value);
    };

    const changeVMPhasesIDEnvironmentsGet = event => {
        setVMIDPhasesEnvironmentsGet(event.target.value);
    };

    const changeVMPhasesIDEnvironmentStart = event => {
        setVMIDPhasesEnvironmentStart(event.target.value);
    };

    const changeVMPhasesNameEnvironmentStart = event => {
        setVMNamePhasesEnvironmentStart(event.target.value);
    };

    const changeVMPhasesConnectEnvironmentStart = event => {
        //setVMConnectPhasesEnvironmentStart(event.target.value);
        setVMConnectPhasesEnvironmentStartChecked(!vmPhasesConnectEnvironmentStartChecked)

        if (vmPhasesConnectEnvironmentStartChecked) {
            setVMConnectPhasesEnvironmentStart("on");
        } else {
            setVMConnectPhasesEnvironmentStart("");
        }
    };

    const changeVMPhasesIDEnvironmentStop = event => {
        setVMIDPhasesEnvironmentStop(event.target.value);
    };

    const changeVMPhasesNameEnvironmentStop = event => {
        setVMNamePhasesEnvironmentStop(event.target.value);
    };

    const changeVMPhasesConnectEnvironmentStop = event => {
        //setVMConnectPhasesEnvironmentStop(event.target.value);
        setVMConnectPhasesEnvironmentStopChecked(!vmPhasesConnectEnvironmentStopChecked)

        if (vmPhasesConnectEnvironmentStopChecked) {
            setVMConnectPhasesEnvironmentStop("on");
        } else {
            setVMConnectPhasesEnvironmentStop("");
        }
    };

    const changeVMPhasesIDEnvironmentRun = event => {
        setVMIDPhasesEnvironmentRun(event.target.value);
    };

    const changeVMPhasesNameEnvironmentRun = event => {
        setVMNamePhasesEnvironmentRun(event.target.value);
    };

    const changeVMPhasesConnectEnvironmentRun = () => {
        setVMConnectPhasesEnvironmentRunChecked(!vmPhasesConnectEnvironmentRunChecked)

        if (vmPhasesConnectEnvironmentRunChecked) {
            setVMConnectPhasesEnvironmentRun("on");
        } else {
            setVMConnectPhasesEnvironmentRun("");
        }
    };
    const changeVMPhasesIDCFGFromApp = event => {
        setVMPhasesIDCFGFromApp(event.target.value);
    };

    const changeVMPhasesAPPIDCFGFromApp = event => {
        setVMPhasesAPPIDCFGFromApp(event.target.value);
    };

    const changeVMPhasesENVCFGFromApp = event => {
        setVMPhasesENVCFGFromApp(event.target.value);
    };

    const changeVMPhasesIDCFGTarget = event => {
        setVMPhasesIDCFGTarget(event.target.value);
    };

    const changeVMPhasesENVCFGTarget = event => {
        setVMPhasesENVCFGTarget(event.target.value);
    };

    const changeVMPhasesNameCFGTarget = event => {
        setVMPhasesNameCFGTarget(event.target.value);
    };

    const changeVMPhasesCommandCFGTarget = event => {
        setVMPhasesCommandCFGTarget(event.target.value);
    };

    const changeVMPhasesArgumentsCFGTarget = event => {
        setVMPhasesArgumentsCFGTarget(event.target.value);
    };

    const changeVMPhasesIDCFGApplist = event => {
        setVMPhasesIDCFGApplist(event.target.value);
    };

    const changeVMPhasesENVCFGApplist = event => {
        setVMPhasesENVCFGApplist(event.target.value);
    };

    const changeVMPhasesNameCFGApplist = event => {
        setVMPhasesNameCFGApplist(event.target.value);
    };

    const changeVMPhasesCommandCFGApplist = event => {
        setVMPhasesCommandCFGApplist(event.target.value);
    };

    const changeVMPhasesArgumentsCFGApplist = event => {
        setVMPhasesArgumentsCFGApplist(event.target.value);
    };

    const changeVMPhasesIDCFGTasklist = event => {
        setVMPhasesIDCFGTasklist(event.target.value);
    };

    const changeVMPhasesENVCFGTasklist = event => {
        setVMPhasesENVCFGTasklist(event.target.value);
    };

    const changeVMPhasesTypeCFGTasklist = event => {
        setVMPhasesTypeCFGTasklist(event.target.value);
    };

    const changeVMPhasesCommandCFGTasklist = event => {
        setVMPhasesCommandCFGTasklist(event.target.value);
    };

    const changeVMPhasesArgumentsCFGTasklist = event => {
        setVMPhasesArgumentsCFGTasklist(event.target.value);
    };

    const changeVMPhasesIDBaseimageStop = event => {
        setVMIDPhasesBaseimageStop(event.target.value);
    };

    const changeVMPhasesConnectBaseimageStop = event => {
        //setVMConnectPhasesBaseimageStop(event.target.value);
        setVMConnectPhasesBaseimageStopChecked(!vmPhasesConnectBaseimageStopChecked)

        if (vmPhasesConnectBaseimageStopChecked) {
            setVMConnectPhasesBaseimageStop("on");
        } else {
            setVMConnectPhasesBaseimageStop("");
        }
    };

    const changeVMPhasesIDBaseimageStart = event => {
        setVMIDPhasesBaseimageStart(event.target.value);
    };

    const changeVMPhasesConnectBaseimageStart = event => {
        //setVMConnectPhasesBaseimageStart(event.target.value);
        setVMConnectPhasesBaseimageStartChecked(!vmPhasesConnectBaseimageStartChecked)

        if (vmPhasesConnectBaseimageStartChecked) {
            setVMConnectPhasesBaseimageStart("on");
        } else {
            setVMConnectPhasesBaseimageStart("");
        }
    };

    const changeVMPhasesIDBaseimageDelete = event => {
        setVMIDPhasesBaseimageDelete(event.target.value);
    };

    const changeVMPhasesIDBaseimageFinalize = event => {
        setVMIDPhasesBaseimageFinalize(event.target.value);
    };

    const changeVMPhasesIDBaseimageClone = event => {
        setVMIDPhasesBaseimageClone(event.target.value);
    };

    const changeVMPhasesNameBaseimageClone = event => {
        setVMNamePhasesBaseimageClone(event.target.value);
    };

    const changeVMPhasesNewIDBaseimageClone = event => {
        setVMNewIDPhasesBaseimageClone(event.target.value);
    };

    const changeVMPhasesIDBaseimageCreateFromApp = event => {
        setVMIDPhasesBaseimageCreateFromApp(event.target.value);
    };

    const changeVMPhasesAPPIDBaseimageCreateFromApp = event => {
        setVMAPPIDPhasesBaseimageCreateFromApp(event.target.value);
    };

    const changeVMPhasesNameBaseimageCreateFromApp = event => {
        setVMNamePhasesBaseimageCreateFromApp(event.target.value);
    };

    const changeVMPhasesENVBaseimageCreateFromApp = event => {
        setVMENVPhasesBaseimageCreateFromApp(event.target.value);
    };

    const changeVMPhasesRunBaseimageCreateFromApp = event => {
        setVMRunPhasesBaseimageCreateFromAppChecked(!vmRunPhasesBaseimageCreateFromAppChecked)

        if (vmRunPhasesBaseimageCreateFromAppChecked) {
            setVMRunPhasesBaseimageCreateFromApp("on");
        } else {
            setVMRunPhasesBaseimageCreateFromApp("");
        }
    };

    const changeVMPhasesIDBaseimageCloneFromApp = event => {
        setVMIDPhasesBaseimageCloneFromApp(event.target.value);
    };

    const changeVMPhasesAPPIDBaseimageCloneFromApp = event => {
        setVMAPPIDPhasesBaseimageCloneFromApp(event.target.value);
    };

    const changeVMPhasesNewIDBaseimageCloneFromApp = event => {
        setVMNewIDPhasesBaseimageCloneFromApp(event.target.value);
    };

    const changeVMPhasesNameBaseimageCloneFromApp = event => {
        setVMNamePhasesBaseimageCloneFromApp(event.target.value);
    };

    const changeVMPhasesENVBaseimageCloneFromApp = event => {
        setVMENVPhasesBaseimageCloneFromApp(event.target.value);
    };

    const changeVMPhasesRunBaseimageCloneFromApp = event => {
        setVMRunPhasesBaseimageCloneFromAppChecked(!vmRunPhasesBaseimageCloneFromAppChecked)

        if (vmRunPhasesBaseimageCloneFromAppChecked) {
            setVMRunPhasesBaseimageCloneFromApp("on");
        } else {
            setVMRunPhasesBaseimageCloneFromApp("");
        }
    };

    const changeVMPhasesIDBaseimageCreate = event => {
        setVMIDPhasesBaseimageCreate(event.target.value);
    };

    const changeVMPhasesObjectTypeBaseimageCreate = event => {
        setVMObjectTypePhasesBaseimageCreate(event.target.value);
    };

    const changeVMPhasesNameBaseimageCreate = event => {
        setVMNamePhasesBaseimageCreate(event.target.value);
    };

    const changeVMPhasesRootImageBaseimageCreate = event => {
        setVMRootImagePhasesBaseimageCreate(event.target.value);
    };

    const changeVMPhasesDockerfileBaseimageCreate = event => {
        if (event.target.files) {
            setVMDockerfilePhasesBaseimageCreate(event.target.files[0]);
        }
    };

    const changeVMPhasesCephPublicBaseimageCreate = event => {
        //setVMCephPublicPhasesBaseimageCreate(event.target.value);
        setVMCephPublicPhasesBaseimageCreateChecked(!vmPhasesCephPublicBaseimageCreateChecked)

        if (vmPhasesCephPublicBaseimageCreateChecked) {
            setVMCephPublicPhasesBaseimageCreate("on");
        } else {
            setVMCephPublicPhasesBaseimageCreate("");
        }
    };

    const changeVMPhasesCephSharedBaseimageCreate = event => {
        //setVMCephSharedPhasesBaseimageCreate(event.target.value);
        setVMCephSharedPhasesBaseimageCreateChecked(!vmPhasesCephSharedBaseimageCreateChecked)

        if (vmPhasesCephSharedBaseimageCreateChecked) {
            setVMCephSharedPhasesBaseimageCreate("on");
        } else {
            setVMCephSharedPhasesBaseimageCreate("");
        }
    };

    const changeVMPhasesCephUserBaseimageCreate = event => {
        //setVMCephUserPhasesBaseimageCreate(event.target.value);
        setVMCephUserPhasesBaseimageCreateChecked(!vmPhasesCephUserBaseimageCreateChecked)

        if (vmPhasesCephUserBaseimageCreateChecked) {
            setVMCephUserPhasesBaseimageCreate("on");
        } else {
            setVMCephUserPhasesBaseimageCreate("");
        }
    };

    const changeVMPhasesNameVMBaseimageCreate = event => {
        setVMNameVMPhasesBaseimageCreate(event.target.value);
    };

    const changeVMPhasesOSTypeBaseimageCreate = event => {
        setVMOSTypePhasesBaseimageCreate(event.target.value);
    };

    const changeVMPhasesCoresBaseimageCreate = event => {
        setVMCoresPhasesBaseimageCreate(event.target.value);
    };

    const changeVMPhasesMemorySizeBaseimageCreate = event => {
        setVMMemorySizePhasesBaseimageCreate(event.target.value);
    };

    const changeVMPhasesDiskSizeBaseimageCreate = event => {
        setVMDiskSizePhasesBaseimageCreate(event.target.value);
    };

    const changeVMPhasesKeyboardBaseimageCreate = event => {
        setVMKeyboardPhasesBaseimageCreate(event.target.value);
    };

    const changeVMPhasesCephPoolBaseimageCreate = event => {
        //setVMCephPoolPhasesBaseimageCreate(event.target.value);
        setVMCephPoolPhasesBaseimageCreateChecked(!vmPhasesCephPoolBaseimageCreateChecked)

        if (vmPhasesCephPoolBaseimageCreateChecked) {
            setVMCephPoolPhasesBaseimageCreate("on");
        } else {
            setVMCephPoolPhasesBaseimageCreate("");
        }
    };

    const changeVMResolutionPhasesBaseimageCreate = event => {
        setVMResolutionPhasesBaseimageCreate(event.target.value);
    };
    const changeVMContypePhasesBaseimageCreate = event => {
        setVMContypePhasesBaseimageCreate(event.target.value);
    };
    const changeVMResizePhasesBaseimageCreate = event => {
        setVMResizePhasesBaseimageCreate(event.target.value);
    };
    const changeVMScalePhasesBaseimageCreate = event => {
        setVMScalePhasesBaseimageCreate(event.target.value);
    };
    const changeVMScalePhasesBaseimageCreateChecked = () => {
        setVMScalePhasesBaseimageCreateChecked(!vmScalePhasesBaseimageCreateChecked)

        if (vmScalePhasesBaseimageCreateChecked) {
            setVMScalePhasesBaseimageCreate("on");
        } else {
            setVMScalePhasesBaseimageCreate("");
        }
    };

    const changeVMPhasesObjectListCheckedUser = event => {
        setVMPhasesObjectListCheckedUser(!vmPhasesObjectListCheckedUser)

        if (vmPhasesObjectListCheckedUser) {
            setVMPhasesObjectListCheckedUserText("on");
        } else {
            setVMPhasesObjectListCheckedUserText("");
        }
    };

    const changeVMPhasesObjectListCheckedDaas = event => {
        setVMPhasesObjectListCheckedDaas(!vmPhasesObjectListCheckedDaas)

        if (vmPhasesObjectListCheckedDaas) {
            setVMPhasesObjectListCheckedDaasText("on");
        } else {
            setVMPhasesObjectListCheckedDaasText("");
        }
    };

    const changeVMPhasesObjectListCheckedDetails = event => {
        setVMPhasesObjectListCheckedDetails(!vmPhasesObjectListCheckedDetails)

        if (vmPhasesObjectListCheckedDetails) {
            setVMPhasesObjectListCheckedDetailsText("on");
        } else {
            setVMPhasesObjectListCheckedDetailsText("");
        }
    };

    const openNewTab = () => {
        window.open({viewerURL}, "_blank").focus();
    };

    const openNewWindow = () => {
        window.open({viewerURL}, "DESIGN - Viewer", "fullscreen=yes");
    };

    const backToDashboard = () => {
        window.location.href = "/dashboard/admin";
    };

    const phasesObjectStatusSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
    });

    const phasesObjectListSchema = Yup.object().shape({});

    const phasesEnvironmentCreateSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        name: Yup.string()
            .required('Name invalid'),
        dockerfile: Yup.string()
            .required('Dockerfile invalid'),
    });

    const phasesEnvironmentFinalizeSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        name: Yup.string()
            .required('Name invalid'),
    });

    const phasesEnvironmentDeleteSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        name: Yup.string()
            .required('Name invalid'),
    });

    const phasesEnvironmentGetSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        name: Yup.string()
            .required('Name invalid'),
    });

    const phasesEnvironmentsGetSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
    });

    const phasesEnvironmentStartSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        name: Yup.string()
            .required('Name invalid'),
        connect: Yup.string()
            .required('Connection invalid'),
    });

    const phasesEnvironmentStopSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        name: Yup.string()
            .required('Name invalid'),
        force: Yup.string()
            .required('Connection invalid'),
    });

    const phasesEnvironmentRunSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        env: Yup.string()
            .required('Name invalid'),
        connect: Yup.string()
            .required('Connection invalid'),
    });

    const phasesCFGFromAppSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        appid: Yup.string()
            .required('App ID invalid'),
        env: Yup.string()
            .required('Environment invalid'),
    });

    const phasesCFGTargetSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        env: Yup.string()
            .required('Name invalid'),
        target: Yup.string()
            .required('Target invalid'),
        name: Yup.string()
            .required('Name invalid'),
        cmd: Yup.string()
            .required('Command invalid'),
        args: Yup.string()
            .required('Arguments invalid'),
    });

    const phasesCFGApplistSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        env: Yup.string()
            .required('Name invalid'),
        applist: Yup.string()
            .required('Application list invalid'),
        cmd: Yup.string()
            .required('Command invalid'),
        args: Yup.string()
            .required('Arguments invalid'),
    });

    const phasesCFGTasklistSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        env: Yup.string()
            .required('Environment invalid'),
        tasklist: Yup.string()
            .required('Application list invalid'),
        type: Yup.string()
            .required('Type invalid'),
        cmd: Yup.string()
            .required('Command invalid'),
        args: Yup.string()
            .required('Arguments invalid'),
    });

    const phasesBaseimageStopSchema = Yup.object().shape({
        id_instance: Yup.string()
            .required('ID invalid'),
        /*force: Yup.string()
            .required('Force invalid'),*/
    });

    const phasesBaseimageStartSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        connect: Yup.string()
            .required('Connection invalid'),
    });

    const phasesBaseimageDeleteSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
    });

    const phasesBaseimageFinalizeSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
    });

    const phasesBaseimageCloneSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        newid: Yup.string()
            .required('New ID invalid'),
        name: Yup.string()
            .required('Name invalid'),
    });

    const phasesBaseimageCreateFromAppSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        appid: Yup.string()
            .required('App ID invalid'),
        env: Yup.string()
            .required('Environment invalid'),
        name: Yup.string()
            .required('Name invalid'),
        run: Yup.string()
            .required("Run invalid"),
    });

    const phasesBaseimageCloneFromAppSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        appid: Yup.string()
            .required('App ID invalid'),
        newid: Yup.string()
            .required('New ID invalid'),
        env: Yup.string()
            .required('Environment invalid'),
        name: Yup.string()
            .required('Name invalid'),
        run: Yup.string()
            .required("run invalid"),
    });

    const phasesBaseimageCreateContainerSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        obj_type: Yup.string()
            .required('Object type invalid'),
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
        dockerfile: Yup.mixed()
            .required('Dockerfile invalid'),
        ceph_public: Yup.string()
            .required('CEPH public invalid'),
        ceph_shared: Yup.string()
            .required('CEPH shared invalid'),
        ceph_user: Yup.string()
            .required('CEPH user invalid'),
        viewer_resolution: Yup.string()
            .required('Resolution invalid'),
        viewer_contype: Yup.string()
            .required('Contype invalid'),
        viewer_resize: Yup.string()
            .required('Resize invalid'),
        viewer_scale: Yup.string()
            .required('Scale invalid'),
    });

    const phasesBaseimageCreateVMSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        obj_type: Yup.string()
            .required('Object type invalid'),
        name: Yup.string()
            .required('Name invalid'),
        os_type: Yup.string()
            .required('OS type invalid'),
        cores: Yup.string()
            .required('Cores invalid'),
        memsize: Yup.string()
            .required('Memory size invalid'),
        disksize: Yup.string()
            .required('Disk size invalid'),
        kb: Yup.string()
            .required('Keyboard language invalid'),
        ceph_pool: Yup.string()
            .required('CEPH pool invalid'),
    });

    const vmDataSchema = {
        id: "",
        obj_type: "",
        name: "",
        os_type: "",
        cores: "",
        memsize: "",
        disksize: "",
        kb: "",
        ceph_pool: "",
        ceph_public: "",
        ceph_shared: "",
        ceph_user: "",
        viewer_contype: "",
        viewer_resolution: "",
        viewer_resize: "",
        viewer_scale: "",
    }

    const containerDataSchema = {
        id: "",
        obj_type: "",
        name: "",
        rootimage: "",
        cores: "",
        memsize: "",
        disksize: "",
        dockerfile: "",
        ceph_public: "",
        ceph_shared: "",
        ceph_user: "",
        viewer_contype: "",
        viewer_resolution: "",
        viewer_resize: "",
        viewer_scale: "",
    }

    return (
        <>
            <Header/>
            <ReactBootstrap.Container id="settingsOverviewPhases" fluid={true}>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                        <div>
                            <h2>
                                {t('vm-phases')}
                            </h2>
                        </div>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Tabs defaultActiveKey="phases-baseimage-create" id="all-config-phases">
                    <ReactBootstrap.Tab eventKey="phases-baseimage-create" title={t('vm-phases-baseimage-create')}>
                        <Formik
                            initialValues={
                                vmPhasesObjectTypeBaseimageCreate === "vm"
                                ? vmDataSchema
                                : containerDataSchema
                            }
                            validationSchema={vmPhasesObjectTypeBaseimageCreate === "vm" ? phasesBaseimageCreateVMSchema : phasesBaseimageCreateContainerSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesBaseimageCreate} id="form-phases-baseimage-create">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-baseimage-create">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-baseimage-create" name="vm-id-phases-baseimage-create" value={vmPhasesIDBaseimageCreate} onChange={changeVMPhasesIDBaseimageCreate}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-baseimage-create')}
                                            {/*<ErrorMessage name="vm-id-phases-baseimage-create">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-type-phases-baseimage-create">{t('vm-object-type')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <select id="vm-type-phases-baseimage-create" name="vm-type-phases-baseimage-create" value={vmPhasesObjectTypeBaseimageCreate} onChange={changeVMPhasesObjectTypeBaseimageCreate}>
                                                <option value=""></option>
                                                <option value="vm">VM</option>
                                                <option value="container">Container</option>
                                            </select>
                                            {/*<Field type="text" id="vm-type-phases-baseimage-create" name="vm-type-phases-baseimage-create" value={vmPhasesObjectTypeBaseimageCreate} onChange={changeVMPhasesObjectTypeBaseimageCreate}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-type-phases-baseimage-create')}
                                            {/*<ErrorMessage name="vm-type-phases-baseimage-create">
                                            </ErrorMessage>*/}
                                        </div>
                                        {
                                            vmPhasesObjectTypeBaseimageCreate === "vm" ? (
                                                <>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-name-vm-phases-baseimage-create">{t('vm-name')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <Field type="text" id="vm-name-vm-phases-baseimage-create" name="vm-name-vm-phases-baseimage-create" value={vmPhasesNameVMBaseimageCreate} onChange={changeVMPhasesNameVMBaseimageCreate}/>
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-name-vm-phases-baseimage-create')}
                                                        {/*<ErrorMessage name="vm-name-vm-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-os-type-phases-baseimage-create">{t('vm-os-type')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <select id="vm-os-type-phases-baseimage-create" name="vm-os-type-phases-baseimage-create" value={vmPhasesOSTypeBaseimageCreate} onChange={changeVMPhasesOSTypeBaseimageCreate}>
                                                            <option value="win10">Windows 10</option>
                                                            <option value="win11">Windows 11</option>
                                                            <option value="l26">Linux - Debian 12</option>
                                                        </select>
                                                        {/*<Field type="text" id="vm-os-type-phases-baseimage-create" name="vm-os-type-phases-baseimage-create" value={vmPhasesOSTypeBaseimageCreate} onChange={changeVMPhasesOSTypeBaseimageCreate}/>*/}
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-os-type-phases-baseimage-create')}
                                                        {/*<ErrorMessage name="vm-os-type-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-cores-phases-baseimage-create">{t('vm-cores')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <Field type="text" id="vm-cores-phases-baseimage-create" name="vm-cores-phases-baseimage-create" value={vmPhasesCoresBaseimageCreate} onChange={changeVMPhasesCoresBaseimageCreate}/>
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-cores-phases-baseimage-create')}
                                                        {/*<ErrorMessage name="vm-cores-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-memory-size-phases-baseimage-create">{t('vm-memory-size')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <Field type="text" id="vm-memory-size-phases-baseimage-create" name="vm-memory-size-phases-baseimage-create" value={vmPhasesMemorySizeBaseimageCreate} onChange={changeVMPhasesMemorySizeBaseimageCreate}/>
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-memory-size-phases-baseimage-create')}
                                                        {/*<ErrorMessage name="vm-memory-size-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-disk-size-phases-baseimage-create">{t('vm-disk-size')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <Field type="text" id="vm-disk-size-phases-baseimage-create" name="vm-disk-size-phases-baseimage-create" value={vmPhasesDiskSizeBaseimageCreate} onChange={changeVMPhasesDiskSizeBaseimageCreate}/>
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-disk-size-phases-baseimage-create')}
                                                        {/*<ErrorMessage name="vm-disk-size-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-keyboard-language-phases-baseimage-create">{t('vm-keyboard-language')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <Field type="text" id="vm-keyboard-language-phases-baseimage-create" name="vm-keyboard-language-phases-baseimage-create" value={vmPhasesKeyboardBaseimageCreate} onChange={changeVMPhasesKeyboardBaseimageCreate}/>
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-keyboard-language-phases-baseimage-create')}
                                                        {/*<ErrorMessage name="vm-keyboard-language-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-ceph-pool-phases-baseimage-create">{t('vm-ceph-pool')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <input
                                                            type="checkbox"
                                                            id="vm-ceph-pool-phases-baseimage-create"
                                                            name="vm-ceph-pupoolblic-phases-baseimage-create"
                                                            value={vmPhasesCephPoolBaseimageCreate}
                                                            checked={vmPhasesCephPoolBaseimageCreateChecked}
                                                            onChange={changeVMPhasesCephPoolBaseimageCreate}
                                                        />
                                                        {/*<Field type="text" id="vm-ceph-pool-phases-baseimage-create" name="vm-ceph-pool-baseimage-environment-create" value={vmPhasesCephPoolBaseimageCreate} onChange={changeVMPhasesCephPoolBaseimageCreate}/>*/}
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-ceph-pool-phases-environment-create')}
                                                        {/*<ErrorMessage name="vm-ceph-pool-phases-environment-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-ceph-public-phases-baseimage-create">{t('vm-ceph-public')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <input
                                                            type="checkbox"
                                                            id="vm-ceph-public-phases-baseimage-create"
                                                            name="vm-ceph-public-phases-baseimage-create"
                                                            value={vmPhasesCephPublicBaseimageCreate}
                                                            checked={vmPhasesCephPublicBaseimageCreateChecked}
                                                            onChange={changeVMPhasesCephPublicBaseimageCreate}
                                                        />
                                                        {/*<Field type="text" id="vm-ceph-public-phases-baseimage-create" name="vm-ceph-public-baseimage-environment-create" value={vmPhasesCephPublicBaseimageCreate} onChange={changeVMPhasesCephPublicBaseimageCreate}/>*/}
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-ceph-public-phases-environment-create')}
                                                        {/*<ErrorMessage name="vm-ceph-public-phases-environment-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-ceph-shared-phases-baseimage-create">{t('vm-ceph-shared')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <input
                                                            type="checkbox"
                                                            id="vm-ceph-shared-phases-baseimage-create"
                                                            name="vm-ceph-shared-phases-baseimage-create"
                                                            value={vmPhasesCephSharedBaseimageCreate}
                                                            checked={vmPhasesCephSharedBaseimageCreateChecked}
                                                            onChange={changeVMPhasesCephSharedBaseimageCreate}
                                                        />
                                                        {/*<Field type="text" id="vm-ceph-shared-phases-baseimage-create" name="vm-ceph-shared-baseimage-environment-create" value={vmPhasesCephSharedBaseimageCreate} onChange={changeVMPhasesCephSharedBaseimageCreate}/>*/}
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-ceph-shared-phases-environment-create')}
                                                        {/*<ErrorMessage name="vm-ceph-shared-phases-environment-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-ceph-user-phases-baseimage-create">{t('vm-ceph-user')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <input
                                                            type="checkbox"
                                                            id="vm-ceph-user-phases-baseimage-create"
                                                            name="vm-ceph-user-phases-baseimage-create"
                                                            value={vmPhasesCephUserBaseimageCreate}
                                                            checked={vmPhasesCephUserBaseimageCreateChecked}
                                                            onChange={changeVMPhasesCephUserBaseimageCreate}
                                                        />
                                                        {/*<Field type="text" id="vm-ceph-user-phases-baseimage-create" name="vm-ceph-user-baseimage-environment-create" value={vmPhasesCephUserBaseimageCreate} onChange={changeVMPhasesCephUserBaseimageCreate}/>*/}
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-ceph-user-phases-environment-create')}
                                                        {/*<ErrorMessage name="vm-ceph-user-phases-environment-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-resolution-phases-environment-create">{t('vm-resolution')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <Field type="text" id="vm-resolution-phases-environment-create" name="vm-resolution-phases-environment-create" value={vmResolutionPhasesBaseimageCreate} onChange={changeVMResolutionPhasesBaseimageCreate}/>
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-resolution-phases-environment-create')}
                                                        {/*<ErrorMessage name="vm-resolution-phases-environment-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-contype-phases-environment-create">{t('vm-contype')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <select id="vm-contype-phases-environment-create" name="vm-contype-phases-environment-create" value={vmContypePhasesBaseimageCreate} onChange={changeVMContypePhasesBaseimageCreate}>
                                                            <option value="sysvnc">System VNC (Proxmox default)</option>
                                                            <option value="instvnc">Instance VNC (Docker default)</option>
                                                            <option value="rdp">RDP (Windows only)</option>
                                                        </select>
                                                        {/*<Field type="text" id="vm-contype-phases-environment-create" name="vm-contype-phases-environment-create" value={vmContypePhasesBaseimageCreate} onChange={changeVMContypePhasesBaseimageCreate}/>*/}
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-contype-phases-environment-create')}
                                                        {/*<ErrorMessage name="vm-contype-phases-environment-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-resize-phases-environment-create">{t('vm-resize')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <select id="vm-resize-phases-environment-create" name="vm-resize-phases-environment-create" value={vmResizePhasesBaseimageCreate} onChange={changeVMResizePhasesBaseimageCreate}>
                                                            <option value="none">None (Do nothing)</option>
                                                            <option value="semi">Semi (Allow instance)</option>
                                                            <option value="full">Full (Enforce JS)</option>
                                                        </select>
                                                        {/*<Field type="text" id="vm-resize-phases-environment-create" name="vm-resize-phases-environment-create" value={vmResizePhasesBaseimageCreate} onChange={changeVMResizePhasesBaseimageCreate}/>*/}
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-resize-phases-environment-create')}
                                                        {/*<ErrorMessage name="vm-resize-phases-environment-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-scale-phases-environment-create">{t('vm-scale')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <input
                                                            type="checkbox"
                                                            id="vm-scale-phases-environment-create"
                                                            name="vm-scale-phases-environment-create"
                                                            value={vmScalePhasesBaseimageCreate}
                                                            checked={vmScalePhasesBaseimageCreateChecked}
                                                            onChange={changeVMScalePhasesBaseimageCreateChecked}
                                                        />
                                                        {/*<Field type="text" id="vm-scale-phases-environment-create" name="vm-scale-phases-environment-create" value={vmScalePhasesBaseimageCreate} onChange={changeVMScalePhasesBaseimageCreate}/>*/}
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-scale-phases-environment-create')}
                                                        {/*<ErrorMessage name="vm-scale-phases-environment-create">
                                                         </ErrorMessage>*/}
                                                    </div>
                                                </>
                                            ) : vmPhasesObjectTypeBaseimageCreate === "container" ? (
                                                <>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-name-phases-baseimage-create">{t('vm-name')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <Field type="text" id="vm-name-phases-baseimage-create" name="vm-name-phases-baseimage-create" value={vmPhasesNameBaseimageCreate} onChange={changeVMPhasesNameBaseimageCreate}/>
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-name-phases-baseimage-create')}
                                                        {/*<ErrorMessage name="vm-name-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-root-image-phases-baseimage-create">{t('vm-root-image')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <select id="vm-root-image-phases-baseimage-create" name="vm-root-image-phases-baseimage-create" value={vmPhasesRootImageBaseimageCreate} onChange={changeVMPhasesRootImageBaseimageCreate}>
                                                            <option value="x11vnc">x11vnc</option>
                                                            <option value="wine">wine</option>
                                                        </select>
                                                        {/*<Field type="text" id="vm-root-image-phases-baseimage-create" name="vm-root-image-phases-baseimage-create" value={vmPhasesRootImageBaseimageCreate} onChange={changeVMPhasesRootImageBaseimageCreate}/>*/}
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-root-image-phases-baseimage-create')}
                                                        {/*<ErrorMessage name="vm-root-image-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-cores-phases-baseimage-create">{t('vm-cores')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <Field type="text" id="vm-cores-phases-baseimage-create" name="vm-cores-phases-baseimage-create" value={vmPhasesCoresBaseimageCreate} onChange={changeVMPhasesCoresBaseimageCreate}/>
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-cores-phases-baseimage-create')}
                                                        {/*<ErrorMessage name="vm-cores-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-memory-size-phases-baseimage-create">{t('vm-memory-size')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <Field type="text" id="vm-memory-size-phases-baseimage-create" name="vm-memory-size-phases-baseimage-create" value={vmPhasesMemorySizeBaseimageCreate} onChange={changeVMPhasesMemorySizeBaseimageCreate}/>
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-memory-size-phases-baseimage-create')}
                                                        {/*<ErrorMessage name="vm-memory-size-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-disk-size-phases-baseimage-create">{t('vm-disk-size')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <Field type="text" id="vm-disk-size-phases-baseimage-create" name="vm-disk-size-phases-baseimage-create" value={vmPhasesDiskSizeBaseimageCreate} onChange={changeVMPhasesDiskSizeBaseimageCreate}/>
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-disk-size-phases-baseimage-create')}
                                                        {/*<ErrorMessage name="vm-disk-size-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-dockerfile-phases-baseimage-create">{t('vm-dockerfile')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <input type="file" id="vm-dockerfile-phases-baseimage-create" name="vm-dockerfile-phases-baseimage-create" onChange={changeVMPhasesDockerfileBaseimageCreate}/>
                                                        {/*<Field type="text" id="vm-dockerfile-phases-baseimage-create" name="vm-dockerfile-phases-baseimage-create" value={vmPhasesDockerfileBaseimageCreate} onChange={changeVMPhasesDockerfileBaseimageCreate}/>*/}
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-dockerfile-phases-baseimage-create')}
                                                        {/*<ErrorMessage name="vm-dockerfile-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-ceph-public-phases-baseimage-create">{t('vm-ceph-public')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <input
                                                            type="checkbox"
                                                            id="vm-ceph-public-phases-baseimage-create"
                                                            name="vm-ceph-public-phases-baseimage-create"
                                                            value={vmPhasesCephPublicBaseimageCreate}
                                                            checked={vmPhasesCephPublicBaseimageCreateChecked}
                                                            onChange={changeVMPhasesCephPublicBaseimageCreate}
                                                        />
                                                        {/*<Field type="text" id="vm-ceph-public-phases-baseimage-create" name="vm-ceph-public-baseimage-environment-create" value={vmPhasesCephPublicBaseimageCreate} onChange={changeVMPhasesCephPublicBaseimageCreate}/>*/}
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-ceph-public-phases-environment-create')}
                                                        {/*<ErrorMessage name="vm-ceph-public-phases-environment-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-ceph-shared-phases-baseimage-create">{t('vm-ceph-shared')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <input
                                                            type="checkbox"
                                                            id="vm-ceph-shared-phases-baseimage-create"
                                                            name="vm-ceph-shared-phases-baseimage-create"
                                                            value={vmPhasesCephSharedBaseimageCreate}
                                                            checked={vmPhasesCephSharedBaseimageCreateChecked}
                                                            onChange={changeVMPhasesCephSharedBaseimageCreate}
                                                        />
                                                        {/*<Field type="text" id="vm-ceph-shared-phases-baseimage-create" name="vm-ceph-shared-baseimage-environment-create" value={vmPhasesCephSharedBaseimageCreate} onChange={changeVMPhasesCephSharedBaseimageCreate}/>*/}
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-ceph-shared-phases-environment-create')}
                                                        {/*<ErrorMessage name="vm-ceph-shared-phases-environment-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-ceph-user-phases-baseimage-create">{t('vm-ceph-user')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <input
                                                            type="checkbox"
                                                            id="vm-ceph-user-phases-baseimage-create"
                                                            name="vm-ceph-user-phases-baseimage-create"
                                                            value={vmPhasesCephUserBaseimageCreate}
                                                            checked={vmPhasesCephUserBaseimageCreateChecked}
                                                            onChange={changeVMPhasesCephUserBaseimageCreate}
                                                        />
                                                        {/*<Field type="text" id="vm-ceph-user-phases-baseimage-create" name="vm-ceph-user-baseimage-environment-create" value={vmPhasesCephUserBaseimageCreate} onChange={changeVMPhasesCephUserBaseimageCreate}/>*/}
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-ceph-user-phases-environment-create')}
                                                        {/*<ErrorMessage name="vm-ceph-user-phases-environment-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-resolution-phases-environment-create">{t('vm-resolution')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <Field type="text" id="vm-resolution-phases-environment-create" name="vm-resolution-phases-environment-create" value={vmResolutionPhasesBaseimageCreate} onChange={changeVMResolutionPhasesBaseimageCreate}/>
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-resolution-phases-environment-create')}
                                                        {/*<ErrorMessage name="vm-resolution-phases-environment-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-contype-phases-environment-create">{t('vm-contype')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <select id="vm-contype-phases-environment-create" name="vm-contype-phases-environment-create" value={vmContypePhasesBaseimageCreate} onChange={changeVMContypePhasesBaseimageCreate}>
                                                            <option value="sysvnc">System VNC (Proxmox default)</option>
                                                            <option value="instvnc">Instance VNC (Docker default)</option>
                                                            <option value="rdp">RDP (Windows only)</option>
                                                        </select>
                                                        {/*<Field type="text" id="vm-contype-phases-environment-create" name="vm-contype-phases-environment-create" value={vmContypePhasesBaseimageCreate} onChange={changeVMContypePhasesBaseimageCreate}/>*/}
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-contype-phases-environment-create')}
                                                        {/*<ErrorMessage name="vm-contype-phases-environment-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-resize-phases-environment-create">{t('vm-resize')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <select id="vm-resize-phases-environment-create" name="vm-resize-phases-environment-create" value={vmResizePhasesBaseimageCreate} onChange={changeVMResizePhasesBaseimageCreate}>
                                                            <option value="none">None (Do nothing)</option>
                                                            <option value="semi">Semi (Allow instance)</option>
                                                            <option value="full">Full (Enforce JS)</option>
                                                        </select>
                                                        {/*<Field type="text" id="vm-resize-phases-environment-create" name="vm-resize-phases-environment-create" value={vmResizePhasesBaseimageCreate} onChange={changeVMResizePhasesBaseimageCreate}/>*/}
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-resize-phases-environment-create')}
                                                        {/*<ErrorMessage name="vm-resize-phases-environment-create">
                                                        </ErrorMessage>*/}
                                                    </div>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <label htmlFor="vm-scale-phases-environment-create">{t('vm-scale')}</label>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        <input
                                                            type="checkbox"
                                                            id="vm-scale-phases-environment-create"
                                                            name="vm-scale-phases-environment-create"
                                                            value={vmScalePhasesBaseimageCreate}
                                                            checked={vmScalePhasesBaseimageCreateChecked}
                                                            onChange={changeVMScalePhasesBaseimageCreateChecked}
                                                        />
                                                        {/*<Field type="text" id="vm-scale-phases-environment-create" name="vm-scale-phases-environment-create" value={vmScalePhasesBaseimageCreate} onChange={changeVMScalePhasesBaseimageCreate}/>*/}
                                                    </ReactBootstrap.Col>
                                                    <div className="error-text">
                                                        {t('error-vm-scale-phases-environment-create')}
                                                        {/*<ErrorMessage name="vm-scale-phases-environment-create">
                                                         </ErrorMessage>*/}
                                                    </div>
                                                </>
                                            ) : (
                                                <></>
                                            )
                                        }
                                    </ReactBootstrap.Row>
                                    {
                                        vmPhasesObjectTypeBaseimageCreate === "vm" ? (
                                            <ReactBootstrap.Row>
                                                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <ReactBootstrap.Button
                                                        type="submit"
                                                        variant="primary"
                                                        id="submit"
                                                        disabled={vmPhasesIDBaseimageCreate.length > 0 && vmPhasesObjectTypeBaseimageCreate !== "" && vmPhasesMemorySizeBaseimageCreate.length > 0 && vmPhasesDiskSizeBaseimageCreate.length > 0 && ((/*vmPhasesDockerfileBaseimageCreate &&*/ vmPhasesNameBaseimageCreate.length > 0 && vmPhasesRootImageBaseimageCreate.length > 0) || (vmPhasesNameVMBaseimageCreate.length > 0 && vmPhasesOSTypeBaseimageCreate.length > 0 && vmPhasesCoresBaseimageCreate.length > 0 && vmPhasesMemorySizeBaseimageCreate.length > 0 && vmPhasesDiskSizeBaseimageCreate.length > 0 && vmPhasesKeyboardBaseimageCreate.length > 0)) ? false : true}>
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
                                                        disabled={vmPhasesIDBaseimageCreate.length > 0 && vmPhasesObjectTypeBaseimageCreate !== "" && vmPhasesCoresBaseimageCreate.length > 0 && vmPhasesMemorySizeBaseimageCreate.length > 0 && vmPhasesDiskSizeBaseimageCreate.length > 0 && ((/*vmPhasesDockerfileBaseimageCreate &&*/ vmPhasesNameBaseimageCreate.length > 0 && vmPhasesRootImageBaseimageCreate.length > 0) || (vmPhasesNameVMBaseimageCreate.length > 0 && vmPhasesOSTypeBaseimageCreate.length > 0 && vmPhasesKeyboardBaseimageCreate.length > 0)) ? false : true}>
                                                        {t('submit')}
                                                    </ReactBootstrap.Button>
                                                </ReactBootstrap.Col>
                                            </ReactBootstrap.Row>
                                        )
                                    }
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="phases-baseimage-clone" title={t('vm-phases-baseimage-clone')}>
                        <Formik
                            initialValues={{
                                id: "",
                                newid: "",
                                name: "",
                            }}
                            validationSchema={phasesBaseimageCloneSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesBaseimageClone} id="form-phases-baseimage-clone">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-baseimage-clone">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-baseimage-clone" name="vm-id-phases-baseimage-clone" value={vmPhasesIDBaseimageClone} onChange={changeVMPhasesIDBaseimageClone}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-baseimage-clone')}
                                            {/*<ErrorMessage name="vm-id-phases-baseimage-clone">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-newid-phases-baseimage-clone">{t('vm-new-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-newid-phases-baseimage-clone" name="vm-newid-phases-baseimage-clone" value={vmPhasesNewIDBaseimageClone} onChange={changeVMPhasesNewIDBaseimageClone}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-newid-phases-baseimage-clone')}
                                            {/*<ErrorMessage name="vm-newid-phases-baseimage-clone">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-name-phases-baseimage-clone">{t('vm-name')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-name-phases-baseimage-clone" name="vm-name-phases-baseimage-clone" value={vmPhasesNameBaseimageClone} onChange={changeVMPhasesNameBaseimageClone}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-name-phases-baseimage-clone')}
                                            {/*<ErrorMessage name="vm-name-phases-baseimage-clone">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmPhasesIDBaseimageClone.length > 0 && vmPhasesNewIDBaseimageClone.length > 0 && vmPhasesNameBaseimageClone.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="phases-baseimage-create-from-app" title={t('vm-phases-baseimage-create-from-app')}>
                        <Formik
                            initialValues={{
                                id: "",
                                appid: "",
                                env: "",
                                name: "",
                                run: "",
                            }}
                            validationSchema={phasesBaseimageCreateFromAppSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesBaseimageCreateFromApp} id="form-phases-baseimage-create-from-app">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-baseimage-create-from-app">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-baseimage-create-from-app" name="vm-id-phases-baseimage-create-from-app" value={vmPhasesIDBaseimageCreateFromApp} onChange={changeVMPhasesIDBaseimageCreateFromApp}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-baseimage-create-from-app')}
                                            {/*<ErrorMessage name="vm-id-phases-baseimage-create-from-app">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-app-id-phases-baseimage-create-from-app">{t('vm-app-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-app-id-phases-baseimage-create-from-app" name="vm-app-id-phases-baseimage-create-from-app" value={vmPhasesAPPIDBaseimageCreateFromApp} onChange={changeVMPhasesAPPIDBaseimageCreateFromApp}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-app-id-phases-baseimage-create-from-app')}
                                            {/*<ErrorMessage name="vm-app-id-phases-baseimage-create-from-app">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-name-phases-baseimage-create-from-app">{t('vm-name')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-name-phases-baseimage-create-from-app" name="vm-name-phases-baseimage-create-from-app" value={vmPhasesNameBaseimageCreateFromApp} onChange={changeVMPhasesNameBaseimageCreateFromApp}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-name-phases-baseimage-create-from-app')}
                                            {/*<ErrorMessage name="vm-name-phases-baseimage-create-from-app">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-env-phases-baseimage-create-from-app">{t('vm-env')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-env-phases-baseimage-create-from-app" name="vm-env-phases-baseimage-create-from-app" value={vmPhasesENVBaseimageCreateFromApp} onChange={changeVMPhasesENVBaseimageCreateFromApp}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-env-phases-baseimage-create-from-app')}
                                            {/*<ErrorMessage name="vm-env-phases-baseimage-create-from-app">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-run-phases-baseimage-create-from-app">{t('run-baseimage')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-run-phases-baseimage-create-from-app"
                                                name="vm-run-phases-baseimage-create-from-app"
                                                value={vmRunPhasesBaseimageCreateFromApp}
                                                checked={vmRunPhasesBaseimageCreateFromAppChecked}
                                                onChange={changeVMPhasesRunBaseimageCreateFromApp}
                                            />
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-run-phases-baseimage-create-from-app')}
                                            {/*<ErrorMessage name="vm-run-phases-baseimage-create-from-app">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmPhasesIDBaseimageCreateFromApp.length > 0 && vmPhasesAPPIDBaseimageCreateFromApp.length > 0 && vmPhasesNameBaseimageCreateFromApp.length > 0 && vmPhasesENVBaseimageCreateFromApp.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="phases-baseimage-clone-from-app" title={t('vm-phases-baseimage-clone-from-app')}>
                        <Formik
                            initialValues={{
                                id: "",
                                appid: "",
                                newid: "",
                                env: "",
                                name: "",
                                run: "",
                            }}
                            validationSchema={phasesBaseimageCloneFromAppSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesBaseimageCloneFromApp} id="form-phases-baseimage-clone-from-app">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-baseimage-clone-from-app">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-baseimage-clone-from-app" name="vm-id-phases-baseimage-clone-from-app" value={vmPhasesIDBaseimageCloneFromApp} onChange={changeVMPhasesIDBaseimageCloneFromApp}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-baseimage-clone-from-app')}
                                            {/*<ErrorMessage name="vm-id-phases-baseimage-clone-from-app">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-app-id-phases-baseimage-clone-from-app">{t('vm-app-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-app-id-phases-baseimage-clone-from-app" name="vm-app-id-phases-baseimage-clone-from-app" value={vmPhasesAPPIDBaseimageCloneFromApp} onChange={changeVMPhasesAPPIDBaseimageCloneFromApp}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-app-id-phases-baseimage-clone-from-app')}
                                            {/*<ErrorMessage name="vm-app-id-phases-baseimage-clone-from-app">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-new-id-phases-baseimage-clone-from-app">{t('vm-new-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-new-id-phases-baseimage-clone-from-app" name="vm-new-id-phases-baseimage-clone-from-app" value={vmPhasesNewIDBaseimageCloneFromApp} onChange={changeVMPhasesNewIDBaseimageCloneFromApp}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-new-id-phases-baseimage-clone-from-app')}
                                            {/*<ErrorMessage name="vm-new-id-phases-baseimage-clone-from-app">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-name-phases-baseimage-clone-from-app">{t('vm-name')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-name-phases-baseimage-clone-from-app" name="vm-name-phases-baseimage-clone-from-app" value={vmPhasesNameBaseimageCloneFromApp} onChange={changeVMPhasesNameBaseimageCloneFromApp}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-name-phases-baseimage-clone-from-app')}
                                            {/*<ErrorMessage name="vm-name-phases-baseimage-clone-from-app">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-env-phases-baseimage-clone-from-app">{t('vm-env')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-env-phases-baseimage-clone-from-app" name="vm-env-phases-baseimage-clone-from-app" value={vmPhasesENVBaseimageCloneFromApp} onChange={changeVMPhasesENVBaseimageCloneFromApp}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-env-phases-baseimage-clone-from-app')}
                                            {/*<ErrorMessage name="vm-env-phases-baseimage-clone-from-app">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-run-phases-baseimage-clone-from-app">{t('run-baseimage')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-run-phases-baseimage-clone-from-app"
                                                name="vm-run-phases-baseimage-clone-from-app"
                                                value={vmRunPhasesBaseimageCloneFromApp}
                                                checked={vmRunPhasesBaseimageCloneFromAppChecked}
                                                onChange={changeVMPhasesRunBaseimageCloneFromApp}
                                            />
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-run-phases-baseimage-create-from-app')}
                                            {/*<ErrorMessage name="vm-run-phases-baseimage-create-from-app">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmPhasesIDBaseimageCloneFromApp.length > 0 && vmPhasesAPPIDBaseimageCloneFromApp.length > 0 && vmPhasesNewIDBaseimageCloneFromApp.length > 0 && vmPhasesNameBaseimageCloneFromApp.length > 0 && vmPhasesENVBaseimageCloneFromApp.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="phases-baseimage-finalze" title={t('vm-phases-baseimage-finalize')}>
                        <Formik
                            initialValues={{
                                id: "",
                            }}
                            validationSchema={phasesBaseimageFinalizeSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesBaseimageFinalize} id="form-phases-baseimage-finalize">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-baseimage-finalize">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-baseimage-finalize" name="vm-id-phases-baseimage-finalize" value={vmPhasesIDBaseimageFinalize} onChange={changeVMPhasesIDBaseimageFinalize}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-baseimage-finalize')}
                                            {/*<ErrorMessage name="vm-id-phases-baseimage-finalize">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmPhasesIDBaseimageFinalize.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="phases-baseimage-delete" title={t('vm-phases-baseimage-delete')}>
                        <Formik
                            initialValues={{
                                id: "",
                            }}
                            validationSchema={phasesBaseimageDeleteSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesBaseimageDelete} id="form-phases-baseimage-delete">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-baseimage-delete">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-baseimage-delete" name="vm-id-phases-baseimage-delete" value={vmPhasesIDBaseimageDelete} onChange={changeVMPhasesIDBaseimageDelete}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-baseimage-delete')}
                                            {/*<ErrorMessage name="vm-id-phases-baseimage-delete">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmPhasesIDBaseimageDelete.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="phases-baseimage-start" title={t('vm-phases-baseimage-start')}>
                        <Formik
                            initialValues={{
                                id: "",
                                connect: "",
                            }}
                            validationSchema={phasesBaseimageStartSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesBaseimageStart} id="form-phases-baseimage-start">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-baseimage-start">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-baseimage-start" name="vm-id-phases-baseimage-start" value={vmPhasesIDBaseimageStart} onChange={changeVMPhasesIDBaseimageStart}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-baseimage-start')}
                                            {/*<ErrorMessage name="vm-id-phases-baseimage-start">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-connect-phases-baseimage-stop">{t('vm-connect')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-connect-phases-baseimage-start"
                                                name="vm-connect-phases-baseimage-start"
                                                value={vmPhasesConnectBaseimageStart}
                                                checked={vmPhasesConnectBaseimageStartChecked}
                                                onChange={changeVMPhasesConnectBaseimageStart}
                                            />
                                            {/*<Field type="text" id="vm-connect-phases-baseimage-start" name="vm-connect-baseimage-environment-start" value={vmPhasesConnectBaseimageStart} onChange={changeVMPhasesConnectBaseimageStart}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-connect-phases-environment-start')}
                                            {/*<ErrorMessage name="vm-connect-phases-environment-start">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmPhasesIDBaseimageStart.length > 0 ? false : true}>
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
                            vmStartBaseImageSubmit ? (
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
                                        vmPhasesConnectBaseimageStartChecked ? (
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
                    <ReactBootstrap.Tab eventKey="phases-baseimage-stop" title={t('vm-phases-baseimage-stop')}>
                        <Formik
                            initialValues={{
                                id_instance: "",
                                force: "",
                            }}
                            validationSchema={phasesBaseimageStopSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesBaseimageStop} id="form-phases-baseimage-stop">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-baseimage-stop">{t('vm-id-instance')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-baseimage-stop" name="vm-id-phases-baseimage-stop" value={vmPhasesIDBaseimageStop} onChange={changeVMPhasesIDBaseimageStop}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-baseimage-stop')}
                                            {/*<ErrorMessage name="vm-id-phases-baseimage-stop">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-connect-phases-baseimage-stop">{t('vm-force')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-connect-phases-baseimage-stop"
                                                name="vm-connect-phases-baseimage-stop"
                                                value={vmPhasesConnectBaseimageStop}
                                                checked={vmPhasesConnectBaseimageStopChecked}
                                                onChange={changeVMPhasesConnectBaseimageStop}
                                            />
                                            {/*<Field type="text" id="vm-connect-phases-baseimage-stop" name="vm-connect-baseimage-environment-stop" value={vmPhasesConnectBaseimageStop} onChange={changeVMPhasesConnectBaseimageStop}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-connect-phases-environment-stop')}
                                            {/*<ErrorMessage name="vm-connect-phases-environment-stop">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmPhasesIDBaseimageStop.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="phases-cfg-from-application" title={t('vm-phases-cfg-from-application')}>
                        <Formik
                            initialValues={{
                                id: "",
                                appid: "",
                                env: "",
                            }}
                            validationSchema={phasesCFGFromAppSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesCFGFromApp} id="form-phases-cfg-from-app">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-cfg-from-app">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-cfg-from-app" name="vm-id-phases-cfg-from-app" value={vmPhasesIDCFGFromApp} onChange={changeVMPhasesIDCFGFromApp}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-cfg-from-app')}
                                            {/*<ErrorMessage name="vm-id-phases-cfg-from-app">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-app-id-phases-cfg-from-app">{t('vm-app-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-app-id-phases-cfg-from-app" name="vm-app-id-phases-cfg-from-app" value={vmPhasesAPPIDCFGFromApp} onChange={changeVMPhasesAPPIDCFGFromApp}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-app-id-phases-cfg-from-app')}
                                            {/*<ErrorMessage name="vm-app-id-phases-cfg-from-app">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-env-phases-cfg-from-app">{t('vm-env')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-env-phases-cfg-from-app" name="vm-env-phases-cfg-from-app" value={vmPhasesENVCFGFromApp} onChange={changeVMPhasesENVCFGFromApp}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-env-phases-cfg-from-app')}
                                            {/*<ErrorMessage name="vm-env-phases-cfg-from-app">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmPhasesIDCFGFromApp.length > 0 && vmPhasesAPPIDCFGFromApp.length > 0 && vmPhasesENVCFGFromApp.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="phases-cfg-tasklist" title={t('vm-phases-cfg-tasklist')}>
                        <Formik
                            initialValues={{
                                id: "",
                                env: "",
                                tasklist: "",
                                type: "",
                                cmd: "",
                                arg: "",
                            }}
                            validationSchema={phasesCFGTasklistSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesCFGTasklist} id="form-phases-cfg-tasklist">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-cfg-tasklist">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-cfg-tasklist" name="vm-id-phases-cfg-tasklist" value={vmPhasesIDCFGTasklist} onChange={changeVMPhasesIDCFGTasklist}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-cfg-tasklist')}
                                            {/*<ErrorMessage name="vm-id-phases-cfg-tasklist">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-env-phases-cfg-tasklist">{t('vm-env')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-env-phases-cfg-tasklist" name="vm-env-phases-cfg-tasklist" value={vmPhasesENVCFGTasklist} onChange={changeVMPhasesENVCFGTasklist}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-env-phases-cfg-tasklist')}
                                            {/*<ErrorMessage name="vm-env-phases-cfg-tasklist">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-type-phases-cfg-tasklist">{t('vm-type')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <select id="vm-name-phases-cfg-tasklist" name="vm-name-phases-cfg-tasklist" value={vmPhasesTypeCFGTasklist} onChange={changeVMPhasesTypeCFGTasklist}>
                                                <option value="exec_cmd">{t('execute-command')}</option>
                                                <option value="os_install">{t('os-install')}</option>
                                                <option value="os_uninstall">{t('os-uninstall')}</option>
                                            </select>
                                            {/*<Field type="text" id="vm-name-phases-cfg-tasklist" name="vm-type-phases-cfg-tasklist" value={vmPhasesTypeCFGTasklist} onChange={changeVMPhasesTypeCFGTasklist}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-type-phases-cfg-tasklist')}
                                            {/*<ErrorMessage name="vm-type-phases-cfg-tasklist">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-command-phases-cfg-tasklist">{t('vm-command')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-command-phases-cfg-tasklist" name="vm-command-phases-cfg-tasklist" value={vmPhasesCommandCFGTasklist} onChange={changeVMPhasesCommandCFGTasklist}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-command-phases-cfg-tasklist')}
                                            {/*<ErrorMessage name="vm-command-phases-cfg-tasklist">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-arguments-phases-cfg-tasklist">{t('vm-arguments')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-arguments-phases-cfg-tasklist" name="vm-arguments-phases-cfg-tasklist" value={vmPhasesArgumentsCFGTasklist} onChange={changeVMPhasesArgumentsCFGTasklist}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-arguments-phases-cfg-tasklist')}
                                            {/*<ErrorMessage name="vm-arguments-phases-cfg-tasklist">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmPhasesIDCFGTasklist.length > 0 && vmPhasesTypeCFGTasklist.length > 0 && vmPhasesCommandCFGTasklist.length > 0 /*&& vmPhasesArgumentsCFGTasklist.length > 0*/ ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="phases-cfg-applist" title={t('vm-phases-cfg-applist')}>
                        <Formik
                            initialValues={{
                                id: "",
                                env: "",
                                applist: "",
                                cmd: "",
                                arg: "",
                            }}
                            validationSchema={phasesCFGApplistSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesCFGApplist} id="form-phases-cfg-applist">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-cfg-applist">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-cfg-applist" name="vm-id-phases-cfg-applist" value={vmPhasesIDCFGApplist} onChange={changeVMPhasesIDCFGApplist}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-cfg-applist')}
                                            {/*<ErrorMessage name="vm-id-phases-cfg-applist">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-env-phases-cfg-applist">{t('vm-env')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-env-phases-cfg-applist" name="vm-env-phases-cfg-applist" value={vmPhasesENVCFGApplist} onChange={changeVMPhasesENVCFGApplist}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-env-phases-cfg-applist')}
                                            {/*<ErrorMessage name="vm-env-phases-cfg-applist">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-name-phases-cfg-applist">{t('vm-name')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-name-phases-cfg-applist" name="vm-name-phases-cfg-applist" value={vmPhasesNameCFGApplist} onChange={changeVMPhasesNameCFGApplist}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-name-phases-cfg-applist')}
                                            {/*<ErrorMessage name="vm-name-phases-cfg-applist">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-command-phases-cfg-applist">{t('vm-command')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-command-phases-cfg-applist" name="vm-command-phases-cfg-applist" value={vmPhasesCommandCFGApplist} onChange={changeVMPhasesCommandCFGApplist}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-command-phases-cfg-applist')}
                                            {/*<ErrorMessage name="vm-command-phases-cfg-applist">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-arguments-phases-cfg-applist">{t('vm-arguments')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-arguments-phases-cfg-applist" name="vm-arguments-phases-cfg-applist" value={vmPhasesArgumentsCFGApplist} onChange={changeVMPhasesArgumentsCFGApplist}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-arguments-phases-cfg-applist')}
                                            {/*<ErrorMessage name="vm-arguments-phases-cfg-applist">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmPhasesIDCFGApplist.length > 0 && vmPhasesNameCFGApplist.length > 0 && vmPhasesCommandCFGApplist.length > 0 /*&& vmPhasesArgumentsCFGApplist.length > 0*/ ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="phases-cfg-target" title={t('vm-phases-cfg-target')}>
                        <Formik
                            initialValues={{
                                id: "",
                                env: "",
                                target: "",
                                name: "",
                                cmd: "",
                                arg: "",
                            }}
                            validationSchema={phasesCFGTargetSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesCFGTarget} id="form-phases-cfg-target">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-cfg-target">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-cfg-target" name="vm-id-phases-cfg-target" value={vmPhasesIDCFGTarget} onChange={changeVMPhasesIDCFGTarget}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-cfg-target')}
                                            {/*<ErrorMessage name="vm-id-phases-cfg-target">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-env-phases-cfg-target">{t('vm-env')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-env-phases-cfg-target" name="vm-env-phases-cfg-target" value={vmPhasesENVCFGTarget} onChange={changeVMPhasesENVCFGTarget}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-env-phases-cfg-target')}
                                            {/*<ErrorMessage name="vm-env-phases-cfg-target">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-name-phases-cfg-target">{t('vm-name')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-name-phases-cfg-target" name="vm-name-phases-cfg-target" value={vmPhasesNameCFGTarget} onChange={changeVMPhasesNameCFGTarget}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-name-phases-cfg-target')}
                                            {/*<ErrorMessage name="vm-name-phases-cfg-target">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-command-phases-cfg-target">{t('vm-command')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-command-phases-cfg-target" name="vm-command-phases-cfg-target" value={vmPhasesCommandCFGTarget} onChange={changeVMPhasesCommandCFGTarget}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-command-phases-cfg-target')}
                                            {/*<ErrorMessage name="vm-command-phases-cfg-target">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-arguments-phases-cfg-target">{t('vm-arguments')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-arguments-phases-cfg-target" name="vm-arguments-phases-cfg-target" value={vmPhasesArgumentsCFGTarget} onChange={changeVMPhasesArgumentsCFGTarget}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-arguments-phases-cfg-target')}
                                            {/*<ErrorMessage name="vm-arguments-phases-cfg-target">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmPhasesIDCFGTarget.length > 0 && vmPhasesNameCFGTarget.length > 0 && vmPhasesCommandCFGTarget.length > 0 /*&& vmPhasesArgumentsCFGTarget.length > 0*/ ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="phases-environment-create" title={t('vm-phases-environment-create')}>
                        <Formik
                            initialValues={{
                                id: "",
                                name: "",
                                dockerfile: "",
                            }}
                            validationSchema={phasesEnvironmentCreateSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesEnvironmentCreate} id="form-phases-environment-create">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-environment-create">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-environment-create" name="vm-id-phases-environment-create" value={vmPhasesIDEnvironmentCreate} onChange={changeVMPhasesIDEnvironmentCreate}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-environment-create')}
                                            {/*<ErrorMessage name="vm-id-phases-environment-create">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-name-phases-environment-create">{t('vm-name')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-name-phases-environment-create" name="vm-name-phases-environment-create" value={vmPhasesNameEnvironmentCreate} onChange={changeVMPhasesNameEnvironmentCreate}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-name-phases-environment-create')}
                                            {/*<ErrorMessage name="vm-name-phases-environment-create">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-dockerfile-phases-environment-create">{t('vm-dockerfile')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input type="file" id="vm-dockerfile-phases-environment-create" name="vm-dockerfile-phases-environment-create" onChange={changeVMPhasesDockerfileEnvironmentCreate}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-dockerfile-phases-environment-create')}
                                            {/*<ErrorMessage name="vm-dockerfile-phases-environment-create">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmPhasesIDEnvironmentCreate.length > 0 && vmPhasesNameEnvironmentCreate.length > 0 ? false : true}>
                                                {/*&& vmPhasesDockerfileEnvironmentCreate !== undefined*/}
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                        {
                            vmPhasesSubmitEnvironmentCreate ? (
                                <ReactBootstrap.Row id="form-phases-environment-general-data">
                                    {
                                        vmPhasesDataEnvironmentCreate !== undefined
                                            ? (
                                                <>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        created_at:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesDataEnvironmentCreate.created_at}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        env_apps:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesDataEnvironmentCreate.env_apps}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        env_target:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {JSON.stringify(vmPhasesDataEnvironmentCreate.env_target)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        env_tasks:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesDataEnvironmentCreate.env_tasks}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        id:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesDataEnvironmentCreate.id}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        id_backend:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesDataEnvironmentCreate.id_backend}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        id_object:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesDataEnvironmentCreate.id_object}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        name:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesDataEnvironmentCreate.name}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        state:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesDataEnvironmentCreate.state}
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
                    <ReactBootstrap.Tab eventKey="phases-environment-finalize" title={t('vm-phases-environment-finalize')}>
                        <Formik
                            initialValues={{
                                id: "",
                                name: "",
                            }}
                            validationSchema={phasesEnvironmentFinalizeSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesEnvironmentFinalize} id="form-phases-environment-finalize">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-environment-finalize">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-environment-finalize" name="vm-id-phases-environment-finalize" value={vmPhasesIDEnvironmentFinalize} onChange={changeVMPhasesIDEnvironmentFinalize}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-environment-finalize')}
                                            {/*<ErrorMessage name="vm-id-phases-environment-finalize">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-name-phases-environment-finalize">{t('vm-name')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-name-phases-environment-finalize" name="vm-name-phases-environment-finalize" value={vmPhasesNameEnvironmentFinalize} onChange={changeVMPhasesNameEnvironmentFinalize}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-name-phases-environment-finalize')}
                                            {/*<ErrorMessage name="vm-name-phases-environment-finalize">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmPhasesIDEnvironmentFinalize.length > 0 && vmPhasesNameEnvironmentFinalize.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="phases-environment-delete" title={t('vm-phases-environment-delete')}>
                        <Formik
                            initialValues={{
                                id: "",
                                name: "",
                            }}
                            validationSchema={phasesEnvironmentDeleteSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesEnvironmentDelete} id="form-phases-environment-delete">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-environment-delete">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-environment-delete" name="vm-id-phases-environment-delete" value={vmPhasesIDEnvironmentDelete} onChange={changeVMPhasesIDEnvironmentDelete}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-environment-delete')}
                                            {/*<ErrorMessage name="vm-id-phases-environment-delete">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-name-phases-environment-delete">{t('vm-name')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-name-phases-environment-delete" name="vm-name-phases-environment-delete" value={vmPhasesNameEnvironmentDelete} onChange={changeVMPhasesNameEnvironmentDelete}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-name-phases-environment-delete')}
                                            {/*<ErrorMessage name="vm-name-phases-environment-delete">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmPhasesIDEnvironmentDelete.length > 0 && vmPhasesNameEnvironmentDelete.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="phases-environment-get" title={t('vm-phases-environment-get')}>
                        <Formik
                            initialValues={{
                                id: "",
                                name: "",
                            }}
                            validationSchema={phasesEnvironmentGetSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesEnvironmentGet} id="form-phases-environment-get">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-environment-get">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-environment-get" name="vm-id-phases-environment-get" value={vmPhasesIDEnvironmentGet} onChange={changeVMPhasesIDEnvironmentGet}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-environment-get')}
                                            {/*<ErrorMessage name="vm-id-phases-environment-get">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-name-phases-environment-get">{t('vm-name')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-name-phases-environment-get" name="vm-name-phases-environment-get" value={vmPhasesNameEnvironmentGet} onChange={changeVMPhasesNameEnvironmentGet}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-name-phases-environment-get')}
                                            {/*<ErrorMessage name="vm-name-phases-environment-get">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmPhasesIDEnvironmentGet.length > 0 && vmPhasesNameEnvironmentGet.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                        {
                            vmPhasesSubmitEnvironmentGet ? (
                                <ReactBootstrap.Row id="form-phases-environment-general-data">
                                    {
                                        vmPhasesDataEnvironmentGet !== undefined
                                            ? (
                                                <>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        created_at:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesDataEnvironmentGet.created_at}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        env_apps:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesDataEnvironmentGet.env_apps}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        env_target:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {JSON.stringify(vmPhasesDataEnvironmentGet.env_target)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        env_tasks:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesDataEnvironmentGet.env_tasks}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        id:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesDataEnvironmentGet.id}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        id_backend:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesDataEnvironmentGet.id_backend}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        id_object:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesDataEnvironmentGet.id_object}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        name:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesDataEnvironmentGet.name}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        state:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesDataEnvironmentGet.state}
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
                    <ReactBootstrap.Tab eventKey="phases-environments-get" title={t('vm-phases-environments-get')}>
                        <Formik
                            initialValues={{
                                id: "",
                            }}
                            validationSchema={phasesEnvironmentsGetSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesEnvironmentsGet} id="form-phases-environments-get">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-environments-get">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-environments-get" name="vm-id-phases-environments-get" value={vmPhasesIDEnvironmentsGet} onChange={changeVMPhasesIDEnvironmentsGet}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-environments-get')}
                                            {/*<ErrorMessage name="vm-id-phases-environments-get">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmPhasesIDEnvironmentsGet.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                        {
                            vmPhasesSubmitEnvironmentGets ? (
                                <ReactBootstrap.Row id="form-phases-environment-general-data">
                                    {
                                        vmPhasesDataEnvironmentGets !== undefined
                                            ? (
                                                <>
                                                    {
                                                        vmPhasesDataEnvironmentGets.map(data => {
                                                            return(
                                                                <>
                                                                    {
                                                                        <ReactBootstrap.Row id="form-phases-environment-general-data">
                                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                created_at:
                                                                            </ReactBootstrap.Col>
                                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                {data.created_at}
                                                                            </ReactBootstrap.Col>
                                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                env_apps:
                                                                            </ReactBootstrap.Col>
                                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                {data.env_apps}
                                                                            </ReactBootstrap.Col>
                                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                env_target:
                                                                            </ReactBootstrap.Col>
                                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                {JSON.stringify(data.env_target)}
                                                                            </ReactBootstrap.Col>
                                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                env_tasks:
                                                                            </ReactBootstrap.Col>
                                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                {data.env_tasks}
                                                                            </ReactBootstrap.Col>
                                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                id:
                                                                            </ReactBootstrap.Col>
                                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                {data.id}
                                                                            </ReactBootstrap.Col>
                                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                id_backend:
                                                                            </ReactBootstrap.Col>
                                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                {data.id_backend}
                                                                            </ReactBootstrap.Col>
                                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                id_object:
                                                                            </ReactBootstrap.Col>
                                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                {data.id_object}
                                                                            </ReactBootstrap.Col>
                                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                name:
                                                                            </ReactBootstrap.Col>
                                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                {data.name}
                                                                            </ReactBootstrap.Col>
                                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                state:
                                                                            </ReactBootstrap.Col>
                                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                {data.state}
                                                                            </ReactBootstrap.Col>
                                                                        </ReactBootstrap.Row>
                                                                    }
                                                                </>
                                                            )
                                                        })
                                                    }
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
                    <ReactBootstrap.Tab eventKey="phases-environment-start" title={t('vm-phases-environment-start')}>
                        <Formik
                            initialValues={{
                                id: "",
                                name: "",
                                connect: "",
                            }}
                            validationSchema={phasesEnvironmentStartSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesEnvironmentStart} id="form-phases-environment-start">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-environment-start">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-environment-start" name="vm-id-phases-environment-start" value={vmPhasesIDEnvironmentStart} onChange={changeVMPhasesIDEnvironmentStart}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-environment-start')}
                                            {/*<ErrorMessage name="vm-id-phases-environment-start">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-name-phases-environment-start">{t('vm-name')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-name-phases-environment-start" name="vm-name-phases-environment-start" value={vmPhasesNameEnvironmentStart} onChange={changeVMPhasesNameEnvironmentStart}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-name-phases-environment-start')}
                                            {/*<ErrorMessage name="vm-name-phases-environment-start">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-connect-phases-environment-start">{t('vm-connect')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-connect-phases-environment-start"
                                                name="vm-connect-phases-environment-start"
                                                value={vmPhasesConnectEnvironmentStart}
                                                checked={vmPhasesConnectEnvironmentStartChecked}
                                                onChange={changeVMPhasesConnectEnvironmentStart}
                                            />
                                            {/*<Field type="text" id="vm-connect-phases-environment-start" name="vm-connect-phases-environment-start" value={vmPhasesConnectEnvironmentStart} onChange={changeVMPhasesConnectEnvironmentStart}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-connect-phases-environment-start')}
                                            {/*<ErrorMessage name="vm-connect-phases-environment-start">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmPhasesIDEnvironmentStart.length > 0 && vmPhasesNameEnvironmentStart.length > 0 && vmPhasesConnectEnvironmentStartChecked ? false : true}>
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
                            vmStartEnvironmentSubmit ? (
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
                                        vmPhasesConnectEnvironmentStartChecked ? (
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
                    <ReactBootstrap.Tab eventKey="phases-environment-run" title={t('vm-phases-environment-run')}>
                        <Formik
                            initialValues={{
                                id: "",
                                env: "",
                                connect: "",
                            }}
                            validationSchema={phasesEnvironmentRunSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesEnvironmentRun} id="form-phases-environment-run">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-environment-run">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-environment-run" name="vm-id-phases-environment-run" value={vmPhasesIDEnvironmentRun} onChange={changeVMPhasesIDEnvironmentRun}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-environment-run')}
                                            {/*<ErrorMessage name="vm-id-phases-environment-run">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-name-phases-environment-run">{t('vm-env')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-name-phases-environment-run" name="vm-name-phases-environment-run" value={vmPhasesNameEnvironmentRun} onChange={changeVMPhasesNameEnvironmentRun}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-name-phases-environment-run')}
                                            {/*<ErrorMessage name="vm-name-phases-environment-run">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-connect-phases-environment-start">{t('vm-connect')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-connect-phases-environment-run"
                                                name="vm-connect-phases-environment-run"
                                                value={vmPhasesConnectEnvironmentRun}
                                                checked={vmPhasesConnectEnvironmentRunChecked}
                                                onChange={changeVMPhasesConnectEnvironmentRun}
                                            />
                                            {/*<Field type="text" id="vm-connect-phases-environment-run" name="vm-connect-phases-environment-run" value={vmPhasesConnectEnvironmentRun} onChange={changeVMPhasesConnectEnvironmentRun}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-connect-phases-environment-run')}
                                            {/*<ErrorMessage name="vm-connect-phases-environment-run">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmPhasesIDEnvironmentRun.length > 0 && vmPhasesNameEnvironmentRun.length > 0 && vmPhasesConnectEnvironmentRunChecked ? false : true}>
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
                            vmRunEnvironmentSubmit ? (
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
                                        vmPhasesConnectEnvironmentRunChecked ? (
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
                    <ReactBootstrap.Tab eventKey="phases-environment-stop" title={t('vm-phases-environment-stop')}>
                        <Formik
                            initialValues={{
                                id: "",
                                name: "",
                                force: "",
                            }}
                            validationSchema={phasesEnvironmentStopSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesEnvironmentStop} id="form-phases-environment-stop">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-environment-stop">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-environment-stop" name="vm-id-phases-environment-stop" value={vmPhasesIDEnvironmentStop} onChange={changeVMPhasesIDEnvironmentStop}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-environment-stop')}
                                            {/*<ErrorMessage name="vm-id-phases-environment-stop">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-name-phases-environment-stop">{t('vm-name')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-name-phases-environment-stop" name="vm-name-phases-environment-stop" value={vmPhasesNameEnvironmentStop} onChange={changeVMPhasesNameEnvironmentStop}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-name-phases-environment-stop')}
                                            {/*<ErrorMessage name="vm-name-phases-environment-stop">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-connect-phases-environment-stop">{t('vm-force')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-connect-phases-environment-stop"
                                                name="vm-connect-phases-environment-stop"
                                                value={vmPhasesConnectEnvironmentStop}
                                                checked={vmPhasesConnectEnvironmentStopChecked}
                                                onChange={changeVMPhasesConnectEnvironmentStop}
                                            />
                                            {/*<Field type="text" id="vm-connect-phases-environment-stop" name="vm-connect-phases-environment-stop" value={vmPhasesConnectEnvironmentStop} onChange={changeVMPhasesConnectEnvironmentStop}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-connect-phases-environment-stop')}
                                            {/*<ErrorMessage name="vm-connect-phases-environment-stop">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmPhasesIDEnvironmentStop.length > 0 && vmPhasesNameEnvironmentStop.length > 0 && vmPhasesConnectEnvironmentStopChecked ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="phases-object-status" title={t('vm-phases-object-status')}>
                        <Formik
                            initialValues={{
                                id: "",
                            }}
                            validationSchema={phasesObjectStatusSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesObjectStatus} id="form-phases-object-status">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-phases-object-status">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-phases-object-status" name="vm-id-phases-object-status" value={vmPhasesIDObjectStatus} onChange={changeVMPhasesIDObjectStatus}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-phases-object-status')}
                                            {/*<ErrorMessage name="vm-id-phases-object-status">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmPhasesIDObjectStatus.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                        {
                            vmPhasesObjectStatusSubmit ? (
                                <ReactBootstrap.Row id="form-phases-object-status">
                                    {
                                        vmPhasesObjectStatus !== undefined
                                            ? (
                                                <>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        ceph_public:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.ceph_public}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        ceph_shared:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.ceph_shared}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        ceph_user:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.ceph_user}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        environments:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {
                                                            vmPhasesObjectStatus.environments.length === 0
                                                            ? (
                                                                <>[]</>
                                                            ) : (
                                                                <>
                                                                    {
                                                                        vmPhasesObjectStatus.environments.map(data => {
                                                                            return(
                                                                                <>
                                                                                    <div>
                                                                                        created_at: {data.created_at}
                                                                                    </div>
                                                                                    <div>
                                                                                        env_apps: {data.env_apps}
                                                                                    </div>
                                                                                    <div>
                                                                                        env_target: {data.env_target}
                                                                                    </div>
                                                                                    <div>
                                                                                        env_tasks: {data.env_tasks}
                                                                                    </div>
                                                                                    <div>
                                                                                        id: {data.id}
                                                                                    </div>
                                                                                    <div>
                                                                                        id_backend: {data.id_backend}
                                                                                    </div>
                                                                                    <div>
                                                                                        id_object: {data.id_object}
                                                                                    </div>
                                                                                    <div>
                                                                                        name: {data.name}
                                                                                    </div>
                                                                                    <div>
                                                                                        state: {data.state}
                                                                                    </div>
                                                                                </>
                                                                            )
                                                                        })
                                                                    }
                                                                </>
                                                            )
                                                        }
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        extra_args:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.extra_args}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        id:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.id}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        id_docker:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.id_docker}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        id_owner:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.id_owner}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        id_proxmox:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.id_proxmox}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        id_user:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.id_user}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        object_apps:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.object_apps}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        object_state:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.object_state}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        object_storage:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.object_storage}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        object_target:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {JSON.stringify(vmPhasesObjectStatus.object_target)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        object_tasks:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.object_tasks}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        object_type:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.object_type}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        os_installer:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.os_installer}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        os_password:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.os_password}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        os_type:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.os_type}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        os_username:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.os_username}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        os_wine:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.os_wine}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        stateinfo:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="image-list-object">
                                                        <pre>
                                                            {JSON.stringify(vmPhasesObjectStatus.stateinfo, null, 3)}
                                                        </pre>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        vnc_password:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.vnc_password}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        vnc_port_instance:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.vnc_port_instance}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        vnc_port_system:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.vnc_port_system}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        vnc_username:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {vmPhasesObjectStatus.vnc_username}
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
                    <ReactBootstrap.Tab eventKey="phases-object-list" title={t('vm-phases-object-list')}>
                        <Formik
                            initialValues={{}}
                            validationSchema={phasesObjectListSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={phasesObjectList} id="form-phases-object-list">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-object-list-user">{t('object-list-user')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-object-list-user"
                                                name="vm-object-list-user"
                                                value={vmPhasesObjectListCheckedUserText}
                                                checked={vmPhasesObjectListCheckedUser}
                                                onChange={changeVMPhasesObjectListCheckedUser}
                                            />
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-object-list-daas">{t('object-list-daas')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-object-list-daas"
                                                name="vm-object-list-daas"
                                                value={vmPhasesObjectListCheckedDaasText}
                                                checked={vmPhasesObjectListCheckedDaas}
                                                onChange={changeVMPhasesObjectListCheckedDaas}
                                            />
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-object-list-detailed">{t('object-list-detailed')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-object-list-detailed"
                                                name="vm-object-list-detailed"
                                                value={vmPhasesObjectListCheckedDetailsText}
                                                checked={vmPhasesObjectListCheckedDetails}
                                                onChange={changeVMPhasesObjectListCheckedDetails}
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
                            vmPhasesObjectListSubmit ? (
                                <ReactBootstrap.Row id="form-phases-object-status">
                                    {
                                        vmPhasesObjectList.length > 0
                                            ? (
                                                vmPhasesObjectList.map((data) => {
                                                    return (
                                                        <>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                daas_id:
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                {data.daas_id}
                                                            </ReactBootstrap.Col>
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
                                                                name:
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

export default SettingsPhases;
