import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

export default function LoadingBox() {
  return (
    <div>
      <Spinner animation="grow" size="sm" as="span" className="slow" />{' '}
      <Spinner animation="grow" size="sm" as="span" />{' '}
      <Spinner animation="grow" size="sm" as="span" className="fast">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
