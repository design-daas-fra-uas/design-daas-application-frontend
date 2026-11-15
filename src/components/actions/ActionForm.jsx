import { useEffect, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';

import { createLogger } from '../../utils/logger';
import Combobox from './Combobox';
import { initialValues, isVisible, validate } from './fields';

const log = createLogger('ActionForm');

// Items of a field's `suggest()` and whether they are 'loading', 'loaded' or failed ('error').
function useSuggestions(suggest) {
  const [state, setState] = useState({ items: [], status: 'loading' });
  useEffect(() => {
    let active = true;
    suggest()
      .then((items) => active && setState({ items, status: 'loaded' }))
      .catch((error) => {
        log.warn('Loading the suggestions failed', error);
        if (active) {
          setState({ items: [], status: 'error' });
        }
      });
    return () => {
      active = false;
    };
  }, [suggest]);
  return state;
}

function SuggestInput({ field, id, describedBy }) {
  const { items, status } = useSuggestions(field.suggest);
  return <Combobox id={id} name={field.name} items={items} status={status} describedBy={describedBy} />;
}

function FieldInput({ field, id, setFieldValue }) {
  const { t } = useTranslation();
  const describedBy = field.hint ? `${id}-hint` : undefined;

  switch (field.type) {
    case 'checkbox':
      return (
        <Field type="checkbox" id={id} name={field.name} className="form-check-input" aria-describedby={describedBy} />
      );
    case 'select':
      return (
        <Field as="select" id={id} name={field.name} className="form-select" aria-describedby={describedBy}>
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
          aria-describedby={describedBy}
          onChange={(event) => setFieldValue(field.name, event.currentTarget.files?.[0])}
        />
      );
    case 'number':
      return (
        <Field
          type="number"
          min="1"
          step="1"
          id={id}
          name={field.name}
          className="form-control"
          aria-describedby={describedBy}
        />
      );
    default:
      if (field.suggest) {
        return <SuggestInput field={field} id={id} describedBy={describedBy} />;
      }
      return <Field type="text" id={id} name={field.name} className="form-control" aria-describedby={describedBy} />;
  }
}

// Form built from field definitions (see ./fields). Submitting calls
// `onSubmit(values)`; the button stays disabled until every visible required
// field has a value, while the request is running, and while `disabled`.
function ActionForm({ id, fields, onSubmit, submitLabel = 'submit', disabled = false }) {
  const { t } = useTranslation();
  const initial = useMemo(() => initialValues(fields), [fields]);
  const validator = useMemo(() => validate(fields, t('field-required'), t), [fields, t]);

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
                    {field.hint && (
                      <div id={`${inputId}-hint`} className="form-text">
                        {t(field.hint)}
                      </div>
                    )}
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
