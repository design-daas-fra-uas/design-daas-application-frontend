import { useMemo, useState } from 'react';
import { Alert, Button, Form, Tab, Table, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Field, useFormikContext } from 'formik';
import * as Yup from 'yup';

import AsyncContent from '../../../components/AsyncContent';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';
import FormField from '../../../components/FormField';
import FormModal from '../../../components/FormModal';
import PageLayout from '../../../components/PageLayout';
import { SearchSelectField } from '../../../components/SearchSelect';
import useResource from '../../../hooks/useResource';
import { ROUTES } from '../../../routes';

import { getUserGroups } from '../../../api/userGroups';
import { getUsers } from '../../../api/users';
import {
  RULE_KINDS,
  createEndpointGroup,
  createPermissionRule,
  deleteEndpointGroup,
  deletePermissionRule,
  getEndpointGroups,
  getEndpoints,
  getPermissionRules,
  ruleKindOf,
  updateEndpointGroup,
} from '../../../api/permissions';

const RULE_INITIAL_VALUES = { kind: RULE_KINDS[0].kind, subjectId: '', targetId: '', allow: 'true' };
// Endpoints of a group shown in the table before "+N more".
const GROUP_PREVIEW = 4;

const ICONS = { user: 'fa-user', userGroup: 'fa-users', endpoint: 'fa-plug', endpointGroup: 'fa-layer-group' };

// Everything the page shows, loaded together so names can be looked up.
const loadPermissionData = async ({ signal }) => {
  const [endpoints, endpointGroups, rules, users, userGroups] = await Promise.all([
    getEndpoints({ signal }),
    getEndpointGroups({ signal }),
    getPermissionRules({ signal }),
    getUsers({ signal }),
    getUserGroups({ signal }),
  ]);
  const byName = (a, b) => a.functionName.localeCompare(b.functionName);
  return { endpoints: [...endpoints].sort(byName), endpointGroups, rules, users, userGroups };
};

const includesQuery = (query, ...texts) => {
  const needle = query.trim().toLowerCase();
  return !needle || texts.some((text) => text?.toLowerCase().includes(needle));
};

// Options of the subject and target selects for one rule kind (SearchSelect values are strings).
const subjectOptions = (data, subject) =>
  subject === 'user'
    ? data.users.map((u) => ({ value: String(u.id), label: u.name, hint: u.email, icon: ICONS.user }))
    : data.userGroups.map((g) => ({
        value: String(g.id),
        label: g.description || g.name,
        hint: g.description ? g.name : undefined,
        icon: ICONS.userGroup,
      }));

const targetOptions = (data, target) =>
  target === 'endpoint'
    ? data.endpoints.map((e) => ({
        value: String(e.id),
        label: e.functionName,
        hint: e.description,
        icon: ICONS.endpoint,
      }))
    : data.endpointGroups.map((g) => ({
        value: String(g.id),
        label: g.name,
        hint: g.description,
        icon: ICONS.endpointGroup,
      }));

// Search box, "x of y" and the tab's main button.
function Toolbar({ query, onQuery, placeholder, shown, total, action }) {
  const { t } = useTranslation();
  return (
    <div className="section-toolbar">
      <Form.Control
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
        value={query}
        onChange={(event) => onQuery(event.target.value)}
        className="search-input mb-0"
      />
      <span className="text-muted small">{t('permissions-count', { shown, total })}</span>
      {action}
    </div>
  );
}

function IconButton({ icon, label, onClick }) {
  return (
    <button type="button" className="icon-button" aria-label={label} title={label} onClick={onClick}>
      <i className={`fa-solid ${icon}`} aria-hidden="true" />
    </button>
  );
}

function CreateButton({ label, onClick }) {
  return (
    <Button onClick={onClick}>
      <i className="fa-solid fa-plus me-2" aria-hidden="true" />
      {label}
    </Button>
  );
}

function RulesTab({ data, subjectName, onCreate, askDelete }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const visible = data.rules.filter((rule) => includesQuery(query, subjectName(rule), rule.targetName));

  return (
    <>
      <Toolbar
        query={query}
        onQuery={setQuery}
        placeholder={t('search-rules')}
        shown={visible.length}
        total={data.rules.length}
        action={<CreateButton label={t('create-rule')} onClick={onCreate} />}
      />
      {visible.length === 0 ? (
        <p className="empty-state">{data.rules.length ? t('no-matches') : t('no-rules')}</p>
      ) : (
        <Table hover responsive className="data-table">
          <thead>
            <tr>
              <th>{t('rule-kind')}</th>
              <th>{t('rule-subject')}</th>
              <th>{t('rule-target')}</th>
              <th>{t('rule-decision')}</th>
              <th aria-label={t('actions')} />
            </tr>
          </thead>
          <tbody>
            {visible.map((rule) => {
              const { subject, target } = ruleKindOf(rule.kind);
              return (
                <tr key={`${rule.kind}-${rule.id}`}>
                  <td className="text-nowrap">
                    <span className="step-pill">{RULE_KINDS.findIndex((k) => k.kind === rule.kind) + 1}</span>
                    <span className="text-muted small">{t(`rule-kind-short-${rule.kind}`)}</span>
                  </td>
                  <td>
                    <i className={`fa-solid ${ICONS[subject]} cell-icon`} aria-hidden="true" />
                    {subjectName(rule)}
                  </td>
                  <td>
                    <i className={`fa-solid ${ICONS[target]} cell-icon`} aria-hidden="true" />
                    {target === 'endpoint' ? <code>{rule.targetName}</code> : rule.targetName}
                  </td>
                  <td>
                    <span className={`decision-pill ${rule.allow ? 'is-allow' : 'is-deny'}`}>
                      <i className={`fa-solid ${rule.allow ? 'fa-check' : 'fa-ban'}`} aria-hidden="true" />
                      {rule.allow ? t('allow') : t('deny')}
                    </span>
                  </td>
                  <td className="text-end">
                    <IconButton
                      icon="fa-trash"
                      label={`${t('delete')} ${t('rule')}`}
                      onClick={() =>
                        askDelete(t('delete-rule'), `${subjectName(rule)} → ${rule.targetName}`, () =>
                          deletePermissionRule(rule.kind, rule.id),
                        )
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </>
  );
}

function EndpointGroupsTab({ data, endpointName, onCreate, onEdit, askDelete }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(null);
  const visible = data.endpointGroups.filter((group) =>
    includesQuery(query, group.name, group.description, ...group.endpointIds.map(endpointName)),
  );

  return (
    <>
      <Toolbar
        query={query}
        onQuery={setQuery}
        placeholder={t('search-endpoint-groups')}
        shown={visible.length}
        total={data.endpointGroups.length}
        action={<CreateButton label={t('create-endpoint-group')} onClick={onCreate} />}
      />
      {visible.length === 0 ? (
        <p className="empty-state">{data.endpointGroups.length ? t('no-matches') : t('no-endpoint-groups')}</p>
      ) : (
        <Table hover responsive className="data-table">
          <thead>
            <tr>
              <th>{t('name')}</th>
              <th>{t('endpoints')}</th>
              <th aria-label={t('actions')} />
            </tr>
          </thead>
          <tbody>
            {visible.map((group) => {
              const names = group.endpointIds.map(endpointName).sort();
              const isOpen = expanded === group.id;
              const shown = isOpen ? names : names.slice(0, GROUP_PREVIEW);
              return (
                <tr key={group.id}>
                  <td className="group-name-cell">
                    <div className="fw-medium">{group.name}</div>
                    {group.description && <div className="text-muted small">{group.description}</div>}
                  </td>
                  <td>
                    <div className="pill-list">
                      <span className="count-badge ms-0">{names.length}</span>
                      {shown.map((name) => (
                        <span key={name} className="tag-pill">
                          {name}
                        </span>
                      ))}
                      {names.length > GROUP_PREVIEW && (
                        <button
                          type="button"
                          className="pill-more"
                          aria-expanded={isOpen}
                          onClick={() => setExpanded(isOpen ? null : group.id)}
                        >
                          {isOpen ? t('show-less') : t('show-more', { count: names.length - GROUP_PREVIEW })}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="text-end text-nowrap">
                    <IconButton icon="fa-pen" label={`${t('edit')}: ${group.name}`} onClick={() => onEdit(group)} />
                    <IconButton
                      icon="fa-trash"
                      label={`${t('delete')} ${group.name}`}
                      onClick={() =>
                        askDelete(t('delete-endpoint-group'), group.name, () => deleteEndpointGroup(group.id))
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </>
  );
}

function EndpointsTab({ data }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  // Endpoint id -> names of the groups it is in
  const groupsOf = useMemo(() => {
    const result = new Map();
    data.endpointGroups.forEach((group) =>
      group.endpointIds.forEach((id) => result.set(id, [...(result.get(id) ?? []), group.name])),
    );
    return result;
  }, [data.endpointGroups]);
  const visible = data.endpoints.filter((e) => includesQuery(query, e.functionName, e.description));

  return (
    <>
      <p className="text-muted small mb-0">
        <i className="fa-solid fa-rotate me-2" aria-hidden="true" />
        {t('endpoints-hint')}
      </p>
      <Toolbar
        query={query}
        onQuery={setQuery}
        placeholder={t('search-endpoints')}
        shown={visible.length}
        total={data.endpoints.length}
      />
      {visible.length === 0 ? (
        <p className="empty-state">{data.endpoints.length ? t('no-matches') : t('no-endpoints')}</p>
      ) : (
        <div className="table-scroll">
          <Table hover className="data-table">
            <thead>
              <tr>
                <th>{t('name')}</th>
                <th>{t('description')}</th>
                <th>{t('endpoint-groups')}</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((endpoint) => (
                <tr key={endpoint.id}>
                  <td className="text-nowrap">
                    <code className="endpoint-name">{endpoint.functionName}</code>
                  </td>
                  <td className="text-muted small">{endpoint.description}</td>
                  <td>
                    <div className="pill-list">
                      {(groupsOf.get(endpoint.id) ?? []).map((name) => (
                        <span key={name} className="tag-pill">
                          {name}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
}

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
      <FormField name="kind" label={t('rule-kind')} as="select" onChange={selectKind} hint={t('rule-kind-hint')}>
        {RULE_KINDS.map(({ kind }) => (
          <option key={kind} value={kind}>
            {t(`rule-kind-${kind}`)}
          </option>
        ))}
      </FormField>
      <SearchSelectField
        name="subjectId"
        label={t(subject === 'user' ? 'account' : 'group')}
        options={subjectOptions(data, subject)}
      />
      <SearchSelectField
        name="targetId"
        label={t(target === 'endpoint' ? 'endpoint' : 'endpoint-group')}
        options={targetOptions(data, target)}
      />
      <fieldset className="form-group col-12">
        <legend className="segmented-legend">{t('rule-decision')}</legend>
        <div className="segmented">
          <label className="segmented-option is-allow">
            <Field type="radio" name="allow" value="true" />
            <span>
              <i className="fa-solid fa-check me-2" aria-hidden="true" />
              {t('allow')}
            </span>
          </label>
          <label className="segmented-option is-deny">
            <Field type="radio" name="allow" value="false" />
            <span>
              <i className="fa-solid fa-ban me-2" aria-hidden="true" />
              {t('deny')}
            </span>
          </label>
        </div>
      </fieldset>
    </>
  );
}

function Permissions() {
  const { t } = useTranslation();
  const { data, status, reload } = useResource(loadPermissionData);
  const [tab, setTab] = useState('rules');
  const [openModal, setOpenModal] = useState(null); // 'endpointGroup' | 'rule' | null
  const [editGroup, setEditGroup] = useState(null); // endpoint group being edited, null when creating
  const [pendingDelete, setPendingDelete] = useState(null); // { title, message, action }

  const required = t('error-required', 'This field is required.');
  const endpointGroupSchema = useMemo(
    () => Yup.object().shape({ name: Yup.string().trim().required(required) }),
    [required],
  );
  const ruleSchema = useMemo(
    () => Yup.object().shape({ subjectId: Yup.string().required(required), targetId: Yup.string().required(required) }),
    [required],
  );

  const closeModal = () => setOpenModal(null);
  const reloadSilently = () => reload({ silent: true });

  const subjectName = (rule) => {
    const { subject } = ruleKindOf(rule.kind);
    const match = subjectOptions(data, subject).find((o) => o.value === String(rule.subjectId));
    return match?.label ?? `#${rule.subjectId}`;
  };
  const endpointName = (id) => data.endpoints.find((e) => e.id === id)?.functionName ?? `#${id}`;

  const askDelete = (title, name, action) =>
    setPendingDelete({ title, message: t('delete-confirm', { name }), action });

  const openGroupModal = (group) => {
    setEditGroup(group);
    setOpenModal('endpointGroup');
  };
  const groupInitialValues = editGroup
    ? { name: editGroup.name, description: editGroup.description ?? '', endpointIds: editGroup.endpointIds.map(String) }
    : { name: '', description: '', endpointIds: [] };
  const saveGroup = ({ name, description, endpointIds }) => {
    const payload = { name: name.trim(), description, endpointIds: endpointIds.map(Number) };
    return editGroup ? updateEndpointGroup(editGroup.id, payload) : createEndpointGroup(payload);
  };

  const tabTitle = (key, count) => (
    <>
      {t(key)}
      <span className="count-badge">{count}</span>
    </>
  );

  return (
    <PageLayout backTo={ROUTES.admin.root} id="permissions" title={t('permissions', 'Permissions')}>
      <Alert variant="info" className="d-flex gap-2">
        <i className="fa-solid fa-circle-info mt-1" aria-hidden="true" />
        <span>{t('permissions-hint')}</span>
      </Alert>
      <AsyncContent status={status} onRetry={reload}>
        {() => (
          <div className="panel">
            <Tabs id="permissions-tabs" activeKey={tab} onSelect={(key) => setTab(key)} className="mb-2">
              <Tab eventKey="rules" title={tabTitle('permission-rules', data.rules.length)}>
                <RulesTab
                  data={data}
                  subjectName={subjectName}
                  onCreate={() => setOpenModal('rule')}
                  askDelete={askDelete}
                />
              </Tab>
              <Tab eventKey="groups" title={tabTitle('endpoint-groups', data.endpointGroups.length)}>
                <EndpointGroupsTab
                  data={data}
                  endpointName={endpointName}
                  onCreate={() => openGroupModal(null)}
                  onEdit={openGroupModal}
                  askDelete={askDelete}
                />
              </Tab>
              <Tab eventKey="endpoints" title={tabTitle('endpoints', data.endpoints.length)}>
                <EndpointsTab data={data} />
              </Tab>
            </Tabs>

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
              title={editGroup ? t('edit-endpoint-group') : t('create-endpoint-group')}
              titleId="endpoint-group-modal-title"
              initialValues={groupInitialValues}
              validationSchema={endpointGroupSchema}
              onSubmit={saveGroup}
              onSaved={reloadSilently}
            >
              <FormField name="name" label={t('name', 'Name')} htmlFor="endpoint-group-name" />
              <FormField
                name="description"
                label={t('description', 'Description')}
                htmlFor="endpoint-group-description"
              />
              <SearchSelectField
                name="endpointIds"
                label={t('endpoints')}
                options={targetOptions(data, 'endpoint')}
                multiple
              />
            </FormModal>
          </div>
        )}
      </AsyncContent>

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
