import React from 'react';

const WattbikeModel = (props) => {
  
  const model = serialToModel(props.value);

  return (
    <>
      {model}
    </>
  );
};

function serialToModel(serial) {
    let model = '';
    const atomRegex = /^(26)[a-zA-Z0-9]{6}/i;
    const ptRegex = /^(25)[a-zA-Z0-9]{6}/i;

    if(atomRegex.test(serial)){
        model = 'Atom';
    }else if(ptRegex.test(serial)){
        model = 'Pro/Trainer';
    }else{
        model = 'Unknown';
    }
    return model;
}
export default WattbikeModel;

