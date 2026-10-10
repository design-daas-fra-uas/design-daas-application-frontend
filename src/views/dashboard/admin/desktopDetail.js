import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Header from '../../../components/header';

import { getDesktop } from '../../../api/desktops';

function DesktopDetail() {
    const [allDesktopDetails, setAllDesktopDetails] = useState(null);
    const [loadStatus, setLoadStatus] = useState('loading');
    const params = useParams(); // Example: {params.id}
    const { t } = useTranslation();

    const fetchDesktopDetail = useCallback(() => {
        let isCurrent = true;
        setAllDesktopDetails(null);
        setLoadStatus('loading');

        getDesktop(params.id)
            .then((desktop) => {
                if (!isCurrent) {
                    return;
                }
                setAllDesktopDetails(desktop || null);
                setLoadStatus(desktop ? 'loaded' : 'not-found');
            })
            .catch((e) => {
                console.log(e);
                if (isCurrent) {
                    setLoadStatus(e?.response?.status === 404 ? 'not-found' : 'error');
                }
            });

        return () => {
            isCurrent = false;
        };
    }, [params.id]);

    useEffect(() => fetchDesktopDetail(), [fetchDesktopDetail]);

    return (
        <>
            <Header />
            <ReactBootstrap.Container id="desktop-details">
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                        <div>
                            <h2>
                                {t('desktop-details')}
                            </h2>
                        </div>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        {loadStatus === 'loading' && <p>{t('loading', 'Loading...')}</p>}
                        {loadStatus === 'not-found' && <p role="alert">{t('desktop-not-found', 'Desktop not found.')}</p>}
                        {loadStatus === 'error' && <p role="alert">{t('load-error', 'Could not load the data. Please try again.')}</p>}
                        {loadStatus === 'loaded' && allDesktopDetails && (
                            <div>
                                <ul>
                                    <li>
                                        <span>
                                            {allDesktopDetails.id}.) {allDesktopDetails.description}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={4} xl={4}>
                        <div>
                            <Link to="/dashboard/admin/settings/desktops" className="link-daas-design">
                                {/*<i className="fa-solid fa-arrow-left"></i>*/}
                                <div>
                                    {t('back-link')}
                                </div>
                            </Link>
                        </div>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
            </ReactBootstrap.Container>
        </>
    );
}

export default DesktopDetail;
