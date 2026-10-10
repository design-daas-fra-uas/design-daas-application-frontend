import React from 'react';
import { Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import FormField from './FormField';

// Name, email and password fields of a "create account" form. Returns grid
// columns, so it must be rendered inside a <Row>.
function AccountFields({ idSuffix = '' }) {
  const { t } = useTranslation();

  return (
    <>
      <FormField name="name" label={t('username')} htmlFor={`username${idSuffix}`} />
      <FormField name="email" label={t('email')} htmlFor={`email${idSuffix}`} />
      <FormField name="password" label={t('password')} htmlFor={`password${idSuffix}`} type="password" />
      <Col xs={12}>
        <div>{t('password-detail-info')}</div>
      </Col>
    </>
  );
}

export default AccountFields;