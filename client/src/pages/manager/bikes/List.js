import LoadingContent from "components/LoadingContent";
import PageWrapper from "components/PageWrapper";
import { useEffect, useState } from "react";
import CustomTable from "components/CustomTable";
import { Link } from "react-router-dom";
import PrimaryBtn from "components/PrimaryBtn";
import { deleteBike, getBikes } from "services/api";
import numArr from "aux/num-arr";
import cleanQuery from "aux/clean-query";

const BikesTable = ({ data, onDelete }) => {
  const fields = [
    {
      title: 'ID',
      content: row => row.id
    },
    {
      title: 'Model',
      content: row => row.model
    },
    {
      title: 'Color',
      content: row => row.color
    },
    {
      title: 'Location',
      content: row => row.location.name
    },
    {
      title: 'Rating',
      content: row => row.rating
    },
    {
      title: 'Available',
      content: row => (row.available ? 'Yes' : 'No')
    },
    {
      title: 'Actions',
      content: row => (
        <div className="flex gap-4">
          <Link to={`/bikes/${row.id}`} className="text-sky-600">View</Link>
          <button className="text-red-600" onClick={async () => {

            const shouldProceed = window.confirm(`Are you sure you want to delete bike ${row.id} - ${row.model}?`);
            if(!shouldProceed) return;

            await deleteBike(row.id);
            onDelete();
          }}>
            Delete
          </button>
        </div>
      )
    },
  ];

  return (
    <CustomTable fields={fields} data={data} />
  );
}

export default function List() {
  const [ loading, setLoading ] = useState(false);
  const [ bikesData, setBikesData ] = useState({
    count: 0,
    rows: [],
  });

  const [ query, setQuery ] = useState({
    color: '',
    model: '',
    location: 0,
    rating: 0,
    dateFrom: '',
    dateTo: '',
    page: 1,
    limit: 10, // This is fixed for now
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const bikesRes = await getBikes(cleanQuery(query));
      setBikesData(bikesRes);
      setLoading(false);
    })();
  }, [query]);

  const totalPages = Math.ceil(bikesData.count / query.limit);

  return (
    <PageWrapper title="Bikes">

      <div className="flex gap-4 justify-end mb-4">
        <Link to="add">
          <PrimaryBtn>Add New</PrimaryBtn>
        </Link>
      </div>

      { loading ? <LoadingContent /> :
        <>
          <BikesTable data={bikesData.rows} onDelete={async () => {
            setLoading(true);
            const bikesRes = await getBikes(cleanQuery(query));
            setBikesData(bikesRes);
            setLoading(false);
          }} />

          { totalPages > 1 ?
            <div className="flex gap-4 mt-4 justify-center">
              {numArr(totalPages).map(i => (
                <button onClick={() => setQuery({ ...query, page: i })} key={i} className="text-sky-600">{i}</button>
              ))}
            </div>
          : null }
        </>
      }
    </PageWrapper>
  );
}
