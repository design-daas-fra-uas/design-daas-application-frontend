import { Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

// "Back" link already wrapped in its grid column (for use inside a <Row>).
function BackLink({ to }) {
  const { t } = useTranslation();

  return (
    <Col xs={12}>
      <Link to={to} className="back-link">
        <i className="fa-solid fa-arrow-left" aria-hidden="true" />
        {t('back-link')}
      </Link>
    </Col>
  );
}

export default BackLink;
