import React, { useContext } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import { Store } from '../Store';
import MessageBox from '../components/MessageBox';
import FreeShipping from '../components/FreeShipping';
import Container from 'react-bootstrap/Container';

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    cart: { cartItems }
  } = state;

  const updateCartHandler = (item, quantity) => {
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

  const removeItem = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkOutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <Container>
      <Helmet>
        <title>My Bag</title>
      </Helmet>
      <h1 className="mb-5">
        My Bag ({cartItems.reduce((a, c) => c.quantity + a, 0)}){' '}
      </h1>
      {cartItems.length === 0 ? (
        <MessageBox> Your Cart Is Empty</MessageBox>
      ) : (
        <Row>
          <Col md={8}>
            {cartItems.map((item) => (
              <Row key={item._id} className="align-items-center mb-2">
                <Col xs={6} md={2}>
                  <Link to={`/product/${item.slug}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="img-thumbnail"
                    />
                  </Link>
                </Col>
                <Col xs={6} md={4}>
                  {item.name} <br />${item.price}
                </Col>
                <Col xs={6} md={4}>
                  <Button
                    onClick={() => updateCartHandler(item, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <i className="fas fa-minus"></i>
                  </Button>

                  <span className="mx-2">Qty: {item.quantity}</span>
                  <Button
                    onClick={() => updateCartHandler(item, item.quantity + 1)}
                    disabled={item.quantity >= item.countInStock}
                  >
                    <i className="fas fa-plus"></i>
                  </Button>
                </Col>
                <Col xs={6} md={2}>
                  <Button onClick={() => removeItem(item)}>
                    {' '}
                    <i className="fas fa-trash-alt"></i>
                  </Button>
                </Col>
              </Row>
            ))}
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    Total:{' '}
                    <strong>
                      ${cartItems.reduce((a, c) => c.quantity * c.price + a, 0)}
                    </strong>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <FreeShipping
                      total={cartItems.reduce(
                        (a, c) => c.quantity * c.price + a,
                        0
                      )}
                    />
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button
                      disabled={cartItems.length === 0}
                      type="button"
                      onClick={checkOutHandler}
                    >
                      Procces to Checkout
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}
