import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const isEmpty = (data) =>
  data === undefined ||
  data === null ||
  data === '' ||
  (Array.isArray(data) && data.length === 0) ||
  (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0);

const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

// One record as "key: value" rows; nested records and lists are shown the same way.
function RecordView({ record }) {
  return (
    <div className="result-record">
      {Object.entries(record).map(([key, value]) => (
        <Row key={key}>
          <Col xs={12} md={6}>
            {key}:
          </Col>
          <Col xs={12} md={6} className="image-list-object">
            {value !== null && typeof value === 'object' ? <ResultView data={value} /> : String(value ?? '')}
          </Col>
        </Row>
      ))}
    </div>
  );
}

// Shows a DaaS response: a record, a list of records, or plain text (e.g. a log).
function ResultView({ data }) {
  const { t } = useTranslation();

  if (isEmpty(data)) {
    return <p>{t('no-data-available')}</p>;
  }
  if (Array.isArray(data)) {
    return data.every(isRecord) ? (
      // Records are replaced as a whole and never reordered, so the index is a stable fallback key.
      // eslint-disable-next-line @eslint-react/no-array-index-key
      data.map((record, index) => <RecordView key={record.id ?? record.daas_id ?? index} record={record} />)
    ) : (
      <pre>{JSON.stringify(data, null, 3)}</pre>
    );
  }
  if (isRecord(data)) {
    return <RecordView record={data} />;
  }
  return <pre className="result-text">{String(data)}</pre>;
}

export default ResultView;
