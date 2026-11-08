import { useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';

import { initialValues, isVisible, validate } from './fields';

function FieldInput({ field, id, setFieldValue }) {
  const { t } = useTranslation();

  switch (field.type) {
    case 'checkbox':
      return <Field type="checkbox" id={id} name={field.name} className="form-check-input" />;
    case 'select':
      return (
        <Field as="select" id={id} name={field.name} className="form-select">
          {field.choices.map(([value, text]) => (
            <option key={value} value={value}>
              {field.translate ? t(text) : text}
            </option>
          ))}
        </Field>
      );
    case 'file':
      return (
        <input
          type="file"
          className="form-control"
          id={id}
          name={field.name}
          onChange={(event) => setFieldValue(field.name, event.currentTarget.files?.[0])}
        />
      );
    default:
      return <Field type="text" id={id} name={field.name} className="form-control" />;
  }
}

// Form built from field definitions (see ./fields). Submitting calls
// `onSubmit(values)`; the button stays disabled until every visible required
// field has a value, while the request is running, and while `disabled`.
function ActionForm({ id, fields, onSubmit, submitLabel = 'submit', disabled = false }) {
  const { t } = useTranslation();
  const initial = useMemo(() => initialValues(fields), [fields]);
  const validator = useMemo(() => validate(fields, t('field-required')), [fields, t]);

  return (
    <Formik initialValues={initial} initialErrors={validator(initial)} validate={validator} onSubmit={onSubmit}>
      {({ values, isValid, isSubmitting, setFieldValue }) => (
        <Form id={id} className="action-form">
          {fields
            .filter((field) => isVisible(field, values))
            .map((field) => {
              const inputId = `${id}-${field.name}`;
              return (
                <div key={field.name} className={`form-field form-field-${field.type}`}>
                  <label htmlFor={inputId}>{t(field.label)}</label>
                  <div className="form-field-control">
                    <FieldInput field={field} id={inputId} setFieldValue={setFieldValue} />
                    <ErrorMessage name={field.name} component="div" className="error-text" />
                  </div>
                </div>
              );
            })}
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={disabled || !isValid || isSubmitting}>
              {t(submitLabel)}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ActionForm;
