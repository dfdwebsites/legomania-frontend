import React, { useRef } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

export default function CartConfirm(props) {
  const cartConfirmRef = useRef();
  const { product } = props;
  const navigate = useNavigate();
  return (
    <div
      ref={cartConfirmRef}
      id="cart-confirm-container"
      className="d-flex justify-content-center align-items-center cart-confirm-container"
    >
      <div className="confirm-card d-flex flex-column">
        <div className="mb-2  d-flex">
          <div>
            {' '}
            <i
              className="fas fa-check-circle"
              style={{ color: 'green', fontSize: '1.5rem' }}
            ></i>
          </div>
          <div className="ms-2">
            <div>Item succesfully added to cart</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button className="close-btn" onClick={() => props.closeDiv()}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div className="mb-2 d-flex">
          <div
            className="align-items-center d-flex"
            style={{ flex: '1 0 100px' }}
          >
            <img src={product.image} alt={product.name} />
          </div>
          <div
            className="p-0 d-flex flex-column ms-2"
            style={{ flex: '3 1 400px' }}
          >
            <div className="mb-2">{product.name}</div>
            <div className="mb-2">
              <strong>${product.price}</strong>
            </div>
            <div className="mb-2">Qty:{product.quantity}</div>
          </div>
        </div>
        <div className="d-flex">
          <div className="d-flex justify-content-center w-100">
            {' '}
            <Button
              style={{ width: '80%', fontSize: '.75rem' }}
              onClick={() => props.closeDiv()}
            >
              {' '}
              Continiue Shopping
            </Button>
          </div>
          <div className="d-flex justify-content-center w-100">
            {' '}
            <Button
              style={{ width: '80%', fontSize: '.75rem' }}
              onClick={() => navigate('/cart')}
            >
              View My Bag
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
