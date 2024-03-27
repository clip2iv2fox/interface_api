import React, { useEffect, useState } from "react";
import { PageBody } from "@app/components/PageBody";
import { Devices_server, Stack_server, Tests, Tests_server, Users_server } from "@app/types/Types";
import { get_rows, get_time } from "@app/configs/Axios_configs";

export const Tests_page = () => {
    const [time, setTime] = useState<string>("")                // время последнего обновления данных
    const [tests, setTests] = useState<Tests[]>()               // полученные тестируемые
    const [loading, setLoading] = useState<boolean>(true)       // флаг проходит ли сейчас начальная загрузка данных
    const [errorTime, setErrorTime] = useState(false)           // ошибка при получении времени
    const [errorRows, setErrorRows] = useState(false)           // ошибка при получении данных

    // название столбцов таблицы на странице
    const column_names_tests = ["Пользователь", "Зона", "x", "y", "Устройство", "Стадия / %", "Статус"];

    // название ключей в JSON файле, которые выводятся в таблице (совпадают с пунктами фильтрации)
    const column_ID_tests = ["user", "zone", "x", "y", "device", "percent", "status"]

    // получение данных
    useEffect(() => {
        // получение строк таблицы (стендов)
        const fetchRows = async () => {
            const bd_data_promise: Promise<Users_server | Tests_server | Devices_server | Stack_server | string> = get_rows("test?");
            const bd_data = await bd_data_promise;
            if (Array.isArray(bd_data)) {
                const tests = bd_data.map((test: Tests_server) => ({
                    id: test.id != undefined ? test.id : "",
                    user: test.id_user,
                    zone: test.id_zone,
                    x: test.x_coord,
                    y: test.y_coord,
                    device: test.id_device,
                    percent: test.id_stage,
                    beginning: test.create_at != undefined ? test.create_at : "",
                    ip: test.ip,
                    status: test.status == "PASS" ?
                        "Завершено"
                    :
                        test.status == "INTERACT_LOC" || test.status == "INTERACT_REM" ?
                            "Действие"
                        :
                            test.status == "FAIL" ?
                                "Ошибка"
                            :
                                test.status == "ERROR" ?
                                    "Не отвечает"
                                :
                                    test.status == "PROGRES" ?
                                        "Тестирование"
                                    :
                                        "Пусто"
                }));
                setErrorRows(false)
                setTests(tests);
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
        <React.Fragment>
            <PageBody
                column_names={column_names_tests}
                rows={tests}
                column_ID={column_ID_tests}
                loading={loading}
                error={errorRows || errorTime}
            />
        </React.Fragment>
    );
};
