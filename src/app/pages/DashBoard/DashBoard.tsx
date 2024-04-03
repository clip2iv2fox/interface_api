import React, { useEffect, useState } from 'react'
import CardStack from './components/CardStack'
import { Bullseye, Flex, FlexItem, Page, Spinner, Split, SplitItem} from '@patternfly/react-core';
import { useLocation } from 'react-router-dom';
import { Stand, Tests, Tests_server } from '@app/types/Types';
import { get_id, get_rows, get_time } from '@app/configs/Axios_configs';

const DashBoard_page = () => {
    const [time, setTime] = useState<string>("");                           // время последнего обновления данных
    const [stand, setStand] = useState<Stand>(                              // полученные стенды
        {
            id: "",
            name: "",
            x: "0",
            y: "0",
            create_at: "",
            modified_at: ""
        }
    );
    const [devices, setDevices] = useState<Tests[]>([                       // тестируемое данного стенда
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
    const [loadingDevices, setLoadingDevices] = useState<boolean>(true);    // флаг проходит ли сейчас начальная загрузка тестируемого
    const [errorTime, setErrorTime] = useState(false);                      // ошибка при загрузке времени
    const [errorData, setErrorData] = useState(false);                      // ошибка при загрузке данных
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)          // открыто ли модальное окно логов
    const [logsCard, setCardLogs] = useState<Tests>()
    const logs: any = []

    // определение страницы для получения данных
    const id = useLocation();

    // получение данных
    useEffect(() => {
        // получение данных
        const fetchData = async () => {
            try {
                setLoadingStand(true);
                setLoadingDevices(true);

                // получение стендов
                const standData = await get_id(`stand${id.pathname.replace("Zone", "")}`);
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
                    setLoadingStand(false);
                    setLoadingDevices(false);
                }
                setLoadingStand(false);

                // получение тестируемых
                const devicesData = await get_rows(
                    `test?id_zone=${id.pathname.replace("/", "")}&`
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
                        status: device.status,
                        beginning: device.create_at != undefined ? device.create_at : "",
                    }));
                    setErrorData(false);
                    setDevices(devices);
                } else {
                    setErrorData(true);
                    setLoadingStand(false);
                    setLoadingDevices(false);
                }
                setLoadingDevices(false);
            } catch (error) {
                // Handle errors
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

    // открытие модального окна логов
    const openModal = (flag: boolean, card: Tests) => {


    }

    // создание элементов в строке
    function repeatX(y: number): React.JSX.Element | undefined {
        // массив для элементов в строке, где первый - это её номер
        const elements: any = [(
            <SplitItem key={`${y}- coordinate`}>
                <Flex>
                    <FlexItem>
                        <div style={{color: "#6a6e73", paddingTop: "21px"}}>
                            {y + 1}
                        </div>
                    </FlexItem>
                </Flex>
            </SplitItem>
        )];
        // элемент, которого нет в бд, но по размерности стенда о должен быть
        const newFound = {
            id: "",
            device: "name",
            zone: "",
            x: "",
            y: "",
            user: "",
            percent: "",
            ip: "",
            status: "EMPTY",
            beginning: "",
        };

        // создание элементов строки
        for (let i = 0; i <= parseInt(stand.x) - 1; i++) {
            const foundDevice = devices.find(device => device.x === `${i + 1}` && device.y === `${y + 1}`);
            elements.push(
                <SplitItem isFilled key={`${i}-${y}`}>
                    <CardStack
                        card={foundDevice ? foundDevice : newFound}
                        openModal={(flag, card)=>openModal(flag, card)}
                    />
                </SplitItem>
            );
        }

        return elements;
    }

    // создание строки
    function repeatY(): React.JSX.Element | undefined {
        const elements: any = [];

        for (let i = 0; i <= parseInt(stand.y) - 1; i++) {
            elements.push(
                <FlexItem key={i}>
                    <Split hasGutter>
                        {repeatX(i)}
                    </Split>
                </FlexItem>
            );
        }

        return elements;
    }

    return (
        <Page>
            {loadingStand && loadingDevices ?
                <Flex justifyContent={{ default: "justifyContentCenter" }}>
                    <Bullseye style={{marginTop: "15%"}}>
                        <Spinner isSVG size="xl" aria-label="loading"/>
                    </Bullseye>
                </Flex>
            :
                errorTime || errorData ?
                    <Flex justifyContent={{ default: "justifyContentCenter" }}>
                        <Bullseye style={{marginTop: "15%", color: "#751400"}}>
                            Нет подключения к серверу
                        </Bullseye>
                    </Flex>
                :
                    <div style={{ overflowY: "scroll", overflow: "hidden", height: "100vh", padding: "15px"}}>
                        <Flex  direction={{ default: 'column' }}>
                            {repeatY()}
                        </Flex>
                    </div>
            }
        </Page>
    );
};

export default DashBoard_page