import React, { useEffect, useState } from "react";
import { PageBody } from "@app/components/PageBody";
import { Page } from "@patternfly/react-core";
import { Devices_server, Stack, Stack_server, Tests_server, Users_server } from "@app/types/Types";
import { get_rows, get_time } from "@app/configs/Axios_configs";

export const Config_page = () => {
    const [time, setTime] = useState<string>("")                // время последнего обновления данных
    const [stack, setStack] = useState<Stack[]>([])             // полученные стенды
    const [loading, setLoading] = useState<boolean>(true)       // флаг проходит ли сейчас начальная загрузка данных
    const [errorTime, setErrorTime] = useState(false)           // ошибка при получении времени
    const [errorRows, setErrorRows] = useState(false)           // ошибка при получении данных

    const column_names_stack = ["Имя", "x", "y"];               // название столбцов таблицы на странице

    const column_ID_stack = ["name", "x", "y"]                  // название ключей в JSON файле, которые выводятся в таблице (совпадают с пунктами фильтрации)

    // получение данных
    useEffect(() => {
        // получение строк таблицы (стендов)
        const fetchRows = async () => {
            const bd_data_promise: Promise<Users_server | Tests_server | Devices_server | Stack_server | string> = get_rows("stand?");
            const bd_data = await bd_data_promise;
            if (Array.isArray(bd_data)) {
                const stacks = bd_data.map((stack: Stack_server) => ({
                    id: stack.id != undefined ? stack.id : "",
                    name: stack.stand_name,
                    x: stack.stand_x,
                    y: stack.stand_y,
                }));
                setErrorRows(false)
                setStack(stacks);
                setLoading(false)
            } else {
                // Обработка ошибки
                setErrorRows(true)
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
                setErrorTime(false)
            }).catch((error) => {
                // Обработка ошибки
                setErrorTime(true)
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [time]);

    return (
        <Page>
            <PageBody
                column_names={column_names_stack}
                rows={stack}
                column_ID={column_ID_stack}
                loading={loading}
                error={errorTime || errorRows}
            />
        </Page>
    );
};
