import { useMemo, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import useRequestAlert from '../../../hooks/useRequestAlert';
import { ROUTES } from '../../../routes';
import { configSteps } from './setup/configSteps';
import { ConfigSteps, SetupLayout, SetupSection } from './setup/SetupLayout';
import { delay, readBaseImage } from './setup/storedObject';

// Expert mode: configure the selected base image (it already exists) and finalize it.
function ObjectBaseImageSetup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { requestAlert, showRequestAlert } = useRequestAlert();
  const [{ objectId }] = useState(readBaseImage);

  const steps = useMemo(() => configSteps({ objectId, env: '' }), [objectId]);
  const finalize = useMemo(
    () => ({
      key: 'baseimage-finalize',
      endpoint: '/phases/baseimage_finalize',
      body: () => ({ id: objectId }),
      submitLabel: 'button-baseimage-finalize',
      onSuccess: async () => {
        await delay(3000);
        localStorage.setItem('expert-mode-baseimage', 'true');
        navigate(ROUTES.user.expertEnvironment);
      },
    }),
    [objectId, navigate],
  );

  return (
    <SetupLayout id="objectBaseImageSetup" requestAlert={requestAlert} backTo={ROUTES.dashboard}>
      <Row>
        <Col xs={12} className="text-left">
          <h3>{t('title-baseimage-create')}</h3>
        </Col>
        <Col xs={12} className="text-left">
          {t('object-available')}
        </Col>
        <Col xs={12}>
          <Button variant="primary" disabled>
            {t('button-baseimage-create')}
          </Button>
        </Col>
      </Row>
      <ConfigSteps title="title-baseimage-settings" steps={steps} showRequestAlert={showRequestAlert} />
      <SetupSection
        title="title-baseimage-finalize"
        info="button-baseimage-finalize-info-text"
        action={finalize}
        showRequestAlert={showRequestAlert}
      />
    </SetupLayout>
  );
}

export default ObjectBaseImageSetup;
