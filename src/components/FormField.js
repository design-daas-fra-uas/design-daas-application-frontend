import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { Field, ErrorMessage, useField } from 'formik';

// Reusable label + Formik <Field> + <ErrorMessage> triple, wrapped in the same
// three <Col xs={12}> blocks that were copy-pasted across every admin form
// (mainAdmin.js, settingsUsers.js, settingsAdmins.js, desktopGroups.js, desktops.js).
// Intentionally renders just the <Col>s (not its own <Row>) so multiple
// FormFields can keep sharing one <ReactBootstrap.Row> exactly like before.
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
        <Field id={fieldId} name={name} type={as ? undefined : type} as={as} className={fieldClassName} aria-invalid={hasError} {...fieldProps}>
          {children}
        </Field>
      </ReactBootstrap.Col>
      <ReactBootstrap.Col xs={12}>
        <div className="error-text" role={hasError ? 'alert' : undefined}>
          <ErrorMessage name={name} />
        </div>
      </ReactBootstrap.Col>
    </>
  );
}

export default FormField;
