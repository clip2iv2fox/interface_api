import React, { useEffect, useState } from "react";
import { PageBody } from "@app/components/PageBody";
import { Page, PageSection, PageSectionVariants } from "@patternfly/react-core";
import { Devices, Devices_server, Stack_server, Tests_server, Users_server } from "@app/types/Types";
import { get_rows, get_time } from "@app/configs/Axios_configs";
import { MultiDropdown } from "@app/components/MultiDropdown";

export const Devices_page = () => {
    const [time, setTime] = useState<string>("")                    // время последнего обновления данных
    const [devices, setDevices] = useState<Devices[]>()             // полученное оборудование
    const [loading, setLoading] = useState<boolean>(true)           // флаг проходит ли сейчас начальная загрузка данных
    const [errorTime, setErrorTime] = useState(false)               // ошибка при получении времени
    const [errorRows, setErrorRows] = useState(false)               // ошибка при получении данных

    // название столбцов таблицы на странице
    const column_names_devices = ["Серийный номер", "MAC", "Номер места", "Свойства"];

    // название ключей в JSON файле, которые выводятся в таблице (совпадают с пунктами фильтрации)
    const column_ID_devices = ["serial", "mac", "place", "property"]

    // получение данных
    useEffect(() => {
        // получение строк таблицы (оборудование)
        const fetchRows = async () => {
            const bd_data_promise: Promise<Users_server | Tests_server | Devices_server | Stack_server | string> = get_rows("devices?");
            const bd_data = await bd_data_promise;
            if (Array.isArray(bd_data)) {
                const devices = bd_data.map((device: Devices_server) => ({
                    id: device.id != undefined ? device.id : "",
                    serial: device.serial_number,
                    mac: device.mac,
                    place: device.place_number,
                    property: device.properties
                }));
                setDevices(devices);
                setErrorRows(false)
                setLoading(false)
            } else {
                // Обработка ошибки
                setErrorRows(true)
            }
        };

        // получение времени с ежесекундным запросом
        // когда время изменяется идёт запрос на получение данных
        const interval = setInterval(() => {
            const bd_time_promise: Promise<string> = get_time();
            bd_time_promise.then((bd_time: string) => {
                setTime((prevTime) => {
                    if (bd_time !== prevTime) {
                        fetchRows();
                        return bd_time;
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
    }, []);

    return (
        <Page >
            {/* <PageSection variant={PageSectionVariants.light}>
                <MultiDropdown/>
            </PageSection> */}
            <PageBody
                column_names={column_names_devices}
                rows={devices}
                column_ID={column_ID_devices}
                loading={loading}
                error={errorRows || errorTime}
            />
        </Page>
    );
};
