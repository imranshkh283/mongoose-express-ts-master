import React from "react";
import { withRouter } from "react-router-dom";
import { ACCESS_TOKEN_NAME } from "../../constants/apiContants";
function Header(props) {
    const capitalize = (s) => {
        if (typeof s !== "string") return "";
        return s.charAt(0).toUpperCase() + s.slice(1);
    };
    let title = capitalize(
        props.location.pathname.substring(1, props.location.pathname.length)
    );
    if (props.location.pathname === "/") {
        title = "Welcome";
    }
    function renderLogout() {
        if (props.location.pathname === "/home") {
            return (
                <div className="ml-auto">
                    <button className="btn btn-danger" onClick={() => handleLogout()}>
                        Logout
                    </button>
                </div>
            );
        }
    }

    function renderMenuBar() {
        const validPath = ["/home", "/profile"];
        if (validPath.includes(props.location.pathname)) {
            return (
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <a className="nav-link" href="/home">Home <span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/profile">Profile</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            );
        }
    }
    function handleLogout() {
        localStorage.removeItem(ACCESS_TOKEN_NAME);
        props.history.push("/login");
    }
    return (
        <nav className="navbar navbar-dark bg-primary">
            <div className="row col-12 d-flex justify-content-center text-white">
                {/* <span className="h3">{props.title || title}</span> */}
                {renderMenuBar()}
                {renderLogout()}
            </div>
        </nav>
    );
}
export default withRouter(Header);
