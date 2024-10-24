import { useContext, useState } from "react";
import MovieContext from "../context/MovieContext";
import styled from "styled-components";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

interface Inputs {
  old_password: string;
  new_password: string;
}

function Personal() {
  const [errorMsg, setErrorMsg] = useState<string>("");

  let { user, personalInfo, authTokens, getUserInfo, logoutUser } =
    useContext(MovieContext);
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    let response = await fetch(
      `https://moviesapi-1bux.onrender.com/api/change_password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authTokens?.access,
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );

    if (response.status == 204) {
      alert("Password updated");
      logoutUser();
      reset();
      navigate("/login");
    } else {
      setErrorMsg("Something went wrong; Check your data!");
    }
  };

  let changeAvatar = async (
    e: React.FormEvent<HTMLFormElement>,
    tkn: string,
    url: string
  ) => {
    if (e.target) {
      const formData = new FormData(e.currentTarget);

      let response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + tkn,
        },
        credentials: "include",
        body: formData,
      });

      if (response.status == 200 && authTokens) {
        getUserInfo(authTokens?.access);
      }
    }
  };
  if (!personalInfo) {
    return <h1>Loading...</h1>;
  }

  return (
    <Container>
      <InfoTitle>Personal Info</InfoTitle>
      {!user && <Navigate to="/" />}
      <Name>Name: {personalInfo?.username}</Name>

      {/* Avatar update */}
      <AvatarBox>
        <Avatar>Avatar:</Avatar>
        <AvatarForm
          onChange={(e) => {
            if (authTokens)
              changeAvatar(
                e,
                authTokens?.access,
                `https://moviesapi-1bux.onrender.com/api/update_avatar/${personalInfo?.id}`
              );
          }}
        >
          <AvatarInput type="file" name="avatar" accept="image/*" />
        </AvatarForm>
      </AvatarBox>

      {/* Password update */}
      <PasswordBox>
        <PasswordTitle>Password</PasswordTitle>
        <PasswordForm onSubmit={handleSubmit(onSubmit)}>
          <PassworLabel htmlFor="old_password">password</PassworLabel>
          <PasswordInput
            onClick={() => setErrorMsg("")}
            type="text"
            {...register("old_password")}
          />
          <PassworLabel htmlFor="new_password">new password</PassworLabel>

          <PasswordInput
            type="text"
            onClick={() => setErrorMsg("")}
            {...register("new_password")}
          />
          {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}
          <Submit type="submit" value={"Change"} />
        </PasswordForm>
      </PasswordBox>
    </Container>
  );
}

export default Personal;

const Container = styled.div``;
const InfoTitle = styled.h2`
  margin-bottom: 50px;
  color: #dc9b9b;
`;
const AvatarBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
const Avatar = styled.p``;
const Name = styled.p`
  margin-right: 20px;
  margin-bottom: 20px;
`;
const AvatarForm = styled.form``;
const AvatarInput = styled.input``;

const PasswordBox = styled.section`
  margin-top: 100px;
`;
const PasswordTitle = styled.h2`
  margin-top: 100px;
  margin-bottom: 50px;
  color: #dc9b9b;
`;
const PasswordForm = styled.form`
  max-width: 170px;
  display: flex;
  flex-direction: column;
`;
const PassworLabel = styled.label`
  margin-bottom: 4px;
`;
const PasswordInput = styled.input`
  font-size: 18px;
  outline-color: grey;
  padding-inline: 5px;
  margin-bottom: 20px;
`;
const Submit = styled.input`
  width: 100px;
`;
const ErrorMsg = styled.span`
  color: red;
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 10px;
`;
