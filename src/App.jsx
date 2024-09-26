import React, { useEffect, useState, Suspense, lazy } from "react";
import { Users } from "./users";
import "./App.css";

function App() {
  //let us grab the total number of page
  // because we want to know how many pages to iterate over
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [componentToLoad, setComponentToLoad] = useState(null);

  useEffect(() => {
    setUsers(Users);
  }, []);

  const handleLoadComponent = (component) => {
    setComponentToLoad(component);
  };

  const totalNumOfUsers = users.length;
  //we want decide on how many items we want to show per page
  //with that figure out how many pages we get
  const totalNumOfPages = Math.ceil(totalNumOfUsers / 20);
  //need ot iterage over totalNumOfPages and use that to display at the bottom
  const pages = [...Array(totalNumOfPages)];

  //show the currentItems on currentPage
  //let us now render the first 20 items since y defautl we want to show 20 items
  //we can use slice
  const currentPageLastItemNumber = 20 * currentPage; // 20 -> 40 -> 60
  const currentPageFirstItemNumber = currentPageLastItemNumber - 20; //1 -> 21 -> 41
  const showUsersOnCurrentPage = users.slice(
    currentPageFirstItemNumber,
    currentPageLastItemNumber
  );

  //use functional updates
  function handlePreviousPage() {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  }

  function handleNextPage() {
    setCurrentPage((prevPage) =>
      prevPage < totalNumOfPages ? prevPage + 1 : prevPage
    );
  }

  // Dynamically import components based on user selection
  const loadComponent = (component) => {
    switch (component) {
      case "Chart":
        return lazy(() => import("./Chart"));
      case "Form":
        return lazy(() => import("./Form"));
      case "Gallery":
        return lazy(() => import("./Gallery"));
      default:
        return null;
    }
  };

  const LoadedComponent = loadComponent(componentToLoad);
  return (
    <div>
      <button onClick={() => handleLoadComponent("Chart")}>Load Chart</button>
      <button onClick={() => handleLoadComponent("Form")}>Load Form</button>
      <button onClick={() => handleLoadComponent("Gallery")}>
        Load Gallery
      </button>
      {/* Use Suspense to show a fallback while loading */}
      {LoadedComponent && (
        <Suspense fallback={<div>Loading component...</div>}>
          <LoadedComponent />
        </Suspense>
      )}

      {showUsersOnCurrentPage.map((user, index) => (
        <div key={user.id}>{user.id + " : " + user.first_name}</div>
      ))}
      <div className="pageControls">
        <span onClick={handlePreviousPage} style={{ cursor: "pointer" }}>
          Prev
        </span>
        <p className="pagesDiv">
          {pages.map((page, index) => (
            <span
              key={index}
              className="page"
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </span>
          ))}
        </p>
        <span onClick={handleNextPage} style={{ cursor: "pointer" }}>
          Next
        </span>
      </div>
    </div>
  );
}
export default App;
