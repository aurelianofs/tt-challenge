import BasicInput from "components/forms/BasicInput";
import BasicCheckbox from "components/forms/BasicCheckbox";
import Field from "components/forms/Field";
import PageWrapper from "components/PageWrapper";
import PrimaryBtn from "components/PrimaryBtn";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import TextSelect from 'react-select'
import { getBike, getLocations, updateBike, createBike } from "services/api";
import { format } from 'date-fns';
import CustomTable from "components/CustomTable";

const ReservationsTable = ({ data }) => {
  const fields = [
    {
      title: 'ID',
      content: row => row.id
    },
    {
      title: 'User ID',
      content: row => row.user.id
    },
    {
      title: 'Username',
      content: row => row.user.username
    },
    {
      title: 'From',
      content: row => format(new Date(row.dateFrom), 'MM/dd/yyyy')
    },
    {
      title: 'To',
      content: row => format(new Date(row.dateTo), 'MM/dd/yyyy')
    },
  ]

  return (<CustomTable data={data} fields={fields} />)
}

export default function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ searchLocation, setSearchLocation ] = useState('');
  const [ locations, setLocations ] = useState([]);
  const [ bike, setBike ] = useState({
    model: '',
    color: '',
    available: true,
    locationId: 0,
  });

  useEffect(() => {
    (async () => {
      const promises = [getLocations()];

      if(id) promises.push(getBike(id));

      const [ resLocations, resBike ] = await Promise.all(promises);

      setLocations(resLocations.rows);

      if(!resBike) return;
      setBike(resBike);
      const location = resLocations.find(l => l.id === resBike.locationId);
      setSearchLocation(location.name);
    })();
  }, []);

  const handleChange = prop => e => {
    setBike({
      ...bike,
      [prop]: e.target.value
    })
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const bikeToPost = {
      model: bike.model,
      color: bike.color,
      available: bike.available,
      locationId: bike.locationId,
    };

    let res;
    if(id) {
      res = await updateBike(id, bikeToPost);
    } else {
      res = await createBike(bikeToPost);
    }

    if(res.name === "AxiosError") return alert(res.response?.data?.message);

    return navigate("/bikes");
  };

  const locationValue = bike.locationId ? locations.find(l => l.id === bike.locationId) : null;
  const filteredSuggestions = locations.filter(location => location.name.includes(searchLocation));

  return (
    <PageWrapper title={ id ? `Bike ${id} - ${bike.model}` : 'Add new bike'}>
      <div className="flex gap-20">
        <form onSubmit={handleSubmit} className="w-72">
          <div>
            <Field label="Model:">
              <BasicInput type="text" name="model" value={bike.model} onChange={handleChange('model')} />
            </Field>

            <Field label="Color:">
              <BasicInput type="text" name="color" value={bike.color} onChange={handleChange('color')} />
            </Field>

            <Field label="Location:">
              <TextSelect
                value={locationValue ? { value: locationValue.id, label: locationValue.name } : null}
                options={filteredSuggestions.slice(0,6).map(l => ({ value: l.id, label: l.name }))}
                onInputChange={value => {
                  setSearchLocation(value)
                }}
                isClearable={true}
                onChange={option => {
                  setBike({
                    ...bike,
                    locationId: option ? option.value : 0
                  });
                }}
              />
            </Field>

            <Field>
              <BasicCheckbox checked={bike.available} onChange={e => {
                setBike({
                  ...bike,
                  available: e.target.checked
                })
              }} />
              Is this bike available?
            </Field>
          </div>

          <div className="flex gap-4 items-center">
            <PrimaryBtn>{ id ? 'Update' : 'Submit' }</PrimaryBtn>
            <Link to="/bikes" className="text-sky-600 inline-block">Go back</Link>
          </div>
        </form>

        { id ?
        <div className="grow">
          <h2 className="text-xl mb-4">Reservations</h2>
          {
            bike.reservations?.length ?
            <div>
              <ReservationsTable data={bike.reservations} />
            </div>
            :
            <p>This bike doesn't have any bike reservations</p>
          }
        </div>
        : null }
      </div>
    </PageWrapper>
  );
}
