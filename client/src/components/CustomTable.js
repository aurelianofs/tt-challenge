const CustomTable = ({ fields, data }) => {
  return (
    <>
      <table className="w-full">
        <thead className="border-b">
          <tr>
            {fields.map(({ title }, i) => (
              <th key={i} className="text-left px-2 py-3">
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((row, i) => (
            <tr key={i}>
              {fields.map(({ content }, j) => (
                <td key={i+'-'+j} className="px-2 py-3">
                  {content(row, data, j)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default CustomTable;
