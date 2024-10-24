import styled from "styled-components";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface Inputs {
  username: string;
  password: string;
  password2: string;
}

function Signup() {
  // let { setMovieList } = useContext(MovieContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  let Register = async (url: string, userData: Inputs) => {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    console.log(response.status);

    if (response.status == 201) {
      alert("Registered completed");
      navigate("/login");
    } else if (response.status == 409) {
      alert("User already axists");
    } else {
      alert("Something went wrong!");
    }
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    Register("https://moviesapi-1bux.onrender.com/api/register", data);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          placeholder="username"
          {...register("username", { required: "required field" })}
        />
        {errors.username && <ErrorMsg>{errors.username.message}</ErrorMsg>}
        <Input
          type="text"
          placeholder="password"
          {...register("password", {
            required: "required field",
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: "Invalid password type",
            },
          })}
        />
        {errors.password && <ErrorMsg>{errors.password.message}</ErrorMsg>}

        <Input
          type="text"
          placeholder="confirm password"
          {...register("password2", {
            required: "required field",
            validate: {
              confirmPass: (val: string) =>
                val === watch("password") || "passwords don't match",
            },
          })}
        />
        {errors.password2 && <ErrorMsg>{errors.password2.message}</ErrorMsg>}

        <SubmitBtn type="submit" value="Signup" />
      </Form>
    </Container>
  );
}

export default Signup;
const Container = styled.div`
  height: calc(100vh - 220px);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 280px;
  width: 100%;
  gap: 25px;
`;
const Input = styled.input`
  font-size: 14px;
  height: 25px;
  padding-inline: 8px;
  padding-block: 15px;
  border-radius: 3px;
  &:enabled {
    outline: none;
    border: none;
  }
`;
const SubmitBtn = styled.input`
  margin-top: -5px;
  padding-block: 8px;
  background-color: rgb(153, 195, 255);
  border-radius: 5px;
  border-radius: 5px;
`;
const ErrorMsg = styled.span`
  color: red;
  font-size: 12px;
  margin-top: -20px;
  &:last-of-type {
    margin-bottom: 5px;
  }
`;
