import React, { useRef, useState } from "react";
import {
    Drawer,
    DrawerPanelContent,
    DrawerContent,
    DrawerContentBody,
    DrawerHead,
    DrawerActions,
    DrawerCloseButton,
    Button,
    Flex,
    FlexItem,
    DrawerPanelBody,
    Tooltip,
    Spinner,
    Bullseye,
    Alert,
    Stack as Stack_Platform,
    StackItem,
    Modal,
    ModalVariant,
} from "@patternfly/react-core";
import { CloseIcon } from "@patternfly/react-icons";
import { TableFlex } from "./Table";
import UserRedacor from "./redactors/UserRedacor";
import TestsRedactor from "./redactors/TestsRedactor";
import DevicesRedactor from "./redactors/DevicesRedactor";
import {Users, Tests, Devices, Stack, Stand} from "@app/types/Types"
import { change_row, delete_row, post_row } from "@app/configs/Axios_configs";
import StackRedactor from "./redactors/StackRedactor";
import StandRedactor from "./redactors/StandRedactor";

export const PageBody = ({column_names, rows, column_ID, loading, error}) => {
    //открытие зарытие редактора
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    //данные редактора пользователей
    const [repositoryUsers, setRepositoryUsers] = useState<Users>(
        {
            id: "",
            name: "",
            number: "",
            password: "",
            token: "",
            access: "",
        }
    );
    //данные редактора тестов
    const [repositoryTests, setRepositoryTests] = useState<Tests>(
        {
            id: "",
            user: "",
            zone: "",
            x: "",
            y: "",
            device: "",
            percent: "",
            beginning: "",
            ip: "",
            status: ""
        }
    );
    //данные редактора устройств
    const [repositoryDevices, setRepositoryDevices] = useState<Devices>(
        {
            id: "",
            serial: "",
            mac: "",
            place: "",
            property: "",
        }
    );
    //данные редактора устройств
    const [repositoryStack, setRepositoryStack] = useState<Stack>(
        {
            id: "",
            name: "",
            x: "",
            y: "",
        }
    );
    //отслеживание создаём мы или редактируем строку
    const [creating, setCreating] = useState<boolean>(false)
    //сброс данных в редакторе
    const [cancel, setCancel] = useState<boolean>(false)
    // открыто ли модальное окно
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    // id стенда
    const [idForDeleteStand, setIdForDeleteStand] = useState<number>(0)
    // произошло ли изменение редактора
    const [changed, setIsChanged] = useState<boolean>(true)

    const drawerRef = useRef<HTMLDivElement>();

    const onExpand = () => {
        drawerRef.current && drawerRef.current.focus();
    };

    //установка данных из таблицы для редактора
    const onClick = (repo: Users & Tests & Devices & Stack) => {
        if (column_names[0] == "ФИО"){
            setRepositoryUsers(repo)
        } else if (column_names[0] == "Пользователь" || column_names[0] == "x") {
            setRepositoryTests(repo)
        } else if (column_names[0] == "Серийный номер") {
            setRepositoryDevices(repo)
        } else {
            setRepositoryStack(repo)
        }
        setCancel(false)
        setIsExpanded(true);
    };

    //закрытие редактора
    const onCloseClick = () => {
        setIsExpanded(false);
    };

    //сохранение изменений строки
    const handleSave = () => {
        if (column_names[0] == "ФИО") {
            change_row("users", repositoryUsers.id,
                {
                    fio: repositoryUsers.name,
                    tabnumber: repositoryUsers.number,
                    password: repositoryUsers.password,
                    token: repositoryUsers.token,
                    access: repositoryUsers.access,
                }
            );
        } else if (column_names[0] == "Пользователь" || column_names[0] == "x") {
            change_row("test", repositoryTests.id,
                {
                    id_user: repositoryTests.user,
                    id_zone: repositoryTests.zone,
                    x_coord: repositoryTests.x,
                    y_coord: repositoryTests.y,
                    id_device: repositoryTests.device,
                    id_stage: repositoryTests.percent,
                    ip: repositoryTests.ip,
                    start_time: repositoryTests.beginning,
                    status: repositoryTests.status == "Завершено" ?
                        "PASS"
                    :
                        repositoryTests.status == "Действие" ?
                            "INTERACT_REM"
                        :
                            repositoryTests.status == "Ошибка" ?
                                "FAIL"
                            :
                                repositoryTests.status == "Не отвечает" ?
                                    "ERROR"
                                :
                                    repositoryTests.status == "Тестирование" ?
                                        "PROGRES"
                                    :
                                        "EMPTY"
                }
            );
            console.log({
                id_user: repositoryTests.user,
                id_zone: repositoryTests.zone,
                x_coord: repositoryTests.x,
                y_coord: repositoryTests.y,
                id_device: repositoryTests.device,
                id_stage: repositoryTests.percent,
                ip: repositoryTests.ip,
                status: repositoryTests.status == "Завершено" ?
                    "PASS"
                :
                    repositoryTests.status == "Действие" ?
                        "INTERACT_REM"
                    :
                        repositoryTests.status == "Ошибка" ?
                            "FAIL"
                        :
                            repositoryTests.status == "Не отвечает" ?
                                "ERROR"
                            :
                                repositoryTests.status == "Тестирование" ?
                                    "PROGRES"
                                :
                                    "EMPTY"
            })
        } else if (column_names[0] == "Серийный номер") {
            change_row("devices", repositoryDevices.id,
                {
                    serial_number: repositoryDevices.serial,
                    mac: repositoryDevices.mac,
                    place_number: repositoryDevices.place,
                    properties: repositoryDevices.property,
                }
            );
        } else {
            change_row("stand", repositoryStack.id,
                {
                    stand_name: repositoryStack.name,
                    stand_x: repositoryStack.x,
                    stand_y: repositoryStack.y,
                }
            )
        }
        setIsExpanded(false)
    }

    //отслеживание изменений в редакторе
    const userChanger = (repo: Users) => {
        setRepositoryUsers(repo)
    };

    const testChanger = (repo: Tests) => {
        setRepositoryTests(repo)
    };

    const deviceChanger = (repo: Devices) => {
        setRepositoryDevices(repo)
    };

    const stackChanger = (repo: Stack) => {
        setRepositoryStack(repo)
    };

    //создание новой строки
    const handlePost = () => {
        if (column_names[0] == "ФИО") {
            post_row("users",
                {
                    fio: repositoryUsers.name,
                    tabnumber: repositoryUsers.number,
                    password: repositoryUsers.password,
                    token: repositoryUsers.token,
                    access: repositoryUsers.access,
                }
            );
        } else if (column_names[0] == "Пользователь" || column_names[0] == "x") {
            post_row("test",
                {
                    id_device: repositoryTests.device,
                    id_zone: repositoryTests.zone,
                    x_coord: repositoryTests.x,
                    y_coord: repositoryTests.y,
                    id_user: repositoryTests.user,
                    id_stage: repositoryTests.percent,
                    ip: repositoryTests.ip,
                    status:  repositoryTests.status == "Завершено" ?
                        "PASS"
                    :
                        repositoryTests.status == "Действие" ?
                            "INTERACT_REM"
                        :
                            repositoryTests.status == "Ошибка" ?
                                "FAIL"
                            :
                                repositoryTests.status == "Не отвечает" ?
                                    "ERROR"
                                :
                                    repositoryTests.status == "Тестирование" ?
                                        "PROGRES"
                                    :
                                        "EMPTY"
                }
            );
        } else if (column_names[0] == "Серийный номер") {
            post_row("devices",
                {
                    serial_number: repositoryDevices.serial,
                    mac: repositoryDevices.mac,
                    place_number: repositoryDevices.place,
                    properties: repositoryDevices.property,
                }
            );
        } else {
            post_row("stand",
                {
                    stand_name: repositoryStack.name,
                    stand_x: repositoryStack.x,
                    stand_y: repositoryStack.y,
                }
            );
        }
        setCreating(false)
        setIsExpanded(false)
    }

    //установка режима создания новой строки
    const createNewRepo = () => {
        setCreating(true)
        setCancel(!cancel)
        setIsExpanded(true)
    }

    //удаление строки
    const handleDelete = (id: number) => {
        if (column_names[0] == "ФИО") {
            delete_row("users", id)
        } else if (column_names[0] == "Пользователь" || column_names[0] == "x") {
            delete_row("test", id)
        } else if (column_names[0] == "Серийный номер") {
            delete_row("devices", id)
        } else {
            setIdForDeleteStand(id)
            setIsModalOpen(true)
        }
        setIsExpanded(false)
    }

    // выводимый редактор
    const panelContent = (
        <DrawerPanelContent defaultSize={"320px"}>
            <DrawerHead>
                <div style={{ fontSize: "20px", fontWeight: "800px"}} tabIndex={isExpanded ? 0 : -1}>
                    Редактор
                </div>
                <DrawerActions>
                    <DrawerCloseButton onClick={onCloseClick} />
                </DrawerActions>
            </DrawerHead>
            <DrawerPanelBody>
                <Stack_Platform hasGutter>
                    <StackItem>
                        {column_names[0] == "ФИО" ?
                            <UserRedacor cancel={cancel} repo={repositoryUsers} isChanged={(flag: boolean)=>setIsChanged(flag)} changedRepo={(newRepo: Users)=>userChanger(newRepo)}/>
                        :
                            column_names[0] == "Пользователь" ?
                                <TestsRedactor cancel={cancel} repo={repositoryTests} isChanged={(flag: boolean)=>setIsChanged(flag)} changedRepo={(newRepo: Tests)=>testChanger(newRepo)}/>
                            :
                                column_names[0] == "Серийный номер" ?
                                    <DevicesRedactor cancel={cancel} repo={repositoryDevices} isChanged={(flag: boolean)=>setIsChanged(flag)} changedRepo={(newRepo: Devices)=>deviceChanger(newRepo)}/>
                                :
                                    column_names[0] == "Имя" ?
                                        <StandRedactor cancel={cancel} repo={repositoryStack}  isChanged={(flag: boolean)=>setIsChanged(flag)} changedRepo={(newRepo: Stack)=>stackChanger(newRepo)}/>
                                    :
                                        <StackRedactor cancel={cancel} repo={repositoryTests} isChanged={(flag: boolean)=>setIsChanged(flag)} changedRepo={(newRepo: Tests)=>testChanger(newRepo)}/>
                        }
                    </StackItem>
                    <StackItem>
                        <Flex justifyContent={{ default: "justifyContentSpaceBetween" }}>
                            <FlexItem>
                                <Button
                                    isDisabled={changed}
                                    variant="secondary"
                                    onClick={()=>{creating ? handlePost() : handleSave()}}
                                >
                                    Сохранить
                                </Button>
                            </FlexItem>
                            <FlexItem>
                                <Tooltip position="bottom"
                                    content={
                                        <div>
                                            сброс
                                        </div>
                                    }
                                >
                                    <Button variant="secondary" isDanger onClick={() => setCancel(!cancel)}><CloseIcon/></Button>
                                </Tooltip>
                            </FlexItem>
                        </Flex>
                    </StackItem>
                </Stack_Platform>
            </DrawerPanelBody>
        </DrawerPanelContent>
    );

    return (
        <React.Fragment>
            <Modal
                variant={ModalVariant.medium}
                title="Удаление стелажа приведёт к удалению его устройств из базы"
                tabIndex={0}
                isOpen={isModalOpen}
                onClose={()=>setIsModalOpen(false)}
            >
                <Flex justifyContent={{ default: 'justifyContentSpaceAround' }}>
                    <FlexItem>
                        <Button variant="secondary" isDanger onClick={() => (delete_row("stand", idForDeleteStand),  setIsModalOpen(false))}>Удалить</Button>
                    </FlexItem>
                    <FlexItem>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Отмена</Button>
                    </FlexItem>
                </Flex>
            </Modal>
            <div style={{ overflowY: "scroll", overflow: "hidden", height: "100vh"}}>
                <Drawer isExpanded={isExpanded} position="left" onExpand={onExpand}>
                    <DrawerContent panelContent={panelContent}>
                        <DrawerContentBody>
                            <Flex justifyContent={{ default: "justifyContentCenter" }}>
                                {loading ?
                                    <Bullseye style={{marginTop: "15%"}}>
                                        <Spinner isSVG size="xl" aria-label="loading"/>
                                    </Bullseye>
                                :
                                    <FlexItem style={{width: "100%"}}>
                                        {error ?
                                            <Alert variant="danger" title="Ошибка при подключении к серверу (переходя на другую страницу, вы потеряете доступ к данным)" />
                                        :
                                            ""
                                        }
                                        <div style={{display: "flex", position: "fixed", zIndex: 1, right: "16px", margin: "8px"}}>
                                            <Button isDisabled={isExpanded} onClick={()=>createNewRepo()}>Создать</Button>
                                        </div>
                                        <TableFlex
                                            names={column_names}
                                            rows={rows}
                                            ids={column_ID}
                                            expanded={isExpanded}
                                            correct={(repo: Users & Tests & Devices & Stack)=>onClick(repo)} handleDelete={(id: number)=>handleDelete(id)}
                                        />
                                    </FlexItem>
                                }
                            </Flex>
                        </DrawerContentBody>
                    </DrawerContent>
                </Drawer>
            </div>
        </React.Fragment>
    );
};
