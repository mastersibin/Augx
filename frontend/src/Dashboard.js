import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Upload from "./Upload";
import Library from "./Library";
import Favourites from "./Favourites";

function Dashboard() {
  const [values, setValues] = useState();
  const [tabValue, setTabValue] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:3333" + "/dashboard", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      // .then(res => console.log(res))
      .then((res) => setValues(JSON.stringify(res)))
      .catch(() => {
        navigate("/");
      });
  }, []);

  const onTabClick = (value) => {
    setTabValue(value);
  };

  const renderTabs = (tabValue) => {
    switch (tabValue) {
      case "library":
        return <Library></Library>;
      case "upload":
        return <Upload></Upload>;
      case "favourites":
        return <Favourites></Favourites>;
      default:
        return <Library></Library>;
    }
  };
  const logout = () => {
    fetch("http://localhost:3333" + "/logout", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    window.location.reload(false);
  };
  return (
    <div className="wrapper">
      <nav id="sidebar">
        <div className="sidebar-header">
          <h3>Galleria</h3>
        </div>

        <ul className="list-unstyled components">
          <li>
            <a href="#" onClick={() => onTabClick("library")}>
              Library
            </a>
          </li>
          <li>
            <a href="#" onClick={() => onTabClick("favourites")}>
              Favourites
            </a>
          </li>
          <li>
            <a href="#" onClick={() => onTabClick("upload")}>
              Upload Image
            </a>
          </li>
          <li>
            <a href="#" onClick={() => logout()}>
              Logout
            </a>
          </li>
        </ul>
      </nav>

      <div id="content">{renderTabs(tabValue)}</div>
    </div>
  );
}
export default Dashboard;
