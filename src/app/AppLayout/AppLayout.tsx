import * as React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Nav,
  NavList,
  NavItem,
  NavExpandable,
  Page,
  PageHeader,
  PageSidebar,
  SkipToContent,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  Button
} from "@patternfly/react-core";
import { routes, IAppRoute, IAppRouteGroup } from "../routes";

interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  const history = useNavigate();
  const [isNavOpen, setIsNavOpen] = React.useState(true);                 // открыт ли sidebar
  const [isMobileView, setIsMobileView] = React.useState(true);           // мобильный ли режим
  const [isNavOpenMobile, setIsNavOpenMobile] = React.useState(false);    // открыт ли sidebar в мобильном режиме

  // открытие sidebar в мобильном режиме
  const onNavToggleMobile = () => {
    setIsNavOpenMobile(!isNavOpenMobile);
  };

  // открытие sidebar
  const onNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  // отслеживание размерности страницы
  const onPageResize = (props: { mobileView: boolean; windowSize: number }) => {
    setIsMobileView(props.mobileView);
  };

  // вывод Logo в NavBar со ссылкой на главную страниицу
  function LogoImg() {
    return (
      <img src="/images/favicon1.ico" width={"24px"} alt="logo" onClick={()=>history("/tests")}/>
    );
  }

  // NavBar кнопки
  const headerTools = (
    <PageHeaderTools>
      <PageHeaderToolsGroup
        visibility={{
          default: "hidden",
          lg: "visible"
        }} /** the settings and help icon buttons are only visible on desktop sizes and replaced by a kebab dropdown for other sizes */
      >
        <PageHeaderToolsItem
          visibility={{ default: "hidden", md: "visible" }} /** this user dropdown is hidden on mobile sizes */
        >
          <Button variant="secondary" onClick={() => history("/")}>Выход</Button>
        </PageHeaderToolsItem>
      </PageHeaderToolsGroup>
    </PageHeaderTools>
  );

  // NavBar
  const Header = (
    <PageHeader
      logo={<LogoImg />}
      headerTools={headerTools}
      showNavToggle
      isNavOpen={isNavOpen}
      onNavToggle={isMobileView ? onNavToggleMobile : onNavToggle}
    />
  );

  // отслеживание активности (открыта страница или нет)
  const location = useLocation();

  // создание в SideBar кнопок для перехода на страницы
  const renderNavItem = (route: IAppRoute, index: number) => (
    <NavItem key={`${route.label}-${index}`} id={`${route.label}-${index}`} isActive={route.path === location.pathname}>
      <NavLink to={route.path}>
        {route.label}
      </NavLink>
    </NavItem>
  );

  // сделано для NavLink, которые лежат во вложениях
  const renderNavGroup = (group: IAppRouteGroup, groupIndex: number) => (
    <NavExpandable
      key={`${group.label}-${groupIndex}`}
      id={`${group.label}-${groupIndex}`}
      title={group.label}
      isActive={group.routes.some((route) => route.path === location.pathname)}
    >
      {group.routes.map((route, idx) => route.label && renderNavItem(route, idx))}
    </NavExpandable>
  );

  // строение SideBar
  const Navigation = (
    <Nav id="nav-primary-simple" theme="dark">
      <NavList id="nav-list-simple">
        {routes().map(
          (route, idx) => route.label && (!route.routes ? renderNavItem(route, idx) : renderNavGroup(route, idx))
        )}
      </NavList>
    </Nav>
  );

  // вставка шаблона
  const Sidebar = (
    <PageSidebar
      theme="dark"
      nav={Navigation}
      isNavOpen={isMobileView ? isNavOpenMobile : isNavOpen} />
  );

  const pageId = "primary-app-container";

  // переход по ссылке
  const PageSkipToContent = (
    <SkipToContent onClick={(event) => {
      event.preventDefault();
      const primaryContentContainer = document.getElementById(pageId);
      primaryContentContainer && primaryContentContainer.focus();
    }} href={`#${pageId}`}>
      Skip to Content
    </SkipToContent>
  );

  return (
      <Page
        mainContainerId={pageId}
        header={Header}
        sidebar={Sidebar}
        onPageResize={onPageResize}
        skipToContent={PageSkipToContent}>
        {children}
      </Page>
  );
};

export { AppLayout };