import React, { useEffect, useState } from "react";
import { PageBody } from "@app/components/PageBody";
import { Page, PageSection, PageSectionVariants, Split, SplitItem } from "@patternfly/react-core";
import { Stand, Tests, Tests_server } from "@app/types/Types";
import { get_id, get_rows, get_time } from "@app/configs/Axios_configs";
import { useLocation } from "react-router-dom";

export const Stack_page = () => {
    const [time, setTime] = useState<string>("")                            // время последнего обновления данных
    const [stand, setStand] = useState<Stand>(                              // полученные стенд
        {
            id: "",
            name: "--",
            x: "--",
            y: "--",
            create_at: "",
            modified_at: ""
        }
    );
    const [devices, setDevices] = useState<Tests[]>([                       // полученные тестируемые стенда
        {
            id: "",
            device: "",
            zone: "",
            x: "",
            y: "",
            user: "",
            percent: "",
            ip: "",
            status: "",
            beginning: "",
        }
    ]);
    const [loadingStand, setLoadingStand] = useState<boolean>(true);        // флаг проходит ли сейчас начальная загрузка стендов
    const [loadingDevices, setLoadingDevices] = useState<boolean>(true);    // флаг проходит ли сейчас начальная загрузка тестируемых
    const [errorTime, setErrorTime] = useState(false);                      // ошибка при получении времени
    const [errorData, setErrorData] = useState(false);                      // ошибка при получении данных

    // получение локации страницы
    const id = useLocation();

    // название столбцов таблицы на странице
    const column_names_tests = ["x", "y", "IP"];

    // название ключей в JSON файле, которые выводятся в таблице (совпадают с пунктами фильтрации)
    const column_ID_tests = ["x", "y", "ip"]

    // получение данных
    useEffect(() => {
        // получение данных (стендов и тестируемых)
        const fetchData = async () => {
            try {
                setLoadingStand(true);
                setLoadingDevices(true);

                // получение данных стендов по id через локацию страницы
                const standData = await get_id(`${id.pathname.replace("/", "")}`);
                if (typeof standData === "object") {
                    const stand = {
                        id: standData.id,
                        name: standData.stand_name,
                        x: standData.stand_x,
                        y: standData.stand_y,
                        create_at: standData.create_at,
                        modified_at: standData.modified_at,
                    };
                    setErrorData(false);
                    setStand(stand);
                } else {
                    setErrorData(true);
                }
                setLoadingStand(false);

                // получение данных тестируемых
                const devicesData = await get_rows(
                `test?id_zone=${id.pathname.replace("/stand/", "")}&`
                );
                if (Array.isArray(devicesData)) {
                    const devices = devicesData.map((device: Tests_server) => ({
                        id: device.id != undefined ? device.id : "",
                        device: device.id_device,
                        zone: device.id_zone,
                        x: device.x_coord,
                        y: device.y_coord,
                        user: device.id_user,
                        percent: device.id_stage,
                        ip: device.ip,
                        status: device.status == "PASS" ?
                            "Завершено"
                        :
                            device.status == "INTERACT_LOC" || device.status == "INTERACT_REM" ?
                                    "Действие"
                                :
                                device.status == "FAIL" ?
                                        "Ошибка"
                                    :
                                    device.status == "ERROR" ?
                                            "Не отвечает"
                                        :
                                            "Пусто",
                        beginning: device.create_at != undefined ? device.create_at : "",
                    }));
                    setErrorData(false);
                    setDevices(devices);
                } else {
                    setErrorData(true);
                }
                setLoadingDevices(false);
            } catch (error) {
                //  Обработка ошибки
                setErrorData(true);
                setLoadingStand(false);
                setLoadingDevices(false);
            }
        };

        fetchData();

        // получение времени с ежесекундным запросом
        // когда время изменяется идёт запрос на получение данных
        const interval = setInterval(() => {
            const bd_time_promise = get_time();
            bd_time_promise.then((bd_time: Array<any>) => {
                setTime((prevTime: string) => {
                    if (bd_time[0].modified_at !== prevTime) { // Предполагается, что у вас только один объект в массиве
                        fetchData();
                        return bd_time[0].modified_at;
                    }
                    return prevTime;
                });
                setErrorTime(false)
            }).catch((error) => {
                // Обработка ошибки
                setErrorTime(true)
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [id, time]);

    const header = (
        <Split>
            <SplitItem>Имя: {stand.name}</SplitItem>
            <SplitItem isFilled/>
            <SplitItem>x: {stand.x}</SplitItem>
            <SplitItem isFilled/>
            <SplitItem>y: {stand.y}</SplitItem>
            <SplitItem isFilled/>
        </Split>
    )

    return (
        <Page>
            <PageSection variant={PageSectionVariants.light}>{header}</PageSection>
            <PageBody
                column_names={column_names_tests}
                rows={devices}
                column_ID={column_ID_tests}
                loading={loadingStand && loadingDevices}
                error={errorData || errorTime}
            />
        </Page>
    );
};
