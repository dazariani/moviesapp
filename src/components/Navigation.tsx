import { useContext } from "react";
import MovieContext from "../context/MovieContext";
import styled from "styled-components";
import { Link } from "react-router-dom";

function Navigation() {
  let { user, logoutUser } = useContext(MovieContext);

  return (
    <Container>
      <Link to="/">Home</Link>
      {user && <Link to="/myMovies">My Movies</Link>}
      <Link to="/about">About Us</Link>
      {!user ? (
        <Link to="/login">Sign In</Link>
      ) : (
        <Logout onClick={logoutUser}>Log Out</Logout>
      )}
      {!user && <Link to="/signup">Sign up</Link>}
    </Container>
  );
}

export default Navigation;

const Container = styled.div`
  display: flex;
  gap: 25px;
  color: rgb(167, 186, 196);

  & > a {
    text-decoration: none;
    color: unset;
  }
`;
const Logout = styled.span`
  cursor: pointer;
`;
