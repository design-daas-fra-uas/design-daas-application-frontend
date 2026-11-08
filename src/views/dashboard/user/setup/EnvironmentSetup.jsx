import { useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import { file } from '../../../../components/actions/fields';
import useRequestAlert from '../../../../hooks/useRequestAlert';
import { ROUTES } from '../../../../routes';
import { configSteps } from './configSteps';
import { ConfigSteps, SetupLayout, SetupSection } from './SetupLayout';
import { delay, readEditedEnvironment, readNewEnvironment } from './storedObject';

// Expert mode: create (or edit) an environment of an object, configure it and
// finalize it. When creating, the later steps unlock once the environment exists.
function EnvironmentSetup({ edit = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { requestAlert, showRequestAlert } = useRequestAlert();
  const [stored] = useState(edit ? readEditedEnvironment : readNewEnvironment);
  const [env, setEnv] = useState(stored.env);
  const [created, setCreated] = useState(edit);
  const { objectId } = stored;

  const steps = useMemo(
    () => configSteps({ objectId, env, saved: stored.saved, targetName: stored.targetName }),
    [objectId, env, stored],
  );

  const actions = useMemo(() => {
    const openStartPage = (type) => {
      localStorage.setItem('expert-mode-environment', 'true');
      localStorage.setItem('expert-mode-environment-type', type);
      navigate(ROUTES.user.expertStartSystem);
    };
    const target = () => ({ id: objectId, name: env });
    return {
      create: {
        key: 'environment-create',
        endpoint: '/phases/environment_create',
        fields: [file('dockerfile', 'vm-dockerfile')],
        body: ({ dockerfile }) => ({ ...target(), dockerfile: dockerfile ?? '' }),
        submitLabel: 'button-environment-create',
        onSuccess: () => setCreated(true),
      },
      finalize: {
        key: 'environment-finalize',
        endpoint: '/phases/environment_finalize',
        body: target,
        submitLabel: 'button-environment-finalize',
        onSuccess: async () => {
          await delay(2000);
          openStartPage('start');
        },
      },
      finalizeAndRun: {
        key: 'environment-finalize-run',
        endpoint: '/phases/environment_finalize',
        body: target,
        submitLabel: 'button-environment-finalize-start',
        onSuccess: async () => {
          localStorage.setItem('expert-mode-environment-id', objectId);
          localStorage.setItem('expert-mode-environment-env', env);
          await delay(3000);
          openStartPage('run');
        },
      },
    };
  }, [objectId, env, navigate]);

  const locked = !created || !env.trim();

  return (
    <SetupLayout id="objectEnvironmentSetup" requestAlert={requestAlert} backTo={ROUTES.user.expertBaseImage}>
      <Row>
        <Col xs={12} className="text-left">
          <h3>{t('title-environment-create')}</h3>
        </Col>
        <Col xs={12} md={6}>
          <label htmlFor="environment-object-id">{t('vm-id')}</label>
        </Col>
        <Col xs={12} md={6}>
          <input type="text" id="environment-object-id" value={objectId} disabled />
        </Col>
        <Col xs={12} md={6}>
          <label htmlFor="environment-name">{t('vm-name')}</label>
        </Col>
        <Col xs={12} md={6}>
          <input type="text" id="environment-name" value={env} onChange={(event) => setEnv(event.target.value)} />
        </Col>
      </Row>
      <SetupSection action={actions.create} showRequestAlert={showRequestAlert} disabled={!env.trim()} />
      <ConfigSteps
        title="title-environment-settings"
        steps={steps}
        showRequestAlert={showRequestAlert}
        disabled={locked}
      />
      <SetupSection
        title="title-environment-finalize"
        action={actions.finalize}
        showRequestAlert={showRequestAlert}
        disabled={locked}
      />
      <SetupSection
        info="button-environment-finalize-info-text"
        action={actions.finalizeAndRun}
        showRequestAlert={showRequestAlert}
        disabled={locked}
      />
    </SetupLayout>
  );
}

export default EnvironmentSetup;
