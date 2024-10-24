import MovieItem from "./MovieItem";
import Sort from "./Sort";
import styled from "styled-components";
import MovieContext from "../context/MovieContext";
import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Genres from "./Genres";

function MoviesGrid() {
  let location = useLocation();

  let {
    movieList,
    personalInfo,
    getUserInfo,
    authTokens,
    getMovies,
    loading,
    searchParams,
    setSearchParams,
  } = useContext(MovieContext);

  useEffect(() => {
    if (authTokens) {
      getUserInfo(authTokens.access);
    }
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <Wrapper>
      {location.pathname == "/" && <Genres />}
      {location.pathname == "/" && <Sort />}
      {location.pathname == "/myMovies" &&
        personalInfo?.bookmarked.length !== 0 && <Sort />}
      <Container
        style={
          personalInfo?.bookmarked.length == 0 && location.pathname !== "/"
            ? { display: "flex" }
            : { display: "grid" }
        }
      >
        {location.pathname == "/" || location.pathname == "/search"
          ? movieList?.results.map((movie) => {
              return <MovieItem key={movie.id} movie={movie} />;
            })
          : personalInfo?.bookmarked.map((movie) => {
              return <MovieItem key={movie.id} movie={movie} />;
            })}

        {personalInfo?.bookmarked.length == 0 &&
          location.pathname == "/myMovies" && <p>No Movies Bookmarked</p>}
      </Container>

      {location.pathname == "/" && (
        <PaginationBox>
          {movieList?.previous && (
            <Pagination
              onClick={() => {
                if (movieList.previous) {
                  let currentPage = Number(searchParams.get("page"));
                  let currentGenre = searchParams.get("genre");
                  if (currentPage == 2 && currentGenre) {
                    setSearchParams({
                      page: String(currentPage - 1),
                      genre: currentGenre,
                    });
                  } else if (currentPage == 2) {
                    setSearchParams({});
                  } else if (currentGenre) {
                    setSearchParams({
                      page: String(currentPage - 1),
                      genre: currentGenre,
                    });
                  } else {
                    setSearchParams({
                      page: String(currentPage - 1),
                    });
                  }
                  if (movieList.previous.includes("page")) {
                    getMovies(
                      movieList.previous.slice(0, -1) + String(currentPage - 1)
                    );
                  } else if (searchParams.get("page") == "2") {
                    getMovies(
                      movieList.previous + "?page=" + String(currentPage - 1)
                    );
                  } else {
                    getMovies(movieList.previous);
                  }
                }
              }}
            >
              {"<<"} prev
            </Pagination>
          )}

          {movieList?.next && (
            <Pagination
              onClick={async () => {
                if (movieList.next) {
                  let currentPage = Number(searchParams.get("page"));
                  let currentGenre = searchParams.get("genre");
                  if (currentGenre) {
                    setSearchParams({
                      page: String(currentPage + (currentPage == 0 ? 2 : 1)),
                      genre: currentGenre,
                    });
                  } else {
                    setSearchParams({
                      page: String(currentPage + (currentPage == 0 ? 2 : 1)),
                    });
                  }
                  getMovies(
                    movieList.next.slice(0, -1) +
                      String(currentPage + (currentPage == 0 ? 2 : 1))
                  );
                }
              }}
            >
              next {">>"}
            </Pagination>
          )}
        </PaginationBox>
      )}
    </Wrapper>
  );
}

export default MoviesGrid;

const Wrapper = styled.div``;
const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  row-gap: 40px;
  margin-bottom: 30px;
  justify-content: center;
`;
const PaginationBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;
const Pagination = styled.span`
  cursor: pointer;
  color: #a2a2ec;
`;
