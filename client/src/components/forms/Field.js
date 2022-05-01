const Field = ({ label, children }) => (
  <label className="block my-4">
    { label ? <p className="mb-2">{label}</p> : null }
    { children }
  </label>
);

export default Field;
