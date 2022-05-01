import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import PageWrapper from "components/PageWrapper";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DateRange } from 'react-date-range';
import { useEffect, useState } from 'react';
import PrimaryBtn from 'components/PrimaryBtn';
import { getBike, reserveBike } from 'services/api';
import { format } from 'date-fns';

const formatDate = date => format(date, 'yyyy-MM-dd');

const getDaysArray = function(start, end) {
  for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
      arr.push(new Date(dt));
  }
  return arr;
};

export default function Reserve() {
  const navigate = useNavigate();
  const { bikeId: id } = useParams()
  const [ bike, setBike ] = useState({});
  const [ selection, setSelection ] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  useEffect(() => {
    (async () => {
      const resBike = await getBike(id);
      setBike(resBike);
    })();
  }, [])

  const disabledDates = bike.reservations ? bike.reservations.map(reservation => getDaysArray(reservation.dateFrom, reservation.dateTo)).flat() : [];

  return (
    <PageWrapper title={`Reserve bike ${id}`}>
      <p>Model: <strong>{bike.model}</strong></p>
      <p>Color: <strong>{bike.color}</strong></p>
      <p>Location: <strong>{bike.location?.name}</strong></p>
      <p>Rating: <strong>{bike.rating?.toFixed(1)}</strong></p>

      <div className='my-4'>
        <DateRange
          staticRanges={[]}
          disabledDates={disabledDates}
          ranges={[selection]}
          minDate={new Date()}
          months={2}
          direction="horizontal"
          onChange={e => {
            setSelection(e.selection)
          }}
        />
      </div>

      <div className="flex gap-4 items-center">
        <PrimaryBtn onClick={() => {
          reserveBike(
            id,
            formatDate(selection.startDate),
            formatDate(selection.endDate)
          );
          navigate('/reservations');
        }}>Resesrve</PrimaryBtn>
        <Link to="/" className="text-sky-600 inline-block">Go back</Link>
      </div>
    </PageWrapper>
  );
}
