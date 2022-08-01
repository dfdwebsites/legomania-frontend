import React, { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';

export default function PaymentScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod }
  } = state;
  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };
  return (
    <Container className="small-container">
      <Helmet>
        <title>Paymnent Method</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3 />
      <h1 className="my-3 text-center">Paymnent Method</h1>
      <Form onSubmit={submitHandler}>
        <div className="mb-3">
          <Form.Check
            type="radio"
            id="PayPal"
            label="PayPal"
            value="PayPal"
            checked={paymentMethodName === 'PayPal'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Form.Check
            type="radio"
            id="Stripe"
            label="Stripe"
            value="Stripe"
            checked={paymentMethodName === 'Stripe'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </div>
        <div>
          <Button type="submit"> Continue</Button>
        </div>
      </Form>
    </Container>
  );
}
