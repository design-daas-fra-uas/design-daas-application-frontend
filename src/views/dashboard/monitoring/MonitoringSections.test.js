import { render, screen } from '@testing-library/react';

import '../../../i18n';
import { EMPTY_MONITORING } from './monitoringConfig';
import { CategoryContent, MonitoringCounts, MonitoringTabs } from './MonitoringSections';

const data = {
  ...EMPTY_MONITORING,
  tasks: [{ id_task: 'task-1', result: { ok: true }, task_state: 'done' }],
  files: [{ id: 'file-1', localpath: '/tmp/a' }],
  hosts: { available_cpus: 16 },
  limits: { fallback: { cpu_max: 4 }, limits: [{ id_owner: 3, vm_max: 2 }], syslimit: { vm_max: 10 } },
};

it('shows the counts of tasks, files and apps', () => {
  render(<MonitoringCounts data={data} />);
  expect(screen.getByText(/ 2$/)).toBeInTheDocument();
});

it('renders task records with their fields', () => {
  render(<CategoryContent category="tasks" data={data} />);
  expect(screen.getByRole('button', { name: 'task-1' })).toBeInTheDocument();
  expect(screen.getByText('{"ok":true}')).toBeInTheDocument();
});

it('renders limits and reports empty categories', () => {
  render(<CategoryContent category="limits" data={data} />);
  expect(screen.getByText('10')).toBeInTheDocument();

  render(<CategoryContent category="apps" data={data} />);
  expect(screen.getAllByText(/no data|keine daten/i).length).toBeGreaterThan(0);
});

it('renders every category without crashing on empty data', () => {
  render(<MonitoringTabs data={EMPTY_MONITORING} id="test" />);
  expect(screen.getAllByRole('tab').length).toBe(9);
});
