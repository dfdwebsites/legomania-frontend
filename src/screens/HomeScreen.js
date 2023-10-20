import React, { useEffect, useReducer, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import LoadingBox from '../components/LoadingBox';
import ProdcutCard from '../components/ProdcutCard';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/esm/Button';
import CanvasBG from '../components/CanvasBG';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import data from '../data.js'
import { toast } from 'react-toastify';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export default function HomeScreen() {
  const [{ loading, products, error }, dispatch] = useReducer(reducer, {
    products: data.products,
    loading: false,
    error: ''
  });
  const [serverIsLoading, setServerIsLoading] = useState(true)

  const [activeProduct, setActiveProduct] = useState(0);
  const rightRef = useRef();
  const leftRef = useRef();
  useEffect(() => {
    const fetchdata = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/products`
        ).then(result => {
          toast.success('Server woke app');
          setServerIsLoading(false)
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchdata();
  }, []);

  const getLatestProducts = (num) => {
    let latestProducts = products.sort((a, b) => {
      let da = new Date(a.createdAt),
        db = new Date(b.createdAt);
      return db - da;
    });

    return latestProducts.slice(0, num + 1);
  };

  const getFeaturedProducts = () => {
    let featuredProducts = products.filter((x) => x.isFeatured);
    return featuredProducts;
  };

  return (
    <div>
      <div>
        <Helmet>
          <title>LegoMania</title>
        </Helmet>
        {loading ? (
          <LoadingBox />
        ) : (
          <>
            {error && <p>{error}</p>}
            <div className="hero pt-5 px-5">
              {serverIsLoading && <div style={{position:"absolute",right: "10%",
    color: "white",
    fontSize: "25px"}}>As the server is still loading on the background the data are a sample </div>}
              <Container>
                <Row className="justify-content-between">
                  {/* <Col xs={2} sm={2} md={2}>
                    <Card
                      className="card-small"
                      style={{ cursor: 'pointer' }}
                      onClick={() => leftRef.current.click()}
                    >
                      <Card.Img
                        className="mb-3 img-large"
                        src={
                          products[
                            activeProduct - 1 < 0
                              ? products.length - 1
                              : activeProduct - 1
                          ].image
                        }
                        alt={
                          products[
                            activeProduct - 1 < 0
                              ? products.length - 1
                              : activeProduct - 1
                          ].name
                        }
                      />
                      <Card.Title className="text-center hero-small-card-title">
                        {' '}
                        {
                          products[
                            activeProduct - 1 < 0
                              ? products.length - 1
                              : activeProduct - 1
                          ].name
                        }{' '}
                      </Card.Title>
                    </Card>
                  </Col> */}
                  <Col
                    className="p-0"
                    style={{ maxWidth: '500px', marginLeft: '1rem' }}
                  >
                    <div style={{ color: 'white' }}>
                      <Link to={`/product/${products[activeProduct].slug}`}>
                        <img
                          style={{
                            borderRadius: '50%',
                            aspectRatio: '1/1',
                            objectFit: 'cover',
                            transition: '.25s'
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.borderRadius = 0)
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.borderRadius = '50%')
                          }
                          className="mb-3 img-large"
                          src={products[activeProduct].image}
                          alt={products[activeProduct].name}
                        />
                      </Link>
                      <h2 className="mb-3"> {products[activeProduct].name} </h2>{' '}
                      <p>{products[activeProduct].description}</p>
                      <div className="mb-3">
                        {' '}
                        <Link
                          className="hero-link"
                          to={`/product/${products[activeProduct].slug}`}
                        >
                          See more...
                        </Link>
                      </div>
                    </div>
                  </Col>

                  {/* <Col style={{ maxWidth: '230px' }}>
                    <Card
                      className="card-small"
                      style={{ cursor: 'pointer', backdropFilter: 'blur(1px)' }}
                      onClick={() => rightRef.current.click()}
                    >
                      <Card.Img
                        className="mb-3 img-large"
                        src={
                          products[
                            activeProduct + 1 > products.length - 1
                              ? 0
                              : activeProduct + 1
                          ].image
                        }
                        alt={
                          products[
                            activeProduct + 1 > products.length - 1
                              ? 0
                              : activeProduct + 1
                          ].name
                        }
                      />

                      <Card.Title className="text-center hero-small-card-title">
                        {' '}
                        {
                          products[
                            activeProduct + 1 > products.length - 1
                              ? 0
                              : activeProduct + 1
                          ].name
                        }{' '}
                      </Card.Title>
                    </Card>
                  </Col> */}
                </Row>
                <Row className="mt-4">
                  <Col>
                    <Button
                      ref={leftRef}
                      onClick={() =>
                        setActiveProduct((prev) => {
                          let newProduct = prev - 1;
                          if (newProduct < 0) {
                            newProduct = products.length - 1;
                          }
                          return newProduct;
                        })
                      }
                    >
                      <i className="fas fa-chevron-left"></i> Prev{' '}
                      <img
                        style={{ width: '50px' }}
                        src={
                          products[
                            activeProduct - 1 < 0
                              ? products.length - 1
                              : activeProduct - 1
                          ].image
                        }
                        alt={
                          products[
                            activeProduct - 1 < 0
                              ? products.length - 1
                              : activeProduct - 1
                          ].name
                        }
                      />
                    </Button>
                  </Col>

                  <Col className="d-flex justify-content-end">
                    <Button
                      ref={rightRef}
                      onClick={() =>
                        setActiveProduct((prev) => {
                          let newProduct = prev + 1;
                          if (newProduct > products.length - 1) {
                            newProduct = 0;
                          }
                          return newProduct;
                        })
                      }
                    >
                      <img
                        style={{ width: '50px' }}
                        src={
                          products[
                            activeProduct + 1 > products.length - 1
                              ? 0
                              : activeProduct + 1
                          ].image
                        }
                        alt={
                          products[
                            activeProduct + 1 > products.length - 1
                              ? 0
                              : activeProduct + 1
                          ].name
                        }
                      />{' '}
                      Next <i className="fas fa-chevron-right"></i>
                    </Button>
                  </Col>
                </Row>

                {/* <Button
                  onClick={() =>
                    setActiveProduct((prev) => {
                      let newProduct = prev - 1;
                      if (newProduct < 0) {
                        newProduct = products.length - 1;
                      }
                      return newProduct;
                    })
                  }
                >
                  <i className="fas fa-chevron-left"></i>
                </Button>
                <Button
                  onClick={() =>
                    setActiveProduct((prev) => {
                      let newProduct = prev + 1;
                      if (newProduct > products.length - 1) {
                        newProduct = 0;
                      }
                      return newProduct;
                    })
                  }
                >
                  <i className="fas fa-chevron-right"></i>
                </Button> */}
              </Container>
            </div>
            <section className="latest">
              <CanvasBG />
              <Container>
                <Row className="latest-container">
                  <h2 className="mb-4">Latest Products</h2>
                  {getLatestProducts(2).map((product) => (
                    <Col
                      key={product.slug}
                      sm={6}
                      md={4}
                      ls={3}
                      className="mb-5"
                    >
                      <ProdcutCard product={product} />
                    </Col>
                  ))}
                </Row>
              </Container>
            </section>
            <section className="featured">
              <Container>
                <Row className="featured-container">
                  <h2 className="mb-4">Featured Products</h2>
                  {getFeaturedProducts().map((product) => (
                    <Col
                      key={product.slug}
                      sm={6}
                      md={4}
                      ls={3}
                      className="mb-5"
                    >
                      <ProdcutCard product={product} />
                    </Col>
                  ))}
                </Row>
              </Container>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
