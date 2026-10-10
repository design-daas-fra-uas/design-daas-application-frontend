import React, {useEffect, useState} from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import axios from "axios";
import {useMediaQuery} from "react-responsive";

import {DEVELOPMENT, TEST, LIVE, USERNAME, PASSWORD, URL_SYSTEM} from "../constants/constants";

import Logo from './../assets/images/png/DESIGNLogoColouredWhiteFont.png';
import {ROUTES} from "../routes";
import {changeLanguage} from "../i18n";

function Header() {
    const [sharedData, setSharedData] = useState([]);
    const [ownApplication, setOwnApplication] = useState([]);
    const [instanceStopData, setInstanceStopData] = useState([]);
    const [connectionDataNew, setConnectionDataNew] = useState([]);
    const [connectionDataNewer, setConnectionDataNewer] = useState([]);
    const [ownFiles, setOwnFiles] = useState([]);
    const [sharedFiles, setSharedFiles] = useState([]);
    const [searchFilterData, setSearchFilterData] = useState([]);
    const [dataList, setDataList] = useState([]);
    const [dashboardInfo, setDashboardInfo] = useState({});
    const {t} = useTranslation();

    let userToken = localStorage.getItem("userToken");

    const isSmall = useMediaQuery({
        query: '(max-width: 767px)'
    })

    const dashInfo = localStorage.getItem("dashboard-info")

    useEffect(() => {
        if (userToken !== "" || userToken !== undefined) {
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

                    let newArrayApps = [];

                    arrayApplications.map(data => {
                        newArrayApps.push(data)
                    })

                    setSearchFilterData(newArrayApps)
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
        }
    }, []);

    const changeLanguageGerman = () => changeLanguage('de');

    const changeLanguageEnglish = () => changeLanguage('en');

    const logoutValidation = () => {
        localStorage.removeItem("role");
        localStorage.removeItem("language");
        localStorage.removeItem("userData");
        localStorage.removeItem("userDataID");
        localStorage.removeItem("objectSharedApp");
        localStorage.removeItem("objectUserID");
        localStorage.removeItem("application");
        localStorage.removeItem("app-data");
        localStorage.removeItem("app-data-option");
        localStorage.removeItem("instance-object-id");
        localStorage.removeItem("instance-env");
        localStorage.removeItem("env-object-id")
        localStorage.removeItem("env-name")
        localStorage.removeItem("connection-object-id")
        localStorage.removeItem("connection-env")
        localStorage.removeItem("connection-shared-object-id")
        localStorage.removeItem("connection-shared-env")
        localStorage.removeItem("object-id")
        localStorage.removeItem("object-env-name")
        localStorage.removeItem("object-state")
        localStorage.removeItem("messageError");
        localStorage.removeItem("userDataName");
        localStorage.removeItem("userToken");
        localStorage.removeItem("userTimeToken");
        localStorage.removeItem("userRefreshToken");
        localStorage.removeItem("user-group-id");
        localStorage.removeItem("desktop-group-id");
        localStorage.removeItem("selected-environment-id")
        localStorage.removeItem("selected-environment-name")
        localStorage.removeItem("selected-instance-id")
        localStorage.removeItem("selected-instance-env-name")
        localStorage.removeItem("selected-environment-envname")
        localStorage.removeItem("selected-connection-index")
        localStorage.removeItem("selected-object-id")
        localStorage.removeItem("selected-object-env-name")
        localStorage.removeItem("selected-object-state")
        localStorage.removeItem("expert-mode-baseimage")
        localStorage.removeItem("expert-mode-environment")
        localStorage.removeItem("expert-mode-environment-id")
        localStorage.removeItem("expert-mode-environment-env")
        localStorage.removeItem("timeUser")
        localStorage.removeItem("object-id-instance")
        localStorage.removeItem("application-viewer-id")
        localStorage.removeItem("environment-viewer-id")
        localStorage.removeItem("object-viewer-id")
        localStorage.removeItem("dashboard-info")
        localStorage.removeItem("environment-type-mode")
        localStorage.removeItem("object-id-instance");

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
            window.location.href = ROUTES.login;
        }, 2000);
    };

    const connectStart = (data) => {
        console.log(data)

        localStorage.setItem("connection-object-id", JSON.parse(data).id_inst)
        localStorage.setItem("connection-env", JSON.parse(data).viewer_url)

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

                let newArrayApps = [];

                arrayApplications.map(data => {
                    newArrayApps.push(data)
                })

                setSearchFilterData(newArrayApps)
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
            window.location.href = ROUTES.user.connectionRun;
        }, 2000)
    }

    return (
        <>
            <ReactBootstrap.Navbar expand="lg" fixed="top" variant="dark">
                <ReactBootstrap.Container fluid={true} className={isSmall ? 'header-small' : ''}>
                    <ReactBootstrap.Navbar.Brand>
                        <img src={Logo} alt="Logo"/>
                    </ReactBootstrap.Navbar.Brand>
                    <ReactBootstrap.Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <ReactBootstrap.Navbar.Collapse id="basic-navbar-nav">
                        <ReactBootstrap.Nav className="justify-content-end" style={{width: "100%"}}>
                            {
                                userToken ? (
                                    <>
                                        <ReactBootstrap.Nav.Link href={ROUTES.dashboard}>
                                            {t('home')}
                                        </ReactBootstrap.Nav.Link>
                                        <ReactBootstrap.NavDropdown title={t('available_connections')}
                                                                    id="basic-nav-dropdown">
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
                                    </>
                                ) : (
                                    <></>
                                )
                            }
                            <ReactBootstrap.NavDropdown title={t('language')} id="basic-nav-dropdown-additional">
                                <ReactBootstrap.NavDropdown.Item href="#" onClick={changeLanguageEnglish}>
                                    EN
                                </ReactBootstrap.NavDropdown.Item>
                                <ReactBootstrap.NavDropdown.Item href="#" onClick={changeLanguageGerman}>
                                    DE
                                </ReactBootstrap.NavDropdown.Item>
                            </ReactBootstrap.NavDropdown>
                            {
                                userToken ? (
                                    <ReactBootstrap.Nav.Link href="#" onClick={logoutValidation}>
                                        {t('logout')}
                                    </ReactBootstrap.Nav.Link>
                                ) : (
                                    <></>
                                )
                            }
                        </ReactBootstrap.Nav>
                    </ReactBootstrap.Navbar.Collapse>
                </ReactBootstrap.Container>
            </ReactBootstrap.Navbar>
        </>
    )
}

export default Header;
