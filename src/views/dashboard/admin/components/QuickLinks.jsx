import { useTranslation } from 'react-i18next';

import PageLink from '../../../../components/PageLink';
import { ADMIN_SECTIONS } from '../../../../routes';

// The admin dashboard's links, in titled groups (see ADMIN_SECTIONS).
function QuickLinks() {
  const { t } = useTranslation();

  return ADMIN_SECTIONS.map(({ titleKey, icon, links }) => (
    <section key={titleKey} className="link-section" aria-labelledby={`section-${titleKey}`}>
      <h3 id={`section-${titleKey}`} className="link-section-title">
        <i className={`fa-solid ${icon}`} aria-hidden="true" />
        {t(titleKey)}
      </h3>
      <div className="link-grid">
        {links.map((link) => (
          <PageLink key={link.to} to={link.to} icon={link.icon}>
            {link.labelKeys.map((key) => t(key)).join(' / ')}
          </PageLink>
        ))}
      </div>
    </section>
  ));
}

export default QuickLinks;
