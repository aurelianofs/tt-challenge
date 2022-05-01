import CustomTable from "components/CustomTable";
import BasicInput from "components/forms/BasicInput";
import BasicSelect from "components/forms/BasicSelect";
import Field from "components/forms/Field";
import PageWrapper from "components/PageWrapper";
import PrimaryBtn from "components/PrimaryBtn";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getRoles, getUser, updateUser, createUser } from "services/api";
import { format } from 'date-fns';

const ReservationsTable = ({ data }) => {
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
  ]

  return (<CustomTable data={data} fields={fields} />)
}

export default function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ updatePassword, setUpdatePassword ] = useState(!id);
  const [ roles, setRoles ] = useState([]);
  const [ user, setUser ] = useState({
    username: '',
    password: '',
    roleId: 1,
    reservations: [],
  });


  useEffect(() => {
    (async () => {
      const promises = [getRoles()];

      if(id) promises.push(getUser(id));

      const result = await Promise.all(promises);

      setRoles(result[0]);
      if(id) {
        const userRes = result[1];
        setUser(userRes);
      }
    })()
  }, []);

  const handleChange = prop => e => {
    setUser({
      ...user,
      [prop]: e.target.value
    })
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const userToPost = {
      username: user.username,
      password: user.password,
      roleId: user.roleId,
    };

    if(updatePassword && user.password) userToPost.password = user.password;

    let res;
    if(id) {
      res = await updateUser(id, userToPost);
    } else {
      res = await createUser(userToPost);
    }

    if(res.name === "AxiosError") return alert(res.response?.data?.message);

    return navigate("/users");
  };

  return (
    <PageWrapper title={ id ? `User ${id} - ${user.username}` : 'Add new user'}>
      <div className="flex gap-20">
        <form onSubmit={handleSubmit} className="w-72">
          <div>
            <Field label="Username:">
              <BasicInput type="text" name="username" value={user.username} onChange={handleChange('username')} required/>
            </Field>

            <Field label="Role:">
              <BasicSelect value={user.roleId} onChange={handleChange('roleId')} required>
                {roles.map((role, i) => (
                  <option value={role.id} key={i}>{role.name}</option>
                ))}
              </BasicSelect>
            </Field>

            { id ?
            <label className="block my-4">
              <input type="checkbox" checked={updatePassword} onChange={e => {
                setUpdatePassword(e.target.checked);
              }} /> Do you want to update the password?
            </label>
            : null }

            { updatePassword ?
              <Field label="Password:">
                <BasicInput type="text" name="password" value={user.password} onChange={handleChange('password')} required/>
              </Field>
            : null }
          </div>

          <div className="flex gap-4 items-center">
            <PrimaryBtn>{ id ? 'Update' : 'Submit' }</PrimaryBtn>
            <Link to="/users" className="text-sky-600 inline-block">Go back</Link>
          </div>
        </form>

        { id ?
        <div className="grow">
          <h2 className="text-xl mb-4">Reservations</h2>
          {
            user.reservations?.length ?
            <div>
              <ReservationsTable data={user.reservations} />
            </div>
            :
            <p>This user doesn't have any bike reservations</p>
          }
        </div>
        : null }
      </div>
    </PageWrapper>
  );
}
