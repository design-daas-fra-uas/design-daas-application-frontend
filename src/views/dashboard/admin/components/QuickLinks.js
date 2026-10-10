import React from 'react';
import { Link } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../../../routes';

// Quick-link tiles shown at the bottom of the dashboard.
const QUICK_LINKS = [
  { to: ROUTES.admin.desktops, labelKeys: ['desktops'] },
  { to: ROUTES.admin.desktopGroups, labelKeys: ['desktop-groups'] },
  { to: ROUTES.admin.monitoring, labelKeys: ['monitoring'] },
  { to: ROUTES.admin.limitation, labelKeys: ['limitation'] },
  { to: ROUTES.admin.tasks, labelKeys: ['tasks'] },
  { to: ROUTES.admin.vmEnvironment, labelKeys: ['vm-setup'] },
  { to: ROUTES.admin.nodeConfiguration, labelKeys: ['vm-node-dhcp', 'vm-node-iptables'] },
  { to: ROUTES.admin.connections, labelKeys: ['viewer-check'] },
  { to: ROUTES.admin.instances, labelKeys: ['vm-instance'] },
  { to: ROUTES.admin.docker, labelKeys: ['vm-docker'] },
  { to: ROUTES.admin.phases, labelKeys: ['vm-phases'] },
  { to: ROUTES.admin.adminAssign, labelKeys: ['admin-assign-object-app'] },
  { to: ROUTES.admin.apps, labelKeys: ['app-configuration'] },
  { to: ROUTES.admin.files, labelKeys: ['file-configuration'] },
  { to: ROUTES.dashboard, labelKeys: ['dashboard-back'] },
];

function QuickLinks() {
  const { t } = useTranslation();

  return QUICK_LINKS.map(({ to, labelKeys }) => (
    <Col key={to} xs={12} md={6} lg={4}>
      <Link to={to} className="link-daas-design">
        <div>{labelKeys.map((key) => t(key)).join(' / ')}</div>
      </Link>
    </Col>
  ));
}

export default QuickLinks;