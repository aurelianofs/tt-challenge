const BasicCheckbox = (props) => {
  props = {
    ...props,
    className:  (props.className ? props.className : '') + " mr-2"
  };

  return (
    <input type="checkbox" { ...props } />
  );
};

export default BasicCheckbox;
