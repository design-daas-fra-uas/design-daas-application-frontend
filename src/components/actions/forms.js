// Field sets shared by the admin pages and the user dashboard.
import { OS_TYPES, ROOT_IMAGES, cephFields, checkbox, file, required, select, text, viewerFields } from './fields';

const BASEIMAGE_OS_TYPES = [
  ['win10', 'Windows 10'],
  ['win11', 'Windows 11'],
  ['l26', 'Linux - Debian 12'],
];
const OBJECT_TYPES = [
  ['', ''],
  ['vm', 'VM'],
  ['container', 'Container'],
];
const INSTALLER_TYPES = [
  ['none', 'app-installer-none'],
  ['exec_cmd', 'app-installer-execute-command'],
  ['os_install', 'app-installer-os-install'],
  ['os_uninstall', 'app-installer-os-uninstall'],
];

// /phases/baseimage_create: VM or container fields depending on the object type.
const vmOnly = { visible: (values) => values.obj_type === 'vm' };
const containerOnly = { visible: (values) => values.obj_type === 'container' };
const typed = { visible: (values) => values.obj_type !== '' };

export const BASEIMAGE_CREATE_FIELDS = [
  required(text('id', 'vm-id')),
  required(select('obj_type', 'vm-object-type', OBJECT_TYPES)),
  required(text('vm_name', 'vm-name', { ...vmOnly, param: 'name' })),
  required(text('container_name', 'vm-name', { ...containerOnly, param: 'name' })),
  required(select('os_type', 'vm-os-type', BASEIMAGE_OS_TYPES, vmOnly)),
  required(select('rootimage', 'vm-root-image', ROOT_IMAGES, containerOnly)),
  required(text('cores', 'vm-cores', typed)),
  required(text('memsize', 'vm-memory-size', typed)),
  required(text('disksize', 'vm-disk-size', typed)),
  required(text('kb', 'vm-keyboard-language', vmOnly)),
  file('dockerfile', 'vm-dockerfile', containerOnly),
  checkbox('ceph_pool', 'vm-ceph-pool', vmOnly),
  ...cephFields(typed),
  ...viewerFields(typed),
];

// /phases/baseimage_clone
export const BASEIMAGE_CLONE_FIELDS = [
  required(text('id', 'vm-id')),
  required(text('newid', 'vm-new-id')),
  required(text('name', 'vm-name')),
];

// /apps/create, /apps/update and their *_shared variants
export const APP_FIELDS = [
  required(text('id', 'vm-id')),
  required(text('name', 'app-create-update-name')),
  text('id_file', 'app-create-update-file'),
  text('id_template', 'app-create-update-template'),
  required(select('os_type', 'app-create-update-os-type', OS_TYPES)),
  text('installer', 'app-create-update-installer'),
  text('installer_args', 'app-create-update-installer-args'),
  required(select('installer_type', 'app-create-update-installer-type', INSTALLER_TYPES, { translate: true })),
  required(text('target', 'app-create-update-target')),
  text('target_args', 'app-create-update-target-args'),
  required(text('version', 'app-create-update-version')),
];

// /files/create, /files/update and their *_shared variants
export const FILE_FIELDS = [
  required(text('id', 'vm-id')),
  required(text('filename', 'file-create-update-name')),
  required(text('filepath', 'file-create-update-path')),
  required(select('os_type', 'file-create-update-os-type', OS_TYPES)),
  required(text('version', 'file-create-update-version')),
  required(file('file', 'file-create-update-file')),
];
