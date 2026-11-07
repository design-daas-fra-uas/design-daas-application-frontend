import { TASK_TYPES, required, select, text } from '../../../../components/actions/fields';
import { applistParam, targetParam, tasklistParam } from '../../../../api/phases';

// `saved` holds a step's stored config ({ type, name, cmd, args }) when editing.
const value = (saved, key, fallback = '') => saved?.[key] ?? fallback;

// The three expert-mode configuration steps (tasks, app, start target) for an
// object; `env` is '' for a base image.
export const configSteps = ({ objectId, env, saved = {}, targetName = '' }) => [
  {
    key: 'cfg-tasklist',
    title: 'app-step-one',
    endpoint: '/phases/cfg_tasklist',
    fields: [
      required(
        select('type', 'vm-type', TASK_TYPES, { translate: true, initial: value(saved.tasks, 'type', 'exec_cmd') }),
      ),
      required(text('cmd', 'vm-command', { initial: value(saved.tasks, 'cmd') })),
      text('args', 'vm-arguments', { initial: value(saved.tasks, 'args') }),
    ],
    body: (params) => ({ id: objectId, env, ...params, tasklist: tasklistParam(params) }),
  },
  {
    key: 'cfg-applist',
    title: 'app-step-two',
    endpoint: '/phases/cfg_applist',
    fields: [
      required(text('name', 'vm-name', { initial: value(saved.apps, 'name') })),
      required(text('cmd', 'vm-command', { initial: value(saved.apps, 'cmd') })),
      text('args', 'vm-arguments', { initial: value(saved.apps, 'args') }),
    ],
    // The app name only travels inside `applist`.
    body: ({ name, ...params }) => ({ id: objectId, env, ...params, applist: applistParam({ name, ...params }) }),
  },
  {
    key: 'cfg-target',
    title: 'app-step-three',
    endpoint: '/phases/cfg_set_target',
    fields: [
      required(text('name', 'vm-name', { initial: value(saved.target, 'name', targetName) })),
      required(text('cmd', 'vm-command', { initial: value(saved.target, 'cmd') })),
      text('args', 'vm-arguments', { initial: value(saved.target, 'args') }),
    ],
    body: (params) => ({ id: objectId, env, ...params, target: targetParam(params) }),
  },
];
