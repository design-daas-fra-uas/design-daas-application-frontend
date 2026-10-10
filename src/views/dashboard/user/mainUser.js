import React, { useEffect, useState } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { DEVELOPMENT, DEVELOPMENT_INTERN, PASSWORD, URL_SYSTEM, USERNAME } from "../../../constants/constants";
import { Field, Form, Formik } from "formik";
import { useMediaQuery } from "react-responsive";
import Logo from "../../../assets/images/png/DESIGNLogoColouredWhiteFont.png";
import { requestApplicationAdminSchema, createAppSchema, updateAppSchema, createFileSchema, updateFileSchema, phasesBaseimageCreateContainerSchema, phasesBaseimageCreateVMSchema, phasesBaseimageCloneSchema, vmDataSchema, containerDataSchema } from "./mainUserSchemas";

const LOGOUT_STORAGE_KEYS = [
    "role",
    "language",
    "userData",
    "userDataID",
    "objectSharedApp",
    "objectUserID",
    "application",
    "app-data",
    "app-data-option",
    "instance-object-id",
    "instance-env",
    "env-object-id",
    "env-name",
    "connection-object-id",
    "connection-env",
    "connection-shared-object-id",
    "connection-shared-env",
    "object-id",
    "object-env-name",
    "object-state",
    "messageError",
    "userDataName",
    "userToken",
    "userTimeToken",
    "userRefreshToken",
    "user-group-id",
    "desktop-group-id",
    "selected-environment-id",
    "selected-environment-name",
    "selected-instance-id",
    "selected-instance-env-name",
    "selected-environment-envname",
    "selected-connection-index",
    "selected-object-id",
    "selected-object-env-name",
    "selected-object-state",
    "expert-mode-baseimage",
    "expert-mode-environment",
    "expert-mode-environment-id",
    "expert-mode-environment-env",
    "timeUser",
    "application-viewer-id",
    "environment-viewer-id",
    "object-viewer-id",
    "dashboard-info",
    "environment-type-mode",
];

const bindValue = setter => event => setter(event.target.value);

function MainUser() {
    const [baseimageCreate, setBaseimageCreate] = useState(false);
    const [environmentCreate, setEnvironmentCreate] = useState(false);
    const [environmentApps, setEnvironmentApps] = useState([]);
    //const [environmentSharedAppsMiddle, setEnvironmentSharedAppsMiddle] = useState([]);
    const [environmentSharedApps, setEnvironmentSharedApps] = useState([]);
    const [environmentSharedAppsName, setEnvironmentSharedAppsName] = useState([]);
    const [sharedData, setSharedData] = useState([]);
    const [ownApplication, setOwnApplication] = useState([]);
    const [ownFiles, setOwnFiles] = useState([]);
    const [sharedFiles, setSharedFiles] = useState([]);
    const [dashboardInfo, setDashboardInfo] = useState({});
    const [connectionDataNew, setConnectionDataNew] = useState([]);
    const [dockerfileEnvironmentCreate, setDockerfileEnvironmentCreate] = useState();
    const [dockerfileBaseImageCreate, setDockerfileBaseImageCreate] = useState();
    const [availableEnvironmentValue, setAvailableEnvironmentValue] = useState();
    const [availableInstanceValue, setAvailableInstanceValue] = useState();
    const [availableConnectionValue, setAvailableConnectionValue] = useState();
    const [availableObjectValue, setAvailableObjectValue] = useState();
    const [viewerURL, setViewerURL] = useState("");
    const [startApplicationSuccess, setStartApplicationSuccess] = useState(false);
    const [applicationModal, setApplicationModal] = useState(false);
    const [requestModal, setRequestModal] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [fileModal, setFileModal] = useState(false);
    const [fileDetailsModal, setFileDetailsModal] = useState(false);
    const [detailFileInfo, setDetailFileInfo] = useState({});
    //const [detailViewButton, setDetailViewButton] = useState(false);
    const [requestMessage, setRequestMessage] = useState("");
    const [requestUserID, setRequestUserID] = useState("");
    const [requestUsername, setRequestUsername] = useState("");
    const [instanceStopData, setInstanceStopData] = useState([]);
    const [connectionDataNewer, setConnectionDataNewer] = useState([]);
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
    const [vmCreateUpdateAppID, setVMCreateUpdateAppID] = useState("");
    const [vmCreateUpdateAppName, setVMCreateUpdateAppName] = useState("");
    const [vmCreateUpdateAppIDFile, setVMCreateUpdateAppIDFile] = useState("");
    const [vmCreateUpdateAppIDTemplate, setVMCreateUpdateAppIDTemplate] = useState("");
    const [vmCreateUpdateAppOSType, setVMCreateUpdateAppOSType] = useState("win10");
    const [vmCreateUpdateAppInstaller, setVMCreateUpdateAppInstaller] = useState("");
    const [vmCreateUpdateAppInstallerARGS, setVMCreateUpdateAppInstallerARGS] = useState("");
    const [vmCreateUpdateAppInstallerType, setVMCreateUpdateAppInstallerType] = useState("none");
    const [vmCreateUpdateAppTarget, setVMCreateUpdateAppTarget] = useState("");
    const [vmCreateUpdateAppTargetARGS, setVMCreateUpdateAppTargetARGS] = useState("");
    const [vmCreateUpdateAppVersion, setVMCreateUpdateAppVersion] = useState("");
    const [vmFileUploadAppID, setVMFileUploadAppID] = useState("");
    const [vmFileUploadAppName, setVMFileUploadAppName] = useState("");
    const [vmFileUploadAppPath, setVMFileUploadAppPath] = useState("");
    const [vmFileUploadAppOSType, setVMFileUploadAppOSType] = useState("win10");
    const [vmFileUploadAppVersion, setVMFileUploadAppVersion] = useState("");
    const [vmFileUploadAppSelectFile, setVMFileUploadAppSelectFile] = useState("");
    const [searchFilterData, setSearchFilterData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [dataList, setDataList] = useState([]);
    const [searchFilterDataShared, setSearchFilterDataShared] = useState([]);
    const [searchTextShared, setSearchTextShared] = useState("");
    const [dataListShared, setDataListShared] = useState([]);
    const [allAvailableInstances, setAllAvailableInstances] = useState([]);
    const [stopObjectAvailable, setStopObjectAvailable] = useState(false);
    const [requestAlert, setRequestAlert] = useState(false);
    const [requestAlertMessage, setRequestAlertMessage] = useState(false);
    const {t, i18n} = useTranslation();

    const isSmall = useMediaQuery({
        query: '(max-width: 767px)'
    })

    const fetchDashboardInfo = () => {
        axios.post(DEVELOPMENT + '/monitoring/dashboard_info', {}, {
            headers: {
                Authorization: localStorage.getItem("userToken"),
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': URL_SYSTEM,
                'Access-Control-Allow-Headers': URL_SYSTEM,
            },
            // withCredentials: true,
        })
            .then(response => {
                console.log(response);
                localStorage.setItem("dashboard-info", JSON.stringify(response.data.response_data.dashboardinfo))
                const arrayConnection = response.data.response_data.dashboardinfo.available_connections;
                const arrayInstances = response.data.response_data.dashboardinfo.available_instances;
                const arrayApplications = response.data.response_data.dashboardinfo.available_applications;

                setAllAvailableInstances(response.data.response_data.dashboardinfo.available_instances);

                let newArrayApps = [];

                arrayApplications.map(data => {
                    newArrayApps.push(data)
                })

                setSearchFilterData(newArrayApps)
                setSearchFilterDataShared(newArrayApps)
                setDataListShared(newArrayApps)
                setDataList(newArrayApps)

                setConnectionDataNewer(arrayConnection)

                let newArrConnection = [];
                let newInstanceFilterData = [];

                for (let i = 0; i < arrayConnection.length; i++) {
                    for (let j = 0; j < arrayInstances.length; j++) {
                        if (arrayConnection[i].id_inst == arrayInstances[j].id_instance) {
                            newArrConnection.push(arrayInstances[j]);
                        }
                    }
                }

                arrayInstances.map(instanceObjectData => {
                    newInstanceFilterData.push({
                        "ID_Instance": instanceObjectData.id_instance,
                        "ID_Object": instanceObjectData.id_object,
                        "Env_Name": instanceObjectData.name_env
                    })
                })

                setInstanceStopData(newInstanceFilterData)
                console.log(newInstanceFilterData)

                setConnectionDataNew(newArrConnection)

                if (response.status === 200 && response.data.response_code === 200) {
                    setDashboardInfo(response.data.response_data.dashboardinfo)
                    setSharedData(response.data.response_data.dashboardinfo.available_applications)

                    const filterOwnData = response.data.response_data.dashboardinfo.available_applications.filter(function (userdata) {
                        return userdata.id_owner == Number(localStorage.getItem('userDataID'))
                    });

                    setOwnApplication(filterOwnData)

                    const filterOwnFile = response.data.response_data.dashboardinfo.available_files.filter(function (userdata) {
                        return userdata.id_owner == Number(localStorage.getItem('userDataID'))
                    });

                    setOwnFiles(filterOwnFile)

                    const filterSharedFile = response.data.response_data.dashboardinfo.available_files.filter(function (userdata) {
                        return userdata.id_owner == 0
                    });

                    setSharedFiles(filterSharedFile)
                }
            })
            .catch(e => {
                console.log(e)
            });
    };

    const refreshDashboard = event => {
        event.preventDefault();

        fetchDashboardInfo();
    }

    const chooseApplication = (applicationNameText) => {
        localStorage.setItem('application', applicationNameText)

        window.location.href = "/dashboard/startApplication";
    };

    const goToMonitoring = () => {
        window.location.href = "/dashboard/monitoring";
    }

    const showInfoModal = () => {
        setInfoModal(true);
    };

    const closeInfoModal = () => {
        setInfoModal(false);
    };

    const showApplicationModal = () => {
        setApplicationModal(true);
    };

    const closeApplicationModal = () => {
        setApplicationModal(false);
        setRequestMessage("");
    };

    const showRequestModal = () => {
        setRequestModal(true);
    };

    const closeRequestModal = () => {
        setRequestModal(false);
        setRequestMessage("");
    };

    const showFileModal = () => {
        setFileModal(true);
    };

    const closeFileModal = () => {
        setFileModal(false);
        setRequestMessage("");
    };

    const showFileDetailsModal = () => {
        setFileDetailsModal(true);
    };

    const closeFileDetailsModal = () => {
        setFileDetailsModal(false);
        setRequestMessage("");
    };

    const getFileDetailsModal = (id) => {
        setFileDetailsModal(true);

        axios.post(DEVELOPMENT + '/files/get', {
            id: id,
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

                    setDetailFileInfo(response.data.response_data)

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(false);

                    setDetailFileInfo({})

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
            })
            .catch(e => {
                console.log(e)
                setRequestAlert(true);

                setDetailFileInfo({})

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    };

    const changeRequestMessage = bindValue(setRequestMessage);

    useEffect(() => {
        const token = localStorage.getItem("userToken");

        localStorage.setItem("application-viewer-id", "")
        localStorage.setItem("environment-viewer-id", "")
        localStorage.setItem("object-viewer-id", "")
        localStorage.setItem("selected-environment-id", "")
        localStorage.setItem("selected-environment-name", "")
        localStorage.setItem("selected-instance-id", "")
        localStorage.setItem("selected-instance-env-name", "")
        localStorage.setItem("selected-connection-index", "")
        localStorage.setItem("selected-object-id", "")
        localStorage.setItem("selected-object-env-name", "")
        localStorage.setItem("selected-object-state", "")
        localStorage.setItem("object-id-instance", "")

        if (localStorage.getItem("selected-environment-id") === undefined && localStorage.getItem("selected-environment-name") === undefined) {
            setAvailableEnvironmentValue("")
        }

        if (localStorage.getItem("selected-instance-id") === undefined && localStorage.getItem("selected-instance-env-name") === undefined) {
            setAvailableInstanceValue("")
        }

        if (localStorage.getItem("selected-connection-index") === undefined) {
            setAvailableConnectionValue("")
        }

        if (localStorage.getItem("selected-object-id") === undefined && localStorage.getItem("selected-object-env-name") === undefined && localStorage.getItem("selected-object-state") === undefined) {
            setAvailableObjectValue("")
        }

        axios.get(DEVELOPMENT_INTERN + '/oauth2/user/session', {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*",
                'Access-Control-Allow-Headers': "*",
            },
            // withCredentials: true,
        })
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    localStorage.setItem('userDataID', response.data.user_id)
                    localStorage.setItem('userDataName', response.data.name)

                    setRequestUserID(response.data.user_id)
                    setRequestUsername(response.data.name)
                }
            })
            .catch(e => {
                console.log(e)
            });

        fetchDashboardInfo();

        /*axios.post(DEVELOPMENT + '/phases/environments_get', {
            id: "",
        }, {
            headers: {
                Authorization: token,
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': URL_SYSTEM,
                'Access-Control-Allow-Headers': URL_SYSTEM,
            },
            // withCredentials: true,
        })
            .then(response => {
                console.log(response);
                if (response.status === 200 && response.data.response_code === 200) {
                  setDashboardInfo(response.data.response_data.dashboardinfo)
                }
            })
            .catch(e => {
                console.log(e)
            });*/

        /* User applications */

        axios.post(DEVELOPMENT + '/phases/object_list', {
            onlyuser: "on",
        }, {
            headers: {
                Authorization: token,
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': URL_SYSTEM,
                'Access-Control-Allow-Headers': URL_SYSTEM,
            },
            // withCredentials: true,
        })
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    if (response.data.response_data.length > 0) {
                        const firstData = response.data.response_data.find(function (userdata) {
                            return userdata.daas_owner == Number(localStorage.getItem('userDataID'))
                        });
                        //console.log(firstData.daas_id);
                        console.log("List: " + JSON.stringify(response.data.response_data))
                        localStorage.setItem("objectUserID", firstData.daas_id)

                        //setTimeout(() => {
                        axios.post(DEVELOPMENT + '/phases/object_status', {
                            id: firstData.daas_id,
                        }, {
                            headers: {
                                Authorization: token,
                                'Content-Type': 'multipart/form-data',
                                'Access-Control-Allow-Origin': URL_SYSTEM,
                                'Access-Control-Allow-Headers': URL_SYSTEM,
                            },
                            // withCredentials: true,
                        })
                            .then(response => {
                                //console.log(response);
                                console.log("Status: " + response.data.response_data)
                                if (response.status === 200) {
                                    if (response.data.response_data !== undefined && response.data.response_data.environments.length > 0) {
                                        setEnvironmentApps([response.data.response_data.environments[0]])
                                    } else {
                                        setEnvironmentApps([])
                                    }
                                }
                            })
                            .catch(e => {
                                console.log(e)
                            });
                        //}, 3000);
                    } else {
                        console.log("No data")
                    }
                }
            })
            .catch(e => {
                console.log(e)
            });

        /* Shared applications */

        /*axios.post(DEVELOPMENT + '/phases/object_list', {
          onlydaas: "on",
        }, {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': URL_SYSTEM,
            'Access-Control-Allow-Headers': URL_SYSTEM,
          },
          // withCredentials: true,
        })
        .then(response => {
          console.log(response);
          if (response.status === 200) {
            if (response.data.response_data.length > 0) {
              const sharedData = response.data.response_data.filter(function (userdata) {
                return userdata.daas_owner // == 0
              });
              localStorage.setItem("objectSharedApp", JSON.stringify(response.data.response_data))

              //console.log("Shared data" + JSON.stringify(sharedData))

              // setEnvironmentSharedAppsMiddle(sharedData);

              let environmentSharedAppsMiddle = [];

              sharedData.map(shareID => {
                axios.post(DEVELOPMENT + '/phases/object_status', {
                  id: shareID.daas_id,
                }, {
                  headers: {
                    Authorization: token,
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': URL_SYSTEM,
                    'Access-Control-Allow-Headers': URL_SYSTEM,
                  },
                  // withCredentials: true,
                })
                .then(response => {
                  console.log(response);
                  if (response.status === 200) {
                    //console.log(response.data.response_data.environments.length !== 0)
                    if (response.data.response_data.environments.length !== 0) {
                      //for (let i = 0; i <= response.data.response_data.environments.length; i++) {
                        environmentSharedAppsMiddle.push(response.data.response_data.environments[0])
                        //setEnvironmentSharedApps(prevArray => [...prevArray, response.data.response_data.environments[0].env_apps[0]])
                      if (response.data.response_data.environments[0].env_apps.length > 0) {
                        setEnvironmentSharedAppsName(prevArray => [...prevArray, response.data.response_data.environments[0].env_apps[0].name])
                      } else {
                        setEnvironmentSharedAppsName(prevArray => [...prevArray, "none"])
                      }
                      //}
                    } else {
                      console.log("No environment data available")
                    }
                  }
                })
                .catch(e => {
                  console.log(e)
                });
              })

              setTimeout(() => {
                setEnvironmentSharedApps(environmentSharedAppsMiddle)
                console.log(environmentSharedAppsMiddle)
              }, 4000)
            } else {
              console.log("No data")
            }
          }
        })
        .catch(e => {
          console.log(e)
        });*/
    }, [])

    const startObject = (event, id, env, state) => {
        const token = localStorage.getItem("userToken");

        event.preventDefault();

        if (state === "environment-create" || state === "environment-final") {
            axios.post(DEVELOPMENT + '/phases/environment_start', {
                id: id,
                name: env,
                connect: "on",
            }, {
                headers: {
                    'Authorization': token,
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

                        fetchDashboardInfo();

                        localStorage.setItem("object-id-instance", response.data.id_instance)

                        localStorage.setItem("connection-env", response.data.response_url)

                        setTimeout(() => {
                            setRequestAlert(false);
                            setRequestAlertMessage(false);

                            window.location.href = "/dashboard/connectionRun";
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
        } else if (state === "baseimage-create" || state === "baseimage-final") {
            axios.post(DEVELOPMENT + '/phases/baseimage_start', {
                id: id,
                connect: "on",
            }, {
                headers: {
                    'Authorization': token,
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

                        fetchDashboardInfo();

                        localStorage.setItem("object-id-instance", response.data.id_instance)

                        localStorage.setItem("connection-env", response.data.response_url)

                        setTimeout(() => {
                            setRequestAlert(false);
                            setRequestAlertMessage(false);

                            window.location.href = "/dashboard/connectionRun";
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
        } else {
            console.log("Error")
        }
    }

    const stopObject = (event, id, env, state) => {
        const token = localStorage.getItem("userToken");

        event.preventDefault();

        let newIDInstance = "";

        /*instanceStopData.map(dataInstance => {
            if (dataInstance.ID_object === id) {
                localStorage.setItem("object-id-instance", dataInstance.ID_Instance);
            }
        })*/

        if (state === "environment-create" || state === "environment-final") {
            axios.post(DEVELOPMENT + '/phases/environment_stop', {
                id: localStorage.getItem("object-id-instance"),
                name: env,
                force: "on",
            }, {
                headers: {
                    'Authorization': token,
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

                        axios.post(DEVELOPMENT + '/monitoring/dashboard_info', {}, {
                            headers: {
                                Authorization: localStorage.getItem("userToken"),
                                'Content-Type': 'multipart/form-data',
                                'Access-Control-Allow-Origin': URL_SYSTEM,
                                'Access-Control-Allow-Headers': URL_SYSTEM,
                            },
                            // withCredentials: true,
                        })
                            .then(response => {
                                console.log(response);

                                localStorage.setItem("object-id-instance", "")
                                localStorage.setItem("dashboard-info", JSON.stringify(response.data.response_data.dashboardinfo))
                                const arrayConnection = response.data.response_data.dashboardinfo.available_connections;
                                const arrayInstances = response.data.response_data.dashboardinfo.available_instances;
                                const arrayApplications = response.data.response_data.dashboardinfo.available_applications;

                                setAllAvailableInstances(response.data.response_data.dashboardinfo.available_instances);

                                let newArrayApps = [];

                                arrayApplications.map(data => {
                                    newArrayApps.push(data)
                                })

                                setSearchFilterData(newArrayApps)
                                setSearchFilterDataShared(newArrayApps)
                                setDataListShared(newArrayApps)
                                setDataList(newArrayApps)

                                setConnectionDataNewer(arrayConnection)

                                let newArrConnection = [];
                                let newInstanceFilterData = [];

                                for (let i = 0; i < arrayConnection.length; i++) {
                                    for (let j = 0; j < arrayInstances.length; j++) {
                                        if (arrayConnection[i].id_inst == arrayInstances[j].id_instance) {
                                            newArrConnection.push(arrayInstances[j]);
                                        }
                                    }
                                }

                                arrayInstances.map(instanceObjectData => {
                                    newInstanceFilterData.push({
                                        "ID_Instance": instanceObjectData.id_instance,
                                        "ID_Object": instanceObjectData.id_object,
                                        "Env_Name": instanceObjectData.name_env
                                    })
                                })

                                setInstanceStopData(newInstanceFilterData)
                                console.log(newInstanceFilterData)

                                setConnectionDataNew(newArrConnection)

                                if (response.status === 200 && response.data.response_code === 200) {
                                    setDashboardInfo(response.data.response_data.dashboardinfo)
                                    setSharedData(response.data.response_data.dashboardinfo.available_applications)

                                    const filterOwnData = response.data.response_data.dashboardinfo.available_applications.filter(function (userdata) {
                                        return userdata.id_owner == Number(localStorage.getItem('userDataID'))
                                    });

                                    setOwnApplication(filterOwnData)

                                    const filterOwnFile = response.data.response_data.dashboardinfo.available_files.filter(function (userdata) {
                                        return userdata.id_owner == Number(localStorage.getItem('userDataID'))
                                    });

                                    setOwnFiles(filterOwnFile)

                                    const filterSharedFile = response.data.response_data.dashboardinfo.available_files.filter(function (userdata) {
                                        return userdata.id_owner == 0
                                    });

                                    setSharedFiles(filterSharedFile)
                                }
                            })
                            .catch(e => {
                                console.log(e)
                            });

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
        } else if (state === "baseimage-create" || state === "baseimage-final") {
            axios.post(DEVELOPMENT + '/phases/baseimage_stop', {
                id_instance: localStorage.getItem("object-id-instance"),
                force: "on",
            }, {
                headers: {
                    'Authorization': token,
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

                        axios.post(DEVELOPMENT + '/monitoring/dashboard_info', {}, {
                            headers: {
                                Authorization: localStorage.getItem("userToken"),
                                'Content-Type': 'multipart/form-data',
                                'Access-Control-Allow-Origin': URL_SYSTEM,
                                'Access-Control-Allow-Headers': URL_SYSTEM,
                            },
                            // withCredentials: true,
                        })
                            .then(response => {
                                console.log(response);

                                localStorage.setItem("object-id-instance", "")
                                localStorage.setItem("dashboard-info", JSON.stringify(response.data.response_data.dashboardinfo))
                                const arrayConnection = response.data.response_data.dashboardinfo.available_connections;
                                const arrayInstances = response.data.response_data.dashboardinfo.available_instances;
                                const arrayApplications = response.data.response_data.dashboardinfo.available_applications;

                                setAllAvailableInstances(response.data.response_data.dashboardinfo.available_instances);

                                let newArrayApps = [];

                                arrayApplications.map(data => {
                                    newArrayApps.push(data)
                                })

                                setSearchFilterData(newArrayApps)
                                setSearchFilterDataShared(newArrayApps)
                                setDataListShared(newArrayApps)
                                setDataList(newArrayApps)

                                setConnectionDataNewer(arrayConnection)

                                let newArrConnection = [];
                                let newInstanceFilterData = [];

                                for (let i = 0; i < arrayConnection.length; i++) {
                                    for (let j = 0; j < arrayInstances.length; j++) {
                                        if (arrayConnection[i].id_inst == arrayInstances[j].id_instance) {
                                            newArrConnection.push(arrayInstances[j]);
                                        }
                                    }
                                }

                                arrayInstances.map(instanceObjectData => {
                                    newInstanceFilterData.push({
                                        "ID_Instance": instanceObjectData.id_instance,
                                        "ID_Object": instanceObjectData.id_object,
                                        "Env_Name": instanceObjectData.name_env
                                    })
                                })

                                setInstanceStopData(newInstanceFilterData)
                                console.log(newInstanceFilterData)

                                setConnectionDataNew(newArrConnection)

                                if (response.status === 200 && response.data.response_code === 200) {
                                    setDashboardInfo(response.data.response_data.dashboardinfo)
                                    setSharedData(response.data.response_data.dashboardinfo.available_applications)

                                    const filterOwnData = response.data.response_data.dashboardinfo.available_applications.filter(function (userdata) {
                                        return userdata.id_owner == Number(localStorage.getItem('userDataID'))
                                    });

                                    setOwnApplication(filterOwnData)

                                    const filterOwnFile = response.data.response_data.dashboardinfo.available_files.filter(function (userdata) {
                                        return userdata.id_owner == Number(localStorage.getItem('userDataID'))
                                    });

                                    setOwnFiles(filterOwnFile)

                                    const filterSharedFile = response.data.response_data.dashboardinfo.available_files.filter(function (userdata) {
                                        return userdata.id_owner == 0
                                    });

                                    setSharedFiles(filterSharedFile)
                                }
                            })
                            .catch(e => {
                                console.log(e)
                            });

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
        } else {
            console.log("Error")
        }
    }

    const stopInstance = (event, id, env) => {
        const token = localStorage.getItem("userToken");

        event.preventDefault();

        axios.post(DEVELOPMENT + '/viewer/disconnect', {
            id: id,
            id_env: env,
        }, {
            headers: {
                'Authorization': token,
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

                    fetchDashboardInfo();

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

    const deleteObject = (event, id, env, state) => {
        const token = localStorage.getItem("userToken");

        event.preventDefault();

        if (state === "environment-create" || state === "environment-final") {
            axios.post(DEVELOPMENT + '/phases/environment_delete', {
                id: id,
                name: env,
                connect: "on",
            }, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': URL_SYSTEM,
                    'Access-Control-Allow-Headers': URL_SYSTEM,
                },
                // withCredentials: true,
            })
                .then(response => {
                    console.log(response);
                    if (response.status === 200 && response.data.response_code === 200) {


                        axios.post(DEVELOPMENT + '/phases/baseimage_delete', {
                            id: id,
                            connect: "on",
                        }, {
                            headers: {
                                'Authorization': token,
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

                                    fetchDashboardInfo();


                                    setTimeout(() => {
                                        setRequestAlert(false);
                                        setRequestAlertMessage(false);
                                    }, 2000);
                                }
                                if (response.status === 200 && response.data.response_code !== 200) {
                                    setRequestAlert(true);
                                    setRequestAlertMessage(false);

                                    fetchDashboardInfo();

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
                        axios.post(DEVELOPMENT + '/phases/baseimage_delete', {
                            id: id,
                            connect: "on",
                        }, {
                            headers: {
                                'Authorization': token,
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

                                    fetchDashboardInfo();


                                    setTimeout(() => {
                                        setRequestAlert(false);
                                        setRequestAlertMessage(false);
                                    }, 2000);
                                }
                                if (response.status === 200 && response.data.response_code !== 200) {
                                    setRequestAlert(true);
                                    setRequestAlertMessage(false);

                                    fetchDashboardInfo();

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
        } else if (state === "baseimage-create" || state === "baseimage-final") {
            axios.post(DEVELOPMENT + '/phases/baseimage_delete', {
                id: id,
                connect: "on",
            }, {
                headers: {
                    'Authorization': token,
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

                        fetchDashboardInfo();

                        localStorage.setItem("test", "")
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
        } else {
            console.log("Error")
        }
    }

    const applicationData = (dataID, selectOption) => {
        localStorage.setItem("app-data", dataID)
        localStorage.setItem("app-data-option", selectOption)

        fetchDashboardInfo();

        setTimeout(() => {
            window.location.href = "/dashboard/applicationRun";
        }, 2000)
    }

    const instanceData = (objectID, selectEnv) => {
        localStorage.setItem("instance-object-id", objectID)
        localStorage.setItem("instance-env", selectEnv)

        fetchDashboardInfo();

        setTimeout(() => {
            window.location.href = "/dashboard/instanceRun";
        }, 2000)
    }

    const environmentData = (objectID, selectEnv, modeType) => {
        localStorage.setItem("env-object-id", objectID)
        localStorage.setItem("env-name", selectEnv)

        localStorage.setItem("environment-type-mode", modeType)

        fetchDashboardInfo();

        setTimeout(() => {
            window.location.href = "/dashboard/environmentRun";
        }, 2000)
    }

    const environmentDataStop = (objectID, selectEnv) => {
        localStorage.setItem("env-object-id", objectID)
        localStorage.setItem("env-name", selectEnv)

        axios.post(DEVELOPMENT + '/phases/environment_stop', {
            id: objectID,
            name: selectEnv,
            force: 'on'
        }, {
            headers: {
                Authorization: localStorage.getItem("userToken"),
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

                    localStorage.setItem("dashboard-info", JSON.stringify(response.data.response_data.dashboardinfo))
                    const arrayConnection = response.data.response_data.dashboardinfo.available_connections;
                    const arrayInstances = response.data.response_data.dashboardinfo.available_instances;
                    const arrayApplications = response.data.response_data.dashboardinfo.available_applications;

                    setAllAvailableInstances(response.data.response_data.dashboardinfo.available_instances);

                    let newArrayApps = [];

                    arrayApplications.map(data => {
                        newArrayApps.push(data)
                    })

                    setSearchFilterData(newArrayApps)
                    setSearchFilterDataShared(newArrayApps)
                    setDataListShared(newArrayApps)
                    setDataList(newArrayApps)

                    setConnectionDataNewer(arrayConnection)

                    let newArrConnection = [];
                    let newInstanceFilterData = [];

                    for (let i = 0; i < arrayConnection.length; i++) {
                        for (let j = 0; j < arrayInstances.length; j++) {
                            if (arrayConnection[i].id_inst == arrayInstances[j].id_instance) {
                                newArrConnection.push(arrayInstances[j]);
                            }
                        }
                    }

                    arrayInstances.map(instanceObjectData => {
                        newInstanceFilterData.push({
                            "ID_Instance": instanceObjectData.id_instance,
                            "ID_Object": instanceObjectData.id_object,
                            "Env_Name": instanceObjectData.name_env
                        })
                    })

                    setInstanceStopData(newInstanceFilterData)
                    console.log(newInstanceFilterData)

                    setConnectionDataNew(newArrConnection)

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }

                if (response.status === 200 && response.data.response_code !== 200) {
                    console.log(response);

                    setRequestAlert(true);
                    setRequestAlertMessage(false);

                    localStorage.setItem("dashboard-info", JSON.stringify(response.data.response_data.dashboardinfo))
                    const arrayConnection = response.data.response_data.dashboardinfo.available_connections;
                    const arrayInstances = response.data.response_data.dashboardinfo.available_instances;
                    const arrayApplications = response.data.response_data.dashboardinfo.available_applications;

                    setAllAvailableInstances(response.data.response_data.dashboardinfo.available_instances);

                    let newArrayApps = [];

                    arrayApplications.map(data => {
                        newArrayApps.push(data)
                    })

                    setSearchFilterData(newArrayApps)
                    setSearchFilterDataShared(newArrayApps)
                    setDataListShared(newArrayApps)
                    setDataList(newArrayApps)

                    setConnectionDataNewer(arrayConnection)

                    let newArrConnection = [];
                    let newInstanceFilterData = [];

                    for (let i = 0; i < arrayConnection.length; i++) {
                        for (let j = 0; j < arrayInstances.length; j++) {
                            if (arrayConnection[i].id_inst == arrayInstances[j].id_instance) {
                                newArrConnection.push(arrayInstances[j]);
                            }
                        }
                    }

                    arrayInstances.map(instanceObjectData => {
                        newInstanceFilterData.push({
                            "ID_Instance": instanceObjectData.id_instance,
                            "ID_Object": instanceObjectData.id_object,
                            "Env_Name": instanceObjectData.name_env
                        })
                    })

                    setInstanceStopData(newInstanceFilterData)
                    console.log(newInstanceFilterData)

                    setConnectionDataNew(newArrConnection)

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

    const environmentDataEdit = (objectID, selectEnv, selectName, modeType, selectApps, selectTasks, selectTarget) => {
        localStorage.setItem("env-object-id", objectID)
        localStorage.setItem("env-name", selectEnv)
        localStorage.setItem("env-name-object", selectName)
        localStorage.setItem("environment-type-mode", modeType)
        localStorage.setItem("env-apps", selectApps)
        localStorage.setItem("env-tasks", selectTasks)
        localStorage.setItem("env-target", selectTarget)

        fetchDashboardInfo();

        setTimeout(() => {
            localStorage.setItem("expert-mode-baseimage", "true")
            window.location.href = "/dashboard/expert-mode-environment-edit";
        }, 2000)
    }

    const environmentDataDelete = (event, objectID, selectEnv) => {
        /*localStorage.setItem("env-object-id", objectID)
        localStorage.setItem("env-name", selectEnv)*/

        axios.post(DEVELOPMENT + '/phases/environment_delete', {
            id: objectID,
            name: selectEnv,
        }, {
            headers: {
                Authorization: localStorage.getItem("userToken"),
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

                    fetchDashboardInfo();

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
                console.log(e);
                setRequestAlert(true);
                setRequestAlertMessage(false);

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            })
    }

    const connectionDataDisconnect = (event, objectID) => {
        event.preventDefault();

        console.log(instanceStopData)

        let idSelected = "";
        let envNameSelected = "";

        instanceStopData.map(disconnectData => {
            if (disconnectData.ID_Instance === objectID) {
                idSelected = disconnectData.ID_Object
                envNameSelected = disconnectData.Env_Name;
            }
        })

        axios.post(DEVELOPMENT + '/viewer/disconnect', {
            id: idSelected,
            id_env: envNameSelected,
        }, {
            headers: {
                Authorization: localStorage.getItem("userToken"),
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

        fetchDashboardInfo();
    }

    const connectionSharedData = (objectID, selectEnv) => {
        localStorage.setItem("connection-shared-object-id", objectID)
        localStorage.setItem("connection-shared-env", selectEnv)

        fetchDashboardInfo();

        setTimeout(() => {
            window.location.href = "/dashboard/sharedRun";
        }, 2000)
    }

    const connectionData = (objectID, selectEnv) => {
        localStorage.setItem("connection-object-id", objectID)
        localStorage.setItem("connection-env", selectEnv)

        fetchDashboardInfo();

        setTimeout(() => {
            window.location.href = "/dashboard/connectionRun";
        }, 2000)
    }

    const objectData = (objectID, selectEnv, stateObject) => {
        localStorage.setItem("object-id", objectID)
        localStorage.setItem("object-env-name", selectEnv)
        localStorage.setItem("object-state", stateObject)

        fetchDashboardInfo();

        setTimeout(() => {
            window.location.href = "/dashboard/expert-mode-base-image";
        }, 2000)
    }

    const changeAvailableObjectValue = event => {
        setAvailableObjectValue(event.target.value);
        const data = [event.target.value];

        const instanceDataAll = allAvailableInstances;

        if (instanceDataAll.length > 0 && event.target.value !== "") {
            instanceDataAll.map(dataInstance => {
                if (dataInstance.id_object === JSON.parse(data[0]).id_object) {
                    setStopObjectAvailable(true);
                    localStorage.setItem("object-id-instance", dataInstance.id_instance);
                } else {
                    setStopObjectAvailable(false);
                    localStorage.setItem("object-id-instance", "");
                }
            })
        } else if (instanceDataAll.length > 0 && event.target.value === "") {
            setStopObjectAvailable(false);
            localStorage.setItem("object-id-instance", "");
        }


        if (event.target.value === "") {
            localStorage.setItem("selected-object-id", "")
            localStorage.setItem("selected-object-env-name", "")
            localStorage.setItem("selected-object-state", "")
        } else {
            localStorage.setItem("selected-object-id", JSON.parse(data[0]).id_object)
            localStorage.setItem("selected-object-env-name", JSON.parse(data[0]).id_user)
            localStorage.setItem("selected-object-state", JSON.parse(data[0]).object_state)
        }
    }

    const changeAvailableEnvironmentValue = event => {
        setAvailableEnvironmentValue(event.target.value);
        const data = [event.target.value];

        if (event.target.value !== "") {
            console.log(JSON.parse(data[0]).env_apps[0])
        }

        if (event.target.value === "") {
            localStorage.setItem("selected-environment-id", "")
            localStorage.setItem("selected-environment-name", "")
            localStorage.setItem("selected-environment-name-object", "")
            localStorage.setItem("selected-environment-name-object-env-apps", "")
            localStorage.setItem("selected-environment-name-object-env-tasks", "")
            localStorage.setItem("selected-environment-name-object-env-target", "")
        } else {
            localStorage.setItem("selected-environment-id", JSON.parse(data[0]).id_object)
            localStorage.setItem("selected-environment-name", JSON.parse(data[0]).name)
            localStorage.setItem("selected-environment-name-object", JSON.parse(data[0]).name_object)
            localStorage.setItem("selected-environment-name-object-env-apps", JSON.stringify(JSON.parse(data[0]).env_apps[0]))
            localStorage.setItem("selected-environment-name-object-env-tasks", JSON.stringify(JSON.parse(data[0]).env_tasks[0]))
            localStorage.setItem("selected-environment-name-object-env-target", JSON.stringify(JSON.parse(data[0]).env_target))
        }
    }

    const changeAvailableInstanceValue = event => {
        setAvailableInstanceValue(event.target.value);
        const data = [event.target.value];

        if (event.target.value === "") {
            localStorage.setItem("selected-instance-id", "")
            localStorage.setItem("selected-instance-env-name", "")
        } else {
            localStorage.setItem("selected-instance-id", JSON.parse(data[0]).id_object)
            localStorage.setItem("selected-instance-env-name", JSON.parse(data[0]).name_env)
        }
    }

    const changeAvailableConnectionValue = event => {
        setAvailableConnectionValue(event.target.value);
        const data = event.target.value;

        if (event.target.value === "") {
            localStorage.setItem("selected-connection-index", "")
        } else {
            localStorage.setItem("selected-connection-index", data)
        }
    }

    const requestApplicationAdmin = (event) => {
        event.preventDefault()

        const token = localStorage.getItem("userToken");
        const currentLanguage = localStorage.getItem("language");

        let selectedLanguage = "";

        if (currentLanguage === "de") {
            selectedLanguage = "deu";
        } else if (currentLanguage === "en") {
            selectedLanguage = "eng";
        } else {
            selectedLanguage = "eng";
        }

        axios.post(DEVELOPMENT_INTERN + '/user/request-application/' + requestMessage + '/' + selectedLanguage, {
            /*id: requestUserID,
            username: requestUsername,
            appname: requestMessage,*/
        }, {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*",
                'Access-Control-Allow-Headers': "*",
            },
            // withCredentials: true,
        })
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    console.log(response);
                    setApplicationModal(false);
                    setRequestMessage("");
                }
            })
            .catch(e => {
                console.log(e)
            });
    }

    const adminDashboardDetail = () => {
        window.location.href = "/dashboard/admin";
    };

    const changeLanguageGerman = () => {
        i18n.changeLanguage("de")
        localStorage.setItem('language', 'de')
    }

    const changeLanguageEnglish = () => {
        i18n.changeLanguage("en")
        localStorage.setItem('language', 'en')
    }

    const logoutValidation = () => {
        LOGOUT_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));

        setTimeout(async () => {
            const servicePartnerAuthLogout = async () => {
                await axios.post(DEVELOPMENT + '/logout', {
                    username: USERNAME,
                    password: PASSWORD,
                }, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Credentials': true,
                    },
                    //withCredentials: true,
                })
                    .then(response => {
                        console.log(response);
                    })
                    .catch(e => {
                        console.log(e)
                    });
            };
            await servicePartnerAuthLogout();
        }, 1000);
        setTimeout(() => {
            window.location.href = "/";
        }, 2000);
    };

    const connectStart = (data) => {
        console.log(data)

        localStorage.setItem("connection-object-id", JSON.parse(data).id_inst)
        localStorage.setItem("connection-env", JSON.parse(data).viewer_url)

        fetchDashboardInfo();

        setTimeout(() => {
            window.location.href = "/dashboard/connectionRun";
        }, 2000)
    }

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

    const changeVMFileUploadAppSelectFile = event => {
        if (event.target.files) {
            setVMFileUploadAppSelectFile(event.target.files[0]);
        }
    };

    const changeVMPhasesIDBaseimageCreate = bindValue(setVMIDPhasesBaseimageCreate);

    const changeVMPhasesObjectTypeBaseimageCreate = bindValue(setVMObjectTypePhasesBaseimageCreate);

    const changeVMPhasesNameBaseimageCreate = bindValue(setVMNamePhasesBaseimageCreate);

    const changeVMPhasesRootImageBaseimageCreate = bindValue(setVMRootImagePhasesBaseimageCreate);

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

    const changeVMPhasesNameVMBaseimageCreate = bindValue(setVMNameVMPhasesBaseimageCreate);

    const changeVMPhasesOSTypeBaseimageCreate = bindValue(setVMOSTypePhasesBaseimageCreate);

    const changeVMPhasesCoresBaseimageCreate = bindValue(setVMCoresPhasesBaseimageCreate);

    const changeVMPhasesMemorySizeBaseimageCreate = bindValue(setVMMemorySizePhasesBaseimageCreate);

    const changeVMPhasesDiskSizeBaseimageCreate = bindValue(setVMDiskSizePhasesBaseimageCreate);

    const changeVMPhasesKeyboardBaseimageCreate = bindValue(setVMKeyboardPhasesBaseimageCreate);

    const changeVMPhasesCephPoolBaseimageCreate = event => {
        //setVMCephPoolPhasesBaseimageCreate(event.target.value);
        setVMCephPoolPhasesBaseimageCreateChecked(!vmPhasesCephPoolBaseimageCreateChecked)

        if (vmPhasesCephPoolBaseimageCreateChecked) {
            setVMCephPoolPhasesBaseimageCreate("on");
        } else {
            setVMCephPoolPhasesBaseimageCreate("");
        }
    };

    const changeVMResolutionPhasesBaseimageCreate = bindValue(setVMResolutionPhasesBaseimageCreate);

    const changeVMContypePhasesBaseimageCreate = bindValue(setVMContypePhasesBaseimageCreate);

    const changeVMResizePhasesBaseimageCreate = bindValue(setVMResizePhasesBaseimageCreate);

    const changeVMScalePhasesBaseimageCreate = bindValue(setVMScalePhasesBaseimageCreate);

    const changeVMScalePhasesBaseimageCreateChecked = () => {
        setVMScalePhasesBaseimageCreateChecked(!vmScalePhasesBaseimageCreateChecked)

        if (vmScalePhasesBaseimageCreateChecked) {
            setVMScalePhasesBaseimageCreate("on");
        } else {
            setVMScalePhasesBaseimageCreate("");
        }
    };

    const changeVMPhasesIDBaseimageClone = bindValue(setVMIDPhasesBaseimageClone);

    const changeVMPhasesNameBaseimageClone = bindValue(setVMNamePhasesBaseimageClone);

    const changeVMPhasesNewIDBaseimageClone = bindValue(setVMNewIDPhasesBaseimageClone);

    const excludeColumns = ["id_file", "id_owner", "id_template", "installer_type", "version"];

    const handleChange = value => {
        setSearchText(value);
        filterData(value);
    };

    const filterData = (value) => {
        const lowercasedValue = value.toLowerCase().trim();
        if (lowercasedValue === "") setSearchFilterData(dataList);
        else {
            const filteredData = searchFilterData.filter(item => {
                return Object.keys(item).some(key =>
                    excludeColumns.includes(key) ? false : item[key].toString().toLowerCase().includes(lowercasedValue)
                );
            });
            setSearchFilterData(filteredData);
        }
    }

    const excludeColumnsShared = ["id_file", "id_owner", "id_template", "installer_type", "version"];

    const handleChangeShared = value => {
        setSearchTextShared(value);
        filterDataShared(value);
    };

    const filterDataShared = (value) => {
        const lowercasedValue = value.toLowerCase().trim();
        if (lowercasedValue === "") setSearchFilterDataShared(dataListShared);
        else {
            const filteredDataShared = searchFilterDataShared.filter(item => {
                return Object.keys(item).some(key =>
                    excludeColumnsShared.includes(key) ? false : item[key].toString().toLowerCase().includes(lowercasedValue)
                );
            });
            setSearchFilterDataShared(filteredDataShared);
        }
    }

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

                    axios.post(DEVELOPMENT + '/monitoring/dashboard_info', {}, {
                        headers: {
                            Authorization: localStorage.getItem("userToken"),
                            'Content-Type': 'multipart/form-data',
                            'Access-Control-Allow-Origin': URL_SYSTEM,
                            'Access-Control-Allow-Headers': URL_SYSTEM,
                        },
                        // withCredentials: true,
                    })
                        .then(response => {
                            console.log(response);
                            localStorage.setItem("dashboard-info", JSON.stringify(response.data.response_data.dashboardinfo))
                            const arrayConnection = response.data.response_data.dashboardinfo.available_connections;
                            const arrayInstances = response.data.response_data.dashboardinfo.available_instances;
                            const arrayApplications = response.data.response_data.dashboardinfo.available_applications;

                            setAllAvailableInstances(response.data.response_data.dashboardinfo.available_instances);

                            let newArrayApps = [];

                            arrayApplications.map(data => {
                                newArrayApps.push(data)
                            })

                            setSearchFilterData(newArrayApps)
                            setSearchFilterDataShared(newArrayApps)
                            setDataListShared(newArrayApps)
                            setDataList(newArrayApps)

                            setConnectionDataNewer(arrayConnection)

                            let newArrConnection = [];
                            let newInstanceFilterData = [];

                            for (let i = 0; i < arrayConnection.length; i++) {
                                for (let j = 0; j < arrayInstances.length; j++) {
                                    if (arrayConnection[i].id_inst == arrayInstances[j].id_instance) {
                                        newArrConnection.push(arrayInstances[j]);
                                    }
                                }
                            }

                            arrayInstances.map(instanceObjectData => {
                                newInstanceFilterData.push({
                                    "ID_Instance": instanceObjectData.id_instance,
                                    "ID_Object": instanceObjectData.id_object,
                                    "Env_Name": instanceObjectData.name_env
                                })
                            })

                            setInstanceStopData(newInstanceFilterData)
                            console.log(newInstanceFilterData)

                            setConnectionDataNew(newArrConnection)

                            if (response.status === 200 && response.data.response_code === 200) {
                                setDashboardInfo(response.data.response_data.dashboardinfo)
                                setSharedData(response.data.response_data.dashboardinfo.available_applications)

                                const filterOwnData = response.data.response_data.dashboardinfo.available_applications.filter(function (userdata) {
                                    return userdata.id_owner == Number(localStorage.getItem('userDataID'))
                                });

                                setOwnApplication(filterOwnData)

                                const filterOwnFile = response.data.response_data.dashboardinfo.available_files.filter(function (userdata) {
                                    return userdata.id_owner == Number(localStorage.getItem('userDataID'))
                                });

                                setOwnApplication(filterOwnData)

                                const filterSharedFile = response.data.response_data.dashboardinfo.available_files.filter(function (userdata) {
                                    return userdata.id_owner == 0
                                });

                                setSharedFiles(filterSharedFile)
                            }
                        })
                        .catch(e => {
                            console.log(e)
                        });

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

                    axios.post(DEVELOPMENT + '/monitoring/dashboard_info', {}, {
                        headers: {
                            Authorization: localStorage.getItem("userToken"),
                            'Content-Type': 'multipart/form-data',
                            'Access-Control-Allow-Origin': URL_SYSTEM,
                            'Access-Control-Allow-Headers': URL_SYSTEM,
                        },
                        // withCredentials: true,
                    })
                        .then(response => {
                            console.log(response);
                            localStorage.setItem("dashboard-info", JSON.stringify(response.data.response_data.dashboardinfo))
                            const arrayConnection = response.data.response_data.dashboardinfo.available_connections;
                            const arrayInstances = response.data.response_data.dashboardinfo.available_instances;
                            const arrayApplications = response.data.response_data.dashboardinfo.available_applications;

                            setAllAvailableInstances(response.data.response_data.dashboardinfo.available_instances);

                            let newArrayApps = [];

                            arrayApplications.map(data => {
                                newArrayApps.push(data)
                            })

                            setSearchFilterData(newArrayApps)
                            setSearchFilterDataShared(newArrayApps)
                            setDataListShared(newArrayApps)
                            setDataList(newArrayApps)

                            setConnectionDataNewer(arrayConnection)

                            let newArrConnection = [];
                            let newInstanceFilterData = [];

                            for (let i = 0; i < arrayConnection.length; i++) {
                                for (let j = 0; j < arrayInstances.length; j++) {
                                    if (arrayConnection[i].id_inst == arrayInstances[j].id_instance) {
                                        newArrConnection.push(arrayInstances[j]);
                                    }
                                }
                            }

                            arrayInstances.map(instanceObjectData => {
                                newInstanceFilterData.push({
                                    "ID_Instance": instanceObjectData.id_instance,
                                    "ID_Object": instanceObjectData.id_object,
                                    "Env_Name": instanceObjectData.name_env
                                })
                            })

                            setInstanceStopData(newInstanceFilterData)
                            console.log(newInstanceFilterData)

                            setConnectionDataNew(newArrConnection)

                            if (response.status === 200 && response.data.response_code === 200) {
                                setDashboardInfo(response.data.response_data.dashboardinfo)
                                setSharedData(response.data.response_data.dashboardinfo.available_applications)

                                const filterOwnData = response.data.response_data.dashboardinfo.available_applications.filter(function (userdata) {
                                    return userdata.id_owner == Number(localStorage.getItem('userDataID'))
                                });

                                setOwnApplication(filterOwnData)

                                const filterOwnFile = response.data.response_data.dashboardinfo.available_files.filter(function (userdata) {
                                    return userdata.id_owner == Number(localStorage.getItem('userDataID'))
                                });

                                setOwnApplication(filterOwnData)

                                const filterSharedFile = response.data.response_data.dashboardinfo.available_files.filter(function (userdata) {
                                    return userdata.id_owner == 0
                                });

                                setSharedFiles(filterSharedFile)
                            }
                        })
                        .catch(e => {
                            console.log(e)
                        });

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

    const submitApp = (endpoint) => (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + endpoint, {
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

                    axios.post(DEVELOPMENT + '/monitoring/dashboard_info', {}, {
                        headers: {
                            Authorization: localStorage.getItem("userToken"),
                            'Content-Type': 'multipart/form-data',
                            'Access-Control-Allow-Origin': URL_SYSTEM,
                            'Access-Control-Allow-Headers': URL_SYSTEM,
                        },
                        // withCredentials: true,
                    })
                        .then(response => {
                            console.log(response);
                            localStorage.setItem("dashboard-info", JSON.stringify(response.data.response_data.dashboardinfo))
                            const arrayConnection = response.data.response_data.dashboardinfo.available_connections;
                            const arrayInstances = response.data.response_data.dashboardinfo.available_instances;
                            const arrayApplications = response.data.response_data.dashboardinfo.available_applications;

                            setAllAvailableInstances(response.data.response_data.dashboardinfo.available_instances);

                            let newArrayApps = [];

                            arrayApplications.map(data => {
                                newArrayApps.push(data)
                            })

                            setSearchFilterData(newArrayApps)
                            setSearchFilterDataShared(newArrayApps)
                            setDataListShared(newArrayApps)
                            setDataList(newArrayApps)

                            setConnectionDataNewer(arrayConnection)

                            let newArrConnection = [];
                            let newInstanceFilterData = [];

                            for (let i = 0; i < arrayConnection.length; i++) {
                                for (let j = 0; j < arrayInstances.length; j++) {
                                    if (arrayConnection[i].id_inst == arrayInstances[j].id_instance) {
                                        newArrConnection.push(arrayInstances[j]);
                                    }
                                }
                            }

                            arrayInstances.map(instanceObjectData => {
                                newInstanceFilterData.push({
                                    "ID_Instance": instanceObjectData.id_instance,
                                    "ID_Object": instanceObjectData.id_object,
                                    "Env_Name": instanceObjectData.name_env
                                })
                            })

                            setInstanceStopData(newInstanceFilterData)
                            console.log(newInstanceFilterData)

                            setConnectionDataNew(newArrConnection)

                            if (response.status === 200 && response.data.response_code === 200) {
                                setDashboardInfo(response.data.response_data.dashboardinfo)
                                setSharedData(response.data.response_data.dashboardinfo.available_applications)

                                const filterOwnData = response.data.response_data.dashboardinfo.available_applications.filter(function (userdata) {
                                    return userdata.id_owner == Number(localStorage.getItem('userDataID'))
                                });

                                setOwnApplication(filterOwnData)

                                const filterOwnFile = response.data.response_data.dashboardinfo.available_files.filter(function (userdata) {
                                    return userdata.id_owner == Number(localStorage.getItem('userDataID'))
                                });

                                setOwnApplication(filterOwnData)

                                const filterSharedFile = response.data.response_data.dashboardinfo.available_files.filter(function (userdata) {
                                    return userdata.id_owner == 0
                                });

                                setSharedFiles(filterSharedFile)
                            }
                        })
                        .catch(e => {
                            console.log(e)
                        });

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

    const createApp = submitApp('/apps/create');

    const updateApp = submitApp('/apps/update');

        event.preventDefault();

        axios.post(DEVELOPMENT + '/apps/update', {
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

                    axios.post(DEVELOPMENT + '/monitoring/dashboard_info', {}, {
                        headers: {
                            Authorization: localStorage.getItem("userToken"),
                            'Content-Type': 'multipart/form-data',
                            'Access-Control-Allow-Origin': URL_SYSTEM,
                            'Access-Control-Allow-Headers': URL_SYSTEM,
                        },
                        // withCredentials: true,
                    })
                        .then(response => {
                            console.log(response);
                            localStorage.setItem("dashboard-info", JSON.stringify(response.data.response_data.dashboardinfo))
                            const arrayConnection = response.data.response_data.dashboardinfo.available_connections;
                            const arrayInstances = response.data.response_data.dashboardinfo.available_instances;
                            const arrayApplications = response.data.response_data.dashboardinfo.available_applications;

                            setAllAvailableInstances(response.data.response_data.dashboardinfo.available_instances);

                            let newArrayApps = [];

                            arrayApplications.map(data => {
                                newArrayApps.push(data)
                            })

                            setSearchFilterData(newArrayApps)
                            setSearchFilterDataShared(newArrayApps)
                            setDataListShared(newArrayApps)
                            setDataList(newArrayApps)

                            setConnectionDataNewer(arrayConnection)

                            let newArrConnection = [];
                            let newInstanceFilterData = [];

                            for (let i = 0; i < arrayConnection.length; i++) {
                                for (let j = 0; j < arrayInstances.length; j++) {
                                    if (arrayConnection[i].id_inst == arrayInstances[j].id_instance) {
                                        newArrConnection.push(arrayInstances[j]);
                                    }
                                }
                            }

                            arrayInstances.map(instanceObjectData => {
                                newInstanceFilterData.push({
                                    "ID_Instance": instanceObjectData.id_instance,
                                    "ID_Object": instanceObjectData.id_object,
                                    "Env_Name": instanceObjectData.name_env
                                })
                            })

                            setInstanceStopData(newInstanceFilterData)
                            console.log(newInstanceFilterData)

                            setConnectionDataNew(newArrConnection)

                            if (response.status === 200 && response.data.response_code === 200) {
                                setDashboardInfo(response.data.response_data.dashboardinfo)
                                setSharedData(response.data.response_data.dashboardinfo.available_applications)

                                const filterOwnData = response.data.response_data.dashboardinfo.available_applications.filter(function (userdata) {
                                    return userdata.id_owner == Number(localStorage.getItem('userDataID'))
                                });

                                setOwnApplication(filterOwnData)

                                const filterOwnFile = response.data.response_data.dashboardinfo.available_files.filter(function (userdata) {
                                    return userdata.id_owner == Number(localStorage.getItem('userDataID'))
                                });

                                setOwnApplication(filterOwnData)

                                const filterSharedFile = response.data.response_data.dashboardinfo.available_files.filter(function (userdata) {
                                    return userdata.id_owner == 0
                                });

                                setSharedFiles(filterSharedFile)
                            }
                        })
                        .catch(e => {
                            console.log(e)
                        });

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

    const createFile = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/files/create', {
            id: vmFileUploadAppID,
            filename: vmFileUploadAppName,
            filepath: vmFileUploadAppPath,
            os_type: vmFileUploadAppOSType,
            version: vmFileUploadAppVersion,
            file: vmFileUploadAppSelectFile,
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

                    axios.post(DEVELOPMENT + '/monitoring/dashboard_info', {}, {
                        headers: {
                            Authorization: localStorage.getItem("userToken"),
                            'Content-Type': 'multipart/form-data',
                            'Access-Control-Allow-Origin': URL_SYSTEM,
                            'Access-Control-Allow-Headers': URL_SYSTEM,
                        },
                        // withCredentials: true,
                    })
                        .then(response => {
                            console.log(response);
                            localStorage.setItem("dashboard-info", JSON.stringify(response.data.response_data.dashboardinfo))
                            const arrayConnection = response.data.response_data.dashboardinfo.available_connections;
                            const arrayInstances = response.data.response_data.dashboardinfo.available_instances;
                            const arrayApplications = response.data.response_data.dashboardinfo.available_applications;

                            setAllAvailableInstances(response.data.response_data.dashboardinfo.available_instances);

                            let newArrayApps = [];

                            arrayApplications.map(data => {
                                newArrayApps.push(data)
                            })

                            setSearchFilterData(newArrayApps)
                            setSearchFilterDataShared(newArrayApps)
                            setDataListShared(newArrayApps)
                            setDataList(newArrayApps)

                            setConnectionDataNewer(arrayConnection)

                            let newArrConnection = [];
                            let newInstanceFilterData = [];

                            for (let i = 0; i < arrayConnection.length; i++) {
                                for (let j = 0; j < arrayInstances.length; j++) {
                                    if (arrayConnection[i].id_inst == arrayInstances[j].id_instance) {
                                        newArrConnection.push(arrayInstances[j]);
                                    }
                                }
                            }

                            arrayInstances.map(instanceObjectData => {
                                newInstanceFilterData.push({
                                    "ID_Instance": instanceObjectData.id_instance,
                                    "ID_Object": instanceObjectData.id_object,
                                    "Env_Name": instanceObjectData.name_env
                                })
                            })

                            setInstanceStopData(newInstanceFilterData)
                            console.log(newInstanceFilterData)

                            setConnectionDataNew(newArrConnection)

                            if (response.status === 200 && response.data.response_code === 200) {
                                setDashboardInfo(response.data.response_data.dashboardinfo)
                                setSharedData(response.data.response_data.dashboardinfo.available_applications)

                                const filterOwnData = response.data.response_data.dashboardinfo.available_applications.filter(function (userdata) {
                                    return userdata.id_owner == Number(localStorage.getItem('userDataID'))
                                });

                                setOwnApplication(filterOwnData)

                                const filterOwnFile = response.data.response_data.dashboardinfo.available_files.filter(function (userdata) {
                                    return userdata.id_owner == Number(localStorage.getItem('userDataID'))
                                });

                                setOwnApplication(filterOwnData)

                                const filterSharedFile = response.data.response_data.dashboardinfo.available_files.filter(function (userdata) {
                                    return userdata.id_owner == 0
                                });

                                setSharedFiles(filterSharedFile)
                            }
                        })
                        .catch(e => {
                            console.log(e)
                        });

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

    const updateFile = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/files/update', {
            id: vmFileUploadAppID,
            filename: vmFileUploadAppName,
            filepath: vmFileUploadAppPath,
            os_type: vmFileUploadAppOSType,
            version: vmFileUploadAppVersion,
            file: vmFileUploadAppSelectFile,
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

                    axios.post(DEVELOPMENT + '/monitoring/dashboard_info', {}, {
                        headers: {
                            Authorization: localStorage.getItem("userToken"),
                            'Content-Type': 'multipart/form-data',
                            'Access-Control-Allow-Origin': URL_SYSTEM,
                            'Access-Control-Allow-Headers': URL_SYSTEM,
                        },
                        // withCredentials: true,
                    })
                        .then(response => {
                            console.log(response);
                            localStorage.setItem("dashboard-info", JSON.stringify(response.data.response_data.dashboardinfo))
                            const arrayConnection = response.data.response_data.dashboardinfo.available_connections;
                            const arrayInstances = response.data.response_data.dashboardinfo.available_instances;
                            const arrayApplications = response.data.response_data.dashboardinfo.available_applications;

                            setAllAvailableInstances(response.data.response_data.dashboardinfo.available_instances);

                            let newArrayApps = [];

                            arrayApplications.map(data => {
                                newArrayApps.push(data)
                            })

                            setSearchFilterData(newArrayApps)
                            setSearchFilterDataShared(newArrayApps)
                            setDataListShared(newArrayApps)
                            setDataList(newArrayApps)

                            setConnectionDataNewer(arrayConnection)

                            let newArrConnection = [];
                            let newInstanceFilterData = [];

                            for (let i = 0; i < arrayConnection.length; i++) {
                                for (let j = 0; j < arrayInstances.length; j++) {
                                    if (arrayConnection[i].id_inst == arrayInstances[j].id_instance) {
                                        newArrConnection.push(arrayInstances[j]);
                                    }
                                }
                            }

                            arrayInstances.map(instanceObjectData => {
                                newInstanceFilterData.push({
                                    "ID_Instance": instanceObjectData.id_instance,
                                    "ID_Object": instanceObjectData.id_object,
                                    "Env_Name": instanceObjectData.name_env
                                })
                            })

                            setInstanceStopData(newInstanceFilterData)
                            console.log(newInstanceFilterData)

                            setConnectionDataNew(newArrConnection)

                            if (response.status === 200 && response.data.response_code === 200) {
                                setDashboardInfo(response.data.response_data.dashboardinfo)
                                setSharedData(response.data.response_data.dashboardinfo.available_applications)

                                const filterOwnData = response.data.response_data.dashboardinfo.available_applications.filter(function (userdata) {
                                    return userdata.id_owner == Number(localStorage.getItem('userDataID'))
                                });

                                setOwnApplication(filterOwnData)

                                const filterOwnFile = response.data.response_data.dashboardinfo.available_files.filter(function (userdata) {
                                    return userdata.id_owner == Number(localStorage.getItem('userDataID'))
                                });

                                setOwnApplication(filterOwnData)

                                const filterSharedFile = response.data.response_data.dashboardinfo.available_files.filter(function (userdata) {
                                    return userdata.id_owner == 0
                                });

                                setSharedFiles(filterSharedFile)
                            }
                        })
                        .catch(e => {
                            console.log(e)
                        });

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

    const createAppSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        name: Yup.string()
            .required('Name invalid'),
        id_file: Yup.string()
            .required('File invalid'),
        id_template: Yup.string()
            .required('ID Template invalid'),
        os_type: Yup.string()
            .required('OS Type invalid'),
        installer: Yup.string()
            .required('Installer invalid'),
        installer_args: Yup.string()
            .required('Installer ARGS invalid'),
        installer_type: Yup.string()
            .required('Installer Type invalid'),
        target: Yup.string()
            .required('Target invalid'),
        target_args: Yup.string()
            .required('Target ARGS invalid'),
        version: Yup.string()
            .required('Version invalid'),
    });

    const updateAppSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        name: Yup.string()
            .required('Name invalid'),
        id_file: Yup.string()
            .required('File invalid'),
        id_template: Yup.string()
            .required('ID Template invalid'),
        os_type: Yup.string()
            .required('OS Type invalid'),
        installer: Yup.string()
            .required('Installer invalid'),
        installer_args: Yup.string()
            .required('Installer ARGS invalid'),
        installer_type: Yup.string()
            .required('Installer Type invalid'),
        target: Yup.string()
            .required('Target invalid'),
        target_args: Yup.string()
            .required('Target ARGS invalid'),
        version: Yup.string()
            .required('Version invalid'),
    });

    const createFileSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        filename: Yup.string()
            .required('Name invalid'),
        filepath: Yup.string()
            .required('Path invalid'),
        os_type: Yup.string()
            .required('OS Type invalid'),
        version: Yup.string()
            .required('Version invalid'),
        file: Yup.string()
            .required('File invalid'),
    });

    const updateFileSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        filename: Yup.string()
            .required('Name invalid'),
        filepath: Yup.string()
            .required('Path invalid'),
        os_type: Yup.string()
            .required('OS Type invalid'),
        version: Yup.string()
            .required('Version invalid'),
        file: Yup.string()
            .required('File invalid'),
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

    const phasesBaseimageCloneSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        newid: Yup.string()
            .required('New ID invalid'),
        name: Yup.string()
            .required('Name invalid'),
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
            <>
                <ReactBootstrap.Navbar expand="lg" fixed="top" variant="dark">
                    <ReactBootstrap.Container fluid={true} className={isSmall ? 'header-small' : ''}>
                        <ReactBootstrap.Navbar.Brand>
                            <img src={Logo} alt="Logo"/>
                        </ReactBootstrap.Navbar.Brand>
                        <ReactBootstrap.Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <ReactBootstrap.Navbar.Collapse id="basic-navbar-nav">
                            <ReactBootstrap.Nav className="justify-content-end" style={{width: "100%"}}>
                                <ReactBootstrap.Nav.Link href="/dashboard">
                                    {t('home')}
                                </ReactBootstrap.Nav.Link>
                                <ReactBootstrap.NavDropdown title={t('available_connections')} id="basic-nav-dropdown">
                                    {
                                        connectionDataNewer.length > 0 ? (
                                            <>
                                                {
                                                    connectionDataNewer.map((appConnect, index) => {
                                                        return (
                                                            <>
                                                                <ReactBootstrap.NavDropdown.Item href="#"
                                                                                                 onClick={() => connectStart(JSON.stringify(appConnect))}>
                                                                    {/*<div>
                                                                        {t('id-text') + appConnect.id_inst}
                                                                    </div>*/}
                                                                    <div>
                                                                        {t('url-text') + appConnect.viewer_url}
                                                                    </div>
                                                                </ReactBootstrap.NavDropdown.Item>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </>
                                        ) : (
                                            <ReactBootstrap.NavDropdown.Item href="#">
                                                {t('no-data-available')}
                                            </ReactBootstrap.NavDropdown.Item>
                                        )
                                    }
                                </ReactBootstrap.NavDropdown>
                                <ReactBootstrap.NavDropdown title={t('language')} id="basic-nav-dropdown-additional">
                                    <ReactBootstrap.NavDropdown.Item href="#" onClick={changeLanguageEnglish}>
                                        EN
                                    </ReactBootstrap.NavDropdown.Item>
                                    <ReactBootstrap.NavDropdown.Item href="#" onClick={changeLanguageGerman}>
                                        DE
                                    </ReactBootstrap.NavDropdown.Item>
                                </ReactBootstrap.NavDropdown>
                                <ReactBootstrap.Nav.Link href="#" onClick={logoutValidation}>
                                    {t('logout')}
                                </ReactBootstrap.Nav.Link>
                            </ReactBootstrap.Nav>
                        </ReactBootstrap.Navbar.Collapse>
                    </ReactBootstrap.Container>
                </ReactBootstrap.Navbar>
            </>
            <ReactBootstrap.Container id="dashboardUser">
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                        <h2>
                            {t('overview')}
                        </h2>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                {
                    localStorage.getItem("role") === "admin" ? (
                        <>
                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                                <>
                                    <ReactBootstrap.Button
                                        type="submit"
                                        variant="primary"
                                        onClick={adminDashboardDetail}>
                                        {t('go-to-admin-dashboard')}
                                    </ReactBootstrap.Button>
                                </>
                            </ReactBootstrap.Col>
                        </>
                    ) : (
                        <></>
                    )
                }
                {
                    Object.keys(dashboardInfo).length > 0 ? (
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
                            {/*
                detailViewButton ? (*/
                                <>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={4} xl={4}
                                                            className="text-center">
                                            <div>
                                                {t('count-vm-max')} {dashboardInfo.utilized_ressources.object_vms}/{dashboardInfo.available_ressources.vm_max} (Max)
                                            </div>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={4} xl={4}
                                                            className="text-center">
                                            <div>
                                                {t('count-container-max')} {dashboardInfo.utilized_ressources.object_images}/{dashboardInfo.available_ressources.container_max} (Max)
                                            </div>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={4} xl={4}
                                                            className="text-center">
                                            <div>
                                                {t('count-objects-max')} {dashboardInfo.utilized_ressources.objects}/{dashboardInfo.available_ressources.obj_max} (Max)
                                            </div>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                                        <h3>
                                            {t('available_objects')}
                                        </h3>
                                    </ReactBootstrap.Col>
                                    {
                                        dashboardInfo.available_objects.length > 0 ? (
                                            <>
                                                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}
                                                                    className="text-left">
                                                    <div>
                                                        <select id="available-object" name="available-object"
                                                                value={availableObjectValue}
                                                                onChange={changeAvailableObjectValue}>
                                                            <option value="">{t('no-object')}</option>
                                                            {
                                                                dashboardInfo.available_objects.map((appObject, index) => {
                                                                    return (
                                                                        <>
                                                                            <option
                                                                                value={JSON.stringify(appObject)}>{t('name-text') + appObject.id_user}</option>
                                                                            {/*t('id-text') + appObject.id_object + ", " + */}
                                                                        </>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={3} lg={3} xl={3}
                                                                    className="text-center">
                                                    <ReactBootstrap.Button
                                                        type="submit"
                                                        variant="primary"
                                                        disabled={availableObjectValue === undefined || availableObjectValue === "" ? true : false}
                                                        onClick={(event) => startObject(event, localStorage.getItem("selected-object-id"), localStorage.getItem("selected-object-env-name"), localStorage.getItem("selected-object-state"))}
                                                    >
                                                        {t('start-mode')}
                                                    </ReactBootstrap.Button>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={3} lg={3} xl={3}
                                                                    className="text-center">
                                                    <ReactBootstrap.Button
                                                        type="submit"
                                                        variant="primary"
                                                        disabled={(localStorage.getItem("object-id-instance") === undefined || localStorage.getItem("object-id-instance") === "") ? true : false}
                                                        onClick={(event) => stopObject(event, localStorage.getItem("selected-object-id"), localStorage.getItem("selected-object-env-name"), localStorage.getItem("selected-object-state"))}
                                                    >
                                                        {t('stop-mode')}
                                                    </ReactBootstrap.Button>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={3} lg={3} xl={3}
                                                                    className="text-center">
                                                    <ReactBootstrap.Button
                                                        type="submit"
                                                        variant="primary"
                                                        disabled={availableObjectValue === undefined || availableObjectValue === "" ? true : false}
                                                        onClick={() => objectData(localStorage.getItem("selected-object-id"), localStorage.getItem("selected-object-env-name"), localStorage.getItem("selected-object-state"))}
                                                    >
                                                        {t('edit-headline')} ({t('expert-mode')})
                                                    </ReactBootstrap.Button>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={3} lg={3} xl={3}
                                                                    className="text-center">
                                                    <ReactBootstrap.Button
                                                        type="submit"
                                                        variant="primary"
                                                        disabled={availableObjectValue === undefined || availableObjectValue === "" ? true : false}
                                                        onClick={(event) => deleteObject(event, localStorage.getItem("selected-object-id"), localStorage.getItem("selected-object-env-name"), localStorage.getItem("selected-object-state"))}
                                                    >
                                                        {t('delete-mode')}
                                                    </ReactBootstrap.Button>
                                                </ReactBootstrap.Col>
                                                {/*<div>
                                      {appObject.id_object}
                                    </div>
                                    <div>
                                      {appObject.id_user}
                                    </div>
                                    <div>
                                      {appObject.object_state}
                                    </div>*/}
                                            </>
                                        ) : (
                                            <>
                                                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}
                                                                    className="text-left">
                                                    {t('no-data-available')}
                                                </ReactBootstrap.Col>
                                            </>
                                        )
                                    }
                                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                                        <h3>
                                            {t('available_environments')}
                                        </h3>
                                    </ReactBootstrap.Col>
                                    {
                                        dashboardInfo.available_environments.length > 0 ? (
                                            <>
                                                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}
                                                                    className="text-left">
                                                    <div>
                                                        <select id="available-environments"
                                                                name="available-environments"
                                                                value={availableEnvironmentValue}
                                                                onChange={changeAvailableEnvironmentValue}>
                                                            <option value="">{t('no-environment')}</option>
                                                            {
                                                                dashboardInfo.available_environments.map((appEnv, index) => {
                                                                    return (
                                                                        <>
                                                                            <option
                                                                                value={JSON.stringify(appEnv)}>{t('id-text') + appEnv.id_env + ", " + t('name-text') + appEnv.name + ", " + t('object-text') + appEnv.id_object}</option>
                                                                        </>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={3} lg={3} xl={3}
                                                                    className="text-center button-dashboard-update">
                                                    <ReactBootstrap.Button
                                                        type="submit"
                                                        variant="primary"
                                                        disabled={availableEnvironmentValue === undefined || availableEnvironmentValue === "" ? true : false}
                                                        onClick={() => environmentData(localStorage.getItem("selected-environment-id"), localStorage.getItem("selected-environment-name"), "start")}
                                                    >
                                                        {t('start-headline')}
                                                    </ReactBootstrap.Button>
                                                    <ReactBootstrap.Button
                                                        type="submit"
                                                        variant="primary"
                                                        disabled={availableEnvironmentValue === undefined || availableEnvironmentValue === "" ? true : false}
                                                        onClick={() => environmentData(localStorage.getItem("selected-environment-id"), localStorage.getItem("selected-environment-name"), "run")}
                                                    >
                                                        {t('run-headline')}
                                                    </ReactBootstrap.Button>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={3} lg={3} xl={3}
                                                                    className="text-center">
                                                    <ReactBootstrap.Button
                                                        type="submit"
                                                        variant="primary"
                                                        disabled={availableEnvironmentValue === undefined || availableEnvironmentValue === "" ? true : false}
                                                        onClick={() => environmentDataStop(localStorage.getItem("selected-environment-id"), localStorage.getItem("selected-environment-name"))}
                                                    >
                                                        {t('stop-headline')}
                                                    </ReactBootstrap.Button>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={3} lg={3} xl={3}
                                                                    className="text-center">
                                                    <ReactBootstrap.Button
                                                        type="submit"
                                                        variant="primary"
                                                        disabled={availableEnvironmentValue === undefined || availableEnvironmentValue === "" ? true : false}
                                                        onClick={() => environmentDataEdit(localStorage.getItem("selected-environment-id"), localStorage.getItem("selected-environment-name"), localStorage.getItem("selected-environment-name-object"), "edit", localStorage.getItem("selected-environment-name-object-env-apps"), localStorage.getItem("selected-environment-name-object-env-tasks"), localStorage.getItem("selected-environment-name-object-env-target"))}
                                                    >
                                                        {t('edit-headline')}
                                                    </ReactBootstrap.Button>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={3} lg={3} xl={3}
                                                                    className="text-center">
                                                    <ReactBootstrap.Button
                                                        type="submit"
                                                        variant="primary"
                                                        disabled={availableEnvironmentValue === undefined || availableEnvironmentValue === "" ? true : false}
                                                        onClick={(event) => environmentDataDelete(event, localStorage.getItem("selected-environment-id"), localStorage.getItem("selected-environment-name"))}
                                                    >
                                                        {t('delete-headline')}
                                                    </ReactBootstrap.Button>
                                                </ReactBootstrap.Col>
                                                {/*<div>
                                      {appEnv.id_env}
                                    </div>
                                    <div>
                                      {appEnv.id_object}
                                    </div>
                                    <div>
                                      {appEnv.name}
                                    </div>*/}
                                            </>
                                        ) : (
                                            <>
                                                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}
                                                                    className="text-left">
                                                    {t('no-data-available')}
                                                </ReactBootstrap.Col>
                                            </>
                                        )
                                    }
                                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                                        <h3>
                                            {t('available_applications')}
                                        </h3>
                                    </ReactBootstrap.Col>
                                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                                        <input
                                            style={{marginLeft: 5}}
                                            type="text"
                                            placeholder={t('search-text-placeholder')}
                                            value={searchText}
                                            onChange={e => handleChange(e.target.value)}
                                        />
                                    </ReactBootstrap.Col>
                                    <div className="scrollbar-menu-apps-main">
                                        {
                                            searchFilterData.length > 0 ? searchFilterData.map(appData => {
                                                return (
                                                    <>
                                                        {
                                                            appData.id_owner === Number(localStorage.getItem('userDataID')) ? (
                                                                <>
                                                                    <div className="text-center">
                                                                        <div>
                                                                            {appData.name}
                                                                        </div>
                                                                        <div className="icon-main">
                                                                            {
                                                                                appData.os_type === "win10" || appData.os_type === "win11"
                                                                                    ? (
                                                                                        <span><i
                                                                                            class="fa-brands fa-microsoft fa-xl icon-brands"></i></span>
                                                                                    ) : appData.os_type === "l26vm" || appData.os_type === "l26"
                                                                                        ? (
                                                                                            <span><i
                                                                                                className="fa-brands fa-linux fa-xl icon-brands"></i></span>
                                                                                        ) : (
                                                                                            <></>
                                                                                        )
                                                                            }
                                                                            {
                                                                                appData.object_type === "vm"
                                                                                    ? (
                                                                                        <span><i
                                                                                            class="fa-solid fa-server fa-xl icon-brands"></i></span>
                                                                                    ) : appData.object_type === "container"
                                                                                        ? (
                                                                                            <span><i
                                                                                                className="fa-brands fa-docker fa-xl icon-brands"></i></span>
                                                                                        ) : (
                                                                                            <></>
                                                                                        )
                                                                            }
                                                                            {
                                                                                appData.id_file !== ""
                                                                                    ? (
                                                                                        <span><i
                                                                                            class="fa-solid fa-file fa-xl icon-brands"></i></span>
                                                                                    ) : (
                                                                                        <></>
                                                                                    )
                                                                            }
                                                                        </div>
                                                                        <div className="text-center">
                                                                            <ReactBootstrap.Button
                                                                                type="submit"
                                                                                variant="primary"
                                                                                onClick={() => applicationData(appData.id_app, "clone")}
                                                                                disabled={appData.id_template === "" ? true : false}>
                                                                                {t('clone-headline')}
                                                                            </ReactBootstrap.Button>
                                                                        </div>
                                                                        <div className="text-center">
                                                                            <ReactBootstrap.Button
                                                                                type="submit"
                                                                                variant="primary"
                                                                                onClick={() => applicationData(appData.id_app, "create")}>
                                                                                {t('create-headline')}
                                                                            </ReactBootstrap.Button>
                                                                        </div>
                                                                    </div>
                                                                    {/*
                                                    <div>
                                                      {appData.id_app}
                                                    </div>
                                                    <div>
                                                      {appData.installer_type}
                                                    </div>
                                                    <div>
                                                      {appData.name}
                                                    </div>
                                                    <div>
                                                      {appData.version}
                                                    </div>
                                                    */}
                                                                </>
                                                            ) : (
                                                                <></>
                                                            )
                                                        }
                                                    </>
                                                )
                                            }) : (
                                                <>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}
                                                                        className="text-left">
                                                        {t('no-data-available')}
                                                    </ReactBootstrap.Col>
                                                </>
                                            )
                                        }
                                        {
                                            ownApplication.length === 0 ? (
                                                <>
                                                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}
                                                                        className="text-left">
                                                        {t('no-data-available')}
                                                    </ReactBootstrap.Col>
                                                </>
                                            ) : (
                                                <></>
                                            )
                                        }
                                    </div>

                                    {/*<ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                        <h3>
                          {t('available_connections')}
                        </h3>
                      </ReactBootstrap.Col>*/}
                                    {/*
                        dashboardInfo.available_connections.length > 0 ? (
                          <>
                            <ReactBootstrap.Col xs={12} sm={12} md={8} lg={8} xl={8} className="text-left">
                              <div>
                                <select id="available-connection" name="available-connection" value={availableConnectionValue} onChange={changeAvailableConnectionValue}>
                                  <option value="">{t('no-connection')}</option>
                                  {
                                    dashboardInfo.available_connections.map((appConnect, index) => {
                                      return (
                                        <>
                                          <option value={JSON.stringify(appConnect)}>{t('id-text') + appConnect.id_inst + ", " + t('url-text') + appConnect.viewer_url}</option>
                                        </>
                                      )
                                    })
                                  }
                                </select>
                              </div>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={2} lg={2} xl={2} className="text-center">
                              <ReactBootstrap.Button
                                  type="submit"
                                  variant="primary"
                                  disabled={availableConnectionValue === undefined || availableConnectionValue === "" ? true : false}
                                  onClick={() => connectionData(JSON.parse(localStorage.getItem("selected-connection-index")).id_inst, JSON.parse(localStorage.getItem("selected-connection-index")).viewer_url)}>
                                {t('view-headline')}
                              </ReactBootstrap.Button>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={2} lg={2} xl={2} className="text-center">
                              <ReactBootstrap.Button
                                  type="submit"
                                  variant="primary"
                                  disabled={availableConnectionValue === undefined || availableConnectionValue === "" ? true : false}
                                  onClick={(event) => connectionDataDisconnect(event, JSON.parse(localStorage.getItem("selected-connection-index")).id_inst)}>
                                {t('cut-view-headline')}
                              </ReactBootstrap.Button>
                            </ReactBootstrap.Col>
                          </>
                        ) : (
                          <>
                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                              {t('no-data-available')}
                            </ReactBootstrap.Col>
                          </>
                        )
                      */}
                                    {/*<ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                        <h3>
                          {t('available_instances')}
                        </h3>
                      </ReactBootstrap.Col>*/}
                                    {/*
                        dashboardInfo.available_instances.length > 0 ? (
                          <>
                            <ReactBootstrap.Col xs={12} sm={12} md={8} lg={8} xl={8} className="text-left">
                              <div>
                                <select id="available-instance" name="available-instance" value={availableInstanceValue} onChange={changeAvailableInstanceValue}>
                                  <option value="">{t('no-instance')}</option>
                                  {
                                    dashboardInfo.available_instances.map((appInstance, index) => {
                                      return (
                                        <>
                                          <option value={JSON.stringify(appInstance)}>{t('id-text') + appInstance.id_instance + ", " + t('object-text') + appInstance.id_object}</option>
                                        </>
                                      )
                                    })
                                  }
                                </select>
                              </div>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={2} lg={2} xl={2} className="text-center">
                              <ReactBootstrap.Button
                                  type="submit"
                                  variant="primary"
                                  disabled={availableInstanceValue === undefined || availableInstanceValue === "" ? true : false}
                                  onClick={() => instanceData(localStorage.getItem("selected-instance-id"), localStorage.getItem("selected-instance-env-name"))}
                              >
                                {t('start-headline')}
                              </ReactBootstrap.Button>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={2} lg={2} xl={2} className="text-center">
                              <ReactBootstrap.Button
                                  type="submit"
                                  variant="primary"
                                  disabled={availableInstanceValue === undefined || availableInstanceValue === "" ? true : false}
                                  onClick={(event) => stopInstance(event, localStorage.getItem("selected-instance-id"), localStorage.getItem("selected-instance-env-name"))}
                              >
                                {t('stop-headline')}
                              </ReactBootstrap.Button>
                            </ReactBootstrap.Col>
                          </>
                        ) : (
                          <>
                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                              {t('no-data-available')}
                            </ReactBootstrap.Col>
                          </>
                        )
                      */}
                                </>
                                /*) : (
                                  <></>
                                )
                              */}
                        </ReactBootstrap.Row>
                    ) : (
                        <>
                            <ReactBootstrap.Row>
                                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                                    {t('no-data-available')}
                                </ReactBootstrap.Col>
                            </ReactBootstrap.Row>
                        </>
                    )
                }
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
                {
                    localStorage.getItem("role") === "user" ? (
                        <div className="bottom-footer-fix-monitoring" onClick={goToMonitoring}>
                            <i className="fa-solid fa-gear"></i>
                        </div>
                    ) : (
                        <></>
                    )
                }
                {
                    startApplicationSuccess ? (
                        <>
                            <ReactBootstrap.Row>
                                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <div>
                                        URL: {viewerURL}
                                    </div>
                                </ReactBootstrap.Col>
                            </ReactBootstrap.Row>
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
                        <ReactBootstrap.Modal.Title>
                            {t('info-detail')}
                        </ReactBootstrap.Modal.Title>
                    </ReactBootstrap.Modal.Header>
                    <ReactBootstrap.Modal.Body>
                        <ReactBootstrap.Row>
                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                                <div>
                                    <h2>
                                        {t('clone-headline')}
                                    </h2>
                                </div>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                                <div>
                                    {t('clone-content')}
                                </div>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                                <div>
                                    <h2>
                                        {t('create-headline')}
                                    </h2>
                                </div>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                                <div>
                                    {t('create-content')}
                                </div>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                                <div>
                                    <h2>
                                        {t('icon-headline')}
                                    </h2>
                                </div>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                                <div>
                                    <span><i className="fa-brands fa-microsoft fa-xl"></i></span>
                                    <span className="info-text-space">{t('windows-text')}</span>
                                </div>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                                <div>
                                    <span><i className="fa-brands fa-linux fa-xl"></i></span>
                                    <span className="info-text-space">{t('linux-text')}</span>
                                </div>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                                <div>
                                    <span><i className="fa-solid fa-server fa-xl"></i></span>
                                    <span className="info-text-space">{t('vm-text')}</span>
                                </div>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                                <div>
                                    <span><i className="fa-brands fa-docker fa-xl"></i></span>
                                    <span className="info-text-space">{t('docker-text')}</span>
                                </div>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                                <div>
                                    <span><i className="fa-solid fa-file fa-xl"></i></span>
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
                        <ReactBootstrap.Modal.Title>
                            {t('create-update-share-data')}
                        </ReactBootstrap.Modal.Title>
                    </ReactBootstrap.Modal.Header>
                    <ReactBootstrap.Modal.Body>
                        <ReactBootstrap.Tabs defaultActiveKey="app-shared" id="user-app-view">
                            <ReactBootstrap.Tab eventKey="app-shared" title={t('app-shared')}>
                                <ReactBootstrap.Row>
                                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-left">
                                        <input
                                            style={{marginLeft: 5}}
                                            type="text"
                                            placeholder={t('search-text-placeholder')}
                                            value={searchTextShared}
                                            onChange={e => handleChangeShared(e.target.value)}
                                        />
                                    </ReactBootstrap.Col>
                                </ReactBootstrap.Row>
                                <ReactBootstrap.Row>
                                    {
                                        searchFilterDataShared.length > 0 ? searchFilterDataShared.map(dataShared => {
                                            return (
                                                <>
                                                    {
                                                        dataShared.id_owner === 0 ? (
                                                            <>
                                                                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12}
                                                                                    xl={12} className="text-left">
                                                                    <div>
                                                                        <div>
                                                                            <span
                                                                                className="fw-bold">{t('environment-name') + ": "}
                                                                            </span>
                                                                            <span>
                                                                              {
                                                                                  dataShared.name
                                                                              }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </ReactBootstrap.Col>
                                                                <ReactBootstrap.Col xs={4} sm={4} md={4} lg={4} xl={4}
                                                                                    className="text-center">
                                                                    {
                                                                        dataShared.os_type === "win10" || dataShared.os_type === "win11"
                                                                            ? (
                                                                                <i class="fa-brands fa-microsoft fa-xl"></i>
                                                                            ) : dataShared.os_type === "l26vm" || dataShared.os_type === "l26"
                                                                                ? (
                                                                                    <i className="fa-brands fa-linux fa-xl"></i>
                                                                                ) : (
                                                                                    <></>
                                                                                )
                                                                    }
                                                                </ReactBootstrap.Col>
                                                                <ReactBootstrap.Col xs={4} sm={4} md={4} lg={4} xl={4}
                                                                                    className="text-center">
                                                                    {
                                                                        dataShared.object_type === "vm"
                                                                            ? (
                                                                                <i class="fa-solid fa-server fa-xl"></i>
                                                                            ) : dataShared.object_type === "container"
                                                                                ? (
                                                                                    <i className="fa-brands fa-docker fa-xl"></i>
                                                                                ) : (
                                                                                    <></>
                                                                                )
                                                                    }
                                                                </ReactBootstrap.Col>
                                                                <ReactBootstrap.Col xs={4} sm={4} md={4} lg={4} xl={4}
                                                                                    className="text-center">
                                                                    {
                                                                        dataShared.id_file !== ""
                                                                            ? (
                                                                                <i class="fa-solid fa-file fa-xl"></i>
                                                                            ) : (
                                                                                <></>
                                                                            )
                                                                    }
                                                                </ReactBootstrap.Col>
                                                                <ReactBootstrap.Row className="border_apps_bottom">
                                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6}
                                                                                        xl={6} className="text-center">
                                                                        <ReactBootstrap.Button
                                                                            type="submit"
                                                                            variant="primary"
                                                                            onClick={() => applicationData(dataShared.id_app, "clone")}
                                                                            disabled={dataShared.id_template === "" ? true : false}>
                                                                            {t('clone-headline')}
                                                                        </ReactBootstrap.Button>
                                                                    </ReactBootstrap.Col>
                                                                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6}
                                                                                        xl={6} className="text-center">
                                                                        <ReactBootstrap.Button
                                                                            type="submit"
                                                                            variant="primary"
                                                                            onClick={() => applicationData(dataShared.id_app, "create")}>
                                                                            {t('create-headline')}
                                                                        </ReactBootstrap.Button>
                                                                    </ReactBootstrap.Col>
                                                                </ReactBootstrap.Row>
                                                            </>
                                                        ) : (
                                                            <></>
                                                        )
                                                    }
                                                </>
                                            )
                                        }) : (
                                            <>
                                                {t('no-data-available')}
                                            </>
                                        )
                                    }
                                </ReactBootstrap.Row>
                            </ReactBootstrap.Tab>
                            <ReactBootstrap.Tab eventKey="create-new-object" title={t('create-new-object')}>
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
                                    {({errors, touched}) => (
                                        <Form onSubmit={phasesBaseimageCreate} id="form-phases-baseimage-create">
                                            <ReactBootstrap.Row>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label htmlFor="vm-id-phases-baseimage-create">{t('vm-id')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="vm-id-phases-baseimage-create"
                                                           name="vm-id-phases-baseimage-create"
                                                           value={vmPhasesIDBaseimageCreate}
                                                           onChange={changeVMPhasesIDBaseimageCreate}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-vm-id-phases-baseimage-create')}
                                                    {/*<ErrorMessage name="vm-id-phases-baseimage-create">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="vm-type-phases-baseimage-create">{t('vm-object-type')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <select id="vm-type-phases-baseimage-create"
                                                            name="vm-type-phases-baseimage-create"
                                                            value={vmPhasesObjectTypeBaseimageCreate}
                                                            onChange={changeVMPhasesObjectTypeBaseimageCreate}>
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
                                                                <label
                                                                    htmlFor="vm-name-vm-phases-baseimage-create">{t('vm-name')}</label>
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <Field type="text"
                                                                       id="vm-name-vm-phases-baseimage-create"
                                                                       name="vm-name-vm-phases-baseimage-create"
                                                                       value={vmPhasesNameVMBaseimageCreate}
                                                                       onChange={changeVMPhasesNameVMBaseimageCreate}/>
                                                            </ReactBootstrap.Col>
                                                            <div className="error-text">
                                                                {t('error-vm-name-vm-phases-baseimage-create')}
                                                                {/*<ErrorMessage name="vm-name-vm-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                            </div>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <label
                                                                    htmlFor="vm-os-type-phases-baseimage-create">{t('vm-os-type')}</label>
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <select id="vm-os-type-phases-baseimage-create"
                                                                        name="vm-os-type-phases-baseimage-create"
                                                                        value={vmPhasesOSTypeBaseimageCreate}
                                                                        onChange={changeVMPhasesOSTypeBaseimageCreate}>
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
                                                                <label
                                                                    htmlFor="vm-cores-phases-baseimage-create">{t('vm-cores')}</label>
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <Field type="text" id="vm-cores-phases-baseimage-create"
                                                                       name="vm-cores-phases-baseimage-create"
                                                                       value={vmPhasesCoresBaseimageCreate}
                                                                       onChange={changeVMPhasesCoresBaseimageCreate}/>
                                                            </ReactBootstrap.Col>
                                                            <div className="error-text">
                                                                {t('error-vm-cores-phases-baseimage-create')}
                                                                {/*<ErrorMessage name="vm-cores-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                            </div>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <label
                                                                    htmlFor="vm-memory-size-phases-baseimage-create">{t('vm-memory-size')}</label>
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <Field type="text"
                                                                       id="vm-memory-size-phases-baseimage-create"
                                                                       name="vm-memory-size-phases-baseimage-create"
                                                                       value={vmPhasesMemorySizeBaseimageCreate}
                                                                       onChange={changeVMPhasesMemorySizeBaseimageCreate}/>
                                                            </ReactBootstrap.Col>
                                                            <div className="error-text">
                                                                {t('error-vm-memory-size-phases-baseimage-create')}
                                                                {/*<ErrorMessage name="vm-memory-size-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                            </div>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <label
                                                                    htmlFor="vm-disk-size-phases-baseimage-create">{t('vm-disk-size')}</label>
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <Field type="text"
                                                                       id="vm-disk-size-phases-baseimage-create"
                                                                       name="vm-disk-size-phases-baseimage-create"
                                                                       value={vmPhasesDiskSizeBaseimageCreate}
                                                                       onChange={changeVMPhasesDiskSizeBaseimageCreate}/>
                                                            </ReactBootstrap.Col>
                                                            <div className="error-text">
                                                                {t('error-vm-disk-size-phases-baseimage-create')}
                                                                {/*<ErrorMessage name="vm-disk-size-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                            </div>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <label
                                                                    htmlFor="vm-keyboard-language-phases-baseimage-create">{t('vm-keyboard-language')}</label>
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <Field type="text"
                                                                       id="vm-keyboard-language-phases-baseimage-create"
                                                                       name="vm-keyboard-language-phases-baseimage-create"
                                                                       value={vmPhasesKeyboardBaseimageCreate}
                                                                       onChange={changeVMPhasesKeyboardBaseimageCreate}/>
                                                            </ReactBootstrap.Col>
                                                            <div className="error-text">
                                                                {t('error-vm-keyboard-language-phases-baseimage-create')}
                                                                {/*<ErrorMessage name="vm-keyboard-language-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                            </div>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <label
                                                                    htmlFor="vm-ceph-pool-phases-baseimage-create">{t('vm-ceph-pool')}</label>
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
                                                                <label
                                                                    htmlFor="vm-ceph-public-phases-baseimage-create">{t('vm-ceph-public')}</label>
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
                                                                <label
                                                                    htmlFor="vm-ceph-shared-phases-baseimage-create">{t('vm-ceph-shared')}</label>
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
                                                                <label
                                                                    htmlFor="vm-ceph-user-phases-baseimage-create">{t('vm-ceph-user')}</label>
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
                                                                <label
                                                                    htmlFor="vm-resolution-phases-environment-create">{t('vm-resolution')}</label>
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <Field type="text"
                                                                       id="vm-resolution-phases-environment-create"
                                                                       name="vm-resolution-phases-environment-create"
                                                                       value={vmResolutionPhasesBaseimageCreate}
                                                                       onChange={changeVMResolutionPhasesBaseimageCreate}/>
                                                            </ReactBootstrap.Col>
                                                            <div className="error-text">
                                                                {t('error-vm-resolution-phases-environment-create')}
                                                                {/*<ErrorMessage name="vm-resolution-phases-environment-create">
                                                        </ErrorMessage>*/}
                                                            </div>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <label
                                                                    htmlFor="vm-contype-phases-environment-create">{t('vm-contype')}</label>
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <select id="vm-contype-phases-environment-create"
                                                                        name="vm-contype-phases-environment-create"
                                                                        value={vmContypePhasesBaseimageCreate}
                                                                        onChange={changeVMContypePhasesBaseimageCreate}>
                                                                    <option value="sysvnc">System VNC (Proxmox
                                                                        default)
                                                                    </option>
                                                                    <option value="instvnc">Instance VNC (Docker
                                                                        default)
                                                                    </option>
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
                                                                <label
                                                                    htmlFor="vm-resize-phases-environment-create">{t('vm-resize')}</label>
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <select id="vm-resize-phases-environment-create"
                                                                        name="vm-resize-phases-environment-create"
                                                                        value={vmResizePhasesBaseimageCreate}
                                                                        onChange={changeVMResizePhasesBaseimageCreate}>
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
                                                                <label
                                                                    htmlFor="vm-scale-phases-environment-create">{t('vm-scale')}</label>
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
                                                                <label
                                                                    htmlFor="vm-name-phases-baseimage-create">{t('vm-name')}</label>
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <Field type="text" id="vm-name-phases-baseimage-create"
                                                                       name="vm-name-phases-baseimage-create"
                                                                       value={vmPhasesNameBaseimageCreate}
                                                                       onChange={changeVMPhasesNameBaseimageCreate}/>
                                                            </ReactBootstrap.Col>
                                                            <div className="error-text">
                                                                {t('error-vm-name-phases-baseimage-create')}
                                                                {/*<ErrorMessage name="vm-name-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                            </div>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <label
                                                                    htmlFor="vm-root-image-phases-baseimage-create">{t('vm-root-image')}</label>
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <select id="vm-root-image-phases-baseimage-create"
                                                                        name="vm-root-image-phases-baseimage-create"
                                                                        value={vmPhasesRootImageBaseimageCreate}
                                                                        onChange={changeVMPhasesRootImageBaseimageCreate}>
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
                                                                <label
                                                                    htmlFor="vm-cores-phases-baseimage-create">{t('vm-cores')}</label>
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <Field type="text" id="vm-cores-phases-baseimage-create"
                                                                       name="vm-cores-phases-baseimage-create"
                                                                       value={vmPhasesCoresBaseimageCreate}
                                                                       onChange={changeVMPhasesCoresBaseimageCreate}/>
                                                            </ReactBootstrap.Col>
                                                            <div className="error-text">
                                                                {t('error-vm-cores-phases-baseimage-create')}
                                                                {/*<ErrorMessage name="vm-cores-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                            </div>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <label
                                                                    htmlFor="vm-memory-size-phases-baseimage-create">{t('vm-memory-size')}</label>
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <Field type="text"
                                                                       id="vm-memory-size-phases-baseimage-create"
                                                                       name="vm-memory-size-phases-baseimage-create"
                                                                       value={vmPhasesMemorySizeBaseimageCreate}
                                                                       onChange={changeVMPhasesMemorySizeBaseimageCreate}/>
                                                            </ReactBootstrap.Col>
                                                            <div className="error-text">
                                                                {t('error-vm-memory-size-phases-baseimage-create')}
                                                                {/*<ErrorMessage name="vm-memory-size-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                            </div>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <label
                                                                    htmlFor="vm-disk-size-phases-baseimage-create">{t('vm-disk-size')}</label>
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <Field type="text"
                                                                       id="vm-disk-size-phases-baseimage-create"
                                                                       name="vm-disk-size-phases-baseimage-create"
                                                                       value={vmPhasesDiskSizeBaseimageCreate}
                                                                       onChange={changeVMPhasesDiskSizeBaseimageCreate}/>
                                                            </ReactBootstrap.Col>
                                                            <div className="error-text">
                                                                {t('error-vm-disk-size-phases-baseimage-create')}
                                                                {/*<ErrorMessage name="vm-disk-size-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                            </div>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <label
                                                                    htmlFor="vm-dockerfile-phases-baseimage-create">{t('vm-dockerfile')}</label>
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <input type="file"
                                                                       id="vm-dockerfile-phases-baseimage-create"
                                                                       name="vm-dockerfile-phases-baseimage-create"
                                                                       onChange={changeVMPhasesDockerfileBaseimageCreate}/>
                                                                {/*<Field type="text" id="vm-dockerfile-phases-baseimage-create" name="vm-dockerfile-phases-baseimage-create" value={vmPhasesDockerfileBaseimageCreate} onChange={changeVMPhasesDockerfileBaseimageCreate}/>*/}
                                                            </ReactBootstrap.Col>
                                                            <div className="error-text">
                                                                {t('error-vm-dockerfile-phases-baseimage-create')}
                                                                {/*<ErrorMessage name="vm-dockerfile-phases-baseimage-create">
                                                        </ErrorMessage>*/}
                                                            </div>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <label
                                                                    htmlFor="vm-ceph-public-phases-baseimage-create">{t('vm-ceph-public')}</label>
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
                                                                <label
                                                                    htmlFor="vm-ceph-shared-phases-baseimage-create">{t('vm-ceph-shared')}</label>
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
                                                                <label
                                                                    htmlFor="vm-ceph-user-phases-baseimage-create">{t('vm-ceph-user')}</label>
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
                                                                <label
                                                                    htmlFor="vm-resolution-phases-environment-create">{t('vm-resolution')}</label>
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <Field type="text"
                                                                       id="vm-resolution-phases-environment-create"
                                                                       name="vm-resolution-phases-environment-create"
                                                                       value={vmResolutionPhasesBaseimageCreate}
                                                                       onChange={changeVMResolutionPhasesBaseimageCreate}/>
                                                            </ReactBootstrap.Col>
                                                            <div className="error-text">
                                                                {t('error-vm-resolution-phases-environment-create')}
                                                                {/*<ErrorMessage name="vm-resolution-phases-environment-create">
                                                        </ErrorMessage>*/}
                                                            </div>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <label
                                                                    htmlFor="vm-contype-phases-environment-create">{t('vm-contype')}</label>
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <select id="vm-contype-phases-environment-create"
                                                                        name="vm-contype-phases-environment-create"
                                                                        value={vmContypePhasesBaseimageCreate}
                                                                        onChange={changeVMContypePhasesBaseimageCreate}>
                                                                    <option value="sysvnc">System VNC (Proxmox
                                                                        default)
                                                                    </option>
                                                                    <option value="instvnc">Instance VNC (Docker
                                                                        default)
                                                                    </option>
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
                                                                <label
                                                                    htmlFor="vm-resize-phases-environment-create">{t('vm-resize')}</label>
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                                <select id="vm-resize-phases-environment-create"
                                                                        name="vm-resize-phases-environment-create"
                                                                        value={vmResizePhasesBaseimageCreate}
                                                                        onChange={changeVMResizePhasesBaseimageCreate}>
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
                                                                <label
                                                                    htmlFor="vm-scale-phases-environment-create">{t('vm-scale')}</label>
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
                            <ReactBootstrap.Tab eventKey="clone-new-object" title={t('clone-new-object')}>
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
                                    {({errors, touched}) => (
                                        <Form onSubmit={phasesBaseimageClone} id="form-phases-baseimage-clone">
                                            <ReactBootstrap.Row>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label htmlFor="vm-id-phases-baseimage-clone">{t('vm-id')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="vm-id-phases-baseimage-clone"
                                                           name="vm-id-phases-baseimage-clone"
                                                           value={vmPhasesIDBaseimageClone}
                                                           onChange={changeVMPhasesIDBaseimageClone}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-vm-id-phases-baseimage-clone')}
                                                    {/*<ErrorMessage name="vm-id-phases-baseimage-clone">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="vm-newid-phases-baseimage-clone">{t('vm-new-id')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="vm-newid-phases-baseimage-clone"
                                                           name="vm-newid-phases-baseimage-clone"
                                                           value={vmPhasesNewIDBaseimageClone}
                                                           onChange={changeVMPhasesNewIDBaseimageClone}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-vm-newid-phases-baseimage-clone')}
                                                    {/*<ErrorMessage name="vm-newid-phases-baseimage-clone">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="vm-name-phases-baseimage-clone">{t('vm-name')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="vm-name-phases-baseimage-clone"
                                                           name="vm-name-phases-baseimage-clone"
                                                           value={vmPhasesNameBaseimageClone}
                                                           onChange={changeVMPhasesNameBaseimageClone}/>
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
                            <ReactBootstrap.Tab eventKey="app-create" title={t('app-create')}>
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
                                    validationSchema={createAppSchema}
                                    onSubmit={values => {
                                        console.log(values.text);
                                    }}
                                >
                                    {({errors, touched}) => (
                                        <Form onSubmit={createApp} id="form-apps-tools">
                                            <ReactBootstrap.Row>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label htmlFor="create-app-id">{t('vm-id')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="create-app-id" name="create-app-id"
                                                           value={vmCreateUpdateAppID}
                                                           onChange={changeVMCreateUpdateAppID}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-create-app-id')}
                                                    {/*<ErrorMessage name="create-app-id">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="create-app-name">{t('app-create-update-name')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="create-app-name" name="create-app-name"
                                                           value={vmCreateUpdateAppName}
                                                           onChange={changeVMCreateUpdateAppName}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-create-app-name')}
                                                    {/*<ErrorMessage name="create-app-name">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="create-app-id-file">{t('app-create-update-file')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="create-app-id-file" name="create-app-id-file"
                                                           value={vmCreateUpdateAppIDFile}
                                                           onChange={changeVMCreateUpdateAppIDFile}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-create-app-id-file')}
                                                    {/*<ErrorMessage name="create-app-id-file">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="create-app-id-template">{t('app-create-update-template')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="create-app-id-template"
                                                           name="create-app-id-template"
                                                           value={vmCreateUpdateAppIDTemplate}
                                                           onChange={changeVMCreateUpdateAppIDTemplate}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-create-app-id-template')}
                                                    {/*<ErrorMessage name="create-app-id-template">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="create-app-os-type">{t('app-create-update-os-type')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <select id="create-app-os-type" name="create-app-os-type"
                                                            value={vmCreateUpdateAppOSType}
                                                            onChange={changeVMCreateUpdateAppOSType}>
                                                        <option value="win10">Windows 10</option>
                                                        <option value="win11">Windows 11</option>
                                                        <option value="l26">Debian 12</option>
                                                    </select>
                                                    {/*<Field type="text" id="create-app-os-type" name="create-app-os-type" value={vmCreateUpdateAppOSType} onChange={changeVMCreateUpdateAppOSType}/>*/}
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-create-app-os-type')}
                                                    {/*<ErrorMessage name="create-app-os-type">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="create-app-installer">{t('app-create-update-installer')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="create-app-installer"
                                                           name="create-app-installer"
                                                           value={vmCreateUpdateAppInstaller}
                                                           onChange={changeVMCreateUpdateAppInstaller}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-create-app-installer')}
                                                    {/*<ErrorMessage name="create-app-installer">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="create-app-installer-args">{t('app-create-update-installer-args')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="create-app-installer-args"
                                                           name="create-app-installer-args"
                                                           value={vmCreateUpdateAppInstallerARGS}
                                                           onChange={changeVMCreateUpdateAppInstallerARGS}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-create-app-installer-args')}
                                                    {/*<ErrorMessage name="create-app-installer-args">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="create-app-installer-type">{t('app-create-update-installer-type')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <select id="create-app-installer-type"
                                                            name="create-app-installer-type"
                                                            value={vmCreateUpdateAppInstallerType}
                                                            onChange={changeVMCreateUpdateAppInstallerType}>
                                                        <option value="None">{t('app-installer-none')}</option>
                                                        <option
                                                            value="exec_cmd">{t('app-installer-execute-command')}</option>
                                                        <option
                                                            value="os_install">{t('app-installer-os-install')}</option>
                                                        <option
                                                            value="os_uninstall">{t('app-installer-os-uninstall')}</option>
                                                    </select>
                                                    {/*<Field type="text" id="create-app-installer-type" name="create-app-installer-type" value={vmCreateUpdateAppInstallerType} onChange={changeVMCreateUpdateAppInstallerType}/>*/}
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-create-app-installer-type')}
                                                    {/*<ErrorMessage name="create-app-installer-type">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="create-app-target">{t('app-create-update-target')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="create-app-target" name="create-app-target"
                                                           value={vmCreateUpdateAppTarget}
                                                           onChange={changeVMCreateUpdateAppTarget}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-create-app-target')}
                                                    {/*<ErrorMessage name="create-app-target">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="create-app-target-args">{t('app-create-update-target-args')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="create-app-target-args"
                                                           name="create-app-target-args"
                                                           value={vmCreateUpdateAppTargetARGS}
                                                           onChange={changeVMCreateUpdateAppTargetARGS}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-create-app-target-args')}
                                                    {/*<ErrorMessage name="create-app-target-args">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="create-app-version">{t('app-create-update-version')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="create-app-version" name="create-app-version"
                                                           value={vmCreateUpdateAppVersion}
                                                           onChange={changeVMCreateUpdateAppVersion}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-create-app-version')}
                                                    {/*<ErrorMessage name="create-app-version">
                                            </ErrorMessage>*/}
                                                </div>
                                            </ReactBootstrap.Row>
                                            <ReactBootstrap.Row>
                                                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <ReactBootstrap.Button
                                                        type="submit"
                                                        variant="primary"
                                                        id="submit"
                                                        disabled={vmCreateUpdateAppID.length > 0 && vmCreateUpdateAppName.length > 0 && vmCreateUpdateAppOSType.length > 0 && vmCreateUpdateAppInstallerType.length > 0 && vmCreateUpdateAppTarget.length > 0 && vmCreateUpdateAppVersion.length > 0 ? false : true}>
                                                        {t('submit')}
                                                    </ReactBootstrap.Button>
                                                </ReactBootstrap.Col>
                                            </ReactBootstrap.Row>
                                        </Form>
                                    )}
                                </Formik>
                            </ReactBootstrap.Tab>
                            <ReactBootstrap.Tab eventKey="app-update" title={t('app-update')}>
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
                                    validationSchema={updateAppSchema}
                                    onSubmit={values => {
                                        console.log(values.text);
                                    }}
                                >
                                    {({errors, touched}) => (
                                        <Form onSubmit={updateApp} id="form-apps-tools">
                                            <ReactBootstrap.Row>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label htmlFor="update-app-id">{t('vm-id')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="update-app-id" name="update-app-id"
                                                           value={vmCreateUpdateAppID}
                                                           onChange={changeVMCreateUpdateAppID}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-update-app-id')}
                                                    {/*<ErrorMessage name="update-app-id">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="update-app-name">{t('app-create-update-name')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="update-app-name" name="update-app-name"
                                                           value={vmCreateUpdateAppName}
                                                           onChange={changeVMCreateUpdateAppName}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-update-app-name')}
                                                    {/*<ErrorMessage name="update-app-name">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="update-app-id-file">{t('app-create-update-file')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="update-app-id-file" name="update-app-id-file"
                                                           value={vmCreateUpdateAppIDFile}
                                                           onChange={changeVMCreateUpdateAppIDFile}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-update-app-id-file')}
                                                    {/*<ErrorMessage name="update-app-id-file">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="update-app-id-template">{t('app-create-update-template')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="update-app-id-template"
                                                           name="update-app-id-template"
                                                           value={vmCreateUpdateAppIDTemplate}
                                                           onChange={changeVMCreateUpdateAppIDTemplate}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-update-app-id-template')}
                                                    {/*<ErrorMessage name="update-app-id-template">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="update-app-os-type">{t('app-create-update-os-type')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <select id="update-app-os-type" name="update-app-os-type"
                                                            value={vmCreateUpdateAppOSType}
                                                            onChange={changeVMCreateUpdateAppOSType}>
                                                        <option value="win10">Windows 10</option>
                                                        <option value="win11">Windows 11</option>
                                                        <option value="l26">Debian 12</option>
                                                    </select>
                                                    {/*<Field type="text" id="update-app-os-type" name="update-app-os-type" value={vmCreateUpdateAppOSType} onChange={changeVMCreateUpdateAppOSType}/>*/}
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-update-app-os-type')}
                                                    {/*<ErrorMessage name="update-app-os-type">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="update-app-installer">{t('app-create-update-installer')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="update-app-installer"
                                                           name="update-app-installer"
                                                           value={vmCreateUpdateAppInstaller}
                                                           onChange={changeVMCreateUpdateAppInstaller}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-update-app-installer')}
                                                    {/*<ErrorMessage name="update-app-installer">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="update-app-installer-args">{t('app-create-update-installer-args')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="update-app-installer-args"
                                                           name="update-app-installer-args"
                                                           value={vmCreateUpdateAppInstallerARGS}
                                                           onChange={changeVMCreateUpdateAppInstallerARGS}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-update-app-installer-args')}
                                                    {/*<ErrorMessage name="update-app-installer-args">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="update-app-installer-type">{t('app-create-update-installer-type')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <select id="update-app-installer-type"
                                                            name="update-app-installer-type"
                                                            value={vmCreateUpdateAppInstallerType}
                                                            onChange={changeVMCreateUpdateAppInstallerType}>
                                                        <option value="None">{t('app-installer-none')}</option>
                                                        <option
                                                            value="exec_cmd">{t('app-installer-execute-command')}</option>
                                                        <option
                                                            value="os_install">{t('app-installer-os-install')}</option>
                                                        <option
                                                            value="os_uninstall">{t('app-installer-os-uninstall')}</option>
                                                    </select>
                                                    {/*<Field type="text" id="update-app-installer-type" name="update-app-installer-type" value={vmCreateUpdateAppInstallerType} onChange={changeVMCreateUpdateAppInstallerType}/>*/}
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-update-app-installer-type')}
                                                    {/*<ErrorMessage name="update-app-installer-type">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="update-app-target">{t('app-create-update-target')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="update-app-target" name="update-app-target"
                                                           value={vmCreateUpdateAppTarget}
                                                           onChange={changeVMCreateUpdateAppTarget}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-update-app-target')}
                                                    {/*<ErrorMessage name="update-app-target">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="update-app-target-args">{t('app-create-update-target-args')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="update-app-target-args"
                                                           name="update-app-target-args"
                                                           value={vmCreateUpdateAppTargetARGS}
                                                           onChange={changeVMCreateUpdateAppTargetARGS}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-update-app-target-args')}
                                                    {/*<ErrorMessage name="update-app-target-args">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="update-app-version">{t('app-create-update-version')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="update-app-version" name="update-app-version"
                                                           value={vmCreateUpdateAppVersion}
                                                           onChange={changeVMCreateUpdateAppVersion}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-update-app-version')}
                                                    {/*<ErrorMessage name="update-app-version">
                                            </ErrorMessage>*/}
                                                </div>
                                            </ReactBootstrap.Row>
                                            <ReactBootstrap.Row>
                                                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <ReactBootstrap.Button
                                                        type="submit"
                                                        variant="primary"
                                                        id="submit"
                                                        disabled={vmCreateUpdateAppID.length > 0 && vmCreateUpdateAppName.length > 0 && vmCreateUpdateAppOSType.length > 0 && vmCreateUpdateAppInstallerType.length > 0 && vmCreateUpdateAppTarget.length > 0 && vmCreateUpdateAppVersion.length > 0 ? false : true}>
                                                        {t('submit')}
                                                    </ReactBootstrap.Button>
                                                </ReactBootstrap.Col>
                                            </ReactBootstrap.Row>
                                        </Form>
                                    )}
                                </Formik>
                            </ReactBootstrap.Tab>
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
                                    onSubmit={values => {
                                        console.log(values.text);
                                    }}
                                >
                                    {({errors, touched}) => (
                                        <Form onSubmit={createFile} id="form-apps-tools">
                                            <ReactBootstrap.Row>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label htmlFor="create-file-id">{t('vm-id')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="create-file-id" name="create-file-id"
                                                           value={vmFileUploadAppID}
                                                           onChange={changeVMFileUploadAppID}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-create-file-id')}
                                                    {/*<ErrorMessage name="create-file-id">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="create-file-name">{t('file-create-update-name')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="create-file-name" name="create-file-name"
                                                           value={vmFileUploadAppName}
                                                           onChange={changeVMFileUploadAppName}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-create-file-name')}
                                                    {/*<ErrorMessage name="create-file-name">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="create-file-path">{t('file-create-update-path')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="create-file-path" name="create-file-path"
                                                           value={vmFileUploadAppPath}
                                                           onChange={changeVMFileUploadAppPath}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-create-file-path')}
                                                    {/*<ErrorMessage name="create-file-path">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="create-file-os-type">{t('file-create-update-os-type')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <select id="create-file-os-type" name="create-file-os-type"
                                                            value={vmFileUploadAppOSType}
                                                            onChange={changeVMFileUploadAppOSType}>
                                                        <option value="win10">Windows 10</option>
                                                        <option value="win11">Windows 11</option>
                                                        <option value="l26">Debian 12</option>
                                                    </select>
                                                    {/*<Field type="text" id="create-file-os-type" name="create-file-os-type" value={vmFileUploadAppOSType} onChange={changeVMFileUploadAppOSType}/>*/}
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-create-file-os-type')}
                                                    {/*<ErrorMessage name="create-file-os-type">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="create-file-version">{t('file-create-update-version')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="create-file-version"
                                                           name="create-file-version" value={vmFileUploadAppVersion}
                                                           onChange={changeVMFileUploadAppVersion}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-create-file-version')}
                                                    {/*<ErrorMessage name="create-file-version">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="create-file-file">{t('file-create-update-file')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <input type="file" id="create-file-file" name="create-file-file"
                                                           onChange={changeVMFileUploadAppSelectFile}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-create-file-file')}
                                                    {/*<ErrorMessage name="create-file-file">
                                            </ErrorMessage>*/}
                                                </div>
                                            </ReactBootstrap.Row>
                                            <ReactBootstrap.Row>
                                                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <ReactBootstrap.Button
                                                        type="submit"
                                                        variant="primary"
                                                        id="submit"
                                                        disabled={vmFileUploadAppID.length > 0 && vmFileUploadAppName.length > 0 && vmFileUploadAppOSType.length > 0 && vmFileUploadAppVersion.length > 0 && vmFileUploadAppPath.length > 0 && vmFileUploadAppSelectFile !== "" ? false : true}>
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
                                    onSubmit={values => {
                                        console.log(values.text);
                                    }}
                                >
                                    {({errors, touched}) => (
                                        <Form onSubmit={updateFile} id="form-apps-tools">
                                            <ReactBootstrap.Row>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label htmlFor="update-file-id">{t('vm-id')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="update-file-id" name="update-file-id"
                                                           value={vmFileUploadAppID}
                                                           onChange={changeVMFileUploadAppID}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-update-file-id')}
                                                    {/*<ErrorMessage name="update-file-id">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="update-file-name">{t('file-create-update-name')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="update-file-name" name="update-file-name"
                                                           value={vmFileUploadAppName}
                                                           onChange={changeVMFileUploadAppName}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-update-file-name')}
                                                    {/*<ErrorMessage name="update-file-name">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="update-file-path">{t('file-create-update-path')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="update-file-path" name="update-file-path"
                                                           value={vmFileUploadAppPath}
                                                           onChange={changeVMFileUploadAppPath}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-update-file-path')}
                                                    {/*<ErrorMessage name="update-file-path">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="update-file-os-type">{t('file-create-update-os-type')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <select id="update-file-os-type" name="update-file-os-type"
                                                            value={vmFileUploadAppOSType}
                                                            onChange={changeVMFileUploadAppOSType}>
                                                        <option value="win10">Windows 10</option>
                                                        <option value="win11">Windows 11</option>
                                                        <option value="l26">Debian 12</option>
                                                    </select>
                                                    {/*<Field type="text" id="update-file-os-type" name="update-file-os-type" value={vmFileUploadAppOSType} onChange={changeVMFileUploadAppOSType}/>*/}
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-update-file-os-type')}
                                                    {/*<ErrorMessage name="update-file-os-type">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="update-file-version">{t('file-create-update-version')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <Field type="text" id="update-file-version"
                                                           name="update-file-version" value={vmFileUploadAppVersion}
                                                           onChange={changeVMFileUploadAppVersion}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-update-file-version')}
                                                    {/*<ErrorMessage name="update-file-version">
                                            </ErrorMessage>*/}
                                                </div>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <label
                                                        htmlFor="update-file-file">{t('file-create-update-file')}</label>
                                                </ReactBootstrap.Col>
                                                <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <input type="file" id="update-file-file" name="update-file-file"
                                                           onChange={changeVMFileUploadAppSelectFile}/>
                                                </ReactBootstrap.Col>
                                                <div className="error-text">
                                                    {t('error-update-file-file')}
                                                    {/*<ErrorMessage name="update-file-file">
                                            </ErrorMessage>*/}
                                                </div>
                                            </ReactBootstrap.Row>
                                            <ReactBootstrap.Row>
                                                <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <ReactBootstrap.Button
                                                        type="submit"
                                                        variant="primary"
                                                        id="submit"
                                                        disabled={vmFileUploadAppID.length > 0 && vmFileUploadAppName.length > 0 && vmFileUploadAppOSType.length > 0 && vmFileUploadAppVersion.length > 0 && vmFileUploadAppPath.length > 0 && vmFileUploadAppSelectFile !== "" ? false : true}>
                                                        {t('submit')}
                                                    </ReactBootstrap.Button>
                                                </ReactBootstrap.Col>
                                            </ReactBootstrap.Row>
                                        </Form>
                                    )}
                                </Formik>
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
                        <ReactBootstrap.Modal.Title>
                            {t('request-app')}
                        </ReactBootstrap.Modal.Title>
                    </ReactBootstrap.Modal.Header>
                    <ReactBootstrap.Modal.Body>
                        <Formik
                            initialValues={{
                                /*id: "",
                                username: "",
                                appname: "",*/
                            }}
                            validationSchema={requestApplicationAdminSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({errors, touched}) => (
                                <Form onSubmit={requestApplicationAdmin} id="form-main-user-request">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <label htmlFor="request-message">{t('request-message')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <input type="text" id="request-message" name="request-message"
                                                   value={requestMessage} onChange={changeRequestMessage}/>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={requestMessage.length > 0 ? false : true}
                                                //onClick={closeRequestModal}
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
                        <ReactBootstrap.Modal.Title>
                            {t('all-available-files')}
                        </ReactBootstrap.Modal.Title>
                    </ReactBootstrap.Modal.Header>
                    <ReactBootstrap.Modal.Body>
                        <ReactBootstrap.Tabs defaultActiveKey="own-files" id="files-view">
                            <ReactBootstrap.Tab eventKey="own-files" title={t('own-files')}>
                                {
                                    ownFiles.length > 0 ? (
                                        <>
                                            {
                                                ownFiles.map(ownFileData => {
                                                    return (
                                                        <ReactBootstrap.Row>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}
                                                                                className="text-left">
                                                                {t('details-files-name') + ": " + ownFileData.id}
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                                <ReactBootstrap.Button
                                                                    type="submit"
                                                                    variant="primary"
                                                                    id="submit"
                                                                    onClick={() => getFileDetailsModal(ownFileData.id)}>
                                                                    {t('details-files')}
                                                                </ReactBootstrap.Button>
                                                            </ReactBootstrap.Col>
                                                        </ReactBootstrap.Row>
                                                    )
                                                })
                                            }
                                        </>
                                    ) : (
                                        <ReactBootstrap.Row>
                                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}
                                                                className="text-left">
                                                {t('no-data-available')}
                                            </ReactBootstrap.Col>
                                        </ReactBootstrap.Row>
                                    )
                                }
                            </ReactBootstrap.Tab>
                            <ReactBootstrap.Tab eventKey="shared-files" title={t('shared-files')}>
                                {
                                    sharedFiles.length > 0 ? (
                                        <>
                                            {
                                                sharedFiles.map(sharedFileData => {
                                                    return (
                                                        <ReactBootstrap.Row>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}
                                                                                className="text-left">
                                                                {t('details-files-name') + ": " + sharedFileData.id}
                                                            </ReactBootstrap.Col>
                                                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                                <ReactBootstrap.Button
                                                                    type="submit"
                                                                    variant="primary"
                                                                    id="submit"
                                                                    onClick={() => getFileDetailsModal(sharedFileData.id)}>
                                                                    {t('details-files')}
                                                                </ReactBootstrap.Button>
                                                            </ReactBootstrap.Col>
                                                        </ReactBootstrap.Row>
                                                    )
                                                })
                                            }
                                        </>
                                    ) : (
                                        <ReactBootstrap.Row>
                                            <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}
                                                                className="text-left">
                                                {t('no-data-available')}
                                            </ReactBootstrap.Col>
                                        </ReactBootstrap.Row>
                                    )
                                }
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
                        <ReactBootstrap.Modal.Title>
                            {t('details-files')}
                        </ReactBootstrap.Modal.Title>
                    </ReactBootstrap.Modal.Header>
                    <ReactBootstrap.Modal.Body>
                        {
                            Object.keys(detailFileInfo).length === 0 && detailFileInfo.constructor === Object ? (
                                <ReactBootstrap.Row>
                                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}
                                                        className="text-left">
                                        {t('no-data-available')}
                                    </ReactBootstrap.Col>
                                </ReactBootstrap.Row>
                            ) : (
                                <ReactBootstrap.Row>
                                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}
                                                        className="text-left">
                                        {t('details-files-id') + ": " + detailFileInfo.id}
                                    </ReactBootstrap.Col>
                                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}
                                                        className="text-left text-detail-path">
                                        {t('details-files-localpath') + ": " + detailFileInfo.localpath}
                                    </ReactBootstrap.Col>
                                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}
                                                        className="text-left">
                                        {t('details-files-name') + ": " + detailFileInfo.name}
                                    </ReactBootstrap.Col>
                                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}
                                                        className="text-left">
                                        {t('details-files-os-type') + ": " + detailFileInfo.os_type}
                                    </ReactBootstrap.Col>
                                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}
                                                        className="text-left text-detail-path">
                                        {t('details-files-remotepath') + ": " + detailFileInfo.remotepath}
                                    </ReactBootstrap.Col>
                                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}
                                                        className="text-left">
                                        {t('details-files-version') + ": " + detailFileInfo.version}
                                    </ReactBootstrap.Col>
                                </ReactBootstrap.Row>
                            )
                        }
                    </ReactBootstrap.Modal.Body>
                </ReactBootstrap.Modal>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <div className={requestAlert ? "show-alert" : "hide-alert"}>
                            <div className={requestAlertMessage ? "request-success-alert" : "request-fail-alert"}>
                                {requestAlertMessage ? t('request-successful') : t('request-failed')}
                            </div>
                        </div>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
            </ReactBootstrap.Container>
        </>
    );
}

export default MainUser;
