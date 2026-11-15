import { toContainerObjects } from './docker';

describe('docker api', () => {
  it('keeps only the DaaS container objects of /phases/object_list, sorted by id', () => {
    const entries = [
      { daas_id: 117, daas_name: 'vm-117', daas_object: false, daas_owner: -1, daas_type: 'vm' },
      { daas_id: 'templateDeb12', daas_name: 'deb12template', daas_object: true, daas_owner: 0, daas_type: 'vm' },
      { daas_id: 'contx11', daas_name: 'x11container', daas_object: true, daas_owner: 0, daas_type: 'docker-image' },
      { daas_id: 'sha256:192f7b', daas_name: 'x11vnc', daas_object: true, daas_owner: 0, daas_type: 'docker-image' },
      {
        daas_id: 'sha256:c82246',
        daas_name: 'daas-auth',
        daas_object: false,
        daas_owner: -1,
        daas_type: 'docker-image',
      },
      { daas_id: 'contwine', daas_name: 'winecontainer', daas_object: true, daas_owner: 4, daas_type: 'docker-image' },
    ];
    expect(toContainerObjects(entries)).toEqual([
      { id: 'contwine', name: 'winecontainer', owner: 4 },
      { id: 'contx11', name: 'x11container', owner: 0 },
    ]);
  });
});
