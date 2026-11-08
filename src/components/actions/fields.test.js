import { checkbox, file, initialValues, required, select, text, toParams, validate } from './fields';

const isVm = (values) => values.type === 'vm';
const fields = [
  required(text('id', 'vm-id')),
  select('type', 'vm-object-type', [
    ['vm', 'VM'],
    ['container', 'Container'],
  ]),
  required(text('vm_name', 'vm-name', { visible: isVm, param: 'name' })),
  checkbox('ceph_user', 'vm-ceph-user'),
  file('dockerfile', 'vm-dockerfile'),
];

describe('action fields', () => {
  it('start with empty values and the first choice of a select', () => {
    expect(initialValues(fields)).toEqual({
      id: '',
      type: 'vm',
      vm_name: '',
      ceph_user: false,
      dockerfile: undefined,
    });
  });

  it('require visible required fields only', () => {
    const check = validate(fields, 'required');
    expect(check({ id: ' ', type: 'vm', vm_name: '' })).toEqual({ id: 'required', vm_name: 'required' });
    expect(check({ id: '1', type: 'container', vm_name: '' })).toEqual({});
  });

  it('send visible fields under their parameter name, with checkboxes as on/empty', () => {
    expect(toParams(fields, { id: '1', type: 'vm', vm_name: 'a', ceph_user: true })).toEqual({
      id: '1',
      type: 'vm',
      name: 'a',
      ceph_user: 'on',
      dockerfile: undefined,
    });
    expect(toParams(fields, { id: '1', type: 'container', vm_name: 'a', ceph_user: false })).toEqual({
      id: '1',
      type: 'container',
      ceph_user: '',
      dockerfile: undefined,
    });
  });
});
