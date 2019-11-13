import React from 'react';

const PesFormat = (props) => {
  
  const pes = coefficientToPes(props.value);

  return (
    <>
      {pes}
    </>
  );
};

function coefficientToPes(coefficient) {
  let pes = coefficient * 100;
  pes = pes.toFixed(0);
  return pes;
}
// pesCombinedCoefficient
export default PesFormat;

