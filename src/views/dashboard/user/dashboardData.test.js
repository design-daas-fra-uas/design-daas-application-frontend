import { filterBySearch, ownedBy } from './dashboardData';

describe('ownedBy', () => {
  const items = [
    { id: 1, id_owner: 7 },
    { id: 2, id_owner: '7' },
    { id: 3, id_owner: 0 },
    { id: 4, id_owner: null },
  ];

  it('matches owner ids given as numbers or strings', () => {
    expect(ownedBy(items, 7).map((item) => item.id)).toEqual([1, 2]);
  });

  it('treats owner 0 as shared and ignores items without owner', () => {
    expect(ownedBy(items, 0).map((item) => item.id)).toEqual([3]);
  });

  it('handles a missing list', () => {
    expect(ownedBy(undefined, 1)).toEqual([]);
  });
});

describe('filterBySearch', () => {
  const apps = [
    { name: 'Firefox', os_type: 'linux', version: '1.0', id_owner: 5 },
    { name: 'Office', os_type: 'win10', version: '2.0', target: null },
  ];

  it('returns everything for an empty query', () => {
    expect(filterBySearch(apps, '  ')).toBe(apps);
  });

  it('matches case-insensitively on visible columns', () => {
    expect(filterBySearch(apps, 'FIRE')).toEqual([apps[0]]);
    expect(filterBySearch(apps, 'win')).toEqual([apps[1]]);
  });

  it('ignores hidden columns and null values', () => {
    expect(filterBySearch(apps, '2.0')).toEqual([]);
    expect(filterBySearch(apps, '5')).toEqual([]);
  });

  it('always searches the full list, so a shorter query widens the result', () => {
    expect(filterBySearch(apps, 'firefox')).toHaveLength(1);
    expect(filterBySearch(apps, 'f')).toHaveLength(2);
  });
});
