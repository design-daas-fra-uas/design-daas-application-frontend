import apiClient from './client';

// Permission management of the Java backend. A rule allows or denies a subject
// (user or user group) a target (endpoint or endpoint group); `kind` names the
// combination, in the order the backend checks them.
export const RULE_KINDS = [
  { kind: 'USER_ENDPOINT', subject: 'user', target: 'endpoint' },
  { kind: 'USER_GROUP_ENDPOINT', subject: 'userGroup', target: 'endpoint' },
  { kind: 'USER_ENDPOINT_GROUP', subject: 'user', target: 'endpointGroup' },
  { kind: 'USER_GROUP_ENDPOINT_GROUP', subject: 'userGroup', target: 'endpointGroup' },
];

export const ruleKindOf = (kind) => RULE_KINDS.find((entry) => entry.kind === kind);

export const getEndpoints = ({ signal } = {}) => apiClient.get('/endpoints', { signal });

export const createEndpoint = (payload) => apiClient.post('/endpoint', payload);

export const deleteEndpoint = (id) => apiClient.delete(`/endpoint/${id}`);

export const getEndpointGroups = ({ signal } = {}) => apiClient.get('/endpoint_groups', { signal });

export const createEndpointGroup = (payload) => apiClient.post('/endpoint_group', payload);

export const deleteEndpointGroup = (id) => apiClient.delete(`/endpoint_group/${id}`);

export const getPermissionRules = ({ signal } = {}) => apiClient.get('/permission_rules', { signal });

export const createPermissionRule = (payload) => apiClient.post('/permission_rule', payload);

export const deletePermissionRule = (kind, id) => apiClient.delete(`/permission_rule/${kind}/${id}`);
