const OS_ICONS = {
  win10: 'fa-brands fa-microsoft',
  win11: 'fa-brands fa-microsoft',
  l26: 'fa-brands fa-linux',
  l26vm: 'fa-brands fa-linux',
};
const TYPE_ICONS = { vm: 'fa-solid fa-server', container: 'fa-brands fa-docker' };
const FILE_ICON = 'fa-solid fa-file';

// Operating system, object type and "has a file" icons of an application.
export function appIcons(app) {
  return [OS_ICONS[app.os_type], TYPE_ICONS[app.object_type], app.id_file ? FILE_ICON : undefined].filter(Boolean);
}

export function Icon({ name }) {
  return <i className={`${name} app-icon`} aria-hidden="true" />;
}

// Legend of the icons above, shown in the info modal.
export const ICON_LEGEND = [
  ['fa-brands fa-microsoft', 'windows-text'],
  ['fa-brands fa-linux', 'linux-text'],
  ['fa-solid fa-server', 'vm-text'],
  ['fa-brands fa-docker', 'docker-text'],
  [FILE_ICON, 'file-text'],
];

function AppIcons({ app }) {
  return appIcons(app).map((icon) => <Icon key={icon} name={icon} />);
}

export default AppIcons;
