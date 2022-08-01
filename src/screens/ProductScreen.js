import axios from 'axios';
import React, {
  Suspense,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Rating from '../components/Rating';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import { Link } from 'react-router-dom';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { toast } from 'react-toastify';
import { Canvas } from '@react-three/fiber';
import LoaderTHREE from '../components/LoaderTHREE';
import Model from '../components/TestCubes';
import { Environment, OrbitControls } from '@react-three/drei';
import Container from 'react-bootstrap/Container';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REVIEW_REQUEST':
      return { ...state, loadingCreatingReview: true };
    case 'CREATE_REVIEW_SUCCESS':
      return { ...state, loadingCreatingReview: false };
    case 'CREATE_REVIEW_FAIL':
      return { ...state, loadingCreatingReview: false };
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    default:
      return state;
  }
};

export default function ProductScreen() {
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [three, setThree] = useState(false);
  const [haveCreatedReview, setHaveCreatedReview] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const [{ loading, error, product, loadingCreatingReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: ''
    });

  useEffect(() => {
    const featchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        setSelectedImage(result.data.image);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    featchData();
  }, [slug]);

  useEffect(() => {
    if (userInfo && product && product.reviews && product.reviews.length > 0) {
      const userReview = product.reviews.find(
        (review) => review.name === userInfo.name
      );
      if (userReview) {
        setHaveCreatedReview(true);
      }
    }
  }, [userInfo, product]);

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry, Product is Unavalable at the moment');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity }
    });
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    try {
      dispatch({ type: 'CREATE_REVIEW_REQUEST' });
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        {
          rating,
          comment,
          name: userInfo.name
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` }
        }
      );

      dispatch({ type: 'CREATE_REVIEW_SUCCESS' });
      toast.success('Review submitted successfully');
      product.reviews.unshift(data.review);
      product.numReviews = data.rating;
      dispatch({ type: 'REFRESH_PRODUCT', payload: product });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop
      });
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'CREATE_REVIEW_FAIL' });
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox varient="danger">{error}</MessageBox>
  ) : (
    <Container className="mt-4">
      <Row>
        <Col md={9} style={{ position: 'relative' }}>
          <button
            className="setting-three d-flex justify-content-center align-items-center"
            disabled={three}
            style={{ display: three ? 'none' : 'block' }}
            onClick={() => setThree(!three)}
          >
            3D
          </button>
          {three ? (
            <Canvas style={{ minHeight: '500px' }}>
              <Suspense fallback={<LoaderTHREE />}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />

                <Model
                  url={`models/${slug.includes('sample') ? 'car' : slug}.mpd`}
                />

                <OrbitControls />
                <Environment preset="sunset" />
              </Suspense>
              {/* <TestCubes position={[1.2, 0, 0]} /> */}
            </Canvas>
          ) : (
            // <iframe
            //   src="/test.html"
            //   title="iframe test"
            //   style={{ width: '100%', height: '100%' }}
            // ></iframe>
            <>
              {/* <button id="create"> build </button> */}
              <img className="img-large" src={selectedImage} alt="testing" />
            </>
          )}
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                slug={product.slug}
                numReviews={product.numReviews}
              />
            </ListGroup.Item>
            <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              <Row xs={1} md={2} className="g-2">
                {[product.image, ...product.images].map((x) => (
                  <Col key={x}>
                    <Card>
                      <Button
                        className="thumbnail"
                        type="button"
                        variant="light"
                        onClick={() => {
                          setSelectedImage(x);
                          setThree(false);
                        }}
                      >
                        <Card.Img variant="top" src={x} alt="product" />
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </ListGroup.Item>

            <ListGroup.Item>
              Description :<p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price :</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status :</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">Available</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button variant="primary" onClick={addToCartHandler}>
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <div className="my-3" id="reviews">
          <h2 ref={reviewsRef}>Reviews</h2>
          <div className="mb-3">
            {product.reviews.length === 0 && (
              <MessageBox>There is no review</MessageBox>
            )}
          </div>
          <ListGroup>
            {product.reviews.map((review) => (
              <ListGroup.Item key={review._id}>
                <strong>{review.name}</strong>
                <Rating rating={review.rating} caption=" "></Rating>
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className="mb-3">
            {userInfo ? (
              haveCreatedReview ? (
                <MessageBox>
                  {' '}
                  You have allready created a review for this product
                </MessageBox>
              ) : (
                <Form onSubmit={submitHandler}>
                  <h2>Write a customer review</h2>
                  <Form.Group className="mb-3" controlId="rating">
                    <Form.Label>Rating</Form.Label>
                    <Form.Select
                      aria-label="Rating"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option value="1">1- Poor</option>
                      <option value="2">2- Fair</option>
                      <option value="3">3- Good</option>
                      <option value="4">4- Very good</option>
                      <option value="5">5- Exelent</option>
                    </Form.Select>
                  </Form.Group>
                  <FloatingLabel
                    controlId="floatingTextarea"
                    label="Comments"
                    className="mb-3"
                  >
                    <Form.Control
                      as="textarea"
                      placeholder="Leave a comment here"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </FloatingLabel>
                  <div className="mb-3">
                    <Button disabled={loadingCreatingReview} type="submit">
                      submit
                    </Button>
                  </div>
                  {loadingCreatingReview && <LoadingBox />}
                </Form>
              )
            ) : (
              <MessageBox>
                Please{' '}
                <Link to={`/signin?redirect=/product/${product.slug}`}>
                  Sign In
                </Link>{' '}
                to write a review
              </MessageBox>
            )}
          </div>
        </div>
      </Row>
    </Container>
  );
}
