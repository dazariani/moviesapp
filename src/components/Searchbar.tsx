import { useEffect, useContext } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import MovieContext from "../context/MovieContext";
import { MovieType } from "../context/MovieContext";
import { useNavigate } from "react-router-dom";

interface Inputs {
  movieTitle: string;
}

function Searchbar() {
  let { setMovieList, setLoading } = useContext(MovieContext);
  const navigate = useNavigate();

  const { register, handleSubmit, watch } = useForm<Inputs>();

  let value = watch("movieTitle");

  let onSubmit = async (userData: Inputs) => {
    if (userData.movieTitle !== "" && userData.movieTitle !== undefined) {
      let getMovies = async (url: string) => {
        let response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        let data = await response.json();

        if (response.status == 200) {
          let searchResult: MovieType[] = [];
          data.forEach((m: MovieType) => {
            if (
              m.title.toLowerCase().includes(userData.movieTitle?.toLowerCase())
            ) {
              searchResult.push(m);
            }
          });
          if (searchResult.length > 0) {
            setMovieList({ results: searchResult });
            setLoading(false);
            navigate("/search");
          }
        } else {
          alert("Something went wrong!");
        }
      };
      getMovies("https://moviesapi-1bux.onrender.com/api/movies/");
    }
  };

  useEffect(() => {
    if (value !== "" && value !== undefined) {
      let getMovies = async (url: string) => {
        let response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        let data = await response.json();

        if (response.status == 200) {
          let searchResult: MovieType[] = [];
          data.forEach((m: MovieType) => {
            if (m.title.toLowerCase().includes(value?.toLowerCase())) {
              searchResult.push(m);
            }
          });
          if (searchResult.length > 0) {
            setMovieList({ results: searchResult });
            setLoading(false);
          }
        } else {
          alert("Something went wrong!");
        }
      };
      getMovies("https://moviesapi-1bux.onrender.com/api/movies/");
    }
  }, [value]);

  return (
    <Container>
      <Form>
        <TiTleInput type="text" {...register("movieTitle")} />
        <SubmitBtn onClick={handleSubmit(onSubmit)}>🔍</SubmitBtn>
      </Form>
    </Container>
  );
}

export default Searchbar;

const Container = styled.div``;
const Form = styled.form`
  display: flex;
  gap: 10px;
`;
const TiTleInput = styled.input`
  padding-inline: 5px;
`;
const SubmitBtn = styled.div`
  font-size: 18px;
  cursor: default;
`;
