import * as React from "react";
import { ExclamationTriangleIcon } from "@patternfly/react-icons";
import {
  PageSection,
  Title,
  Button,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody } from "@patternfly/react-core";
import { useNavigate } from "react-router-dom";

// страница, когда ошибка 404
const NotFound: React.FunctionComponent = () => {

  // ссылка на главную Dashboard страницу
  function GoHomeBtn() {
    const history = useNavigate();
    function handleClick() {
      history("/");
    }
    return (
      <Button onClick={handleClick}>Войти в мой аккаунт</Button>
    );
  }

  return (
    <PageSection>
    <EmptyState variant="full">
      <EmptyStateIcon icon={ExclamationTriangleIcon} />
      <Title headingLevel="h1" size="lg">
        404 Страница не найдена
      </Title>
      <EmptyStateBody>
        Мы не нашли страницу, соответствующую адресу, на который вы перешли.
      </EmptyStateBody>
      <GoHomeBtn />
    </EmptyState>
  </PageSection>
  )
};

export { NotFound };
