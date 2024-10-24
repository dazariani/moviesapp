import MoviesGrid from "../components/MoviesGrid";
import styled from "styled-components";

function Home() {
  return (
    <Container>
      <MoviesGrid />
    </Container>
  );
}

export default Home;

const Container = styled.div``;
