import { useContext } from "react";
import styled from "styled-components";
import logo from "../assets/logo.jpg";
import Navigation from "./Navigation";
import MovieContext from "../context/MovieContext";
import { Link } from "react-router-dom";
import Searchbar from "./Searchbar";

function Header() {
  let { personalInfo, authTokens } = useContext(MovieContext);

  return (
    <Wrapper>
      <Container>
        <Link to="/">
          <Logo src={logo} />
        </Link>
        <NavSearchBox>
          <GreetingNavBox>
            <Navigation />
            {personalInfo ? (
              <>
                <Hello>
                  Hello, <Link to="/personal">{personalInfo.username}</Link>
                </Hello>
                <Link to="/personal">
                  <Avatar
                    src={
                      "https://moviesapi-1bux.onrender.com" +
                      personalInfo?.avatar
                    }
                    alt="avatar"
                  />
                </Link>
              </>
            ) : authTokens?.access && !personalInfo ? (
              <p>Loading...</p>
            ) : null}
          </GreetingNavBox>
          <Searchbar />
        </NavSearchBox>
      </Container>
    </Wrapper>
  );
}

export default Header;

const Wrapper = styled.div``;
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding-inline: 20px;
  padding-block: 20px;
  background: rgb(18 30 38);

  & > a {
    height: 80px;
  }
`;
const GreetingNavBox = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  color: aliceblue;
  gap: 40px;
`;
const Logo = styled.img`
  width: 80px;
  border-radius: 50%;
`;
const Hello = styled.p`
  & > a {
    text-decoration: none;
    color: rgb(153, 195, 255);
    text-transform: capitalize;
    margin-left: 4px;
  }
`;
const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;
const NavSearchBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
