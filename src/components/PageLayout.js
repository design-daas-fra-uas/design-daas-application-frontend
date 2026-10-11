import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Header from './header';

// Header + container + centered page title shared by the admin views.
// `wrapTitle` keeps the extra <div> some pages need for their CSS margins.
function PageLayout({ id, title, wrapTitle = false, children }) {
  const heading = <h2>{title}</h2>;

  return (
    <>
      <Header />
      <Container id={id}>
        <Row>
          <Col xs={12} className="text-center">
            {wrapTitle ? <div>{heading}</div> : heading}
          </Col>
        </Row>
        {children}
      </Container>
    </>
  );
}

export default PageLayout;