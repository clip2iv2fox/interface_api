import React, { useEffect, useState } from "react";
import { PageBody } from "@app/components/PageBody";
import { Devices_server, Stack_server, Tests_server, Users, Users_server } from "@app/types/Types";
import { get_rows, get_time } from "@app/configs/Axios_configs";

export const Users_page = () => {
    const [time, setTime] = useState<string>("")                // время последнего обновления данных
    const [loading, setLoading] = useState<boolean>(true)       // флаг проходит ли сейчас начальная загрузка данных
    const [users, setUsers] = useState<Users[]>()               // полученные пользователи
    const [errorTime, setErrorTime] = useState(false)           // ошибка при получении времени
    const [errorRows, setErrorRows] = useState(false)           // ошибка при получении данных

    // название столбцов таблицы на странице
    const column_names_users = ["ФИО", "Табельный номер", "Пароль", "Токен", "Доступ"];

    // название ключей в JSON файле, которые выводятся в таблице (совпадают с пунктами фильтрации)
    const column_ID_users = ["name", "number", "password", "token", "access"]

    // получение данных
    useEffect(() => {
        // получение строк таблицы (стендов)
        const fetchRows = async () => {
            const bd_data_promise: Promise<Users_server | Tests_server | Devices_server | Stack_server | string> = get_rows("users?");
            const bd_data = await bd_data_promise;
            if (Array.isArray(bd_data)) {
                const users = bd_data.map((user: Users_server) => ({
                    id: user.id != undefined ? user.id : "",
                    name: user.fio,
                    number: user.tabnumber,
                    password: user.password,
                    token: user.token,
                    access: user.access,
                }));
                setErrorRows(false)
                setUsers(users);
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
    }, [time]);

    return (
        <React.Fragment>
            <PageBody
                column_names={column_names_users}
                rows={users}
                column_ID={column_ID_users}
                loading={loading}
                error={errorTime || errorRows}
            />
        </React.Fragment>
    );
};
