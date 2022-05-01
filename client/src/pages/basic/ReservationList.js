import LoadingContent from "components/LoadingContent";
import PageWrapper from "components/PageWrapper";
import { useEffect, useState } from "react";
import { deleteReservation, getReservations } from "services/api";
import CustomTable from "components/CustomTable";
import Pagination from "components/Pagination";
import { format } from 'date-fns';

const ReservationsTable = ({ data, onDelete }) => {
  const fields = [
    {
      title: 'ID',
      content: row => row.id
    },
    {
      title: 'Bike',
      content: row => row.bike.id
    },
    {
      title: 'Model',
      content: row => row.bike.model
    },
    {
      title: 'From',
      content: row => format(new Date(row.dateFrom), 'MM/dd/yyyy')
    },
    {
      title: 'To',
      content: row => format(new Date(row.dateTo), 'MM/dd/yyyy')
    },
    {
      title: 'Actions',
      content: row => {
        const formattedStartDate = format(new Date(row.dateFrom), 'LLLL do');
        return (
          <div className="flex gap-4">
            <button className="text-red-600" onClick={async () => {
              const shouldProceed = window.confirm(`Are you sure you want to cancer your reservation of a ${row.bike.model} for the ${formattedStartDate}?`);
              if(!shouldProceed) return;

              await deleteReservation(row.id);
              onDelete();
            }}>
              Cancel
            </button>
          </div>
        );
      }
    },
  ]

  return (<CustomTable data={data} fields={fields} />)
}

export default function ReservationList() {
  const [ loading, setLoading ] = useState(false);
  const [ reservationsData, setReservationsData ] = useState({
    count: 0,
    rows: [],
  });

  const [ query, setQuery ] = useState({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getReservations(query);
      setReservationsData(res);
      setLoading(false);
    })();
  }, [query]);

  const totalPages = Math.ceil(reservationsData.count / query.limit);

  return (
    <PageWrapper title="My Reservations">
      { loading ? <LoadingContent /> :
        <>
          <ReservationsTable data={reservationsData.rows} onDelete={async () => {
            setLoading(true);
            const res = await getReservations();
            setReservationsData(res);
            setLoading(false);
          }} />

          <Pagination pages={totalPages} onPageChange={page => setQuery({ ...query, page })} />
        </>
      }
    </PageWrapper>
  );
}
