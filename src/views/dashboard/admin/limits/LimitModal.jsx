import { useMemo } from 'react';
import { Col, Form, InputGroup } from 'react-bootstrap';
import { ErrorMessage, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import FormField from '../../../../components/FormField';
import FormModal from '../../../../components/FormModal';
import { putLimit } from '../../../../api/limits';
import { LIMIT_FIELDS, toFormValues, toLimitRequest } from './limitFormat';

// A number input with a "No limit" switch next to it; the switch disables the input.
function LimitField({ name, label, unit }) {
  const { t } = useTranslation();
  const { values, handleChange, handleBlur, setFieldValue, errors, touched } = useFormikContext();
  const unlimited = values[`${name}_unlimited`];
  const invalid = Boolean(touched[name] && errors[name]);

  return (
    <Col xs={12} className="limit-field">
      <label htmlFor={`limit-${name}`}>{t(label)}</label>
      <div className="limit-field-controls">
        <InputGroup>
          <Form.Control
            id={`limit-${name}`}
            name={name}
            type="number"
            min="0"
            step={unit === 'bytes' ? '0.5' : '1'}
            value={unlimited ? '' : values[name]}
            placeholder={unlimited ? t('limit-unlimited') : ''}
            disabled={unlimited}
            isInvalid={invalid && !unlimited}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {unit === 'bytes' && <InputGroup.Text>GiB</InputGroup.Text>}
        </InputGroup>
        <Form.Check
          type="switch"
          id={`limit-${name}-unlimited`}
          label={t('limit-no-limit')}
          checked={unlimited}
          onChange={(event) => setFieldValue(`${name}_unlimited`, event.target.checked)}
        />
      </div>
      {!unlimited && (
        <div className="error-text">
          <ErrorMessage name={name} />
        </div>
      )}
    </Col>
  );
}

// Create or edit a user's limit. `limit` is the current entry (edit) or null (new limit,
// prefilled with the defaults); `accounts` are the users the admin can pick from.
function LimitModal({ show, onHide, limit, defaults, accounts, onSaved }) {
  const { t } = useTranslation();
  const editing = limit != null;

  const initialValues = useMemo(
    () => ({ id_owner: editing ? String(limit.id_owner) : '', ...toFormValues(editing ? limit : defaults) }),
    [editing, limit, defaults],
  );

  const validationSchema = useMemo(() => {
    // A value is only needed when its "No limit" switch is off.
    const fields = Object.fromEntries(
      LIMIT_FIELDS.map(({ key }) => [
        key,
        Yup.string().when(`${key}_unlimited`, {
          is: false,
          then: (schema) =>
            schema
              .required(t('limit-error-required'))
              .test('non-negative', t('limit-error-number'), (value) => value !== '' && Number(value) >= 0),
        }),
      ]),
    );
    return Yup.object().shape({
      id_owner: Yup.string().required(t('limit-error-account')),
      ...fields,
    });
  }, [t]);

  return (
    <FormModal
      show={show}
      onHide={onHide}
      title={editing ? t('limit-edit-title') : t('limit-create-title')}
      titleId="limit-modal-title"
      initialValues={initialValues}
      validationSchema={validationSchema}
      requireDirty={false}
      fullWidthSubmit
      onSubmit={(values) => putLimit(toLimitRequest(values.id_owner, values))}
      onSaved={onSaved}
    >
      <FormField name="id_owner" label={t('limit-account')} as="select" disabled={editing}>
        <option value="">{t('please-select', 'Please select')}</option>
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name} ({account.email})
          </option>
        ))}
      </FormField>
      {LIMIT_FIELDS.map((field) => (
        <LimitField key={field.key} name={field.key} label={field.label} unit={field.unit} />
      ))}
    </FormModal>
  );
}

export default LimitModal;
