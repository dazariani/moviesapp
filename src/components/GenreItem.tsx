import styled from "styled-components";
import MovieContext from "../context/MovieContext";
import { useContext } from "react";

interface Props {
  genre: string;
  handler: (g: string) => void;
  active: boolean;
  isActive: string;
}

function GenreItem(props: Props) {
  let { setMovieList, setSearchParams } = useContext(MovieContext);

  const { genre, handler, active, isActive } = props;

  let getFilteredMovies = async () => {
    // setLoading(true);
    let response = await fetch(
      `https://moviesapi-1bux.onrender.com/api/movies/?genre__name=${genre}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    let data = await response.json();

    if (response.status == 200) {
      setMovieList(data);
    } else {
      alert("Something went wrong!");
    }
  };

  const handleClick = async (g: string) => {
    if (isActive !== genre) {
      handler(g);

      setSearchParams({ page: String(1), genre: genre });
      getFilteredMovies();
    }
  };

  return (
    <Container $active={active} onClick={() => handleClick(genre)}>
      {genre}
    </Container>
  );
}

export default GenreItem;

const Container = styled.div<{ $active: boolean }>`
  background-color: ${(props) =>
    props.$active ? "rgb(101 101 190 / 50%)" : "none"};
  padding: 5px;
  padding-inline: 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.2s ease-in-out;

  &:hover {
    transform: scale(1.3);
  }
`;
