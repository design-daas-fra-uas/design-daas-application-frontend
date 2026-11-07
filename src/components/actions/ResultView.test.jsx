import { render, screen } from '@testing-library/react';

import '../../i18n';
import ResultView from './ResultView';

it('shows a placeholder for empty results', () => {
  render(<ResultView data={[]} />);
  expect(screen.getByText('No data available')).toBeInTheDocument();
});

it('shows records as key/value rows, including nested lists', () => {
  render(<ResultView data={{ id: 3, current: [{ id_task: 't-1' }] }} />);
  expect(screen.getByText('id')).toBeInTheDocument();
  expect(screen.getByText('3')).toBeInTheDocument();
  expect(screen.getByText('t-1')).toBeInTheDocument();
});

it('shows text results (e.g. logs) as preformatted text', () => {
  render(<ResultView data={'line 1\nline 2'} />);
  expect(screen.getByText(/line 1/)).toBeInTheDocument();
});
