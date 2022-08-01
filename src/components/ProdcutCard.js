import React, { useContext, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import CartConfirm from './CartConfirm';
import { getOverlayDirection } from 'react-bootstrap/esm/helpers';

export default function ProdcutCard(props) {
  const [addtoCartclicked, setAddtoCartclicked] = useState(false);
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems }
  } = state;

  const closeDiv = () => {
    setAddtoCartclicked(false);
  };

  const addToCartHandler = (item) => {
    setAddtoCartclicked(true);
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

  const [match, setMatch] = useState({
    matches: window.matchMedia('(min-width: 1200px)').matches
  });

  useEffect(() => {
    const handler = (e) => setMatch({ matches: e.matches });
    window
      .matchMedia('(min-width: 1200px)')
      .addEventListener('change', handler);
  }, []);

  return (
    <>
      {addtoCartclicked && (
        <CartConfirm product={product} closeDiv={closeDiv} />
      )}
      <Card className="p-2">
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.image}
            alt={product.name}
            className="card-img-top"
          />
        </Link>
        <Card.Body>
          <Card.Title
            style={{
              lineHeight: `${
                product.name.length > 18 ? '1.2' : match.matches ? '1.2' : '2.4'
              }`
            }}
          >
            {product.name}
          </Card.Title>

          <Card.Text>{product.details}</Card.Text>
          <div className="d-flex justify-content-between mb-3">
            Price: ${product.price}{' '}
            <Link to={`/product/${product.slug}`}>Learn more..</Link>
          </div>
          <Button
            className="mt-3"
            variant="primary"
            onClick={() => addToCartHandler(product)}
          >
            Add to Cart
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}
