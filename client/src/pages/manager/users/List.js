import LoadingContent from "components/LoadingContent";
import PageWrapper from "components/PageWrapper";
import { useEffect, useState } from "react";
import { deleteUser, getUsers } from "services/api";
import CustomTable from "components/CustomTable";
import { Link } from "react-router-dom";
import PrimaryBtn from "components/PrimaryBtn";
import cleanQuery from "aux/clean-query";
import numArr from "aux/num-arr";
import Pagination from "components/Pagination";

const UsersTable = ({ data, onDelete }) => {
  const fields = [
    {
      title: 'ID',
      content: row => row.id
    },
    {
      title: 'Username',
      content: row => row.username
    },
    {
      title: 'Role',
      content: row => row.role.name
    },
    {
      title: 'Actions',
      content: row => (
        <div className="flex gap-4">
          <Link to={`/users/${row.id}`} className="text-sky-600">View</Link>
          <button className="text-red-600" onClick={async () => {

            const shouldProceed = window.confirm(`Are you sure you want to delete user ${row.id} - ${row.username}?`);
            if(!shouldProceed) return;

            await deleteUser(row.id);
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
  const [ loading, setLoading ] = useState(true);
  const [ usersData, setUsersData ] = useState({
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
      const usersRes = await getUsers(cleanQuery(query));
      setUsersData(usersRes);
      setLoading(false);
    })();
  }, [query]);

  const totalPages = Math.ceil(usersData.count / query.limit);

  return (
    <PageWrapper title="Users">

      <div className="flex gap-4 justify-end mb-4">
        <Link to="add">
          <PrimaryBtn>Add New</PrimaryBtn>
        </Link>
      </div>

      { loading ? <LoadingContent /> :
        <>
          <UsersTable data={usersData.rows} onDelete={async () => {
            setLoading(true);
            const usersRes = await getUsers(cleanQuery(query));
            setUsersData(usersRes);
            setLoading(false);
          }} />

          <Pagination pages={totalPages} onPageChange={page => setQuery({ ...query, page })} />
        </>
      }
    </PageWrapper>
  );
}
