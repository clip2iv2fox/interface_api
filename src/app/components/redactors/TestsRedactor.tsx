import React, { useEffect, useState } from "react"

import { Flex, FlexItem, TextInput } from "@patternfly/react-core";
import { Tests } from "@app/types/Types";
import { MultiDropdown } from "../MultiDropdown";

type TestsRedactorProps = {
    cancel: boolean;                            // флаг сброса изменений
    repo: Tests;                                // передаваемые данные
    isChanged: (flag: boolean) => void;         // флаг были ли произведены изменения
    changedRepo: (newRepo: Tests) => void;      // изменеённая пачка данных
}

const TestsRedactor: React.FC<TestsRedactorProps> = ({cancel, repo, isChanged, changedRepo}) => {
    let id: string = repo.id
    const [user, setUser] = useState<string>(repo.user)
    const [zone, setZone] = useState<string>(repo.zone)
    const [device, setDevice] = useState<string>(repo.device)
    const [percent, setPercent] = useState<string>(repo.percent)
    const [beginning, setBeginning] = useState<string>(repo.beginning)
    const [status, setStatus] = useState<string>(repo.status)
    const [clear, setClear] = useState<boolean>(false)
    // копия изначальной пачки данных (использую useState, тк не обновляется после первого добавления)
    const [repoCopy, setRepoCopy] = useState<Tests>(repo)

    // набор пунктов для MultiDropdown
    const list = [
        {
            value: "Завершено",
            disabled: false
        },
        {
            value: "Действие",
            disabled: false
        },
        {
            value: "Ошибка",
            disabled: false
        },
        {
            value: "Не отвечает",
            disabled: false
        },
        {
            value: "Тестирование",
            disabled: false
        },
        {
            value: "Пусто",
            disabled: false
        },
    ]

    // отслеживание и отправка изменений
    useEffect(() => {
        changedRepo(
            {
                id: id,
                user: user,
                zone: zone,
                x: repo.x,
                y: repo.y,
                device: device,
                percent: percent,
                beginning: beginning,
                ip: repo.ip,
                status: status
            }
        )

        if (repoCopy.user != user ||
            repoCopy.zone != zone ||
            repoCopy.device != device ||
            repoCopy.percent != percent ||
            repoCopy.beginning != beginning ||
            repoCopy.status != status
        ) {
            isChanged(false)
        } else {
            isChanged(true)
        }
    }, [user, zone, device, percent, beginning, status])

    // сброс данных в редакторе
    if (cancel != clear) {
        setClear(cancel)
        setUser("")
        setZone("")
        setDevice("")
        setPercent("")
        setBeginning("")
        setStatus("")
    }

    return (
        <Flex direction={{ default: 'column' }}>
            <FlexItem spacer={{ default: 'spacerSm' }}>
                Пользователь
                <TextInput id={"user"} value={user} onChange={(user)=>(setUser(user))} type="text"/>
            </FlexItem>
            <FlexItem spacer={{ default: 'spacerSm' }}>
                Зона
                <TextInput id={"zone"} value={zone} onChange={(zone)=>(setZone(zone))} type="text"/>
            </FlexItem>
            <FlexItem spacer={{ default: 'spacerSm' }}>
                x
                <TextInput isDisabled id={"x"} value={repoCopy.x} type="text"/>
            </FlexItem>
            <FlexItem spacer={{ default: 'spacerSm' }}>
                y
                <TextInput isDisabled id={"y"} value={repoCopy.y} type="text"/>
            </FlexItem>
            <FlexItem spacer={{ default: 'spacerSm' }}>
                Устройство
                <TextInput id={"device"} value={device} onChange={(device)=>(setDevice(device))} type="text"/>
            </FlexItem>
            <FlexItem spacer={{ default: 'spacerSm' }}>
                Стадия / %
                <TextInput id={"percent"} value={percent} onChange={(percent)=>(setPercent(percent))} type="text"/>
            </FlexItem>
            <FlexItem spacer={{ default: 'spacerSm' }}>
                Статус
                <MultiDropdown options={list} chosen={(value)=>setStatus(value)} firstItem={repoCopy.status}/>
            </FlexItem>
        </Flex>
    )
}

export default TestsRedactor