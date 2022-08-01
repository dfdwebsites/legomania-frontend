import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function Footer() {
  return (
    <footer className="p-4" style={{ backgroundColor: 'red' }}>
      <Row
        className="mb-3"
        style={{ maxWidth: '1200px', marginInline: 'auto' }}
      >
        <Col className="d-flex align-items-center">
          <img src="/images/logo.jpg" alt="logo" />
        </Col>
        <Col className="d-flex flex-column align-items-end ">
          <p
            className="mb-2 pe-3"
            style={{ color: 'white', fontWeight: 'bold' }}
          >
            FOLLOW US
          </p>
          <div className="d-flex">
            <button
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                fontSize: '1.2rem'
              }}
            >
              <i className="fab fa-facebook-square"></i>
            </button>
            <button
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                fontSize: '1.2rem'
              }}
            >
              <i className="fab fa-instagram-square"></i>
            </button>
            <button
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                fontSize: '1.2rem'
              }}
            >
              <i className="fab fa-youtube-square"></i>
            </button>
            <button
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                fontSize: '1.2rem'
              }}
            >
              <i className="fab fa-twitter-square"></i>
            </button>
          </div>
        </Col>
      </Row>

      <div
        style={{ color: 'white' }}
        className="d-flex justify-content-center align-items-center"
      >
        LEGO® is a trademark of the LEGO Group. Legomania.com is neither owned,
        endorsed, nor operated by the LEGO Group.
      </div>
    </footer>
  );
}
