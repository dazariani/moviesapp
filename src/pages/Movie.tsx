import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { MovieType } from "../context/MovieContext";
import ReactPlayer from "react-player";

function Movie() {
  let { id } = useParams();
  const [movie, setMovie] = useState<MovieType | null>(null);

  let getMovie = async (url: string) => {
    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    let data = await response.json();

    if (response.status == 200) {
      setMovie(data);
    } else {
      alert("Something went wrong!");
    }
  };

  useEffect(() => {
    getMovie(`https://moviesapi-1bux.onrender.com/api/movies/${id}`);
  }, []);

  return (
    <Container>
      <Title>{movie?.title}</Title>
      {movie && <ReactPlayer playing controls url={movie.url} />}

      <InfoBox>
        <InfoText>
          <InfoTitle>Year:</InfoTitle> {movie?.year}
        </InfoText>
        <InfoText>
          <InfoTitle>Genre:</InfoTitle>{" "}
          {movie?.genre
            .map((g) => g.name + ", ")
            .join("")
            .slice(0, -2)}
        </InfoText>

        <InfoText>
          <InfoTitle>Rating: </InfoTitle>
          {movie?.rating}
        </InfoText>
        <InfoText>
          <InfoTitle>Director: </InfoTitle>{" "}
          {movie?.director
            .map((d) => d.name + ", ")
            .join("")
            .slice(0, -2)}
        </InfoText>

        <InfoText>
          <InfoTitle>Actors: </InfoTitle>{" "}
          {movie?.actors
            .map((a) => a.name + ", ")
            .join("")
            .slice(0, -2)}
        </InfoText>
        <InfoText>
          <InfoTitle>Country: </InfoTitle> {movie?.country}
        </InfoText>
        <InfoText>
          <InfoTitle>Language: </InfoTitle>
          {movie?.language}
        </InfoText>
        <InfoText>
          <InfoTitle>Plot: </InfoTitle> {movie?.plot}
        </InfoText>
      </InfoBox>
    </Container>
  );
}

export default Movie;

const Container = styled.div``;

const Title = styled.h2`
  margin-bottom: 20px;
`;
const InfoBox = styled.section`
  margin-top: 15px;
`;
const InfoText = styled.p`
  margin-bottom: 12px;
`;
const InfoTitle = styled.span`
  color: rgb(153, 195, 255);
`;
