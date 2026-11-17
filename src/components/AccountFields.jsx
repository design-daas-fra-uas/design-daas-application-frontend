import { useTranslation } from 'react-i18next';

import FormField from './FormField';

// Name, email and password fields of a "create account" form. Returns grid
// columns, so it must be rendered inside a <Row>.
function AccountFields({ idSuffix = '' }) {
  const { t } = useTranslation();

  return (
    <>
      {/* A new account: the browser must not fill in the admin's own login. */}
      <FormField name="name" label={t('username')} htmlFor={`username${idSuffix}`} autoComplete="off" />
      <FormField name="email" label={t('email')} htmlFor={`email${idSuffix}`} type="email" autoComplete="off" />
      <FormField
        name="password"
        label={t('password')}
        htmlFor={`password${idSuffix}`}
        type="password"
        autoComplete="new-password"
        hint={t('password-detail-info')}
      />
    </>
  );
}

export default AccountFields;
