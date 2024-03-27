import React, { useState } from "react";
import {
  Bullseye,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  LoginForm,
  Title,
  TitleSizes
} from "@patternfly/react-core";
import { useNavigate } from "react-router-dom";
import "./login.css";

export const Login: React.FunctionComponent = () => {
  const [showHelperText, setShowHelperText] = useState<boolean>(false);       // флаг вывода помогающего текста
  const [username, setUsername] = useState<string>("");                       // логин пользователя
  const [isValidUsername, setIsValidUsername] = useState<boolean>(true);      // флаг валидный ли логин
  const [password, setPassword] = useState<string>("");                       // пароль пользователя
  const [isValidPassword, setIsValidPassword] = useState<boolean>(true);      // влаг валидный ли пароль пользователя

  // определение локации страницы
  const navigate = useNavigate();

  // ввод логина
  const handleUsernameChange = (value: string) => {
    setUsername(value);
  };

  // ввод пароля
  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  // реакция нажатия кнопки подтверждения
  const onLoginButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setIsValidUsername(!!username);
    setIsValidPassword(!!password);
    setShowHelperText(!username || !password);

    if (username.length < 4) {
      setIsValidUsername(false)
    } else {
      setIsValidUsername(true)
    }
    if (!username || !password) {
      return;
    }

    navigate("/tests");
  };

  const loginForm = (
    <LoginForm
      showHelperText={showHelperText}
      helperText="Неврные учётные данные."
      usernameLabel="Имя пользователя"
      usernameValue={username}
      onChangeUsername={handleUsernameChange}
      isValidUsername={isValidUsername}
      passwordLabel="Пароль"
      passwordValue={password}
      onChangePassword={handlePasswordChange}
      isValidPassword={isValidPassword}
      onLoginButtonClick={onLoginButtonClick}
      loginButtonLabel="Войти"
    />
  );

  return (
    <div className="login-page">
      <Bullseye>
        <Card isRounded>
          <CardTitle>
            <Title headingLevel="h1" size={TitleSizes["3xl"]}>
              Войдите в свой аккаунт
            </Title>
          </CardTitle>
          <CardBody>Введите свои учетные данные.</CardBody>
          <CardFooter>{loginForm}</CardFooter>
        </Card>
      </Bullseye>
    </div>
  );
};
