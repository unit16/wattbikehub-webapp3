import React from 'react';

const DistanceFormat = (props) => {
  
  const kilometers = metersToKilometers(props.value);

  return (
    <>
      {kilometers}
    </>
  );
};

function metersToKilometers(meters) {
  let metersToKilometers = meters / 1000;
  metersToKilometers = metersToKilometers.toFixed(2);
  return metersToKilometers;
}

export default DistanceFormat;

