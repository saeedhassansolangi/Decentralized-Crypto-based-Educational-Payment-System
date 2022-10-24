import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function onFormSubmit(e) {
    e.preventDefault();
    if (password.trim().length < 6 || password !== confirmPassword) {
      return setError("Password and confirm password must be same ");
    }

    if (!email.trim()) {
      return setError("email is not defined");
    }

    axios
      .post("http://localhost:5000/users/register", {
        email: email,
        username: username,
        studentId: studentId,
        password: password,
      })
      .then((res) => {
        if (res.data.token) {
          navigate("/login");
        }
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  }

  return (
    <div className="bg-color vh p-3">
      <div className="container user-form">
        <h2 className="text-header">Register</h2>
        {error && <p className="text-center text-danger">{error}</p>}
        <form onSubmit={onFormSubmit}>
          <Input
            placeholder="Email"
            name="email"
            type="email"
            value={email}
            handleChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <Input
            placeholder="username"
            name="username"
            type="username"
            value={username}
            handleChange={(e) => {
              setUsername(e.target.value);
            }}
          />

          <Input
            placeholder="studentId"
            name="studentId"
            type="studentId"
            value={studentId}
            handleChange={(e) => {
              setStudentId(e.target.value);
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

          <Input
            placeholder="Confirm Password"
            name="conirm-password"
            type="confirm-password"
            value={confirmPassword}
            handleChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />

          <button
            type="submit"
            className=" w-28 mt-2 border-2 p-2 border-[#3d4f7c] rounded-full cursor-pointer"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
