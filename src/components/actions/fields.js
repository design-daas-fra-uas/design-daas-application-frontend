// Field definitions for config-driven DaaS forms (see ActionForm).
//
// A field is `{ name, label, type, required, options, initial, visible, param, hint, pattern, invalid }`:
// - `name` is the Formik value name and, unless `param` is given, the request parameter;
// - `label` and `hint` (a short explanation under the input) are i18n keys;
// - `visible(values)` hides the field (and skips its validation and parameter) when false;
// - a non-empty value must match `pattern`, otherwise the i18n key `invalid` is shown;
// - `suggest()` (text fields) resolves to `{ value, label, badge }` items (badge:
//   `{ key, values }` of an i18n text) offered in a
//   searchable list (see Combobox), while typing any other value stays possible;
// - `scale` (number fields) multiplies the value before it is sent, e.g. GiB -> KiB.

export const text = (name, label, options = {}) => ({ type: 'text', name, label, initial: '', ...options });

// Whole number from 1 up.
export const number = (name, label, options = {}) => ({
  type: 'number',
  name,
  label,
  initial: '',
  pattern: /^[1-9]\d*$/,
  invalid: 'field-positive-integer',
  ...options,
});

export const checkbox = (name, label, options = {}) => ({ type: 'checkbox', name, label, initial: false, ...options });

export const file = (name, label, options = {}) => ({ type: 'file', name, label, initial: undefined, ...options });

// `choices` are `[value, text]` pairs; with `translate: true` the texts are i18n keys.
// The first choice is the default unless `initial` is given.
export const select = (name, label, choices, options = {}) => ({
  type: 'select',
  name,
  label,
  choices,
  initial: choices[0][0],
  ...options,
});

export const required = (field) => ({ ...field, required: true });

// Shared choice lists.
export const OS_TYPES = [
  ['win10', 'Windows 10'],
  ['win11', 'Windows 11'],
  ['l26', 'Debian 12'],
];
export const VIEWER_CONTYPES = [
  ['sysvnc', 'System VNC (Proxmox default)'],
  ['instvnc', 'Instance VNC (Docker default)'],
  ['rdp', 'RDP (Windows only)'],
];
// The values the DaaS backend accepts; it resets anything else to 'none'.
// 'browser' resizes the instance's screen to the viewer window.
export const VIEWER_RESIZE = [
  ['none', 'None (keep the instance resolution)'],
  ['browser', 'Browser (resize the instance to the window)'],
];
export const VIEWER_SCALE = [
  ['none', 'None'],
  ['up', 'Up'],
  ['down', 'Down'],
  ['both', 'Both'],
];
// The screen sizes the viewer offers; 'max' fits the instance to the viewer window.
export const VIEWER_RESOLUTIONS = [
  ['max', 'Maximize (fit the viewer window)'],
  ['1920x1080', '1920x1080'],
  ['1680x1050', '1680x1050'],
  ['1600x1200', '1600x1200'],
  ['1280x800', '1280x800'],
  ['1024x768', '1024x768'],
  ['800x600', '800x600'],
];
export const ROOT_IMAGES = [
  ['x11vnc', 'x11vnc'],
  ['wine', 'wine'],
];
export const LIST_CHOICES = [
  ['user', 'user-select'],
  ['shared', 'shared-select'],
  ['both', 'both-select'],
];
export const TASK_TYPES = [
  ['exec_cmd', 'execute-command'],
  ['os_install', 'os-install'],
  ['os_uninstall', 'os-uninstall'],
];

// Ceph storage flags shared by most create/clone forms.
export const cephFields = (options) => [
  checkbox('ceph_public', 'vm-ceph-public', options),
  checkbox('ceph_shared', 'vm-ceph-shared', options),
  checkbox('ceph_user', 'vm-ceph-user', options),
];

// Viewer settings shared by the VM, container and base image create forms.
export const viewerFields = (options) => [
  select('viewer_resolution', 'vm-resolution', VIEWER_RESOLUTIONS, options),
  select('viewer_contype', 'vm-contype', VIEWER_CONTYPES, options),
  select('viewer_resize', 'vm-resize', VIEWER_RESIZE, options),
  select('viewer_scale', 'vm-scale', VIEWER_SCALE, options),
];

export const isVisible = (field, values) => !field.visible || field.visible(values);

export const initialValues = (fields) => Object.fromEntries(fields.map((field) => [field.name, field.initial]));

const isEmpty = (value) => value === undefined || value === null || String(value).trim() === '';

const fieldError = (field, value, message, translate) => {
  if (isEmpty(value)) {
    return field.required ? message : undefined;
  }
  return field.pattern && !field.pattern.test(String(value).trim()) ? translate(field.invalid) : undefined;
};

// Formik `validate`: every visible required field needs a value, and a value
// must match the field's `pattern`. `translate` turns `invalid` keys into text.
export const validate =
  (fields, message, translate = (key) => key) =>
  (values) =>
    Object.fromEntries(
      fields
        .filter((field) => isVisible(field, values))
        .map((field) => [field.name, fieldError(field, values[field.name], message, translate)])
        .filter(([, error]) => error),
    );

// The DaaS backend reads checkboxes as 'on' / ''.
const toParam = (field, value) => {
  if (field.type === 'checkbox') {
    return value ? 'on' : '';
  }
  if (field.scale && !isEmpty(value)) {
    return String(Number(value) * field.scale);
  }
  return value;
};

// Request parameters for the visible fields.
export const toParams = (fields, values) =>
  Object.fromEntries(
    fields
      .filter((field) => isVisible(field, values))
      .map((field) => [field.param || field.name, toParam(field, values[field.name])]),
  );
