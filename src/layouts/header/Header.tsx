import "./Header.css";
import { Outlet, Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <div className="headere">
        <div className="image-section">
          <img
            src={"./assets/images/logo1.png"}
            alt="Company Logo"
            className="logo"
          />
          <span className="text-white fw-bolder">Urban Clap</span>
        </div>
        <div className="link-div">
          <nav>
            <ul className="link-div">
              <li className="mt-2">
                <Link
                  className="link-offset-2 link-underline link-underline-opacity-0 text-white"
                  to="/signin"
                >
                  Signin
                </Link>
              </li>
              <li className="mt-2">
                <Link
                  className="link-offset-2 link-underline link-underline-opacity-0 text-white"
                  to="/signup"
                >
                  Signup
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <Outlet />
    </>
  );
};
export default Header;
