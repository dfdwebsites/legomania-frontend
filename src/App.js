import { BrowserRouter, Route, Link, Routes } from 'react-router-dom';
import {
  Suspense,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductScreen from './screens/ProductScreen';
import HomeScreen from './screens/HomeScreen';

import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Footer from './components/Footer';
// import NavBar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
// import Button from 'react-bootstrap/Button';
import SearchBox from './components/SearchBox';
import CartScreen from './screens/CartScreen';
import axios from 'axios';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import { Store } from './Store';
import LoadingBox from './components/LoadingBox';
import ShippingScreen from './screens/ShippingScreen';
import Row from 'react-bootstrap/Row';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileScreen from './screens/ProfileScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import OrderDetailsScreen from './screens/OrderDetailsScreen';
import AdminRoute from './components/AdminRoute';
import DashboardScreen from './screens/DashboardScreen';
import ProductsListScreen from './screens/ProductsListScreen';
import OrdersListScreen from './screens/OrdersListScreen';
import UsersListScreen from './screens/UsersListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import SearchScreen from './screens/SearchScreen';
import TestScreen from './screens/TestScreen';
import MinifigureScreen from './screens/MinifigureScreen';

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loading: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loading: false };
    case 'UPDATE_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function App() {
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: ''
  });
  const avatarContainerRef = useRef(null);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const avatars = [
    '/images/avatar-1.png',
    '/images/avatar-2.png',
    '/images/avatar-3.png',
    '/images/avatar-4.png',
    '/images/avatar-5.png',
    '/images/avatar-6.png',
    '/images/avatar-7.png',
    '/images/avatar-8.png'
  ];

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, cart } = state;
  // const [userAvatar, setUserAvatar] = useState(userInfo.avatar || null);

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGN_OUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    window.location.href = '/signin';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        setCategories(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const setAvatarImg = async (avatarImg) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      const { data } = await axios.put(
        '/api/users/avatar',
        {
          email: userInfo.email,
          avatar: avatarImg
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` }
        }
      );
      avatarContainerRef.current.classList.remove('open');
      ctxDispatch({ type: 'USER_SIGN_IN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      dispatch({ type: 'UPDATE_SUCCESS' });
    } catch (err) {
      console.log(err);
      dispatch({ type: 'UPDATE_FAIL', payload: err });
    }
  };

  const openAvatars = () => {
    if (avatarContainerRef.current.classList.contains('open')) {
      avatarContainerRef.current.classList.remove('open');
    } else {
      avatarContainerRef.current.classList.add('open');
    }
  };

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container '
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <nav className="main-nav d-flex justify-content-between align-items-center w-100 px-3 pt-3">
            <div>
              {userInfo ? (
                <>
                  <div className="avatar-container">
                    <button
                      className="avatar-btn"
                      onClick={openAvatars}
                      style={{ backgroundImage: `url(${userInfo.avatar})` }}
                    ></button>
                    <div
                      ref={avatarContainerRef}
                      className="avatar-choise-container px-2"
                    >
                      {avatars.map((avatarImg) => (
                        <Col
                          key={avatarImg}
                          xs={12}
                          sm={6}
                          md={4}
                          className="d-flex justify-content-center"
                        >
                          <button onClick={() => setAvatarImg(avatarImg)}>
                            <img src={avatarImg} alt="lego head for avatar" />
                          </button>
                        </Col>
                      ))}
                      {loading && <LoadingBox />}
                    </div>
                  </div>
                  <NavDropdown
                    title={`${userInfo.name.slice(0, 9)}${
                      userInfo.name.length > 9 ? '...' : ''
                    }`}
                    className="dropMan"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Orders History</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      to="#singout"
                      className="dropdown-item"
                      onClick={signoutHandler}
                    >
                      {' '}
                      Sing Out
                    </Link>
                  </NavDropdown>
                </>
              ) : (
                <Link className="nav-links sign-in-link" to="/signin">
                  Sign In
                </Link>
              )}
            </div>
            <div className="d-flex flex-column justify-content-between align-items-center logo">
              <Link to="/">
                <img className="img-large" src="/images/logo.jpg" alt="logo" />
              </Link>
            </div>

            <div className="nav-icon d-flex flex-column align-items-center">
              <Link to="/cart">
                <img
                  src={
                    cart && cart.cartItems.length > 0
                      ? '/images/cart-full.png'
                      : '/images/cart.png'
                  }
                  alt="logo"
                />
                {cart.cartItems.length > 0 && (
                  <Badge pill bg="warning" className="badge-pill">
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </Badge>
                )}
              </Link>
              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title="Admin"
                  id="admin-nav-dropdown"
                  className="d-flex align-items-center dropMan"
                >
                  <LinkContainer to="/admin/dashboard">
                    <NavDropdown.Item>Dashboard</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/products">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orders">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/users">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </div>
          </nav>
          <div className="search-container d-flex justify-content-center align-items-center">
            <button
              style={{
                background: 'transparent',
                border: 'none'
              }}
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
            >
              <Row>
                {' '}
                <i
                  className={`${
                    sidebarIsOpen
                      ? 'fas fa-long-arrow-alt-left'
                      : 'fas fa-long-arrow-alt-right'
                  }`}
                ></i>
              </Row>
              <Row>
                {' '}
                <i
                  className={`${
                    sidebarIsOpen
                      ? 'fas fa-long-arrow-alt-left'
                      : 'fas fa-long-arrow-alt-right'
                  }`}
                ></i>
              </Row>
              <Row>
                {' '}
                <i
                  className={`${
                    sidebarIsOpen
                      ? 'fas fa-long-arrow-alt-left'
                      : 'fas fa-long-arrow-alt-right'
                  }`}
                ></i>
              </Row>
            </button>
            <SearchBox />
          </div>
        </header>
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : ' side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-4">
            <Nav.Item>
              <strong>Categories</strong>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  position: 'absolute',
                  top: '90px',
                  right: '0',
                  height: '50px'
                }}
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <Row>
                  {' '}
                  <i
                    className={`${
                      sidebarIsOpen
                        ? 'fas fa-long-arrow-alt-left'
                        : 'fas fa-long-arrow-alt-right'
                    }`}
                  ></i>
                </Row>
                <Row>
                  {' '}
                  <i
                    className={`${
                      sidebarIsOpen
                        ? 'fas fa-long-arrow-alt-left'
                        : 'fas fa-long-arrow-alt-right'
                    }`}
                  ></i>
                </Row>
                <Row>
                  {' '}
                  <i
                    className={`${
                      sidebarIsOpen
                        ? 'fas fa-long-arrow-alt-left'
                        : 'fas fa-long-arrow-alt-right'
                    }`}
                  ></i>
                </Row>
              </button>
            </Nav.Item>

            <Nav.Item>
              {categories.map((category) => (
                <LinkContainer
                  key={category}
                  to={`/search?category=${category}`}
                  // to="/whatever"
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link className="side-nav-item">{category}</Nav.Link>
                </LinkContainer>
              ))}
            </Nav.Item>
          </Nav>
        </div>
        <main>
          <Routes>
            <Route
              path="/product/create-your-own-minifigure"
              element={
                <Suspense fallback={<LoadingBox />}>
                  <MinifigureScreen />
                </Suspense>
              }
            />
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/test" element={<TestScreen />} />

            {/* user-only routes */}
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <OrderDetailsScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orderhistory"
              element={
                <ProtectedRoute>
                  <OrderHistoryScreen />
                </ProtectedRoute>
              }
            />
            {/* adminonly routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <DashboardScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <ProductsListScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/product/:id"
              element={
                <AdminRoute>
                  <ProductEditScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <OrdersListScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <UsersListScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/user/:id"
              element={
                <AdminRoute>
                  <UserEditScreen />
                </AdminRoute>
              }
            />

            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
