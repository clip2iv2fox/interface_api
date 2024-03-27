import React, { useEffect, useState} from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { NotFound } from "./pages/NotFound/NotFound";

import { AppLayout } from "./AppLayout/AppLayout";
import { Login } from "./pages/Login/Login";
import { Users_page } from "./pages/Users/Users";
import { Tests_page } from "./pages/Tests/Tests";
import { Devices_page } from "./pages/Devices/Devices";
import { Stack_page } from "./pages/Stack/Stack";
import DashBoard_page from "./pages/DashBoard/DashBoard";
import { Devices_server, Stack_server, Stand, Stand_server, Tests_server, Users_server } from "./types/Types";
import { get_rows, get_time } from "./configs/Axios_configs";
import { Config_page } from "./pages/Config_Stands/Config";

export interface IAppRoute {
  label?: string; 
  Component: React.ComponentType<any> | React.ComponentType<any>;
  exact?: boolean;
  path: string;
  title: string;
  routes?: undefined;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

export const routes = () => {
  const [time, setTime] = useState<string>("");             // время последнего обновления данных
  const [stands, setStands] = useState<Stand[]>([]);        // полученные стенды

  // получение данных
  useEffect(() => {
    // получение строк таблицы (стендов)
    const fetchRows = async () => {
        const bd_data_promise: Promise<Users_server | Tests_server | Devices_server | Stack_server | Stand_server | string> = get_rows("stand?");
        const bd_data = await bd_data_promise;
        if (Array.isArray(bd_data) && bd_data.length != 0) {
            const stands = bd_data.map((stand: Stand_server) => ({
              id: stand.id,
              name: stand.stand_name,
              x: stand.stand_x,
              y: stand.stand_y,
              create_at: stand.create_at,
              modified_at: stand.modified_at,
            }));
            setStands(stands);
        }
    };

    fetchRows();

    // получение времени с ежесекундным запросом
    // когда время изменяется идёт запрос на получение данных
    const interval = setInterval(() => {
        const bd_time_promise = get_time();
        bd_time_promise.then((bd_time: Array<any>) => {
            setTime((prevTime: string) => {
                if (bd_time[0].modified_at !== prevTime) { // Предполагается, что у вас только один объект в массиве
                    fetchRows();
                    return bd_time[0].modified_at;
                }
                return prevTime;
            });
          })
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  // страницы DashBoard (схемы стендов)
  const Stacks: IAppRoute[] = stands.map((stand: Stand) => ({
    Component: DashBoard_page,
    exact: true,
    label: stand.name,
    path: `/${stand.name}`,
    title: `PatternFly Seed | General Stand ${stand.id}`,
  }));

  // страницы, первая из которых Конфигуратор, следующие стенды
  const Devices: IAppRoute[] = [
    {
      Component: Config_page,
      exact: true,
      label: "Конфигуратор",
      path: `/stand/config`,
      title: `PatternFly Seed | General Stand config`,
    },
    ...stands.map((stand: Stand) => ({
      Component: Stack_page,
      exact: true,
      label: stand.name,
      path: `/stand/${stand.name}`,
      title: `PatternFly Seed | General test in ${stand.id}`,
    })),
  ];


  // список страниц, куда можем перейти по sidebar
  const routes: AppRouteConfig[] = [
    // {
    //   Component: Users_page,
    //   exact: true,
    //   label: "Пользователи",
    //   path: "/users",
    //   title: "PatternFly Seed | Main users",
    // },
    {
      Component: Tests_page,
      exact: true,
      label: "Тесты",
      path: "/tests",
      title: "PatternFly Seed | Main tests",
    },
    // {
    //   Component: DashBoard_page,
    //   exact: false,
    //   label: "Устройства",
    //   path: "/devices",
    //   title: "PatternFly Seed | Main devices",
    // },
    {
      label: 'Устройства стелажей',
      routes: Devices
    },
    {
      label: 'Схемы стелажей',
      routes: Stacks
    },
  ];

  return routes
}

export const AppRoutes = (): React.ReactElement => {
  // список страниц, куда можем перейти по navbar
  const nav_routes: AppRouteConfig[] = [
    // Ваши маршруты
  ];

  // сохраняем результат функции routes() в переменной
  const allRoutes = routes();

  // обработка списка страниц sidebar
  const flattenedRoutes: IAppRoute[] = routes().reduce(
    (flattened, route) => [
      ...flattened,
      ...(route.routes ? route.routes : [route]),
    ],
    [] as IAppRoute[]
  );

  // обработка списка страниц navbar
  const flattenedNavRoutes: IAppRoute[] = nav_routes.reduce(
    (flattened, route) => [
      ...flattened,
      ...(route.routes ? route.routes : [route]),
    ],
    [] as IAppRoute[]
  );

  // регистрация
  return (
    <Routes>
      {flattenedRoutes.map(({ path, exact, Component, label }, idx) => (
        <Route
          path={path}
          element={
            <AppLayout>
              <Component />
            </AppLayout>
          }
          key={path + idx.toString()}
        />
      ))}

      {flattenedNavRoutes.map(({ path, exact, Component, title }, idx) => (
        <Route
          path={path}
          element={
            <AppLayout>
              <Component />
            </AppLayout>
          }
          key={path + idx.toString()}
        />
      ))}

      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
};
