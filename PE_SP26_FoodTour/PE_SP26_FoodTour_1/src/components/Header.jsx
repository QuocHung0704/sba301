import { Row, Col } from 'react-bootstrap';


function Header() {
  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(
    today.getMonth() + 1
  ).padStart(2, '0')}/${today.getFullYear()}`;

  return (
    <Row className="border-bottom mx-0 mb-0">
      <Col
        xs="auto"
        className="border-end fw-bold d-flex align-items-center px-3 py-2"
        style={{ minWidth: '80px' }}
      >
        Logo
      </Col>
      <Col className="text-end py-1 px-3 small">
        Date: {formattedDate}
      </Col>
    </Row>
  );
}

export default Header;
