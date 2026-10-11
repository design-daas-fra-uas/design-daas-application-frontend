import React, { useState } from 'react';
import { Alert, Button, Col, Modal, Row } from 'react-bootstrap';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';

// Modal with a Formik form (the children are the form fields) and a submit
// button. `onSubmit(values)` should throw when saving fails: the error is shown
// in the modal. After a successful save the modal closes and `onSaved` runs, so
// a failing refresh is never reported as a failed save.
function FormModal({
  show,
  onHide,
  title,
  titleId,
  initialValues,
  validationSchema,
  onSubmit,
  onSaved,
  requireDirty = true,
  fullWidthSubmit = false,
  children,
}) {
  const { t } = useTranslation();
  const [submitError, setSubmitError] = useState('');

  const handleHide = () => {
    setSubmitError('');
    onHide();
  };

  const handleSubmit = async (values) => {
    setSubmitError('');
    try {
      await onSubmit(values);
    } catch (error) {
      console.error(error);
      const conflictMessage = error?.response?.status === 409 ? error.response.data?.message : '';
      setSubmitError(conflictMessage || t('request-failed', 'The request failed. Please try again.'));
      return;
    }

    handleHide();
    try {
      await onSaved?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show={show} onHide={handleHide} size="md" aria-labelledby={titleId} centered>
      <Modal.Header closeButton>
        <Modal.Title id={titleId}>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {submitError && <Alert variant="danger" role="alert">{submitError}</Alert>}
        <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isValid, dirty, isSubmitting }) => (
            <Form>
              <Row>{children}</Row>
              <Row>
                <Col xs={12}>
                  <Button
                    type="submit"
                    variant="primary"
                    className={fullWidthSubmit ? 'submit-full-width' : undefined}
                    disabled={!isValid || (requireDirty && !dirty) || isSubmitting}
                  >
                    {t('submit')}
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}

export default FormModal;