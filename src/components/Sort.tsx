import MovieContext from "../context/MovieContext";
import React, { useContext } from "react";

import { useLocation } from "react-router-dom";
import styled from "styled-components";

function Sort() {
  let {
    getMovies,
    personalInfo,
    setPersonalInfo,
    getUserInfo,
    authTokens,
    searchParams,
  } = useContext(MovieContext);
  let location = useLocation();

  const handleChange = (e: React.FormEvent<HTMLSelectElement>) => {
    if (location.pathname == "/") {
      if (searchParams.get("genre")) {
        let currentGenre = searchParams.get("genre");
        getMovies(
          `https://moviesapi-1bux.onrender.com/api/movies/?genre__name=${currentGenre}&ordering=${
            e.currentTarget.value == "year"
              ? "-year"
              : e.currentTarget.value == "rating"
              ? "-rating"
              : ""
          }`
        );
      } else {
        getMovies(
          `https://moviesapi-1bux.onrender.com/api/movies/?ordering=${
            e.currentTarget.value == "year"
              ? "-year"
              : e.currentTarget.value == "rating"
              ? "-rating"
              : ""
          }`
        );
      }
    }

    if (location.pathname == "/myMovies") {
      if (personalInfo?.bookmarked) {
        let bookMovies = [...personalInfo?.bookmarked];

        if (e.currentTarget.value == "year") {
          bookMovies.sort((a, b) => b.year - a.year);
          setPersonalInfo({ ...personalInfo, bookmarked: bookMovies });
        } else if (e.currentTarget.value == "rating") {
          bookMovies.sort((a, b) => Number(b.rating) - Number(a.rating));
          setPersonalInfo({ ...personalInfo, bookmarked: bookMovies });
        } else if (authTokens) {
          getUserInfo(authTokens?.access);
        }
      }
    }
  };

  return (
    <>
      <Select onChange={(e) => handleChange(e)} name="options">
        <Option value="sort by">sort by</Option>
        <Option value="year">year</Option>
        <Option value="rating">rating</Option>
      </Select>
    </>
  );
}

export default Sort;

const Select = styled.select`
  height: 25px;
  width: 100px;
  margin-bottom: 25px;
  padding-inline: 5px;
  border-radius: 4px;
`;
const Option = styled.option``;
