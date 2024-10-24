import { useContext } from "react";
import styled from "styled-components";
import MovieContext from "../context/MovieContext";
import { Navigate } from "react-router-dom";

function Login() {
  let { user, loginUser } = useContext(MovieContext);

  return (
    <Container>
      <Form onSubmit={loginUser}>
        <UserInput type="text" name="username" placeholder="Enter username" />
        <UserInput type="text" name="password" placeholder="Enter password" />
        <Submit type="submit" />
        {user && <Navigate to="/" />}
      </Form>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  height: calc(100vh - 220px);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 280px;
  width: 100%;
  gap: 30px;
`;
const UserInput = styled.input`
  height: 30px;
  font-size: 15px;
  padding-inline: 5px;
  border-radius: 3px;
  &:enabled {
    outline: none;
    border: none;
  }
`;
const Submit = styled.input`
  margin-top: -10px;
  padding-block: 8px;
  background-color: rgb(153, 195, 255);
  border-radius: 5px;
`;
