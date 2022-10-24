import React, { useState } from "react";
import Input from "../components/Input";
import axios from "../apis";
import { UserContext } from "../contexts/User";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setToken } = useContext(UserContext);

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return alert("Invalid Data");
    }

    axios
      .post(`/users/login`, {
        email: email,
        password: password,
      })
      .then(function (res) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      })

      .catch((err) => {
        console.log(err);
        setError(err.response.data.message);
      });
  };
  return (
    <div className="bg-color vh p-3">
      <div className="container user-form">
        <h2 className="text-header">Login Here</h2>
        {error && <p className="text-center text-danger">{error}</p>}
        <form onSubmit={onFormSubmit}>
          <Input
            placeholder="Enter username or email"
            name="email"
            type="text"
            value={email}
            handleChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            placeholder="Password"
            name="amount"
            type="password"
            value={password}
            handleChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            style={{ backgroundColor: "salmon" }}
            type="submit"
            className=" w-28 bg-green-900  mt-2 text-white font-bold p-2 rounded-full cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
