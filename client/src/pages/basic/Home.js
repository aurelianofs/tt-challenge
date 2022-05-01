import numArr from "aux/num-arr";
import BasicSelect from "components/forms/BasicSelect";
import PageWrapper from "components/PageWrapper";
import RatingStars from "components/RatingStars";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBikes, getBikesColors, getBikesModels, getLocations, rateBike } from "services/api";

const PastDisabledInput = (props) => (<input type="date" min={new Date().toISOString().split('T')[0]} {...props} />);

const BikesGrid = ({ bikes, onRate }) => (
  <div className={"grid grid-cols-3 gap-4"}>
    { bikes.map(bike => (
      <div key={bike.id} className={ "rounded-md border py-4 px-5" + (bike.available ? ' transition hover:shadow-md' : ' opacity-50') }>
        <p>Model: <strong>{bike.model}</strong></p>
        <p>Color: <strong>{bike.color}</strong></p>
        <p>Location: <strong>{bike.location.name}</strong></p>
        <p>Avg. Rating: <strong>{bike.rating.toFixed(1)}</strong></p>

        <RatingStars value={bike.ratings[0]?.rate} onSelect={async rate => {
          await rateBike(bike.id, rate);
          onRate();
        }} />

        <div>
          { bike.available ?
            <Link to={`/reserve/${bike.id}`} className="text-sky-600">Reserve bike</Link> :
            <p>Bike unavailable</p>
          }
        </div>
      </div>
    ))}
  </div>
);

export default function Home() {
  const [ bikesData, setBikesData ] = useState({});

  const [ availableModels, setAvailableModels ] = useState([]);
  const [ availableColors, setAvailableColors ] = useState([]);
  const [ availableLocations, setAvailableLocations ] = useState([]);

  const [ query, setQuery ] = useState({
    color: '',
    model: '',
    location: 0,
    rating: 0,
    dateFrom: '',
    dateTo: '',
    page: 1,
    limit: 6,
    withUserRating: true,
  });

  useEffect(() => {
    (async () => {
      const promises = [
        getBikesModels(),
        getBikesColors(),
        getLocations(),
      ];

      const [ modelsRes, colorsRes, locationsRes ] = await Promise.all(promises);

      setAvailableModels(modelsRes);
      setAvailableColors(colorsRes);
      setAvailableLocations(locationsRes.rows);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const cleanQuery = {};

      for (const key in query) {
        if(!!query[key]) cleanQuery[key] = query[key];
      }

      const bikesRes = await getBikes(cleanQuery);
      setBikesData(bikesRes);
    })();
  }, [query]);

  const totalPages = Math.ceil(bikesData.count / query.limit);

  return (
    <PageWrapper title="Welcome">
      <div className="flex gap-4 mb-4 items-end text-sm">

        <BasicSelect value={query.model} onChange={e => setQuery({ ...query, page: 1, model: e.target.value })}>
          <option value="">Any Model</option>
          {availableModels.map((value, i) => (
            <option key={i}>{value}</option>
          ))}
        </BasicSelect>

        <BasicSelect value={query.color} onChange={e => setQuery({ ...query, page: 1, color: e.target.value })}>
          <option value="">Any Color</option>
          {availableColors.map((value, i) => (
            <option key={i}>{value}</option>
          ))}
        </BasicSelect>

        <BasicSelect value={query.location} onChange={e => setQuery({ ...query, page: 1, location: Number(e.target.value) })}>
          <option value={0}>Any Location</option>
          {availableLocations.map((location, i) => (
            <option key={i} value={location.id}>{location.name}</option>
          ))}
        </BasicSelect>

        <BasicSelect value={query.rating} onChange={e => setQuery({ ...query, page: 1, rating: Number(e.target.value) })}>
          <option value={0}>Any Rating</option>
          <option value={2}>2+</option>
          <option value={3}>3+</option>
          <option value={4}>4+</option>
        </BasicSelect>

        <div className="flex items-end">
          <div>
            From:
            <PastDisabledInput
              value={query.dateFrom}
              onChange={e => setQuery({ ...query, page: 1, dateFrom: e.target.value }) }
              className="block border-y border-l h-9 px-2 rounded-l-md"
            />
          </div>
          <div>
            To:
            <PastDisabledInput
              value={query.dateTo}
              onChange={e => setQuery({ ...query, page: 1, dateTo: e.target.value }) }
              className="block border-y h-9 px-2"
            />
          </div>
          <button
            onClick={e => setQuery({ ...query, page: 1, dateFrom: '', dateTo: '' }) }
            className="w-9 bg-sky-600 text-white h-9 font-bold rounded-r-md"
          >x</button>
        </div>
      </div>

      { bikesData.rows?.length ?
        <>
          <BikesGrid bikes={bikesData.rows} onRate={() => { setQuery({ ...query });}}/>
          { totalPages > 1 ?
            <div className="flex gap-4 mt-4 justify-center">
              {numArr(totalPages).map(i => (
                <button onClick={() => setQuery({ ...query, page: i })} key={i} className="text-sky-600">{i}</button>
              ))}
            </div>
          : null }
        </>
      :
        <p>No results match your query. Try broadening the search criteria.</p>
      }
    </PageWrapper>
  );
}
