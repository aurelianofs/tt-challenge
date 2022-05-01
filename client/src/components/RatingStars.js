import numArr from 'aux/num-arr';
import { useState } from 'react';
import './RatingStars.css';


const RatingStars = ({ max = 5, value = 0, onSelect }) => {
  const [ rate, setRate ] = useState(value);

  return (
    <div className="rating-stars">
      {numArr(5).map(n => (
        <button
          key={n}
          className={"rating-stars__item" + (rate >= n ? " active" : "")}
          onClick={() => {
            setRate(n);
            onSelect(n);
          }}
        >
          &#9733;
        </button>
      ))}
    </div>
  )
};

export default RatingStars;
