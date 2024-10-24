import MovieContext from "../context/MovieContext";
import { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { BsBookmark } from "react-icons/bs";
import { BsBookmarkFill } from "react-icons/bs";
import { MovieType } from "../context/MovieContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface Props {
  movie: MovieType;
}

function MovieItem(props: Props) {
  let location = useLocation();
  const navigate = useNavigate();

  const [isBookmarked, setIsBookmarked] = useState(false);

  let { personalInfo, authTokens, setPersonalInfo } = useContext(MovieContext);
  let { movie } = props;

  // Bookmarks info after login/logout or refresh
  useEffect(() => {
    personalInfo?.bookmarked.forEach((b) => {
      if (b.id == movie.id) {
        setIsBookmarked(true);
      }
    });

    if (!personalInfo) {
      setIsBookmarked(false);
    }
  }, [personalInfo]);

  // Get user's personal info
  let getUserInfo = async (tkn: string) => {
    let response = await fetch("https://moviesapi-1bux.onrender.com/api/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tkn,
      },
      credentials: "include",
    });

    let data = await response.json();

    if (response.status == 200) {
      return data;
    } else {
      alert("Something went wrong!");
    }
  };

  // Update bookmarks
  const addBookmark = async (userId: number, tkn: string, arr: number[]) => {
    let result = await fetch(
      `https://moviesapi-1bux.onrender.com/api/update_bookmarks/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tkn,
        },
        credentials: "include",
        body: JSON.stringify({ bookmarked: arr }),
      }
    );

    let data = await result.json();

    if (result.status == 200) {
      if (personalInfo) {
        let userInfo = { ...personalInfo };
        userInfo.bookmarked = data.bookmarked;
        setTimeout(() => {
          setPersonalInfo(userInfo);
        }, 400);
      }
    }
  };

  const handleBookmark = () => {
    if (authTokens) {
      if (personalInfo) {
        getUserInfo(authTokens.access).then((res) => {
          let current = res.bookmarked.slice();
          let index = current.map((b: MovieType) => b.id).indexOf(movie.id);
          let currentIdArr = current.map((b: MovieType) => b.id);
          if (currentIdArr.includes(movie.id) == false) {
            currentIdArr?.push(movie.id);
          }
          if (index !== -1) {
            currentIdArr.splice(index, 1);
          }
          addBookmark(res.id, authTokens.access, currentIdArr);
        });

        setIsBookmarked(!isBookmarked);
      }
    }
  };

  return (
    <Container $isBookmarked={isBookmarked} $location={location.pathname}>
      <Poster
        onClick={() => {
          navigate(`/movie/${movie.id}`);
        }}
        src={
          location.pathname !== "/" && location.pathname !== "/search"
            ? "https://moviesapi-1bux.onrender.com/" + movie.poster
            : movie.poster
        }
      />
      <BookmarkBox onClick={handleBookmark}>
        {isBookmarked ? (
          <BsBookmarkFill key={movie.id} />
        ) : (
          <BsBookmark key={movie.id} />
        )}
      </BookmarkBox>
      <Title
        onClick={() => {
          navigate(`/movie/${movie.id}`);
        }}
      >
        {movie.title}
      </Title>
      <LastLineBox>
        <Genre>{movie.genre.map((g) => g.name).join(", ")}</Genre>
        <CountryYearBox>
          <Country>{movie.country}</Country>
          <Year>{movie.year}</Year>
        </CountryYearBox>
      </LastLineBox>
    </Container>
  );
}

export default MovieItem;

const Container = styled.div<{ $isBookmarked: boolean; $location: string }>`
  max-width: 200px;
  position: relative;
  opacity: ${(props) =>
    !props.$isBookmarked &&
    props.$location !== "/" &&
    props.$location !== "/search"
      ? "0"
      : "1"};
  transition: 0.3s ease-out;
`;
const BookmarkBox = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
  background-color: grey;
  padding: 10px;
  border-radius: 50%;
  display: flex;
  cursor: pointer;
`;
const Poster = styled.img`
  width: 200px;
  height: 300px;
  border-radius: 10px;
  margin-bottom: 5px;
  cursor: pointer;
`;
const Title = styled.p`
  margin-bottom: 5px;
  max-width: 200px;
  cursor: pointer;
`;
const LastLineBox = styled.div`
  font-size: 12px;
`;
const Genre = styled.p`
  margin-bottom: 3px;
`;
const Country = styled.p``;
const Year = styled.p``;
const CountryYearBox = styled.div`
  display: flex;
  gap: 10px;
`;
