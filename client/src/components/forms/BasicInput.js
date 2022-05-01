const BasicInput = (props) => {
  props = {
    ...props,
    className:  (props.className ? props.className : '') + " rounded-md border px-3 py-1 w-full"
  };

  return (
    <input { ...props } />
  );
};

export default BasicInput;
