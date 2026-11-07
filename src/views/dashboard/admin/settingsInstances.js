import { useState } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import {DEVELOPMENT, TEST, LIVE, USERNAME, PASSWORD, DEVELOPMENT_INTERN, TEST_INTERN, LIVE_INTERN, URL_SYSTEM} from "../../../constants/constants";

import Header from "../../../components/header";

function SettingsInstances() {
    const params = useParams(); // Example: {params.id}
    const [vmIDApp, setVMIDApp] = useState("");
    const [vmENVApp, setVMENVApp] = useState("");
    const [vmCMDApp, setVMCMDApp] = useState("");
    const [vmARGSApp, setVMARGSApp] = useState("");
    const [vmIDCommand, setVMIDCommand] = useState("");
    const [vmENVCommand, setVMENVCommand] = useState("");
    const [vmCMDCommand, setVMCMDCommand] = useState("");
    const [vmARGSCommand, setVMARGSCommand] = useState("");
    const [vmIDSSH, setVMIDSSH] = useState("");
    const [vmENVSSH, setVMENVSSH] = useState("");
    const [vmCMDSSH, setVMCMDSSH] = useState("");
    const [vmARGSSSH, setVMARGSSSH] = useState("");
    const [vmIDAction, setVMIDAction] = useState("");
    const [vmENVAction, setVMENVAction] = useState("");
    const [vmCMDAction, setVMCMDAction] = useState("");
    const [vmARGSAction, setVMARGSAction] = useState("");
    const [vmIDResize, setVMIDResize] = useState("");
    const [vmENVResize, setVMENVResize] = useState("");
    const [vmCMDResize, setVMCMDResize] = useState("");
    const [vmARGSResize, setVMARGSResize] = useState("");
    const [vmIDOSPackage, setVMIDOSPackage] = useState("");
    const [vmENVOSPackage, setVMENVOSPackage] = useState("");
    const [vmCMDOSPackage, setVMCMDOSPackage] = useState("");
    const [vmARGSOSPackage, setVMARGSOSPackage] = useState("");
    const [vmIDUpload, setVMIDUpload] = useState("");
    const [vmENVUpload, setVMENVUpload] = useState("");
    const [vmFileUpload, setVMFileUpload] = useState({});
    const [vmExecuteUpload, setVMExecuteUpload] = useState("");
    const [isCheckedExecuteUpload, setIsCheckedExecuteUpload] = useState(false)
    const [vmIDMount, setVMIDMount] = useState("");
    const [vmENVMount, setVMENVMount] = useState("");
    const [vmCommandMount, setVMCommandMount] = useState("mount");
    const [vmCephPublic, setVMCephPublic] = useState("");
    const [vmCephShared, setVMCephShared] = useState("");
    const [vmCephUser, setVMCephUser] = useState("");
    const [vmCephPublicChecked, setVMCephPublicChecked] = useState(false);
    const [vmCephSharedChecked, setVMCephSharedChecked] = useState(false);
    const [vmCephUserChecked, setVMCephUserChecked] = useState(false);
    const [vmIDConnectionICMP, setVMIDConnectionICMP] = useState("");
    const [vmENVConnectionICMP, setVMENVConnectionICMP] = useState("");
    const [vmIDConnectionSSH, setVMIDConnectionSSH] = useState("");
    const [vmENVConnectionSSH, setVMENVConnectionSSH] = useState("");
    const [vmInstanceList, setVMInstanceList] = useState([]);
    const [vmInstanceListSubmit, setVMInstanceListSubmit] = useState(false);
    const [vmIDInstall, setVMIDInstall] = useState("");
    const [vmCMDInstall, setVMCMDInstall] = useState("");
    const [vmARGSInstall, setVMARGSInstall] = useState("");
    const [vmIDUninstall, setVMIDUninstall] = useState("");
    const [vmCMDUninstall, setVMCMDUninstall] = useState("");
    const [vmARGSUninstall, setVMARGSUninstall] = useState("");
    const [vmIDRoundtrip, setVMIDRoundtrip] = useState("");
    const [vmENVRoundtrip, setVMENVRoundtrip] = useState("");
    const [vmIterationRoundtrip, setVMIterationRoundtrip] = useState("");
    const [vmNameRoundtrip, setVMNameRoundtrip] = useState("");
    const [vmCMDRoundtrip, setVMCMDRoundtrip] = useState("");
    const [vmARGSRoundtrip, setVMARGSRoundtrip] = useState("");
    const [requestAlert, setRequestAlert] = useState(false);
    const [requestAlertMessage, setRequestAlertMessage] = useState(false);
    const { t, i18n } = useTranslation();

    const isNotDesktop = useMediaQuery({
        query: '(max-width: 1200px)'
    })

    const appInstanceVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/inst/vminvoke_app', {
            id: vmIDApp,
            id_env: vmENVApp,
            cmd: vmCMDApp,
            args: vmARGSApp,
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

    const commandInstanceVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/inst/vminvoke_cmd', {
            id: vmIDCommand,
            id_env: vmENVCommand,
            cmd: vmCMDCommand,
            args: vmARGSCommand,
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

    const sshInstanceVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/inst/vminvoke_ssh', {
            id: vmIDSSH,
            id_env: vmENVSSH,
            cmd: vmCMDSSH,
            args: vmARGSSSH,
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

    const actionInstanceVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/inst/vminvoke_action', {
            id: vmIDAction,
            id_env: vmENVAction,
            cmd: vmCMDAction,
            args: vmARGSAction,
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

    const resizeInstanceVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/inst/vminvoke_resolution', {
            id: vmIDResize,
            id_env: vmENVResize,
            cmd: vmCMDResize,
            args: vmARGSResize,
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

    const osPackageInstanceVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/inst/vminvoke_ospackage', {
            id: vmIDOSPackage,
            id_env: vmENVOSPackage,
            cmd: vmCMDOSPackage,
            args: vmARGSOSPackage,
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

    const uploadInstanceVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/inst/vminvoke_upload', {
            id: vmIDUpload,
            id_env: vmENVUpload,
            file: vmFileUpload,
            execute: isCheckedExecuteUpload ? "on" : "", // vmExecuteUpload,
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

    const mountInstanceVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/inst/vminvoke_cephfs', {
            id: vmIDMount,
            id_env: vmENVMount,
            cmd: vmCommandMount,
            ceph_public: vmCephPublicChecked ? "on" : "", // vmCephPublic,
            ceph_shared: vmCephSharedChecked ? "on" : "", // vmCephShared,
            ceph_user: vmCephUserChecked ? "on" : "", // vmCephUser,
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

    const connectionICMPInstanceVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/inst/connection_test_icmp', {
            id: vmIDConnectionICMP,
            id_env: vmENVConnectionICMP,
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

    const connectionSSHInstanceVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/inst/connection_test_ssh', {
            id: vmIDConnectionSSH,
            id_env: vmENVConnectionSSH,
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

    const instanceList = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/inst/list', {}, {
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
                    setVMInstanceList(response.data.response_data);
                    setVMInstanceListSubmit(true);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(false);
                    setVMInstanceList([]);
                    setVMInstanceListSubmit(false);

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
                setVMInstanceList([]);
                setVMInstanceListSubmit(false);

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

    const installInstanceVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/inst/vminvoke_install', {
            id: vmIDInstall,
            cmd: vmCMDInstall,
            args: vmARGSInstall,
        }, {
            headers: {
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

    const uninstallInstanceVirtualEnvironment = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/inst/vminvoke_uninstall', {
            id: vmIDUninstall,
            cmd: vmCMDUninstall,
            args: vmARGSUninstall,
        }, {
            headers: {
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

    const roundtripInstances = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/tests/measure_rtt', {
            id: vmIDRoundtrip,
            id_env: vmENVRoundtrip,
            iter: vmIterationRoundtrip,
            name: vmNameRoundtrip,
            cmd: vmCMDRoundtrip,
            args: vmARGSRoundtrip,
        }, {
            headers: {
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

    const changeVMIDApp = event => {
        setVMIDApp(event.target.value);
    };

    const changeVMENVApp = event => {
        setVMENVApp(event.target.value);
    };

    const changeVMCMDApp = event => {
        setVMCMDApp(event.target.value);
    };

    const changeVMARGSApp = event => {
        setVMARGSApp(event.target.value);
    };

    const changeVMIDCommand = event => {
        setVMIDCommand(event.target.value);
    };

    const changeVMENVCommand = event => {
        setVMENVCommand(event.target.value);
    };

    const changeVMCMDCommand = event => {
        setVMCMDCommand(event.target.value);
    };

    const changeVMARGSCommand = event => {
        setVMARGSCommand(event.target.value);
    };

    const changeVMIDSSH = event => {
        setVMIDSSH(event.target.value);
    };

    const changeVMENVSSH = event => {
        setVMENVSSH(event.target.value);
    };

    const changeVMCMDSSH = event => {
        setVMCMDSSH(event.target.value);
    };

    const changeVMARGSSSH = event => {
        setVMARGSSSH(event.target.value);
    };

    const changeVMIDAction = event => {
        setVMIDAction(event.target.value);
    };

    const changeVMENVAction = event => {
        setVMENVAction(event.target.value);
    };

    const changeVMCMDAction = event => {
        setVMCMDAction(event.target.value);
    };

    const changeVMARGSAction = event => {
        setVMARGSAction(event.target.value);
    };

    const changeVMIDResize = event => {
        setVMIDResize(event.target.value);
    };

    const changeVMENVResize = event => {
        setVMENVResize(event.target.value);
    };

    const changeVMCMDResize = event => {
        setVMCMDResize(event.target.value);
    };

    const changeVMARGSResize = event => {
        setVMARGSResize(event.target.value);
    };

    const changeVMIDOSPackage = event => {
        setVMIDOSPackage(event.target.value);
    };

    const changeVMENVOSPackage = event => {
        setVMENVOSPackage(event.target.value);
    };

    const changeVMCMDOSPackage = event => {
        setVMCMDOSPackage(event.target.value);
    };

    const changeVMARGSOSPackage = event => {
        setVMARGSOSPackage(event.target.value);
    };

    const changeVMIDUpload = event => {
        setVMIDUpload(event.target.value);
    };

    const changeVMENVUpload = event => {
        setVMENVUpload(event.target.value);
    };

    const changeVMFileUpload = event => {
        if (event.target.files) {
            setVMFileUpload(event.target.files[0]);
        }
    };

    const changeVMExecuteUpload = event => {
        setVMExecuteUpload(event.target.value);
    };

    const checkChangeVMExecuteUpload = () => {
        setIsCheckedExecuteUpload(!isCheckedExecuteUpload)

        if (isCheckedExecuteUpload) {
            setVMExecuteUpload("on");
        } else {
            setVMExecuteUpload("");
        }
    }

    const changeVMIDMount = event => {
        setVMIDMount(event.target.value);
    };

    const changeVMENVMount = event => {
        setVMENVMount(event.target.value);
    };

    const changeVMCommandMount = event => {
        setVMCommandMount(event.target.value);
    };

    const changeVMCephPublic = event => {
        setVMCephPublic(event.target.value);
    };

    const checkChangeVMCephPublic = () => {
        setVMCephPublicChecked(!vmCephPublicChecked)

        if (vmCephPublicChecked) {
            setVMCephPublic("on");
        } else {
            setVMCephPublic("");
        }
    }

    const changeVMCephShared = event => {
        setVMCephShared(event.target.value);
    };

    const checkChangeVMCephShared = () => {
        setVMCephSharedChecked(!vmCephSharedChecked)

        if (vmCephSharedChecked) {
            setVMCephShared("on");
        } else {
            setVMCephShared("");
        }
    }

    const changeVMCephUser = event => {
        setVMCephUser(event.target.value);
    };

    const checkChangeVMCephUser = () => {
        setVMCephUserChecked(!vmCephUserChecked)

        if (vmCephUserChecked) {
            setVMCephUser("on");
        } else {
            setVMCephUser("");
        }
    }

    const changeVMIDConnectionICMP = event => {
        setVMIDConnectionICMP(event.target.value);
    };

    const changeVMENVConnectionICMP = event => {
        setVMENVConnectionICMP(event.target.value);
    };

    const changeVMIDConnectionSSH = event => {
        setVMIDConnectionSSH(event.target.value);
    };

    const changeVMENVConnectionSSH = event => {
        setVMENVConnectionSSH(event.target.value);
    };

    /*
    const changeVMIDInstall = event => {
        setVMIDInstall(event.target.value);
    };

    const changeVMCMDInstall = event => {
        setVMCMDInstall(event.target.value);
    };

    const changeVMARGSInstall = event => {
        setVMARGSInstall(event.target.value);
    };

    const changeVMIDUninstall = event => {
        setVMIDUninstall(event.target.value);
    };

    const changeVMCMDUninstall = event => {
        setVMCMDUninstall(event.target.value);
    };

    const changeVMARGSUninstall = event => {
        setVMARGSUninstall(event.target.value);
    };
    */

    const changeVMIDInstall = event => {
        setVMIDInstall(event.target.value);
    };

    const changeVMIDRoundtrip = event => {
        setVMIDRoundtrip(event.target.value);
    };

    const changeVMENVRoundtrip = event => {
        setVMENVRoundtrip(event.target.value);
    };

    const changeVMIterationRoundtrip = event => {
        setVMIterationRoundtrip(event.target.value);
    };

    const changeVMNameRoundtrip = event => {
        setVMNameRoundtrip(event.target.value);
    };

    const changeVMCMDRoundtrip = event => {
        setVMCMDRoundtrip(event.target.value);
    };

    const changeVMARGSRoundtrip = event => {
        setVMARGSRoundtrip(event.target.value);
    };

    const backToDashboard = () => {
        window.location.href = "/dashboard/admin";
    };

    const appInstanceSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        id_env: Yup.string()
            .required('Environment invalid'),
        cmd: Yup.string()
            .required('Command invalid'),
        args: Yup.string()
            //.required('Arguments invalid'),
    });

    const commandInstanceSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        id_env: Yup.string()
            .required('Environment invalid'),
        cmd: Yup.string()
            .required('Command invalid'),
        args: Yup.string()
            //.required('Arguments invalid'),
    });

    const sshInstanceSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        id_env: Yup.string()
            .required('Environment invalid'),
        cmd: Yup.string()
            .required('Command invalid'),
        args: Yup.string()
            //.required('Arguments invalid'),
    });

    const actionInstanceSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        id_env: Yup.string()
            .required('Environment invalid'),
        cmd: Yup.string()
            .required('Command invalid'),
        args: Yup.string()
            //.required('Arguments invalid'),
    });

    const resizeInstanceSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        id_env: Yup.string()
            .required('Environment invalid'),
        cmd: Yup.string()
            .required('Command invalid'),
        args: Yup.string()
            //.required('Arguments invalid'),
    });

    const osPackageInstanceSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        id_env: Yup.string()
            .required('Environment invalid'),
        cmd: Yup.string()
            .required('Command invalid'),
        args: Yup.string()
            //.required('Arguments invalid'),
    });
    
    const uploadInstanceSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        id_env: Yup.string()
            .required('Environment invalid'),
        file: Yup.string()
            .required('file invalid'),
        execute: Yup.string()
            .required('Execute invalid'),
    });

    const mountInstanceSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        id_env: Yup.string()
            .required('Environment invalid'),
        ceph_public: Yup.string()
            .required('Ceph public invalid'),
        ceph_shared: Yup.string()
            .required('Ceph shared invalid'),
        ceph_user: Yup.string()
            .required('Ceph user invalid'),
    });

    const connectionICMPInstanceSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        id_env: Yup.string()
            .required('Environment invalid'),
    });

    const connectionSSHInstanceSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        id_env: Yup.string()
            .required('Environment invalid'),
    });

    const instanceListSchema = Yup.object().shape({});

    /*
    const installInstanceSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        cmd: Yup.string()
            .required('Command invalid'),
        args: Yup.string()
            .required('Arguments invalid'),
    });

    const uninstallInstanceSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        cmd: Yup.string()
            .required('Command invalid'),
        args: Yup.string()
            .required('Arguments invalid'),
    });
    */

    const roundtripInstanceSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        id_env: Yup.string()
            .required('Environment invalid'),
        iter: Yup.string()
            .required('Iteration invalid'),
        name: Yup.string()
            .required('Name invalid'),
        cmd: Yup.string()
            .required('Command invalid'),
        args: Yup.string()
            .required('Arguments invalid'),
    });

    return (
        <>
            <Header/>
            <ReactBootstrap.Container id="settingsOverviewInstanceVirtualEnvironment" fluid={true}>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                        <div>
                            <h2>
                                {t('vm-instance')}
                            </h2>
                        </div>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Tabs defaultActiveKey="instance-app" id="all-config-instance">
                    <ReactBootstrap.Tab eventKey="instance-app" title={t('vm-instance-app')}>
                        <Formik
                            initialValues={{
                                id: "",
                                id_env: "",
                                cmd: "",
                                args: "",
                            }}
                            validationSchema={appInstanceSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={appInstanceVirtualEnvironment} id="form-instance-app">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-app">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-app" name="vm-id-app" value={vmIDApp} onChange={changeVMIDApp}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-app')}
                                            {/*<ErrorMessage name="vm-id-app">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-env-app">{t('vm-env')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-env-app" name="vm-env-app" value={vmENVApp} onChange={changeVMENVApp}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-env-app')}
                                            {/*<ErrorMessage name="vm-env-app">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-cmd-app">{t('vm-instance-command')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-cmd-app" name="vm-cmd-app" value={vmCMDApp} onChange={changeVMCMDApp}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-cmd-app')}
                                            {/*<ErrorMessage name="vm-cmd-app">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-args-app">{t('vm-instance-arguments')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-args-app" name="vm-args-app" value={vmARGSApp} onChange={changeVMARGSApp}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-args-app')}
                                            {/*<ErrorMessage name="vm-args-app">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDApp.length > 0 && vmCMDApp.length > 0 ? false : true}>
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
                                id: "",
                                id_env: "",
                                cmd: "",
                                args: "",
                            }}
                            validationSchema={commandInstanceSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={commandInstanceVirtualEnvironment} id="form-instance-command">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-command">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-command" name="vm-id-command" value={vmIDCommand} onChange={changeVMIDCommand}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-command')}
                                            {/*<ErrorMessage name="vm-id-command">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-env-command">{t('vm-env')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-env-command" name="vm-env-command" value={vmENVCommand} onChange={changeVMENVCommand}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-env-command')}
                                            {/*<ErrorMessage name="vm-env-command">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-cmd-command">{t('vm-instance-command')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-cmd-command" name="vm-cmd-command" value={vmCMDCommand} onChange={changeVMCMDCommand}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-cmd-command')}
                                            {/*<ErrorMessage name="vm-cmd-command">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-args-command">{t('vm-instance-arguments')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-args-command" name="vm-args-command" value={vmARGSCommand} onChange={changeVMARGSCommand}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-args-command')}
                                            {/*<ErrorMessage name="vm-args-command">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDCommand.length > 0 && vmCMDCommand.length > 0 ? false : true}>
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
                                id: "",
                                id_env: "",
                                cmd: "",
                                args: "",
                            }}
                            validationSchema={sshInstanceSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={sshInstanceVirtualEnvironment} id="form-instance-ssh">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-ssh">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-ssh" name="vm-id-ssh" value={vmIDSSH} onChange={changeVMIDSSH}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-ssh')}
                                            {/*<ErrorMessage name="vm-id-ssh">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-env-ssh">{t('vm-env')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-env-ssh" name="vm-env-ssh" value={vmENVSSH} onChange={changeVMENVSSH}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-env-ssh')}
                                            {/*<ErrorMessage name="vm-env-ssh">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-cmd-ssh">{t('vm-instance-command')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-cmd-ssh" name="vm-cmd-ssh" value={vmCMDSSH} onChange={changeVMCMDSSH}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-cmd-ssh')}
                                            {/*<ErrorMessage name="vm-cmd-ssh">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-args-ssh">{t('vm-instance-arguments')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-args-ssh" name="vm-args-ssh" value={vmARGSSSH} onChange={changeVMARGSSSH}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-args-ssh')}
                                            {/*<ErrorMessage name="vm-args-ssh">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDSSH.length > 0 && vmCMDSSH.length > 0 ? false : true}>
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
                                id: "",
                                id_env: "",
                                cmd: "",
                                args: "",
                            }}
                            validationSchema={actionInstanceSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={actionInstanceVirtualEnvironment} id="form-instance-action">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-status">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-status" name="vm-id-status" value={vmIDAction} onChange={changeVMIDAction}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-status')}
                                            {/*<ErrorMessage name="vm-id-status">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-env-action">{t('vm-env')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-env-action" name="vm-env-ssh" value={vmENVAction} onChange={changeVMENVAction}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-env-action')}
                                            {/*<ErrorMessage name="vm-env-action">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-cmd-status">{t('vm-instance-command')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-cmd-status" name="vm-cmd-status" value={vmCMDAction} onChange={changeVMCMDAction}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-cmd-status')}
                                            {/*<ErrorMessage name="vm-cmd-status">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-args-status">{t('vm-instance-arguments')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-args-status" name="vm-args-status" value={vmARGSAction} onChange={changeVMARGSAction}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-args-status')}
                                            {/*<ErrorMessage name="vm-args-status">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDAction.length > 0 && vmCMDAction.length > 0 ? false : true}>
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
                                id: "",
                                id_env: "",
                                cmd: "",
                                args: "",
                            }}
                            validationSchema={resizeInstanceSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={resizeInstanceVirtualEnvironment} id="form-instance-resize">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-resize">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-resize" name="vm-id-resize" value={vmIDResize} onChange={changeVMIDResize}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-resize')}
                                            {/*<ErrorMessage name="vm-id-resize">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-env-resize">{t('vm-env')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-env-resize" name="vm-env-resize" value={vmENVResize} onChange={changeVMENVResize}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-env-resize')}
                                            {/*<ErrorMessage name="vm-env-resize">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-cmd-resize">{t('vm-instance-command')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-cmd-resize" name="vm-cmd-resize" value={vmCMDResize} onChange={changeVMCMDResize}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-cmd-resize')}
                                            {/*<ErrorMessage name="vm-cmd-resize">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-args-resize">{t('vm-instance-arguments')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-args-resize" name="vm-args-resize" value={vmARGSResize} onChange={changeVMARGSResize}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-args-resize')}
                                            {/*<ErrorMessage name="vm-args-resize">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDResize.length > 0 && vmCMDResize.length > 0 ? false : true}>
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
                                id: "",
                                id_env: "",
                                cmd: "",
                                args: "",
                            }}
                            validationSchema={osPackageInstanceSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={osPackageInstanceVirtualEnvironment} id="form-instance-resize">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-os-package">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-os-package" name="vm-id-os-package" value={vmIDOSPackage} onChange={changeVMIDOSPackage}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-os-package')}
                                            {/*<ErrorMessage name="vm-id-os-package">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-env-os-package">{t('vm-env')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-env-os-package" name="vm-env-os-package" value={vmENVOSPackage} onChange={changeVMENVOSPackage}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-env-os-package')}
                                            {/*<ErrorMessage name="vm-env-os-package">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-cmd-os-package">{t('vm-instance-command')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-cmd-os-package" name="vm-cmd-os-package" value={vmCMDOSPackage} onChange={changeVMCMDOSPackage}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-cmd-os-package')}
                                            {/*<ErrorMessage name="vm-cmd-os-package">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-args-os-package">{t('vm-instance-arguments')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-args-os-package" name="vm-args-os-package" value={vmARGSOSPackage} onChange={changeVMARGSOSPackage}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-args-os-package')}
                                            {/*<ErrorMessage name="vm-args-os-package">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDOSPackage.length > 0 && vmCMDOSPackage.length > 0 ? false : true}>
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
                                id: "",
                                id_env: "",
                                file: "",
                                execute: "",
                            }}
                            validationSchema={uploadInstanceSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={uploadInstanceVirtualEnvironment} id="form-instance-upload">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-upload">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-upload" name="vm-id-upload" value={vmIDUpload} onChange={changeVMIDUpload}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-upload')}
                                            {/*<ErrorMessage name="vm-id-upload">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-env-upload">{t('vm-env')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-env-upload" name="vm-env-upload" value={vmENVUpload} onChange={changeVMENVUpload}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-env-upload')}
                                            {/*<ErrorMessage name="vm-env-upload">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-file-upload">{t('vm-file')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            {/*<Field type="text" id="vm-file-upload" name="vm-file-upload" value={vmFileUpload} onChange={changeVMFileUpload}/>*/}
                                            <input id="vm-file-upload" name="vm-file-upload" type="file" onChange={changeVMFileUpload} />
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-file-upload')}
                                            {/*<ErrorMessage name="vm-file-upload">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-execute-upload">{t('vm-execute')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <input
                                                type="checkbox"
                                                id="vm-execute-upload"
                                                name="vm-execute-upload"
                                                value={vmExecuteUpload}
                                                checked={isCheckedExecuteUpload}
                                                onChange={checkChangeVMExecuteUpload}
                                            />
                                            {/*<Field type="text" id="vm-execute-upload" name="vm-execute-upload" value={vmExecuteUpload} onChange={changeVMExecuteUpload}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-execute-upload')}
                                            {/*<ErrorMessage name="vm-execute-upload">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDUpload.length > 0 ? false : true}>
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
                                id: "",
                                id_env: "",
                                ceph_public: "",
                                ceph_shared: "",
                                ceph_user: "",
                            }}
                            validationSchema={mountInstanceSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={mountInstanceVirtualEnvironment} id="form-instance-mount">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-mount">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-mount" name="vm-id-mount" value={vmIDMount} onChange={changeVMIDMount}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-mount')}
                                            {/*<ErrorMessage name="vm-id-mount">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-env-mount">{t('vm-env')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-env-mount" name="vm-env-mount" value={vmENVMount} onChange={changeVMENVMount}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-env-mount')}
                                            {/*<ErrorMessage name="vm-env-mount">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-command-mount">{t('vm-command')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <select id="vm-command-mount" name="vm-command-mount" value={vmCommandMount} onChange={changeVMCommandMount}>
                                                <option value="mount">{t('mount')}</option>
                                                <option value="unmount">{t('unmount')}</option>
                                            </select>
                                            {/*<Field type="text" id="vm-command-mount" name="vm-command-mount" value={vmCommandMount} onChange={changeVMCommandMount}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-command-mount')}
                                            {/*<ErrorMessage name="vm-command-mount">
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
                                                value={vmCephPublic}
                                                checked={vmCephPublicChecked}
                                                onChange={checkChangeVMCephPublic}
                                            />
                                            {/*<Field type="text" id="vm-ceph-public" name="vm-ceph-public" value={vmCephPublic} onChange={changeVMCephPublic}/>*/}
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
                                                value={vmCephShared}
                                                checked={vmCephSharedChecked}
                                                onChange={checkChangeVMCephShared}
                                            />
                                            {/*<Field type="text" id="vm-ceph-shared" name="vm-ceph-shared" value={vmCephShared} onChange={changeVMCephShared}/>*/}
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
                                                value={vmCephUser}
                                                checked={vmCephUserChecked}
                                                onChange={checkChangeVMCephUser}
                                            />
                                            {/*<Field type="text" id="vm-ceph-user" name="vm-ceph-user" value={vmCephUser} onChange={changeVMCephUser}/>*/}
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-ceph-user')}
                                            {/*<ErrorMessage name="vm-ceph-user">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDMount.length > 0 && vmCommandMount.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="instance-list" title={t('vm-instance-list')}>
                        <Formik
                            initialValues={{}}
                            validationSchema={instanceListSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={instanceList} id="form-instance-list">
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
                            vmInstanceListSubmit ? (
                                <ReactBootstrap.Row id="form-instance-list">
                                    {
                                        vmInstanceList.length > 0
                                            ? (
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
                                                                {data.viewer_url === "" ? "-" : data.viewer_url}
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
                    <ReactBootstrap.Tab eventKey="instance-connection-icmp" title={t('vm-instance-connection-icmp')}>
                        <Formik
                            initialValues={{
                                id: "",
                                id_env: "",
                            }}
                            validationSchema={connectionICMPInstanceSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={connectionICMPInstanceVirtualEnvironment} id="form-instance-connection-icmp">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-connection-icmp">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-connection-icmp" name="vm-id-connection-icmp" value={vmIDConnectionICMP} onChange={changeVMIDConnectionICMP}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-connection-icmp')}
                                            {/*<ErrorMessage name="vm-id-connection-icmp">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-env-connection-icmp">{t('vm-env')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-env-connection-icmp" name="vm-env-connection-icmp" value={vmENVConnectionICMP} onChange={changeVMENVConnectionICMP}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-env-connection-icmp')}
                                            {/*<ErrorMessage name="vm-env-connection-icmp">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDConnectionICMP.length > 0 ? false : true}>
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
                                id: "",
                                id_env: "",
                            }}
                            validationSchema={connectionSSHInstanceSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={connectionSSHInstanceVirtualEnvironment} id="form-instance-connection-ssh">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-connection-ssh">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-connection-ssh" name="vm-id-connection-ssh" value={vmIDConnectionSSH} onChange={changeVMIDConnectionSSH}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-connection-ssh')}
                                            {/*<ErrorMessage name="vm-id-connection-ssh">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-env-connection-ssh">{t('vm-env')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-env-connection-ssh" name="vm-env-connection-ssh" value={vmENVConnectionSSH} onChange={changeVMENVConnectionSSH}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-env-connection-ssh')}
                                            {/*<ErrorMessage name="vm-env-connection-ssh">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDConnectionSSH.length > 0 ? false : true}>
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
                                id: "",
                                id_env: "",
                                iter: "",
                                name: "",
                                cmd: "",
                                args: "",
                            }}
                            validationSchema={roundtripInstanceSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={roundtripInstances} id="form-instance-roundtrip">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-id-roundtrip">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-id-roundtrip" name="vm-id-roundtrip" value={vmIDRoundtrip} onChange={changeVMIDRoundtrip}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-id-roundtrip')}
                                            {/*<ErrorMessage name="vm-id-roundtrip">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-env-roundtrip">{t('vm-env')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-env-roundtrip" name="vm-env-roundtrip" value={vmENVRoundtrip} onChange={changeVMENVRoundtrip}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-env-roundtrip')}
                                            {/*<ErrorMessage name="vm-env-roundtrip">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-iteration-roundtrip">{t('vm-iteration')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-iteration-roundtrip" name="vm-iteration-roundtrip" value={vmIterationRoundtrip} onChange={changeVMIterationRoundtrip}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-iteration-roundtrip')}
                                            {/*<ErrorMessage name="vm-iteration-roundtrip">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-name-roundtrip">{t('vm-name')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-name-roundtrip" name="vm-name-roundtrip" value={vmNameRoundtrip} onChange={changeVMNameRoundtrip}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-name-roundtrip')}
                                            {/*<ErrorMessage name="vm-name-roundtrip">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-command-roundtrip">{t('vm-command')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-command-roundtrip" name="vm-command-roundtrip" value={vmCMDRoundtrip} onChange={changeVMCMDRoundtrip}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-command-roundtrip')}
                                            {/*<ErrorMessage name="vm-command-roundtrip">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-arguments-roundtrip">{t('vm-arguments')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-arguments-roundtrip" name="vm-arguments-roundtrip" value={vmARGSRoundtrip} onChange={changeVMARGSRoundtrip}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-arguments-roundtrip')}
                                            {/*<ErrorMessage name="vm-arguments-roundtrip">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmIDRoundtrip.length > 0 ? false : true}>
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

export default SettingsInstances;
