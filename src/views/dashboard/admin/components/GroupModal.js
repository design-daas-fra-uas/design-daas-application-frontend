import React, { useMemo } from 'react';
import { Alert, Button, Col, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import FormField from '../../../../components/FormField';

function SubmitRow({ disabled }) {
  const { t } = useTranslation();

  return (
    <Row>
      <Col xs={12}>
        <Button type="submit" variant="primary" className="submit-full-width" disabled={disabled}>
          {t('submit')}
        </Button>
      </Col>
    </Row>
  );
}

function CreateGroupForm({ onSubmit }) {
  const { t } = useTranslation();
  const schema = useMemo(
    () => Yup.object().shape({ description: Yup.string().required(t('error-create-group-new', 'Description is required')) }),
    [t]
  );

  return (
    <Formik initialValues={{ description: '' }} validationSchema={schema} onSubmit={onSubmit}>
      {({ isValid, dirty, isSubmitting }) => (
        <Form>
          <Row>
            <FormField name="description" label={t('description-group')} htmlFor="create-group-description" />
          </Row>
          <SubmitRow disabled={!isValid || !dirty || isSubmitting} />
        </Form>
      )}
    </Formik>
  );
}

const NO_GROUP = '0';

function UpdateGroupForm({ groups, onSubmit }) {
  const { t } = useTranslation();
  const schema = useMemo(
    () => Yup.object().shape({ description: Yup.string().required(t('error-update-group-new', 'Description is required')) }),
    [t]
  );

  const findGroup = (groupId) => groups.find((group) => String(group.id) === groupId) ?? null;

  return (
    <Formik
      initialValues={{ groupId: NO_GROUP, description: '' }}
      validationSchema={schema}
      onSubmit={({ groupId, description }) => onSubmit(findGroup(groupId), { description })}
    >
      {({ values, isValid, isSubmitting, handleChange, setFieldValue }) => {
        // Selecting a group prefills the form with its description.
        const selectGroup = (event) => {
          handleChange(event);
          setFieldValue('description', findGroup(event.target.value)?.description ?? '');
        };

        return (
          <Form>
            <Row>
              <FormField name="groupId" label={t('group-choice')} htmlFor="update-group-select" as="select" onChange={selectGroup}>
                <option value={NO_GROUP}>{t('select-group')}</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.description}
                  </option>
                ))}
              </FormField>
              {values.groupId !== NO_GROUP && (
                <FormField name="description" label={t('description-group')} htmlFor="update-group-description" />
              )}
            </Row>
            <SubmitRow disabled={values.groupId === NO_GROUP || !isValid || isSubmitting} />
          </Form>
        );
      }}
    </Formik>
  );
}

// Modal with a "create group" and an "update group" tab.
function GroupModal({ show, onHide, error, groups, onCreate, onUpdate }) {
  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('create-update-group')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" role="alert">{t('request-failed', 'The request failed. Please try again.')}</Alert>}
        <Tabs defaultActiveKey="create-group" id="create-update-group">
          <Tab eventKey="create-group" title={t('create-group')}>
            <CreateGroupForm onSubmit={onCreate} />
          </Tab>
          <Tab eventKey="update-group" title={t('update-group')}>
            <UpdateGroupForm groups={groups} onSubmit={onUpdate} />
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}

export default GroupModal;