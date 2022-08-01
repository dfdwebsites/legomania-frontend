import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

export default function SearchBox() {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');

  const searchRef = useRef();

  // const [inputStyle, setInputStyle] = useState({
  //   borderRadius: '50px 0px 0px 50px',
  //   background: 'var(--white-clr)',
  //   borderLeft: '2px solid var(--accent-clr)',
  //   borderTop: '2px solid var(--accent-clr)',
  //   borderBottom: '2px solid var(--accent-clr)',
  //   borderRight: 'none',
  //   WebkitBoxShadow:
  //     'inset 1px 1px 0px 1px rgba(0, 0, 0, 0.75), inset 0px -2px 0px 0px rgba(0, 0, 0, 0.75)',

  //   MozBoxShadow:
  //     'inset 1px 1px 0px 1px rgba(0, 0, 0, 0.75), inset 0px -2px 0px 0px rgba(0, 0, 0, 0.75)',

  //   boxShadow:
  //     'inset 1px 1px 0px 1px rgba(0, 0, 0, 0.75), inset 0px -2px 0px 0px rgba(0, 0, 0, 0.75)',

  //   color: 'var(--dark-clr)'
  // });

  // const changeColor = (value) => {
  //   setInputStyle({
  //     ...inputStyle,
  //     borderRadius: '50px 0px 0px 50px',
  //     background: 'var(--white-clr)',
  //     borderTop: value
  //       ? '2px solid var(--dark-clr)'
  //       : '2px solid var(--accent-clr)',
  //     borderLeft: value
  //       ? '2px solid var(--dark-clr)'
  //       : '2px solid var(--accent-clr)',
  //     borderBottom: value
  //       ? '2px solid var(--dark-clr)'
  //       : '2px solid var(--accent-clr)',
  //     WebkitBoxShadow: value
  //       ? 'none'
  //       : 'inset 1px 1px 0px 1px rgba(0, 0, 0, 0.75), inset 0px -2px 0px 0px rgba(0, 0, 0, 0.75)',

  //     MozBoxShadow: value
  //       ? 'none'
  //       : 'inset 1px 1px 0px 1px rgba(0, 0, 0, 0.75), inset 0px -2px 0px 0px rgba(0, 0, 0, 0.75)',

  //     boxShadow: value
  //       ? 'none'
  //       : 'inset 1px 1px 0px 1px rgba(0, 0, 0, 0.75), inset 0px -2px 0px 0px rgba(0, 0, 0, 0.75)',

  //     color: 'var(--dark-clr)'
  //   });
  // };

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };
  return (
    <Form
      className="d-flex"
      style={{ margin: '0 auto' }}
      onSubmit={submitHandler}
    >
      <InputGroup>
        <FormControl
          ref={searchRef}
          className="nav-input-search lego-border"
          type="text"
          name="q"
          id="q"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search products..."
          aria-label="Search Products"
          aria-describedby="button-search"
        ></FormControl>
        <Button
          variant="outline-primary"
          className="button-search lego-border"
          type="submit"
          id="button-search"
          onMouseEnter={() => {
            searchRef.current.classList.add('button-hovered');
          }}
          onMouseLeave={() => {
            searchRef.current.classList.remove('button-hovered');
          }}
        >
          <i className="fas fa-search"></i>
        </Button>
      </InputGroup>
    </Form>
  );
}
