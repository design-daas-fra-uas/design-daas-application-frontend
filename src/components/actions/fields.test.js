import { checkbox, file, initialValues, number, required, select, text, toParams, validate } from './fields';

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

  it('reject values that do not match the pattern, but not empty optional ones', () => {
    const pattern = [
      required(text('id', 'vm-id', { pattern: /^[a-z]+$/, invalid: 'bad-id' })),
      text('note', 'note', { pattern: /^[a-z]+$/, invalid: 'bad-note' }),
    ];
    const check = validate(pattern, 'required', (key) => `t:${key}`);
    expect(check({ id: 'ok', note: '' })).toEqual({});
    expect(check({ id: 'Not ok', note: '1' })).toEqual({ id: 't:bad-id', note: 't:bad-note' });
    expect(check({ id: '', note: '' })).toEqual({ id: 'required' });
  });

  it('accept whole numbers from 1 and send them scaled', () => {
    const memory = [required(number('memsize', 'memory', { scale: 1024 ** 2 }))];
    const check = validate(memory, 'required');
    for (const bad of ['0', '-1', '2.5', 'abc']) {
      expect(check({ memsize: bad })).toEqual({ memsize: 'field-positive-integer' });
    }
    expect(check({ memsize: 4 })).toEqual({});
    expect(toParams(memory, { memsize: 4 })).toEqual({ memsize: '4194304' });
    expect(toParams(memory, { memsize: '' })).toEqual({ memsize: '' });
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
