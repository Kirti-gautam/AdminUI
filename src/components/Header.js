export default function Header({
  handleSearch,
  handleMultipleDelete,
  selectedArr,
}) {
  return (
    <>
      <div className="header">
        <input
          className="search-bar"
          type="search"
          placeholder="Search by name, email or role"
          onChange={(e) => handleSearch(e.target.value)}
        />
        {selectedArr.length > 0 && (
          <div className="" onClick={handleMultipleDelete}>
            <button type="button" className="delete-btn">
              Deleted Selected Rows
            </button>
          </div>
        )}
      </div>
    </>
  );
}
