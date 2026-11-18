import { formatLimit, toFormValues, toLimitRequest } from './limitFormat';

const GIB = 1024 ** 3;

describe('limitFormat', () => {
  it('shows -1 as unlimited and bytes in GiB', () => {
    expect(formatLimit(-1, 'count', 'Unlimited')).toBe('Unlimited');
    expect(formatLimit(10, 'count', 'Unlimited')).toBe('10');
    expect(formatLimit(12 * GIB, 'bytes', 'Unlimited')).toBe('12.0 GiB');
  });

  it('turns a stored limit into form values', () => {
    const values = toFormValues({
      vm_max: -1,
      container_max: 5,
      obj_max: 0,
      cpu_max: 12,
      mem_max: 12 * GIB,
      dsk_max: 256 * GIB,
    });
    expect(values).toMatchObject({
      vm_max: '',
      vm_max_unlimited: true,
      container_max: '5',
      container_max_unlimited: false,
      mem_max: '12',
      dsk_max: '256',
    });
  });

  it('turns form values into the request, with -1 for "No limit" and GiB as bytes', () => {
    const request = toLimitRequest('7', {
      vm_max: '',
      vm_max_unlimited: true,
      container_max: '5',
      obj_max: '20',
      cpu_max: '4',
      mem_max: '1.5',
      dsk_max: '100',
    });
    expect(request).toEqual({
      id_owner: 7,
      vm_max: -1,
      container_max: 5,
      obj_max: 20,
      cpu_max: 4,
      mem_max: Math.round(1.5 * GIB),
      dsk_max: 100 * GIB,
    });
  });
});
