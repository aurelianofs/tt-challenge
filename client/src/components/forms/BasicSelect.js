const BasicSelect = (props) => {
  props = {
    ...props,
    className: (props.className ? props.className : '') + " rounded-md border px-3 py-1 h-9 w-full"
  };

  return (
    <select { ...props } />
  );
};

export default BasicSelect;
