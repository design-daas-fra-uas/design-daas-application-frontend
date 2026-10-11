import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { Field, ErrorMessage, useField } from 'formik';

// Label + Formik <Field> + <ErrorMessage>, each in its own <Col xs={12}>.
// Renders only the <Col>s (not its own <Row>) so several FormFields can share
// one <Row>. The error text is linked to the field via aria-describedby.
function FormField({ name, label, htmlFor, type = 'text', as, className, children, ...fieldProps }) {
  const fieldId = htmlFor || name;
  const [, meta] = useField(name);
  const baseClassName = className || (as === 'select' ? 'select-field' : 'form-control');
  const hasError = Boolean(meta.touched && meta.error);
  const fieldClassName = hasError ? `${baseClassName} is-invalid` : baseClassName;

  return (
    <>
      <ReactBootstrap.Col xs={12}>
        <label htmlFor={fieldId}>{label}</label>
      </ReactBootstrap.Col>
      <ReactBootstrap.Col xs={12}>
        <Field id={fieldId} name={name} type={as ? undefined : type} as={as} className={fieldClassName} aria-invalid={hasError} aria-describedby={`${fieldId}-error`} {...fieldProps}>
          {children}
        </Field>
      </ReactBootstrap.Col>
      <ReactBootstrap.Col xs={12}>
        <div id={`${fieldId}-error`} className="error-text" role={hasError ? 'alert' : undefined}>
          <ErrorMessage name={name} />
        </div>
      </ReactBootstrap.Col>
    </>
  );
}

export default FormField;
