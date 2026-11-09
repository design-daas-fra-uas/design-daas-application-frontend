import { useMemo, useState } from 'react';
import { Alert, Col, Row, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import * as Yup from 'yup';

import ActionLink from '../../../components/ActionLink';
import AsyncContent from '../../../components/AsyncContent';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';
import FormField from '../../../components/FormField';
import FormModal from '../../../components/FormModal';
import PageLayout from '../../../components/PageLayout';
import useResource from '../../../hooks/useResource';
import { ROUTES } from '../../../routes';

import { getUserGroups } from '../../../api/userGroups';
import { getUsers } from '../../../api/users';
import {
  RULE_KINDS,
  createEndpoint,
  createEndpointGroup,
  createPermissionRule,
  deleteEndpoint,
  deleteEndpointGroup,
  deletePermissionRule,
  getEndpointGroups,
  getEndpoints,
  getPermissionRules,
  ruleKindOf,
} from '../../../api/permissions';

const ENDPOINT_INITIAL_VALUES = { functionName: '', description: '' };
const ENDPOINT_GROUP_INITIAL_VALUES = { name: '', description: '', endpointIds: [] };
const RULE_INITIAL_VALUES = { kind: RULE_KINDS[0].kind, subjectId: '', targetId: '', allow: 'true' };

// Everything the page shows, loaded together so names can be looked up.
const loadPermissionData = async ({ signal }) => {
  const [endpoints, endpointGroups, rules, users, userGroups] = await Promise.all([
    getEndpoints({ signal }),
    getEndpointGroups({ signal }),
    getPermissionRules({ signal }),
    getUsers({ signal }),
    getUserGroups({ signal }),
  ]);
  // Only regular users: admins are always allowed, so a rule for them would never be used.
  return { endpoints, endpointGroups, rules, users, userGroups };
};

// Options of the subject and target selects for one rule kind.
const subjectOptions = (data, subject) =>
  subject === 'user'
    ? data.users.map((u) => ({ id: u.id, label: `${u.name} (${u.email})` }))
    : data.userGroups.map((g) => ({ id: g.id, label: g.description || g.name }));

const targetOptions = (data, target) =>
  target === 'endpoint'
    ? data.endpoints.map((e) => ({ id: e.id, label: e.functionName }))
    : data.endpointGroups.map((g) => ({ id: g.id, label: g.name }));

// Subject and target selects follow the selected kind; changing the kind clears them.
function RuleFields({ data }) {
  const { t } = useTranslation();
  const { values, handleChange, setFieldValue } = useFormikContext();
  const { subject, target } = ruleKindOf(values.kind);

  const selectKind = (event) => {
    handleChange(event);
    setFieldValue('subjectId', '');
    setFieldValue('targetId', '');
  };

  return (
    <>
      <FormField name="kind" label={t('rule-kind')} as="select" onChange={selectKind}>
        {RULE_KINDS.map(({ kind }) => (
          <option key={kind} value={kind}>
            {t(`rule-kind-${kind}`)}
          </option>
        ))}
      </FormField>
      <FormField name="subjectId" label={t(subject === 'user' ? 'user' : 'group')} as="select">
        <option value="">{t('please-select', 'Please select')}</option>
        {subjectOptions(data, subject).map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </FormField>
      <FormField name="targetId" label={t(target === 'endpoint' ? 'endpoint' : 'endpoint-group')} as="select">
        <option value="">{t('please-select', 'Please select')}</option>
        {targetOptions(data, target).map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </FormField>
      <FormField name="allow" label={t('rule-decision')} as="select">
        <option value="true">{t('allow')}</option>
        <option value="false">{t('deny')}</option>
      </FormField>
    </>
  );
}

function Permissions() {
  const { t } = useTranslation();
  const { data, status, reload } = useResource(loadPermissionData);
  const [openModal, setOpenModal] = useState(null); // 'endpoint' | 'endpointGroup' | 'rule' | null
  const [pendingDelete, setPendingDelete] = useState(null); // { title, message, action }

  const endpointSchema = useMemo(
    () =>
      Yup.object().shape({
        functionName: Yup.string()
          .trim()
          .required(t('error-function-name', 'Function name is required.'))
          .matches(/^[\w.-]+$/, t('error-function-name-format')),
      }),
    [t],
  );
  const endpointGroupSchema = useMemo(
    () => Yup.object().shape({ name: Yup.string().trim().required(t('error-required', 'This field is required.')) }),
    [t],
  );
  const ruleSchema = useMemo(
    () =>
      Yup.object().shape({
        subjectId: Yup.string().required(t('error-required', 'This field is required.')),
        targetId: Yup.string().required(t('error-required', 'This field is required.')),
      }),
    [t],
  );

  const closeModal = () => setOpenModal(null);
  const reloadSilently = () => reload({ silent: true });

  const subjectName = (rule) => {
    const { subject } = ruleKindOf(rule.kind);
    const match = subjectOptions(data, subject).find((o) => o.id === rule.subjectId);
    return match?.label ?? `#${rule.subjectId}`;
  };
  const endpointNames = (group) =>
    group.endpointIds
      .map((id) => data.endpoints.find((e) => e.id === id)?.functionName)
      .filter(Boolean)
      .join(', ');

  const askDelete = (title, name, action) =>
    setPendingDelete({ title, message: t('delete-confirm', { name }), action });

  return (
    <PageLayout backTo={ROUTES.admin.root} id="permissions" title={t('permissions', 'Permissions')}>
      <Row>
        <Col xs={12}>
          <Alert variant="info">{t('permissions-hint')}</Alert>
        </Col>
      </Row>
      <AsyncContent status={status} onRetry={reload}>
        {() => (
          <>
            <Row>
              <Col xs={12}>
                <h4>{t('endpoints', 'Endpoints')}</h4>
                <ul className="entity-list">
                  {data.endpoints.map((endpoint) => (
                    <li key={endpoint.id}>
                      <span>
                        {endpoint.functionName}
                        {endpoint.description ? ` — ${endpoint.description}` : ''}
                      </span>
                      <span>
                        <button
                          type="button"
                          className="icon-button"
                          aria-label={`${t('delete')} ${endpoint.functionName}`}
                          onClick={() =>
                            askDelete(t('delete-endpoint'), endpoint.functionName, () => deleteEndpoint(endpoint.id))
                          }
                        >
                          <i className="fa-solid fa-trash" aria-hidden="true" />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <h4>{t('endpoint-groups', 'Endpoint groups')}</h4>
                <ul className="entity-list">
                  {data.endpointGroups.map((group) => (
                    <li key={group.id}>
                      <span>
                        {group.name}
                        {group.endpointIds.length > 0 ? ` (${endpointNames(group)})` : ''}
                      </span>
                      <span>
                        <button
                          type="button"
                          className="icon-button"
                          aria-label={`${t('delete')} ${group.name}`}
                          onClick={() =>
                            askDelete(t('delete-endpoint-group'), group.name, () => deleteEndpointGroup(group.id))
                          }
                        >
                          <i className="fa-solid fa-trash" aria-hidden="true" />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <h4>{t('permission-rules', 'Rules')}</h4>
                <Table responsive size="sm">
                  <thead>
                    <tr>
                      <th>{t('rule-kind')}</th>
                      <th>{t('rule-subject')}</th>
                      <th>{t('rule-target')}</th>
                      <th>{t('rule-decision')}</th>
                      <th aria-label={t('delete')} />
                    </tr>
                  </thead>
                  <tbody>
                    {data.rules.map((rule) => (
                      <tr key={`${rule.kind}-${rule.id}`}>
                        <td>{t(`rule-kind-${rule.kind}`)}</td>
                        <td>{subjectName(rule)}</td>
                        <td>{rule.targetName}</td>
                        <td>{rule.allow ? t('allow') : t('deny')}</td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="icon-button"
                            aria-label={`${t('delete')} ${t('rule')}`}
                            onClick={() =>
                              askDelete(t('delete-rule'), `${subjectName(rule)} → ${rule.targetName}`, () =>
                                deletePermissionRule(rule.kind, rule.id),
                              )
                            }
                          >
                            <i className="fa-solid fa-trash" aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>

            <FormModal
              show={openModal === 'rule'}
              onHide={closeModal}
              title={t('create-rule')}
              titleId="create-rule-modal-title"
              initialValues={RULE_INITIAL_VALUES}
              validationSchema={ruleSchema}
              requireDirty={false}
              onSubmit={({ kind, subjectId, targetId, allow }) =>
                createPermissionRule({
                  kind,
                  subjectId: Number(subjectId),
                  targetId: Number(targetId),
                  allow: allow === 'true',
                })
              }
              onSaved={reloadSilently}
            >
              <RuleFields data={data} />
            </FormModal>

            <FormModal
              show={openModal === 'endpointGroup'}
              onHide={closeModal}
              title={t('create-endpoint-group')}
              titleId="create-endpoint-group-modal-title"
              initialValues={ENDPOINT_GROUP_INITIAL_VALUES}
              validationSchema={endpointGroupSchema}
              onSubmit={({ name, description, endpointIds }) =>
                createEndpointGroup({ name: name.trim(), description, endpointIds: endpointIds.map(Number) })
              }
              onSaved={reloadSilently}
            >
              <FormField name="name" label={t('name', 'Name')} htmlFor="endpoint-group-name" />
              <FormField
                name="description"
                label={t('description', 'Description')}
                htmlFor="endpoint-group-description"
              />
              <FormField name="endpointIds" label={t('endpoints')} as="select" multiple className="form-select">
                {data.endpoints.map((endpoint) => (
                  <option key={endpoint.id} value={endpoint.id}>
                    {endpoint.functionName}
                  </option>
                ))}
              </FormField>
            </FormModal>
          </>
        )}
      </AsyncContent>

      <Row>
        <Col xs={12} md={6} lg={4}>
          <ActionLink onClick={() => setOpenModal('endpoint')}>{t('create-endpoint')}</ActionLink>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <ActionLink onClick={() => setOpenModal('endpointGroup')}>{t('create-endpoint-group')}</ActionLink>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <ActionLink onClick={() => setOpenModal('rule')}>{t('create-rule')}</ActionLink>
        </Col>
      </Row>

      <FormModal
        show={openModal === 'endpoint'}
        onHide={closeModal}
        title={t('create-endpoint')}
        titleId="create-endpoint-modal-title"
        initialValues={ENDPOINT_INITIAL_VALUES}
        validationSchema={endpointSchema}
        onSubmit={({ functionName, description }) => createEndpoint({ functionName: functionName.trim(), description })}
        onSaved={reloadSilently}
      >
        <FormField name="functionName" label={t('function-name', 'Function name')} />
        <FormField name="description" label={t('description', 'Description')} htmlFor="endpoint-description" />
      </FormModal>

      <ConfirmDeleteModal
        show={pendingDelete !== null}
        onHide={() => setPendingDelete(null)}
        title={pendingDelete?.title}
        message={pendingDelete?.message}
        onConfirm={() => pendingDelete.action()}
        onDeleted={reloadSilently}
      />
    </PageLayout>
  );
}

export default Permissions;
