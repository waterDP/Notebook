import React from "react";
import routes from "./routes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./assets/styles/base.css";

const App = () => {
  return (
    <>
      {/* <ul className="sidemenu">
            <BrowserRouter>
                {routes.map(x => <li key={x.path}><Link to={x.path}>{x.name || x.path}</Link></li>)}
            </BrowserRouter>
        </ul> */}
      <div className="container">
        <BrowserRouter>
          <Routes>
            {routes.map(({ path, element: Element }) => (
              <Route path={path} key={path} element={<Element />} />
            ))}
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
};

export default App;
