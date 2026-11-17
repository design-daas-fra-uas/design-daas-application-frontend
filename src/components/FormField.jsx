import * as ReactBootstrap from 'react-bootstrap';
import { Field, ErrorMessage, useField } from 'formik';

// Label + Formik <Field> + <ErrorMessage> as one spaced group in a <Col xs={12}>.
// Renders only the <Col> (not its own <Row>) so several FormFields can share
// one <Row>. The optional `hint` and the error text are linked to the field via
// aria-describedby.
function FormField({ name, label, htmlFor, hint, type = 'text', as, className, children, ...fieldProps }) {
  const fieldId = htmlFor || name;
  const [, meta] = useField(name);
  const baseClassName = className || (as === 'select' ? 'select-field' : 'form-control');
  const hasError = Boolean(meta.touched && meta.error);
  const fieldClassName = hasError ? `${baseClassName} is-invalid` : baseClassName;

  return (
    <ReactBootstrap.Col xs={12} className="form-group">
      <label htmlFor={fieldId}>{label}</label>
      <Field
        id={fieldId}
        name={name}
        type={as ? undefined : type}
        as={as}
        className={fieldClassName}
        aria-invalid={hasError}
        aria-describedby={hint ? `${fieldId}-hint ${fieldId}-error` : `${fieldId}-error`}
        {...fieldProps}
      >
        {children}
      </Field>
      {hint && (
        <div id={`${fieldId}-hint`} className="form-hint">
          {hint}
        </div>
      )}
      <div id={`${fieldId}-error`} className="error-text" role={hasError ? 'alert' : undefined}>
        <ErrorMessage name={name} />
      </div>
    </ReactBootstrap.Col>
  );
}

export default FormField;
