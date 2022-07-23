import { useEffect, useState } from "react";

export default function Pagination({
  setPageIndex,
  pageIndex,
  noOfPages,
  handleIndex,
}) {
  const [pageArr, setPageArr] = useState([]);

  useEffect(() => {
    const arr = Array.from({ length: noOfPages }, (_, i) => i + 1);
    setPageArr(arr);
  }, [noOfPages]);

  return (
    <div className="pagination">
      <div className="previous icon" onClick={() => setPageIndex(0)}>
        <svg
          width="9"
          height="9"
          viewBox="0 0 9 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.4 0.5H0V8.99H1.4V0.5ZM8.51932 8.04267L5.21932 4.74267L8.51932 1.44267L7.57665 0.5L3.33398 4.74267L7.57665 8.98533L8.51932 8.04267Z"
            fill="#333333"
          />
        </svg>
      </div>
      <div
        className="previous icon"
        onClick={() => {
          if (pageIndex !== 0) setPageIndex((pageIndex) => pageIndex - 1);
        }}
      >
        <svg
          width="6"
          height="10"
          viewBox="0 0 6 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.21871 5.00048L5.51871 8.30048L4.57604 9.24315L0.333374 5.00048L4.57604 0.757812L5.51871 1.70048L2.21871 5.00048Z"
            fill="#333333"
          />
        </svg>
      </div>
      <div>
        {pageArr.map((ind) => (
          <span className="page" onClick={() => handleIndex(ind)}>
            {ind}
          </span>
        ))}
      </div>

      <div
        className="next icon"
        onClick={() => {
          if (pageIndex !== noOfPages - 1)
            setPageIndex((pageIndex) => pageIndex + 1);
        }}
      >
        <svg
          width="6"
          height="10"
          viewBox="0 0 6 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.78145 5.00048L0.481445 1.70048L1.42411 0.757812L5.66678 5.00048L1.42411 9.24315L0.481445 8.30048L3.78145 5.00048Z"
            fill="#333333"
          />
        </svg>
      </div>
      <div className="next icon" onClick={() => setPageIndex(noOfPages - 1)}>
        <svg
          width="9"
          height="9"
          viewBox="0 0 9 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.6 0.5H9V8.99H7.6V0.5ZM0.480682 8.04267L3.78068 4.74267L0.480682 1.44267L1.42335 0.5L5.66602 4.74267L1.42335 8.98533L0.480682 8.04267Z"
            fill="#333333"
          />
        </svg>
      </div>
    </div>
  );
}
