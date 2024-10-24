import GenreItem from "./GenreItem";
import styled from "styled-components";
import { useState, useContext, useEffect } from "react";
import MovieContext from "../context/MovieContext";

const genres = [
  "Animation",
  "History",
  "Mystery",
  "War",
  "Thriller",
  "Fantasy",
  "Sci-Fi",
  "Adventure",
  "Romance",
  "Action",
  "Crime",
  "Drama",
];

function Genres() {
  const [isActive, setIsActive] = useState<string>("");

  let { searchParams } = useContext(MovieContext);

  useEffect(() => {
    if (!searchParams.get("genre")) {
      setIsActive("");
    } else if (searchParams.get("genre")) {
      let currentGenre = searchParams.get("genre");
      setIsActive(String(currentGenre));
    }
  }, [searchParams.get("genre")]);

  return (
    <Container>
      {genres.map((genre, ind) => {
        return (
          <GenreItem
            key={ind}
            genre={genre}
            handler={() => setIsActive(genre)}
            active={isActive === genre}
            isActive={isActive}
          />
        );
      })}
    </Container>
  );
}

export default Genres;

const Container = styled.div`
  color: #dc9b9b;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
`;
