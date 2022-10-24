import React from "react";
import { ConnectButton } from "@web3uikit/web3";
import { UserContext } from "../contexts/User.js";
import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useChain, useMoralis } from "react-moralis";
import { FaCircle } from "react-icons/fa";

const OWNER = "0x28Fb7188c696BE99983Fa7bE8f974670EBB6b800";

function Navbar() {
  const { user, token, setUser, setToken } = useContext(UserContext);
  const navigate = useNavigate();
  const { chain } = useChain();
  const { account } = useMoralis();

  const isAdmin = account && account.toLowerCase() === OWNER.toLowerCase();

  return (
    <nav
      style={{ fontSize: "0.9em" }}
      className="navbar navbar-expand-lg navbar-light bg-light sticky-top"
    >
      <Link to={"/"} className="navbar-brand">
        CryptEduPay
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {chain && (
              <li
                className="nav-item"
                style={{
                  backgroundColor: "#eee",
                  padding: "0px 10px",
                  borderRadius: "10px",
                }}
              >
                <FaCircle color="#43edbd" enableBackground={true} />
                <span
                  className="navbar-text"
                  style={{ color: "black", paddingLeft: "10px" }}
                >
                  {chain.name}
                </span>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {token || user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/payment">
                    Payment
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/buy">
                    Buy Crypto
                  </Link>
                </li>
                {isAdmin ? (
                  <li className="nav-item">
                    <Link
                      className="nav-link "
                      to={`/user/admin/${user && user.username}`}
                    >
                      Add Record
                    </Link>
                  </li>
                ) : null}
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to={`/user/${user && user.username}`}
                  >
                    {user && user.username.substring(0, 6)}...
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to={"/"}
                    onClick={() => {
                      localStorage.clear();
                      setToken(null);
                      setUser(null);
                      navigate("/");
                    }}
                  >
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">
                    About Us
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
          <span className="navbar-text">
            <ConnectButton moralisAuth={false} />
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
