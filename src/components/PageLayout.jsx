import { Container } from 'react-bootstrap';

import Header from './header';
import PageHeader from './PageHeader';

// Navbar + container + page header (Back button, title, actions) shared by the admin views.
function PageLayout({ id, title, backTo, actions, children }) {
  return (
    <>
      <Header />
      <Container id={id} className="page">
        <PageHeader title={title} backTo={backTo} actions={actions} />
        {children}
      </Container>
    </>
  );
}

export default PageLayout;
