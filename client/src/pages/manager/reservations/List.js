import LoadingContent from "components/LoadingContent";
import PageWrapper from "components/PageWrapper";
import { useEffect, useState } from "react";
import { deleteUser, getUsers } from "services/api";
import CustomTable from "components/CustomTable";
import { Link } from "react-router-dom";
import PrimaryBtn from "components/PrimaryBtn";

const UsersTable = ({ users, onDelete }) => {
  const fields = [
    {
      title: 'ID',
      content: user => user.id
    },
    {
      title: 'Username',
      content: user => user.username
    },
    {
      title: 'Role',
      content: user => user.role.name
    },
    {
      title: 'Actions',
      content: user => (
        <div className="flex gap-4">
          <Link to={`/users/${user.id}`} className="text-sky-600">Edit</Link>
          <button className="text-red-600" onClick={async () => {
            await deleteUser(user.id);
            onDelete();
          }}>
            Delete
          </button>
        </div>
      )
    },
  ];

  return (
    <CustomTable fields={fields} data={users} />
  );
}

export default function List() {
  const [ loading, setLoading ] = useState(true);
  const [ users, setUsers ] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getUsers();
      setUsers(res);
      setLoading(false);
    })()
  }, []);

  return (
    <PageWrapper title="Users">

      <div className="flex gap-4 justify-end mb-4">
        <Link to="add">
          <PrimaryBtn>Add New</PrimaryBtn>
        </Link>
      </div>

      { loading ? <LoadingContent /> :
        <UsersTable users={users} onDelete={async () => {
          const res = await getUsers();
          setUsers(res);
        }} />
      }
    </PageWrapper>
  );
}
