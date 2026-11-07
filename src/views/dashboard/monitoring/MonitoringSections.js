import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { CATEGORIES, RECORD_FIELDS, USAGE_GROUPS } from './monitoringConfig';

const { Accordion, Col, Row, Tab, Tabs } = ReactBootstrap;

const isEmpty = (value) => !value || (Array.isArray(value) ? value.length === 0 : Object.keys(value).length === 0);

const fieldName = (field) => (typeof field === 'string' ? field : field.name);

const formatValue = (field, value) => {
  if (value === undefined || value === null) {
    return '';
  }
  return field.json || typeof value === 'object' ? JSON.stringify(value) : value;
};

function Title({ children }) {
  return (
    <Row>
      <Col xs={12} className="text-left">
        <h3>{children}</h3>
      </Col>
    </Row>
  );
}

function NoData() {
  const { t } = useTranslation();
  return (
    <Row>
      <Col xs={12} md={6} className="text-left text-normal">
        {t('no-data-available')}
      </Col>
    </Row>
  );
}

// Two-column "name | value" grid for one record.
function FieldGrid({ record, fields }) {
  return (
    <Row>
      {fields.map((field) => {
        const name = fieldName(field);
        return [
          <Col key={`${name}-label`} xs={12} md={6} className="text-left">
            {name}
          </Col>,
          <Col key={`${name}-value`} xs={12} md={6} className={field.wrap ? 'text-left text-path-break' : 'text-left'}>
            {formatValue(field, record?.[name])}
          </Col>,
        ];
      })}
    </Row>
  );
}

// Collapsible list of records, titled by `idField`.
function RecordList({ records, fields, idField }) {
  if (isEmpty(records)) {
    return <NoData />;
  }
  return (
    <Accordion>
      {records.map((record, index) => (
        <Accordion.Item key={record[idField] ?? index} eventKey={String(record[idField] ?? index)}>
          <Accordion.Header>{record[idField]}</Accordion.Header>
          <Accordion.Body>
            <FieldGrid record={record} fields={fields} />
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

function Sockets({ sockets }) {
  const { t } = useTranslation();
  return ['active', 'closed'].map((state) => (
    <div key={state}>
      <Title>{t(`${state}-websockets`)}</Title>
      <FieldGrid record={sockets} fields={[{ name: `${state}_websockets`, json: true }]} />
    </div>
  ));
}

function Objects({ objects }) {
  return USAGE_GROUPS.map((group) => (
    <div key={group}>
      <Title>{group}</Title>
      {isEmpty(objects) ? <NoData /> : <FieldGrid record={objects[group]} fields={RECORD_FIELDS.usage} />}
    </div>
  ));
}

function Limits({ limits }) {
  const empty = isEmpty(limits);
  return (
    <>
      <Title>fallback</Title>
      {empty ? <NoData /> : <FieldGrid record={limits.fallback} fields={RECORD_FIELDS.limit} />}
      <Title>limits</Title>
      {empty || isEmpty(limits.limits) ? (
        <NoData />
      ) : (
        limits.limits.map((limit, index) => (
          <FieldGrid key={limit.id_owner ?? index} record={limit} fields={RECORD_FIELDS.limit} />
        ))
      )}
      <Title>syslimit</Title>
      {empty ? <NoData /> : <FieldGrid record={limits.syslimit} fields={RECORD_FIELDS.limit} />}
    </>
  );
}

// Body of one category, without its title.
export function CategoryContent({ category, data }) {
  const value = data[category];
  switch (category) {
    case 'tasks':
      return <RecordList records={value} fields={RECORD_FIELDS.tasks} idField="id_task" />;
    case 'files':
      return <RecordList records={value} fields={RECORD_FIELDS.files} idField="id" />;
    case 'apps':
      return <RecordList records={value} fields={RECORD_FIELDS.apps} idField="id" />;
    case 'sockets':
      return <Sockets sockets={value} />;
    case 'hosts':
      return <FieldGrid record={value} fields={RECORD_FIELDS.hosts} />;
    case 'objects':
      return <Objects objects={value} />;
    case 'utilization':
      return <FieldGrid record={value} fields={RECORD_FIELDS.utilization} />;
    case 'limits':
      return <Limits limits={value} />;
    default:
      return null;
  }
}

export function MonitoringCounts({ data }) {
  const { t } = useTranslation();
  const counts = [
    ['count-total', data.tasks.length + data.files.length + data.apps.length],
    ['count-tasks', data.tasks.length],
    ['count-files', data.files.length],
    ['count-apps', data.apps.length],
  ];
  return (
    <Row>
      {counts.map(([label, count]) => (
        <Col key={label} xs={12} md={4} lg={3} className="text-center">
          {`${t(label)} ${count}`}
        </Col>
      ))}
    </Row>
  );
}

// "Complete" tab with every category stacked, followed by one tab per category.
export function MonitoringTabs({ data, id }) {
  const { t } = useTranslation();
  return (
    <Tabs defaultActiveKey="complete" id={id}>
      <Tab eventKey="complete" title={t('complete-monitoring')}>
        {CATEGORIES.map(({ key, title }) => (
          <section key={key}>
            <Title>{t(title)}</Title>
            <CategoryContent category={key} data={data} />
          </section>
        ))}
      </Tab>
      {CATEGORIES.map(({ key, title }) => (
        <Tab key={key} eventKey={key} title={t(title)}>
          <CategoryContent category={key} data={data} />
        </Tab>
      ))}
    </Tabs>
  );
}
