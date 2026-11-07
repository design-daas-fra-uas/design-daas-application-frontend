import { useEffect, useState } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import Header from '../../../components/header';
import LoadingSpinner from '../../../assets/animation/loadingspinner.svg';

import Header from "../../../components/header";
import LoadingSpinner from "../../../assets/animation/loadingspinner.svg";
import { createLogger } from '../../../utils/logger';

function SettingsVirtualEnvironment() {
    const params = useParams(); // Example: {params.id}
    const [vmID, setVMID] = useState("");
    const [vmName, setVMName] = useState("");
    const [vmKeyboardLanguage, setVMKeyboardLanguage] = useState("");
    const [vmCores, setVMCores] = useState("");
    const [vmMemorySize, setVMMemorySize] = useState("");
    const [vmDiskSize, setVMDiskSize] = useState("");
    const [vmOSType, setVMOSType] = useState("win10");
    const [vmCephPool, setVMCephPool] = useState("");
    const [vmCephPoolChecked, setVMCephPoolChecked] = useState(false);
    const [vmCephPublicCreate, setVMCephPublicCreate] = useState("");
    const [vmCephSharedCreate, setVMCephSharedCreate] = useState("");
    const [vmCephUserCreate, setVMCephUserCreate] = useState("");
    const [vmCephPublicCreateChecked, setVMCephPublicCreateChecked] = useState(false);
    const [vmCephSharedCreateChecked, setVMCephSharedCreateChecked] = useState(false);
    const [vmCephUserCreateChecked, setVMCephUserCreateChecked] = useState(false);
    const [vmResolution, setVMResolution] = useState("");
    const [vmContype, setVMContype] = useState("sysvnc");
    const [vmResize, setVMResize] = useState("none");
    const [vmScale, setVMScale] = useState("");
    const [vmScaleChecked, setVMScaleChecked] = useState(false);
    const [vmIDDelete, setVMIDDelete] = useState("");
    const [vmIDStart, setVMIDStart] = useState("");
    const [vmENVStart, setVMENVStart] = useState("");
    const [vmConnectStart, setVMConnectStart] = useState("");
    const [vmConnectStartChecked, setVMConnectStartChecked] = useState(false);
    const [vmIDStop, setVMIDStop] = useState("");
    const [vmIDStatus, setVMIDStatus] = useState("");
    const [vmIDConfig, setVMIDConfig] = useState("");
    const [vmIDConfigPre, setVMIDConfigPre] = useState("");
    const [vmNameConfigPre, setVMNameConfigPre] = useState("");
    const [vmOSTypeConfigPre, setVMOSTypeConfigPre] = useState("");
    const [vmCoresConfigPre, setVMCoresConfigPre] = useState("");
    const [vmMemorySizeConfigPre, setVMMemorySizeConfigPre] = useState("");
    const [vmDiskSizeConfigPre, setVMDiskSizeConfigPre] = useState("");
    const [vmISOConfigPre, setVMISOConfigPre] = useState("");
    const [vmKeyboardLanguageConfigPre, setVMKeyboardLanguageConfigPre] = useState("");
    const [vmIDConfigPost, setVMIDConfigPost] = useState("");
    const [vmNameConfigPost, setVMNameConfigPost] = useState("");
    const [vmKeyboardLanguageConfigPost, setVMKeyboardLanguageConfigPost] = useState("");
    const [vmIDSnapshot, setVMIDSnapshot] = useState("");
    const [vmIDSnapshotCreate, setVMIDSnapshotCreate] = useState("");
    const [vmIDSnapshotName, setVMIDSnapshotName] = useState("");
    const [vmIDSnapshotDesc, setVMIDSnapshotDesc] = useState("");
    const [vmIDSnapshotRollback, setVMIDSnapshotRollback] = useState("");
    const [vmIDSnapshotNameRollback, setVMIDSnapshotNameRollback] = useState("");
    const [vmIDClone, setVMIDClone] = useState("");
    const [vmNewIDClone, setVMNewIDClone] = useState("");
    const [vmNameClone, setVMNameClone] = useState("");
    const [vmKeyboardLanguageClone, setVMKeyboardLanguageClone] = useState("");
    const [vmSnapnameClone, setVMSnapnameClone] = useState("");
    const [vmCephPublicClone, setVMCephPublicClone] = useState("");
    const [vmCephSharedClone, setVMCephSharedClone] = useState("");
    const [vmCephUserClone, setVMCephUserClone] = useState("");
    const [vmCephPublicCloneChecked, setVMCephPublicCloneChecked] = useState(false);
    const [vmCephSharedCloneChecked, setVMCephSharedCloneChecked] = useState(false);
    const [vmCephUserCloneChecked, setVMCephUserCloneChecked] = useState(false);
    const [vmIDConvert, setVMIDConvert] = useState("");
    const [vmDiskConvert, setVMDiskConvert] = useState("");
    const [vmIDStatusSubmit, setVMIDStatusSubmit] = useState(false);
    const [vmIDConfigSubmit, setVMIDConfigSubmit] = useState(false);
    const [vmIDSnapshotSubmit, setVMIDSnapshotSubmit] = useState(false);
    const [vmStartSubmit, setVMStartSubmit] = useState(false);
    const [allVM, setAllVM] = useState([]);
    const [allSnapshots, setAllSnapshots] = useState([]);
    const [statusVM, setStatusVM] = useState({});
    const [configVM, setConfigVM] = useState({});
    const [viewerURL, setViewerURL] = useState("");
    const [requestAlert, setRequestAlert] = useState(false);
    const [requestAlertMessage, setRequestAlertMessage] = useState(false);
    const [loadingSpinnerShow, setLoadingSpinnerShow] = useState(false);
    const [loadingSpinnerShowSubmit, setLoadingSpinnerShowSubmit] = useState(false);
    const { t, i18n } = useTranslation();


    const isNotDesktop = useMediaQuery({
        query: '(max-width: 1200px)'
    })

    useEffect(() => {
        axios.post(DEVELOPMENT + '/vm/list', {
            'onlyuser': 'on'
        }, {
            headers: {
                'Authorization': localStorage.getItem('userToken'),
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': URL_SYSTEM,
                'Access-Control-Allow-Headers': URL_SYSTEM,
            },
            // withCredentials: false,
        })
            .then(response => {
                console.log(response);
                if (response.status === 200 && response.data.response_code === 200) {
                    setAllVM(response.data.response_data)
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                    setAllVM([])
                }
            })
            .catch(e => {
                console.log(e)
            });
    }, []);

    const servicePartnerAuthLogin = async (tokenUser) => {
        await axios.post(DEVELOPMENT + '/login?redirect=%2F', {
            username: USERNAME,
            password: PASSWORD,
        }, {
            headers: {
                Authorization: `${tokenUser}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': URL_SYSTEM, // Specific domain: URL_SYSTEM_WITHOUT_PORT
                'Access-Control-Allow-Headers': URL_SYSTEM, // Specific domain: URL_SYSTEM_WITHOUT_PORT
                // 'Access-Control-Allow-Credentials': false,
                //'Referer': URL_SYSTEM, // Specific domain: URL_SYSTEM_WITHOUT_PORT
            },
            // Only available: Specific domain and CORS credentials 'true'
            // withCredentials: true,
        })
        .then(response => {
            console.log(response);
        })
        .catch(e => {
            console.log(e)
        });
    };

    /*useEffect(() => {
        servicePartnerAuthLogin(localStorage.getItem("userToken"));
    }, []);*/

    const statusVirtualEnvironment = (event) => {
        event.preventDefault();

        //servicePartnerAuthLogin(localStorage.getItem("userToken"));

        axios.post(DEVELOPMENT + '/vm/status', {
            id: vmIDStatus,
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
                    setStatusVM(response.data.response_data)
                    setVMIDStatusSubmit(true);
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
                setVMIDStatusSubmit(false);
                setRequestAlert(true);
                setRequestAlertMessage(false);

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

    const configurationVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/vm/config_get', {
            id: vmIDConfig,
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
                    setConfigVM(response.data.response_data)
                    setVMIDConfigSubmit(true);

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
                setVMIDConfigSubmit(false);
            });
    }

    const createVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/vm/create', {
            id: vmID,
            name: vmName,
            cores: vmCores,
            memsize: vmMemorySize,
            disksize: vmDiskSize,
            os_type: vmOSType,
            kb: vmKeyboardLanguage,
            ceph_pool: vmCephPoolChecked ? "on" : "", // vmCephPool,
            ceph_public: vmCephPublicCreateChecked ? "on" : "", // vmCephPublicCreate,
            ceph_shared: vmCephSharedCreateChecked ? "on" : "", // vmCephSharedCreate,
            ceph_user: vmCephUserCreateChecked ? "on" : "", // vmCephUserCreate,
            viewer_resolution: vmResolution,
            viewer_contype: vmContype,
            viewer_resize: vmResize,
            viewer_scale: vmScaleChecked ? "on" : "", // vmScale,
        }, {
            headers: {
                'Authorization': localStorage.getItem('userToken'),
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': URL_SYSTEM,
                'Access-Control-Allow-Headers': URL_SYSTEM,
            },
            //withCredentials: true,
        })
            .then(response => {
                console.log(response);

                if (response.status === 200 && response.data.response_code === 200) {
                    axios.post(DEVELOPMENT + '/vm/list', {
                        'onlyuser': 'on'
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
                                setAllVM(response.data.response_data)
                                setRequestAlert(true);
                                setRequestAlertMessage(true);

                                setTimeout(() => {
                                    setRequestAlert(false);
                                    setRequestAlertMessage(false);
                                }, 2000);
                            }
                            if (response.status === 200 && response.data.response_code !== 200) {
                                setAllVM(allVM)
                                setRequestAlert(true);
                                setRequestAlertMessage(true);

                                setTimeout(() => {
                                    setRequestAlert(false);
                                    setRequestAlertMessage(false);
                                }, 2000);
                            }
                        })
                        .catch(e => {
                            console.log(e)
                        });
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
            });
    }

    const deleteVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/vm/delete', {
            id: vmIDDelete,
        }, {
            headers: {
                'Authorization': localStorage.getItem('userToken'),
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': URL_SYSTEM,
                'Access-Control-Allow-Headers': URL_SYSTEM,
            },
            //withCredentials: true,
        })
            .then(response => {
                console.log(response.data.response_code);
                if (response.status === 200 && response.data.response_code === 200) {
                    axios.post(DEVELOPMENT + '/vm/list', {
                        "onlyuser": "on"
                    }, {
                        headers: {
                            'Authorization': localStorage.getItem('userToken'),
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': URL_SYSTEM,
                            'Access-Control-Allow-Headers': URL_SYSTEM,
                        },
                        // withCredentials: true,
                    })
                        .then(response => {
                            console.log(response);
                            if (response.status === 200 && response.data.response_code === 200) {
                                setAllVM(response.data.response_data)
                                setRequestAlert(true);
                                setRequestAlertMessage(true);

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

    const startVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/vm/start', {
            id: vmIDStart,
            id_env: vmENVStart,
            connect: vmConnectStartChecked ? "on" : "", // vmConnectStart,
        }, {
            headers: {
                'Authorization': localStorage.getItem('userToken'),
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': URL_SYSTEM,
                'Access-Control-Allow-Headers': URL_SYSTEM,
            },
            //withCredentials: true,
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
                    //console.log(response.data.response_url)
                    setLoadingSpinnerShow(false);
                    setLoadingSpinnerShowSubmit(false);
                    setVMStartSubmit(true);
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
                    setVMStartSubmit(false);
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
                setVMStartSubmit(false);
            });
    }

    const stopVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/vm/stop', {
            id: vmIDStop,
        }, {
            headers: {
                'Authorization': localStorage.getItem('userToken'),
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': URL_SYSTEM,
                'Access-Control-Allow-Headers': URL_SYSTEM,
            },
            //withCredentials: true,
        })
            .then(response => {
                console.log(response);

                if (response.status === 200 && response.data.response_code === 200) {
                    axios.post(DEVELOPMENT + '/vm/list', {
                        'onlyuser': 'on'
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
                                setAllVM(response.data.response_data)
                                setRequestAlert(true);
                                setRequestAlertMessage(true);

                                setTimeout(() => {
                                    setRequestAlert(false);
                                    setRequestAlertMessage(false);
                                }, 2000);
                            }
                            if (response.status === 200 && response.data.response_code !== 200) {
                                setAllVM(allVM)
                                setRequestAlert(true);
                                setRequestAlertMessage(true);

                                setTimeout(() => {
                                    setRequestAlert(false);
                                    setRequestAlertMessage(false);
                                }, 2000);
                            }
                        })
                        .catch(e => {
                            console.log(e)
                        });
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

    const preConfigVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/vm/config_set_pre_install', {
            id: vmIDConfigPre,
            name: vmNameConfigPre,
            ostype: vmOSTypeConfigPre,
            cores: vmCoresConfigPre,
            memsize: vmMemorySizeConfigPre,
            disksize: vmDiskSizeConfigPre,
            iso_installer: vmISOConfigPre,
            keyboard_layout: vmKeyboardLanguageConfigPre,
        }, {
            headers: {
                'Authorization': localStorage.getItem('userToken'),
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': URL_SYSTEM,
                'Access-Control-Allow-Headers': URL_SYSTEM,
            },
            //withCredentials: true,
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
                /*axios.get(DEVELOPMENT + '/vm/list', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': URL_SYSTEM,
                        'Access-Control-Allow-Headers': URL_SYSTEM,
                    },
                    withCredentials: true,
                })
                    .then(response => {
                        console.log(response);
                    })
                    .catch(e => {
                        console.log(e)
                    });*/
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

    const postConfigVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/vm/config_set_post_install', {
            id: vmIDConfigPost,
            name: vmNameConfigPost,
            keyboard_layout: vmKeyboardLanguageConfigPost,
        }, {
            headers: {
                'Authorization': localStorage.getItem('userToken'),
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': URL_SYSTEM,
                'Access-Control-Allow-Headers': URL_SYSTEM,
            },
            //withCredentials: true,
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
                /*axios.get(DEVELOPMENT + '/vm/list', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': URL_SYSTEM,
                        'Access-Control-Allow-Headers': URL_SYSTEM,
                    },
                    withCredentials: true,
                })
                    .then(response => {
                        console.log(response);
                    })
                    .catch(e => {
                        console.log(e)
                    });*/
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

    const snapshotListVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/vm/snapshot_list', {
            id: vmIDSnapshot,
        }, {
            headers: {
                'Authorization': localStorage.getItem('userToken'),
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': URL_SYSTEM,
                'Access-Control-Allow-Headers': URL_SYSTEM,
            },
            //withCredentials: true,
        })
            .then(response => {
                console.log(response);
                if (response.status === 200 && response.data.response_code === 200) {
                    setAllSnapshots(response.data.response_data);
                    setVMIDSnapshotSubmit(true);

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
                setVMIDSnapshotSubmit(false);
                setRequestAlert(true);
                setRequestAlertMessage(false);

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

    const snapshotCreateVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/vm/snapshot_create', {
            id: vmIDSnapshotCreate,
            snapname: vmIDSnapshotName,
            desc: vmIDSnapshotDesc,
        }, {
            headers: {
                'Authorization': localStorage.getItem('userToken'),
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': URL_SYSTEM,
                'Access-Control-Allow-Headers': URL_SYSTEM,
            },
            //withCredentials: true,
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

    const snapshotRollbackVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/vm/snapshot_rollback', {
            id: vmIDSnapshotRollback,
            snapname: vmIDSnapshotNameRollback,
        }, {
            headers: {
                'Authorization': localStorage.getItem('userToken'),
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': URL_SYSTEM,
                'Access-Control-Allow-Headers': URL_SYSTEM,
            },
            //withCredentials: true,
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

    const cloneVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/vm/clone', {
            id: vmIDClone,
            newid: vmNewIDClone,
            name: vmNameClone,
            kb: vmKeyboardLanguageClone,
            snapname: vmSnapnameClone,
            ceph_public: vmCephPublicCloneChecked ? "on" : "", // vmCephPublicClone,
            ceph_shared: vmCephSharedCloneChecked ? "on" : "", // vmCephSharedClone,
            ceph_user: vmCephUserCloneChecked ? "on" : "", // vmCephUserClone,
        }, {
            headers: {
                'Authorization': localStorage.getItem('userToken'),
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': URL_SYSTEM,
                'Access-Control-Allow-Headers': URL_SYSTEM,
            },
            //withCredentials: true,
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

    const convertVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/vm/template_convert', {
            id: vmIDConvert,
            disk: vmDiskConvert,
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

    const changeVMID = event => {
        setVMID(event.target.value);
    };
    const changeVMName = event => {
        setVMName(event.target.value);
    };
    const changeVMKeyboardLanguage = event => {
        setVMKeyboardLanguage(event.target.value);
    };
    const changeVMCores = event => {
        setVMCores(event.target.value);
    };
    const changeVMMemorySize = event => {
        setVMMemorySize(event.target.value);
    };
    const changeVMDiskSize = event => {
        setVMDiskSize(event.target.value);
    };
    const changeVMOSType = event => {
        setVMOSType(event.target.value);
    };
    const changeVMCephTool = event => {
        setVMCephPool(event.target.value);
    };
    const checkChangeVMCephTool = () => {
        setVMCephPoolChecked(!vmCephPoolChecked)

        if (vmCephPoolChecked) {
            setVMCephPool("on");
        } else {
            setVMCephPool("");
        }
    }
    const checkChangeVMCephPublicCreate = () => {
        setVMCephPublicCreateChecked(!vmCephPublicCreateChecked)

        if (vmCephPublicCreateChecked) {
            setVMCephPublicCreate("on");
        } else {
            setVMCephPublicCreate("");
        }
    }
    const checkChangeVMCephSharedCreate = () => {
        setVMCephSharedCreateChecked(!vmCephSharedCreateChecked)

        if (vmCephSharedCreateChecked) {
            setVMCephSharedCreate("on");
        } else {
            setVMCephSharedCreate("");
        }
    }
    const checkChangeVMCephUserCreate = () => {
        setVMCephUserCreateChecked(!vmCephUserCreateChecked)

        if (vmCephUserCreateChecked) {
            setVMCephUserCreate("on");
        } else {
            setVMCephUserCreate("");
        }
    }
    const changeVMResolution = event => {
        setVMResolution(event.target.value);
    };
    const changeVMContype = event => {
        setVMContype(event.target.value);
    };
    const changeVMResize = event => {
        setVMResize(event.target.value);
    };
    const changeVMScale = event => {
        setVMScale(event.target.value);
    };
    const changeVMScaleChecked = () => {
        setVMScaleChecked(!vmScaleChecked)

        if (vmScaleChecked) {
            setVMScale("on");
        } else {
            setVMScale("");
        }
    };
    const changeVMIDDelete = event => {
        setVMIDDelete(event.target.value);
    };
    const changeVMIDStart = event => {
        setVMIDStart(event.target.value);
    };
    const changeVMENVStart = event => {
        setVMENVStart(event.target.value);
    };
    const changeVMConnectStart = event => {
        setVMConnectStart(event.target.value);
    };
    const checkChangeVMConnectStart = () => {
        setVMConnectStartChecked(!vmConnectStartChecked)

        if (vmConnectStartChecked) {
            setVMConnectStart("on");
        } else {
            setVMConnectStart("");
        }
    }
    const changeVMIDStop = event => {
        setVMIDStop(event.target.value);
    };
    const changeVMIDStatus = event => {
        setVMIDStatus(event.target.value);
    };
    const changeVMIDConfig = event => {
        setVMIDConfig(event.target.value);
    };
    const changeVMIDConfigPre = event => {
        setVMIDConfigPre(event.target.value);
    };
    const changeVMNameConfigPre = event => {
        setVMNameConfigPre(event.target.value);
    };
    const changeVMOSTypeConfigPre = event => {
        setVMOSTypeConfigPre(event.target.value);
    };
    const changeVMCoresConfigPre = event => {
        setVMCoresConfigPre(event.target.value);
    };
    const changeVMMemorySizeConfigPre = event => {
        setVMMemorySizeConfigPre(event.target.value);
    };
    const changeVMDiskSizeConfigPre = event => {
        setVMDiskSizeConfigPre(event.target.value);
    };
    const changeVMISOConfigPre = event => {
        setVMISOConfigPre(event.target.value);
    };
    const changeVMKeyboardLanguageConfigPre = event => {
        setVMKeyboardLanguageConfigPre(event.target.value);
    };
    const changeVMIDConfigPost = event => {
        setVMIDConfigPost(event.target.value);
    };
    const changeVMNameConfigPost = event => {
        setVMNameConfigPost(event.target.value);
    };
    const changeVMKeyboardLanguageConfigPost = event => {
        setVMKeyboardLanguageConfigPost(event.target.value);
    };
    const changeVMSnapshotID = event => {
        setVMIDSnapshot(event.target.value);
    };
    const changeVMSnapshotIDCreate = event => {
        setVMIDSnapshotCreate(event.target.value);
    };
    const changeVMSnapshotIDName = event => {
        setVMIDSnapshotName(event.target.value);
    };
    const changeVMSnapshotIDDesc = event => {
        setVMIDSnapshotDesc(event.target.value);
    };
    const changeVMSnapshotIDRollback = event => {
        setVMIDSnapshotRollback(event.target.value);
    };
    const changeVMSnapshotIDNameRollback = event => {
        setVMIDSnapshotNameRollback(event.target.value);
    };
    const changeVMIDClone = event => {
        setVMIDClone(event.target.value);
    };
    const changeVMNewIDClone = event => {
        setVMNewIDClone(event.target.value);
    };
    const changeVMNameClone = event => {
        setVMNameClone(event.target.value);
    };
    const changeVMKeyboardLanguageClone = event => {
        setVMKeyboardLanguageClone(event.target.value);
    };
    const changeVMSnapnameClone = event => {
        setVMSnapnameClone(event.target.value);
    };
    const checkChangeVMCephPublicClone = () => {
        setVMCephPublicCloneChecked(!vmCephPublicCloneChecked)

        if (vmCephPublicCloneChecked) {
            setVMCephPublicClone("on");
        } else {
            setVMCephPublicClone("");
        }
    }
    const checkChangeVMCephSharedClone = () => {
        setVMCephSharedCloneChecked(!vmCephSharedCloneChecked)

        if (vmCephSharedCloneChecked) {
            setVMCephSharedClone("on");
        } else {
            setVMCephSharedClone("");
        }
    }
    const checkChangeVMCephUserClone = () => {
        setVMCephUserCloneChecked(!vmCephUserCloneChecked)

        if (vmCephUserCloneChecked) {
            setVMCephUserClone("on");
        } else {
            setVMCephUserClone("");
        }
    }
    const changeVMIDConvert = event => {
        setVMIDConvert(event.target.value);
    };
    const changeVMDiskConvert = event => {
        setVMDiskConvert(event.target.value);
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

    const createVMSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        cores: Yup.string()
            .required(t('Cores invalid')),
        memsize: Yup.string()
            .required(t('Memory size invalid')),
        disksize: Yup.string()
            .required(t('Disk size invalid')),
        ostype: Yup.string()
            .required(t('OS Type invalid')),
        ceph_pool: Yup.string()
            .required(t('Ceph Pool invalid')),
        viewer_resolution: Yup.string()
            .required('Resolution invalid'),
        viewer_contype: Yup.string()
            .required('Contype invalid'),
        viewer_resize: Yup.string()
            .required('Resize invalid'),
        viewer_scale: Yup.string()
            .required('Scale invalid'),
    });

    const deleteVMSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid')
    });

    const startVMSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid')
    });

    const stopVMSchema = Yup.object().shape({
        id_instance: Yup.string()
            .required('ID instance invalid')
    });

    const statusVMSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid')
    });

    const configVMSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid')
    });

    const preConfigVMSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        name: Yup.string()
            .required(t('Name invalid')),
        ostype: Yup.string()
            .required(t('OS Type invalid')),
        cores: Yup.string()
            .required(t('Cores invalid')),
        memsize: Yup.string()
            .required(t('Memory size invalid')),
        disksize: Yup.string()
            .required(t('Disk size invalid')),
        iso_installer: Yup.string()
            .required(t('ISO image invalid')),
        keyboard_layout: Yup.string()
            .required(t('Keyboard language are invalid')),
    });

    const postConfigVMSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        name: Yup.string()
            .required(t('Name invalid')),
        keyboard_layout: Yup.string()
            .required(t('Keyboard language are invalid')),
    });

    const snapshotListVMSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid')
    });

    const snapshotCreateVMSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        snapname: Yup.string()
            .required('Snapname invalid'),
        desc: Yup.string()
            .required('DESC invalid')
    });

    const snapshotRollbackVMSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        snapname: Yup.string()
            .required('Snapname invalid')
    });

    const cloneVMSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        newid: Yup.string()
            .required('New ID invalid'),
        name: Yup.string()
            .required('Name invalid'),
        kb: Yup.string()
            .required('Keyboard language invalid'),
        snapname: Yup.string()
            .required('Snapname invalid')
    });

    const convertVMSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        disk: Yup.string()
            .required('Disk invalid')
    });

    return (
        <>
            <Header/>
            <ReactBootstrap.Container id="settingsOverviewVirtualEnvironment" fluid={true}>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                        <div>
                            <h2>
                                {t('vm-setup')}
                            </h2>
                        </div>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Tabs defaultActiveKey="create-vm" id="all-vm">
                    <ReactBootstrap.Tab eventKey="create-vm" title={t('vm-create')}>
                        <Formik
                            initialValues={{
                                id: "",
                                name: "",
                                cores: "",
                                memsize: "",
                                disksize: "",
                                ostype: "",
                                kb: "",
                                ceph_pool: "",
                                ceph_public: "",
                                ceph_shared: "",
                                ceph_user: "",
                                viewer_contype: "",
                                viewer_resolution: "",
                                viewer_resize: "",
                                viewer_scale: "",
                            }}
                            validationSchema={createVMSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={createVirtualEnvironment} id="form-create-vm">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id" name="vm-id" value={vmID} onChange={changeVMID}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id')}
                                            {/*<ErrorMessage name="vm-id">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-name">{t('vm-name')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-name" name="vm-name" value={vmName} onChange={changeVMName}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-name')}
                                            {/*<ErrorMessage name="vm-name">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-keyboard-language">{t('vm-keyboard-language')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-keyboard-language" name="vm-keyboard-language" value={vmKeyboardLanguage} onChange={changeVMKeyboardLanguage}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-keyboard-language')}
                                            {/*<ErrorMessage name="vm-keyboard-language">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-cores">{t('vm-cores')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-cores" name="vm-cores" value={vmCores} onChange={changeVMCores}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-cores')}
                                            {/*<ErrorMessage name="vm-cores">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-memory-size">{t('vm-memory-size')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-memory-size" name="vm-memory-size" value={vmMemorySize} onChange={changeVMMemorySize}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-memory-size')}
                                            {/*<ErrorMessage name="vm-memory-size">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-disk-size">{t('vm-disk-size')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-disk-size" name="vm-disk-size" value={vmDiskSize} onChange={changeVMDiskSize}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-disk-size')}
                                            {/*<ErrorMessage name="vm-disk-size">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-os-type">{t('vm-os-type')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <select id="vm-os-type" name="vm-os-type" value={vmOSType} onChange={changeVMOSType}>
                                                <option value="win10">Win 10</option>
                                                <option value="win11">Win 11</option>
                                                <option value="l26">Linux - Debian 12</option>
                                            </select>
                                            {/*<Field type="text" id="vm-os-type" name="vm-os-type" value={vmOSType} onChange={changeVMOSType}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-os-type')}
                                            {/*<ErrorMessage name="vm-os-type">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-os-ceph-tool">{t('vm-ceph-pool')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-os-ceph-tool"
                                                name="vm-os-ceph-tool"
                                                value={vmCephPool}
                                                checked={vmCephPoolChecked}
                                                onChange={checkChangeVMCephTool}
                                            />
                                            {/*<Field type="text" id="vm-os-ceph-tool" name="vm-os-ceph-tool" value={vmCephPool} onChange={changeVMCephTool}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-os-ceph-tool')}
                                            {/*<ErrorMessage name="vm-os-ceph-tool">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-ceph-public">{t('vm-ceph-public')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-ceph-public"
                                                name="vm-ceph-public"
                                                value={vmCephPublicCreate}
                                                checked={vmCephPublicCreateChecked}
                                                onChange={checkChangeVMCephPublicCreate}
                                            />
                                            {/*<Field type="text" id="vm-ceph-public" name="vm-ceph-public" value={vmCephPublicCreate} onChange={changeVMCephPublicCreate}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-ceph-public')}
                                            {/*<ErrorMessage name="vm-ceph-public">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-ceph-shared">{t('vm-ceph-shared')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-ceph-shared"
                                                name="vm-ceph-shared"
                                                value={vmCephSharedCreate}
                                                checked={vmCephSharedCreateChecked}
                                                onChange={checkChangeVMCephSharedCreate}
                                            />
                                            {/*<Field type="text" id="vm-ceph-shared" name="vm-ceph-shared" value={vmCephSharedCreate} onChange={changeVMCephSharedCreate}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-ceph-shared')}
                                            {/*<ErrorMessage name="vm-ceph-shared">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-ceph-user">{t('vm-ceph-user')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-ceph-user"
                                                name="vm-ceph-user"
                                                value={vmCephUserCreate}
                                                checked={vmCephUserCreateChecked}
                                                onChange={checkChangeVMCephUserCreate}
                                            />
                                            {/*<Field type="text" id="vm-ceph-user" name="vm-ceph-user" value={vmCephUserCreate} onChange={changeVMCephUserCreate}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-ceph-user')}
                                            {/*<ErrorMessage name="vm-ceph-user">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-resolution">{t('vm-resolution')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-resolution" name="vm-resolution" value={vmResolution} onChange={changeVMResolution}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-resolution')}
                                            {/*<ErrorMessage name="vm-resolution">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-contype">{t('vm-contype')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <select id="vm-contype-setting" name="vm-contype-setting" value={vmContype} onChange={changeVMContype}>
                                                <option value="sysvnc">System VNC (Proxmox default)</option>
                                                <option value="instvnc">Instance VNC (Docker default)</option>
                                                <option value="rdp">RDP (Windows only)</option>
                                            </select>
                                            {/*<Field type="text" id="vm-contype" name="vm-contype" value={vmContype} onChange={changeVMContype}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-contype')}
                                            {/*<ErrorMessage name="vm-contype">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-resize">{t('vm-resize')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <select id="vm-resize-setting" name="vm-resize-setting" value={vmResize} onChange={changeVMResize}>
                                                <option value="none">None (Do nothing)</option>
                                                <option value="semi">Semi (Allow instance)</option>
                                                <option value="full">Full (Enforce JS)</option>
                                            </select>
                                            {/*<Field type="text" id="vm-resize" name="vm-resize" value={vmResize} onChange={changeVMResize}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-resize')}
                                            {/*<ErrorMessage name="vm-resize">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-scale">{t('vm-scale')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-scale"
                                                name="vm-scale"
                                                value={vmScale}
                                                checked={vmScaleChecked}
                                                onChange={changeVMScaleChecked}
                                            />
                                            {/*<Field type="text" id="vm-scale" name="vm-scale" value={vmScale} onChange={changeVMScale}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-scale')}
                                            {/*<ErrorMessage name="vm-scale">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmID.length > 0 && vmKeyboardLanguage.length > 0 && vmName.length > 0 && vmCores.length > 0 && vmMemorySize.length > 0 && vmDiskSize.length > 0 && vmOSType.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="delete-vm" title={t('vm-delete')}>
                        <Formik
                            initialValues={{
                                id: "",
                            }}
                            validationSchema={deleteVMSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={deleteVirtualEnvironment} id="form-delete-vm">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-delete">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-delete" name="vm-id-delete" value={vmIDDelete} onChange={changeVMIDDelete}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-delete')}
                                            {/*<ErrorMessage name="vm-id-delete">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDDelete.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="start-vm" title={t('vm-start')}>
                        <Formik
                            initialValues={{
                                id: "",
                                id_env: "",
                                connect: "",
                            }}
                            validationSchema={startVMSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={startVirtualEnvironment} id="form-start-vm">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-start">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-start" name="vm-id-start" value={vmIDStart} onChange={changeVMIDStart}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-start')}
                                            {/*<ErrorMessage name="vm-id-start">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-env-start">{t('vm-env')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-env-start" name="vm-env-start" value={vmENVStart} onChange={changeVMENVStart}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-env-start')}
                                            {/*<ErrorMessage name="vm-env-start">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-connect-start">{t('vm-connect')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-connect-start"
                                                name="vm-connect-start"
                                                value={vmConnectStart}
                                                checked={vmConnectStartChecked}
                                                onChange={checkChangeVMConnectStart}
                                            />
                                            {/*<Field type="text" id="vm-connect-start" name="vm-connect-start" value={vmConnectStart} onChange={changeVMConnectStart}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-connect-start')}
                                            {/*<ErrorMessage name="vm-connect-start">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDStart.length > 0 ? false : true}>
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
                            vmStartSubmit ? (
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
                                        vmConnectStartChecked ? (
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
                    <ReactBootstrap.Tab eventKey="stop-vm" title={t('vm-stop')}>
                        <Formik
                            initialValues={{
                                id_instance: "",
                            }}
                            validationSchema={stopVMSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={stopVirtualEnvironment} id="form-stop-vm">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-stop">{t('vm-id-instance')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-stop" name="vm-id-stop" value={vmIDStop} onChange={changeVMIDStop}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-stop')}
                                            {/*<ErrorMessage name="vm-id-stop">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDStop.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="list-vm" title={t('vm-list')}>
                        <ReactBootstrap.Row id="list-vm">
                            {
                                allVM.length > 0
                                    ? (
                                        allVM.map((data) => {
                                            return (
                                                <>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        DaaS - ID:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {data.daas_id}
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
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="status-vm" title={t('vm-status')}>
                        <Formik
                            initialValues={{
                                id: "",
                            }}
                            validationSchema={statusVMSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={statusVirtualEnvironment} id="form-status-vm">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-status">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-status" name="vm-id-status" value={vmIDStatus} onChange={changeVMIDStatus}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-status')}
                                            {/*<ErrorMessage name="vm-id-status">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDStatus.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                        {
                            vmIDStatusSubmit ? (
                                <ReactBootstrap.Row id="list-status-vm">
                                    {
                                        Object.keys(statusVM).length !== 0 && statusVM.constructor === Object
                                            ? (
                                                <>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        ceph_public:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {String(statusVM.ceph_public)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        ceph_shared:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {String(statusVM.ceph_shared)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        ceph_user:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {String(statusVM.ceph_user)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        environments:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="image-list-object">
                                                        <pre>
                                                            {JSON.stringify(statusVM.environments, null, 3)}
                                                        </pre>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        extra_args:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {statusVM.extra_args}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        id:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {statusVM.id}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        id_docker:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {statusVM.id_docker}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        id_owner:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {String(statusVM.id_owner)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        id_proxmox:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {String(statusVM.id_proxmox)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        id_user:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {String(statusVM.id_user)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        object_apps:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="image-list-object">
                                                        <pre>
                                                            {JSON.stringify(statusVM.object_apps, null, 3)}
                                                        </pre>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        object_state:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {String(statusVM.object_state)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        object_storage:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {String(statusVM.object_storage)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        object_target:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {String(statusVM.object_target)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        object_tasks:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="image-list-object">
                                                        <pre>
                                                            {JSON.stringify(statusVM.object_tasks, null, 3)}
                                                        </pre>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        object_type:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {String(statusVM.object_type)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        os_installer:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {String(statusVM.os_installer)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        os_password:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {String(statusVM.os_password)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        os_type:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {String(statusVM.os_type)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        os_username:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {String(statusVM.os_username)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        os_wine:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {String(statusVM.os_wine)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        stateinfo:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6} className="image-list-object">
                                                        <pre>
                                                            {JSON.stringify(statusVM.stateinfo, null, 3)}
                                                        </pre>
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        vnc_password:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {String(statusVM.vnc_password)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        vnc_port_instance:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {String(statusVM.vnc_port_instance)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        vnc_port_system:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {String(statusVM.vnc_port_system)}
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        vnc_username:
                                                    </ReactBootstrap.Col>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                        {String(statusVM.vnc_username)}
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
                    <ReactBootstrap.Tab eventKey="config-vm" title={t('vm-config')}>
                        <Formik
                            initialValues={{
                                id: "",
                            }}
                            validationSchema={configVMSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={configurationVirtualEnvironment} id="form-config-vm">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-config">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-config" name="vm-id-config" value={vmIDConfig} onChange={changeVMIDConfig}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-config')}
                                            {/*<ErrorMessage name="vm-id-config">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDConfig.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                        {
                            vmIDConfigSubmit ? (
                                <ReactBootstrap.Row id="list-config-vm">
                                    {
                                        configVM
                                            ? (
                                                Object.entries(configVM).map(([key, value]) => {
                                                    return (
                                                        <>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                {key}:
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                {
                                                                    typeof value === "object" ? (
                                                                        <ReactBootstrap.Row id="list-config-vm">
                                                                            {
                                                                                Object.entries(value).map(([keyTwo, valueTwo]) => {
                                                                                    return (
                                                                                        <>
                                                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                                {keyTwo}:
                                                                                            </ReactBootstrap.Col>
                                                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                                {valueTwo}
                                                                                            </ReactBootstrap.Col>
                                                                                        </>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </ReactBootstrap.Row>
                                                                    ) : value
                                                                }
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
                    <ReactBootstrap.Tab eventKey="config-pre-vm" title={t('vm-config') + " (" + t('vm-config-pre') + ")"}>
                        <Formik
                            initialValues={{
                                id: "",
                                name: "",
                                ostype: "",
                                cores: "",
                                memsize: "",
                                disksize: "",
                                iso_installer: "",
                                keyboard_layout: "",
                            }}
                            validationSchema={preConfigVMSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={preConfigVirtualEnvironment} id="form-config-pre-vm">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-config-pre">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-config-pre" name="vm-id-config-pre" value={vmIDConfigPre} onChange={changeVMIDConfigPre}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-config-pre')}
                                            {/*<ErrorMessage name="vm-id-config-pre">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-name-config-pre">{t('vm-name')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-name-config-pre" name="vm-name-config-pre" value={vmNameConfigPre} onChange={changeVMNameConfigPre}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-name-config-pre')}
                                            {/*<ErrorMessage name="vm-name-config-pre">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-cores-config-pre">{t('vm-cores')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-cores-config-pre" name="vm-cores-config-pre" value={vmCoresConfigPre} onChange={changeVMCoresConfigPre}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-cores-config-pre')}
                                            {/*<ErrorMessage name="vm-cores-config-pre">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-memory-size-config-pre">{t('vm-memory-size')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-memory-size-config-pre" name="vm-memory-size-config-pre" value={vmMemorySizeConfigPre} onChange={changeVMMemorySizeConfigPre}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-memory-size-config-pre')}
                                            {/*<ErrorMessage name="vm-memory-size-config-pre">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-disk-size-config-pre">{t('vm-disk-size')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-disk-size-config-pre" name="vm-disk-size-config-pre" value={vmDiskSizeConfigPre} onChange={changeVMDiskSizeConfigPre}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-disk-size-config-pre')}
                                            {/*<ErrorMessage name="vm-disk-size-config-pre">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-os-type-config-pre">{t('vm-os-type')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-os-type-config-pre" name="vm-os-type-config-pre" value={vmOSTypeConfigPre} onChange={changeVMOSTypeConfigPre}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-os-type-config-pre')}
                                            {/*<ErrorMessage name="vm-os-type-config-pre">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-iso-installer-config-pre">{t('vm-iso-installer')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-iso-installer-config-pre" name="vm-iso-installer-config-pre" value={vmISOConfigPre} onChange={changeVMISOConfigPre}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-iso-installer-config-pre')}
                                            {/*<ErrorMessage name="vm-iso-installer-config-pre">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-keyboard-language-config-pre">{t('vm-keyboard-language')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-keyboard-language-config-pre" name="vm-keyboard-language-config-pre" value={vmKeyboardLanguageConfigPre} onChange={changeVMKeyboardLanguageConfigPre}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-keyboard-language-config-pre')}
                                            {/*<ErrorMessage name="vm-keyboard-language-config-pre">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDConfigPre.length > 0 && vmCoresConfigPre.length > 0 && vmMemorySizeConfigPre.length > 0 && vmDiskSizeConfigPre.length > 0 && vmOSTypeConfigPre.length > 0 && vmNameConfigPre.length > 0 && vmISOConfigPre.length > 0 && vmKeyboardLanguageConfigPre.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="config-post-vm" title={t('vm-config') + " (" + t('vm-config-post') + ")"}>
                        <Formik
                            initialValues={{
                                id: "",
                                name: "",
                                keyboard_layout: "",
                            }}
                            validationSchema={postConfigVMSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={postConfigVirtualEnvironment} id="form-config-post-vm">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-config-post">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-config-post" name="vm-id-config-post" value={vmIDConfigPost} onChange={changeVMIDConfigPost}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-config-post')}
                                            {/*<ErrorMessage name="vm-id-config-post">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-name-config-post">{t('vm-name')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-name-config-post" name="vm-name-config-post" value={vmNameConfigPost} onChange={changeVMNameConfigPost}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-name-config-post')}
                                            {/*<ErrorMessage name="vm-name-config-post">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-keyboard-language-config-post">{t('vm-keyboard-language')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-keyboard-language-config-post" name="vm-keyboard-language-config-post" value={vmKeyboardLanguageConfigPost} onChange={changeVMKeyboardLanguageConfigPost}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-keyboard-language-config-post')}
                                            {/*<ErrorMessage name="vm-keyboard-language-config-post">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDConfigPost.length > 0 && vmNameConfigPost.length > 0 && vmKeyboardLanguageConfigPost.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="snapshot-list-vm" title={t('vm-snapname') + " (" + t('vm-list') + ")"}>
                        <Formik
                            initialValues={{
                                id: "",
                            }}
                            validationSchema={snapshotListVMSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={snapshotListVirtualEnvironment} id="form-snapshot-list-vm">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-snapshot-list">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-snapshot-list" name="vm-id-snapshot-list" value={vmIDSnapshot} onChange={changeVMSnapshotID}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-snapshot-list')}
                                            {/*<ErrorMessage name="vm-id-snapshot-list">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDSnapshot.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                        {
                            vmIDSnapshotSubmit ? (
                                <ReactBootstrap.Row id="list-config-vm">
                                    {
                                        allSnapshots.length > 0
                                            ? (
                                                allSnapshots.map(data => {
                                                    return (
                                                        <>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                                {t('vm-snapname')}
                                                            </ReactBootstrap.Col>
                                                            <>
                                                                {
                                                                    Object.entries(data).map(([key, value]) => {
                                                                        return (
                                                                            <>
                                                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                    {key}:
                                                                                </ReactBootstrap.Col>
                                                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                                    {value}
                                                                                </ReactBootstrap.Col>
                                                                            </>
                                                                        )
                                                                    })
                                                                }
                                                            </>
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
                    <ReactBootstrap.Tab eventKey="snapshot-create-vm" title={t('vm-snapname') + " (" + t('vm-create') + ")"}>
                        <Formik
                            initialValues={{
                                id: "",
                                snapname: "",
                                desc: "",
                            }}
                            validationSchema={snapshotCreateVMSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={snapshotCreateVirtualEnvironment} id="form-snapshot-create-vm">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-snapshot-create">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-snapshot-create" name="vm-id-snapshot-create" value={vmIDSnapshotCreate} onChange={changeVMSnapshotIDCreate}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-snapshot-create')}
                                            {/*<ErrorMessage name="vm-id-snapshot-create">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-snapshot-name">{t('vm-snapname')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-snapshot-name" name="vm-id-snapshot-name" value={vmIDSnapshotName} onChange={changeVMSnapshotIDName}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-snapshot-name')}
                                            {/*<ErrorMessage name="vm-id-snapshot-name">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-snapshot-desc">{t('vm-desc')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-snapshot-desc" name="vm-id-snapshot-desc" value={vmIDSnapshotDesc} onChange={changeVMSnapshotIDDesc}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-snapshot-desc')}
                                            {/*<ErrorMessage name="vm-id-snapshot-desc">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDSnapshotCreate.length > 0 && vmIDSnapshotName.length > 0 && vmIDSnapshotDesc.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="snapshot-rollback-vm" title={t('vm-snapname') + " (" + t('vm-rollback') + ")"}>
                        <Formik
                            initialValues={{
                                id: "",
                                snapname: "",
                            }}
                            validationSchema={snapshotRollbackVMSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={snapshotRollbackVirtualEnvironment} id="form-snapshot-rollback-vm">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-snapshot-rollback">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-snapshot-rollback" name="vm-id-snapshot-rollback" value={vmIDSnapshotRollback} onChange={changeVMSnapshotIDRollback}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-snapshot-rollback')}
                                            {/*<ErrorMessage name="vm-id-snapshot-create">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-snapshot-name-rollback">{t('vm-snapname')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-snapshot-name-rollback" name="vm-id-snapshot-name-rollback" value={vmIDSnapshotNameRollback} onChange={changeVMSnapshotIDNameRollback}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-snapshot-name-rollback')}
                                            {/*<ErrorMessage name="vm-id-snapshot-name-rollback">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDSnapshotRollback.length > 0 && vmIDSnapshotNameRollback.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="clone-vm" title={t('vm-clone')}>
                        <Formik
                            initialValues={{
                                id: "",
                                newid: "",
                                name: "",
                                kb: "",
                                snapname: "",
                                ceph_public: "",
                                ceph_shared: "",
                                ceph_user: "",
                            }}
                            validationSchema={cloneVMSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={cloneVirtualEnvironment} id="form-clone-vm">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-clone">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-clone" name="vm-id-clone" value={vmIDClone} onChange={changeVMIDClone}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-clone')}
                                            {/*<ErrorMessage name="vm-id-clone">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-new-clone">{t('vm-new-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-new-clone" name="vm-id-new-clone" value={vmNewIDClone} onChange={changeVMNewIDClone}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-new-clone')}
                                            {/*<ErrorMessage name="vm-id-new-clone">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-name-clone">{t('vm-name')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-name-clone" name="vm-name-clone" value={vmNameClone} onChange={changeVMNameClone}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-name-clone')}
                                            {/*<ErrorMessage name="vm-name-clone">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-kb-clone">{t('vm-keyboard-language')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-kb-clone" name="vm-kb-clone" value={vmKeyboardLanguageClone} onChange={changeVMKeyboardLanguageClone}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-kb-clone')}
                                            {/*<ErrorMessage name="vm-kb-clone">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-snapname-clone">{t('vm-snapname')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-snapname-clone" name="vm-snapname-clone" value={vmSnapnameClone} onChange={changeVMSnapnameClone}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-snapname-clone')}
                                            {/*<ErrorMessage name="vm-snapname-clone">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-ceph-public-clone">{t('vm-ceph-public')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-ceph-public-clone"
                                                name="vm-ceph-public-clone"
                                                value={vmCephPublicClone}
                                                checked={vmCephPublicCloneChecked}
                                                onChange={checkChangeVMCephPublicClone}
                                            />
                                            {/*<Field type="text" id="vm-ceph-public-clone" name="vm-ceph-public-clone" value={vmCephPublicClone} onChange={changeVMCephPublicClone}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-ceph-public-clone')}
                                            {/*<ErrorMessage name="vm-ceph-public-clone">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-ceph-shared-clone">{t('vm-ceph-shared')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-ceph-shared-clone"
                                                name="vm-ceph-shared-clone"
                                                value={vmCephSharedClone}
                                                checked={vmCephSharedCloneChecked}
                                                onChange={checkChangeVMCephSharedClone}
                                            />
                                            {/*<Field type="text" id="vm-ceph-shared-clone" name="vm-ceph-shared-clone" value={vmCephSharedClone} onChange={changeVMCephSharedClone}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-ceph-shared-clone')}
                                            {/*<ErrorMessage name="vm-ceph-shared-clone">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-ceph-user-clone">{t('vm-ceph-user')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-ceph-user-clone"
                                                name="vm-ceph-user-clone"
                                                value={vmCephUserClone}
                                                checked={vmCephUserCloneChecked}
                                                onChange={checkChangeVMCephUserClone}
                                            />
                                            {/*<Field type="text" id="vm-ceph-user-clone" name="vm-ceph-user-clone" value={vmCephUserClone} onChange={changeVMCephUserClone}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-ceph-user-clone')}
                                            {/*<ErrorMessage name="vm-ceph-user-clone">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDClone.length > 0 && vmNewIDClone.length > 0 && vmNameClone.length > 0 && vmKeyboardLanguageClone.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="convert-vm" title={t('vm-template-convert')}>
                        <Formik
                            initialValues={{
                                id: "",
                                disk: "",
                            }}
                            validationSchema={convertVMSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={convertVirtualEnvironment} id="form-convert-vm">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-convert">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-convert" name="vm-id-convert" value={vmIDConvert} onChange={changeVMIDConvert}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-convert')}
                                            {/*<ErrorMessage name="vm-id-convert">
                                            </ErrorMessage>*/}
                                        </div>

                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-disk-convert">{t('vm-disk')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-disk-convert" name="vm-disk-convert" value={vmDiskConvert} onChange={changeVMDiskConvert}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-disk-convert')}
                                            {/*<ErrorMessage name="vm-disk-convert">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDConvert.length > 0 && vmDiskConvert.length > 0 ? false : true}>
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

export default SettingsVirtualEnvironment;
