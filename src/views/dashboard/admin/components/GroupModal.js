import React, { useMemo, useState } from 'react';
import { Button, Col, Modal, Row, Tab, Tabs } from 'react-bootstrap';
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

function UpdateGroupForm({ groups, onSubmit }) {
  const { t } = useTranslation();
  // Group picked in the select; prefills the form with its description.
  const [groupToUpdate, setGroupToUpdate] = useState(null);
  const schema = useMemo(
    () => Yup.object().shape({ description: Yup.string().required(t('error-update-group-new', 'Description is required')) }),
    [t]
  );

  const selectGroup = (event) => {
    setGroupToUpdate(groups.find((group) => String(group.id) === event.target.value) ?? null);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{ description: groupToUpdate?.description ?? '' }}
      validationSchema={schema}
      onSubmit={(values) => onSubmit(groupToUpdate, values)}
    >
      {({ isValid, dirty, isSubmitting }) => (
        <Form>
          <Row>
            <Col xs={12}>
              <label htmlFor="update-group-select">{t('group-choice')}</label>
            </Col>
            <Col xs={12}>
              <select id="update-group-select" className="select-field" onChange={selectGroup} defaultValue="0">
                <option value="0">{t('select-group')}</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.description}
                  </option>
                ))}
              </select>
            </Col>
            {groupToUpdate && <FormField name="description" label={t('description-group')} htmlFor="update-group-description" />}
          </Row>
          <SubmitRow disabled={!groupToUpdate || !isValid || !dirty || isSubmitting} />
        </Form>
      )}
    </Formik>
  );
}

// Modal with a "create group" and an "update group" tab.
function GroupModal({ show, onHide, groups, onCreate, onUpdate }) {
  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('create-update-group')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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