import React from 'react';
import { useParams } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import AsyncContent from '../../../components/AsyncContent';
import BackLink from '../../../components/BackLink';
import PageLayout from '../../../components/PageLayout';
import useResource from '../../../hooks/useResource';
import { ROUTES } from '../../../routes';

import { getDesktop } from '../../../api/desktops';

function DesktopDetail() {
    const { id } = useParams();
    const { t } = useTranslation();
    const { data: desktop, status, reload } = useResource(() => getDesktop(id), [id]);

    return (
        <PageLayout id="desktop-details" title={t('desktop-details')} wrapTitle>
            <Row>
                <Col xs={12}>
                    <AsyncContent status={status} onRetry={reload} notFoundText={t('desktop-not-found', 'Desktop not found.')}>
                        {() => (
                            <p>
                                {desktop.id}.) {desktop.description}
                            </p>
                        )}
                    </AsyncContent>
                </Col>
            </Row>
            <Row>
                <BackLink to={ROUTES.admin.desktops} />
            </Row>
        </PageLayout>
    );
}

export default DesktopDetail;