import { namesOf } from './desktopFormat';

it('joins the names of the given IDs', () => {
  const items = [
    { id: 1, description: 'Office' },
    { id: 2, description: 'Lab' },
  ];
  expect(namesOf([2, 1], items)).toBe('Lab, Office');
});

it('shows the ID of an item that is not loaded', () => {
  expect(namesOf([3], [])).toBe('#3');
  expect(namesOf([3], undefined)).toBe('#3');
  expect(namesOf(undefined, [])).toBe('');
});
