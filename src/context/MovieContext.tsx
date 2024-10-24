import { createContext, useState, useEffect } from "react";
import React from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { SetURLSearchParams, useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

// TS types
interface ChildrenType {
  children: React.ReactNode;
}

interface UserType {
  exp: number;
  iat: number;
  jti: string;
  token_type: string;
  user_id: number;
  username: string;
}

interface GenreType {
  name: string;
}

export interface MovieType {
  actors: { name: string }[];
  country: string;
  director: { name: string }[];
  genre: GenreType[];
  id: number;
  language: string;
  poster: string;
  rating: string;
  title: string;
  year: number;
  url: string;
  plot: string;
}

interface PersonalTypes {
  avatar: string;
  bookmarked: MovieType[] | [];
  id: number;
  username: string;
  password: string;
}

interface AuthtokensType {
  access: string;
  refresh: string;
}

interface movieListType {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: MovieType[];
}

interface contextDataTypes {
  loginUser?: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  user: UserType | null;
  logoutUser: () => void;
  personalInfo: PersonalTypes | null;
  movieList: movieListType | null;
  setMovieList: (prop: movieListType | null) => void;
  setPersonalInfo: (props: PersonalTypes) => void;
  authTokens: AuthtokensType | null;
  token: string | undefined;
  getUserInfo: (tkn: string) => Promise<void>;
  getMovies: (url: string) => Promise<void>;
  loading: boolean;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  setLoading: (props: boolean) => void;
}

// Context
const MovieContext = createContext<contextDataTypes>({} as contextDataTypes);

export default MovieContext;

let token = Cookies.get("accessToken");
let tokenRefresh = Cookies.get("refreshToken");
const accessToken: UserType | null = token ? jwtDecode(token) : null;

export const MovieProvider = ({ children }: ChildrenType) => {
  const [user, setUser] = useState<UserType | null>(accessToken);
  const [authTokens, setAuthTokens] = useState<AuthtokensType | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalTypes | null>(null);
  const [movieList, setMovieList] = useState<movieListType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  let location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams({ page: "1" });

  //  Update token
  const updateToken = async () => {
    let refresh = Cookies.get("refreshToken");
    let response = await fetch(
      "https://moviesapi-1bux.onrender.com/api/token/refresh/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh,
        }),
      }
    );
    let data = await response.json();

    if (response.status == 200) {
      let accessToken = data.access;
      let refreshToken = data.refresh;

      let time = new Date(new Date().getTime() + 5 * 60 * 1000);
      Cookies.set("accessToken", accessToken, {
        expires: time,
        secure: true,
      });
      Cookies.set("refreshToken", refreshToken, {
        expires: 90,
        secure: true,
      });

      setAuthTokens(data);
      setUser(jwtDecode(data.access));
    } else {
      logoutUser();
    }
  };

  // Login user
  let loginUser = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    let response = await fetch(
      "https://moviesapi-1bux.onrender.com/api/token/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: e.currentTarget.username.value,
          password: e.currentTarget.password.value,
        }),
      }
    );

    let data = await response.json();

    if (response.status == 200) {
      let accessToken = data.access;
      let refreshToken = data.refresh;
      let time = new Date(new Date().getTime() + 5 * 60 * 1000);
      Cookies.set("accessToken", accessToken, {
        expires: time,
        secure: true,
      });
      Cookies.set("refreshToken", refreshToken, { expires: 90, secure: true });

      setAuthTokens(data);
      setUser(jwtDecode(data.access));
    } else {
      alert("Something went wrong!");
    }
  };

  //  Log out user
  let logoutUser = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setUser(null);
    setAuthTokens(null);
    setPersonalInfo(null);
  };

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
      setPersonalInfo(data);
      console.log("user info set");
    } else {
      alert("Something went wrong!");
    }
  };

  // Get movies
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
      setMovieList(data);
      setLoading(false);
    } else {
      alert("Something went wrong!");
    }
  };

  let contextData = {
    loginUser,
    user,
    logoutUser,
    personalInfo,
    setPersonalInfo,
    movieList,
    authTokens,
    token,
    getUserInfo,
    getMovies,
    loading,
    searchParams,
    setSearchParams,
    setMovieList,
    setLoading,
  };

  // Refresh token
  let refreshInterval = 4 * 60 * 1000;
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        updateToken();
      }, refreshInterval);

      // clear interval
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    // Fatch movies going back to home page
    if (
      (location.pathname == "/" &&
        searchParams.get("page") == null &&
        searchParams.get("genre") == null) ||
      (location.pathname == "/" &&
        searchParams.get("page") == "1" &&
        searchParams.get("genre") == null)
    ) {
      setLoading(true);

      getMovies("https://moviesapi-1bux.onrender.com/api/movies/?page=1");
    }
    let access = Cookies.get("accessToken");
    let refresh = Cookies.get("refreshToken");
    if (access && refresh) {
      setAuthTokens({
        access,
        refresh,
      });
    }
  }, [location.pathname, searchParams.get("page")]);

  // First time movie fatch
  useEffect(() => {
    if (tokenRefresh) updateToken();
    if (token) getUserInfo(token);

    getMovies(
      `https://moviesapi-1bux.onrender.com/api/movies/?${
        searchParams.get("genre")
          ? "genre__name=" +
            searchParams.get("genre") +
            "&page=" +
            searchParams.get("page")
          : "page=" + searchParams.get("page")
      }`
    );
  }, []);

  return (
    <MovieContext.Provider value={contextData}>
      {children}
    </MovieContext.Provider>
  );
};
