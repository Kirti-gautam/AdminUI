import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import Header from "./Header";
const itemsPerPage = 10;

export default function Homepage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [personName, setPersonName] = useState(null);
  const [personEmail, setPersonEmail] = useState(null);
  const [personRole, setPersonRole] = useState(null);
  //pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  //checkbox
  const [selectedArr, setSelectedArr] = useState([]);
  const [isMainCheckboxSelected, setIsMainCheckboxSelected] = useState({});

  const renderData = React.useMemo(() => {
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, startIndex, endIndex]);

  const handleCheckBox = (id) => {
    const selectedInd = selectedArr.indexOf(id);
    let newSelectedArr = [];
    if (selectedInd === -1) {
      newSelectedArr = newSelectedArr.concat(selectedArr, id); //concat() returns a new arr
      //selectedArr.push(id); by doing this our state variables changed but page didn't rerender(wrong way)
    } else if (selectedInd === 0) {
      newSelectedArr = newSelectedArr.concat(selectedArr.slice(1));
      //selectedArr.shift(); can;t perform this in state variable
    } else if (selectedInd === selectedArr.length - 1) {
      newSelectedArr = newSelectedArr.concat(selectedArr.slice(0, -1));
    } else {
      newSelectedArr = newSelectedArr.concat(
        selectedArr.slice(0, selectedInd),
        selectedArr.slice(selectedInd + 1)
      );
    }
    setSelectedArr(newSelectedArr);
    handleAfter(newSelectedArr);
  };

  const handleSearch = (search) => {
    if (search.length === 0) {
      setFilteredData(data);
    } else {
      const value = search;
      const filteredArr = data.filter(
        (person) =>
          person.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
          person.email.includes(value) ||
          person.role.includes(value)
      );
      setFilteredData(filteredArr);
      setPageIndex(0);
    }
  };

  const handleDelete = (id) => {
    const arr = data.filter((person) => person.id != id);
    setData(arr);
  };

  const handleToggle = (person) => {
    setIsEdit({
      mode: true,
      id: person.id,
    });
    setPersonName(person.name);
    setPersonRole(person.role);
    setPersonEmail(person.email);
  };

  const handleCancel = (person) => {
    setPersonName(person.name);
    setPersonEmail(person.email);
    setPersonRole(person.role);
    setIsEdit({});
  };

  const handleSave = (id) => {
    const resultArr = data.map((person) => {
      if (person.id === id) {
        return {
          ...person,
          name: personName,
          role: personRole,
          email: personEmail,
        };
      }
      return person;
    });
    setData(resultArr);
    setIsEdit({});
  };

  const handleIndex = (index) => {
    setPageIndex(index - 1);
  };

  function ButtonType({ person }) {
    if (isEdit.mode && isEdit.id === person.id) {
      return (
        <div className="btn">
          <button onClick={() => handleSave(person.id)}>✔</button>
          <button className="delete-btn" onClick={() => handleCancel(person)}>
            ❌
          </button>
        </div>
      );
    }
    return <button onClick={() => handleToggle(person)}>Edit</button>;
  }

  useEffect(() => {
    setIsLoading(true);
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Something went wrong");
      })
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const totalCount = React.useMemo(() => {
    return filteredData.length;
  }, [filteredData]);

  useEffect(() => {
    const start = pageIndex * itemsPerPage;
    setStartIndex(start);
    const end = pageIndex * itemsPerPage + itemsPerPage;
    if (end > totalCount) setEndIndex(totalCount);
    else setEndIndex(end);
  }, [pageIndex, totalCount]);

  const noOfPages = React.useMemo(() => {
    const len = filteredData.length;
    let pageCount = 0;
    if (len) {
      pageCount = Math.ceil(len / itemsPerPage);
    }
    return pageCount;
  }, [filteredData]);

  const handleAfter = (newArr) => {
    let flag = true;
    const arr = filteredData?.slice(startIndex, endIndex);
    for (let i = 0; i < endIndex - startIndex; i++) {
      if (newArr.indexOf(arr[i].id) === -1) {
        setIsMainCheckboxSelected((previous) => ({
          ...previous,
          [pageIndex]: false,
        }));
        flag = false;
        return;
      }
    }
    if (flag) {
      setIsMainCheckboxSelected((previous) => ({
        ...previous,
        [pageIndex]: true,
      }));
    }
  };
  const handleMultipleDelete = () => {
    const newArr = data.filter(
      (person) => selectedArr.indexOf(person.id) === -1
    );
    setIsMainCheckboxSelected((previous) => ({
      ...previous,
      [pageIndex]: false,
    }));
    setData(newArr);
  };

  const handleMainCheckbox = () => {
    if (isMainCheckboxSelected[pageIndex]) {
      setIsMainCheckboxSelected((previous) => ({
        ...previous,
        [pageIndex]: false,
      }));
      const temparr = [];
      for (let i = 0; i < endIndex - startIndex; i++) {
        if (selectedArr.indexOf(renderData[i].id) === -1) {
          temparr.push(selectedArr[i]);
        }
      }
      setSelectedArr(temparr);
    } else {
      setIsMainCheckboxSelected((previous) => ({
        ...previous,
        [pageIndex]: true,
      }));
      const temparr = [];
      let newSelectedArr = [];
      for (let i = 0; i < endIndex - startIndex; i++) {
        temparr.push(renderData[i].id);
      }
      newSelectedArr = newSelectedArr.concat(selectedArr, temparr);
      setSelectedArr(newSelectedArr);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (renderData.length == 0) return <h1>No data found!</h1>;

  return (
    <div className="container">
      <Header
        handleMultipleDelete={handleMultipleDelete}
        handleSearch={handleSearch}
        selectedArr={selectedArr}
      />
      <div>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={() => handleMainCheckbox()}
                  checked={
                    Object.keys(isMainCheckboxSelected).indexOf(
                      String(pageIndex)
                    ) !== -1 && isMainCheckboxSelected[pageIndex]
                      ? true
                      : false
                  }
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderData.map((person) => (
              <tr key={person.id}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckBox(person.id)}
                    checked={
                      selectedArr && selectedArr.indexOf(person.id) !== -1
                        ? true
                        : false
                    }
                  />
                </td>
                <td>
                  {isEdit.mode && isEdit.id === person.id ? (
                    <input
                      type="text"
                      value={personName}
                      onChange={(e) => setPersonName(e.target.value)}
                    />
                  ) : (
                    person.name
                  )}
                </td>
                <td>
                  {" "}
                  {isEdit.mode && isEdit.id === person.id ? (
                    <input
                      type="text"
                      value={personEmail}
                      onChange={(e) => setPersonEmail(e.target.value)}
                    />
                  ) : (
                    person.email
                  )}
                </td>
                <td>
                  {" "}
                  {isEdit.mode && isEdit.id === person.id ? (
                    <input
                      type="text"
                      value={personRole}
                      onChange={(e) => setPersonRole(e.target.value)}
                    />
                  ) : (
                    person.role
                  )}
                </td>
                <td className="action">
                  <ButtonType person={person} />
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(person.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <Pagination
          setPageIndex={setPageIndex}
          pageIndex={pageIndex}
          noOfPages={noOfPages}
          handleIndex={handleIndex}
        />
      </div>
    </div>
  );
}
