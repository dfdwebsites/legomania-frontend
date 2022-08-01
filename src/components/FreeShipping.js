import React from 'react';
import MessageBox from './MessageBox';

export default function FreeShipping(props) {
  const { total } = props;
  const freeShipping = 50;
  const persentage =
    (total / freeShipping) * 100 > 100 ? 100 : (total / freeShipping) * 100;

  const progressContainer = {
    backgroundColor: '#006DB7',
    width: '100%',
    borderRadius: '10px',
    height: '10px',
    display: 'flex'
  };
  const progress = {
    backgroundColor: '#FFCF00',
    width: `${persentage}%`,
    borderBottomLeftRadius: '10px',
    borderTopLeftRadius: '10px',
    height: '10px'
  };
  return (
    <>
      {freeShipping <= total ? (
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ color: 'green' }}
        >
          Congratulations you qualify for FREE shipping
          <i className="fas fa-check"></i>
        </div>
      ) : (
        <MessageBox>
          <p className="text-center">
            Spend {freeShipping - total}$ more to get FREE delivery
          </p>
          <div className="d-flex align-items-center">
            <span className="me-1">$0</span>
            <div style={progressContainer}>
              <span style={progress}></span>
            </div>
            <span className="ms-1">$50</span>
          </div>
        </MessageBox>
      )}
    </>
  );
  //   props.Types: {
  //       total: Number
  //   }
}
