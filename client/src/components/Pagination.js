import numArr from "aux/num-arr";

const Pagination = ({pages, onPageChange}) => ( pages > 1 ?
  <div className="flex gap-4 mt-4 justify-center">
    {numArr(pages).map(i => (
      <button onClick={() => onPageChange(i)} key={i} className="text-sky-600">{i}</button>
    ))}
  </div>
: null );

export default Pagination;
