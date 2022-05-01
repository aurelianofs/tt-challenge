const PrimaryBtn = (props) => {
  props = {
    ...props,
    className: props.className + " rounded-md bg-sky-600 text-white px-4 py-2 leading-5"
  };

  return (
    <button { ...props } />
  );
};

export default PrimaryBtn;
