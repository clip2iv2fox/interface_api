import React, { useEffect, useState } from "react"

import { Flex, FlexItem, TextInput } from "@patternfly/react-core";
import { Tests } from "@app/types/Types";

type StackRedactorProps = {
    cancel: boolean;                            // флаг сброса изменений
    repo: Tests;                                // передаваемые данные
    isChanged: (flag: boolean) => void;         // флаг были ли произведены изменения
    changedRepo: (newRepo: Tests) => void;      // изменеённая пачка данных
}

const StackRedactor: React.FC<StackRedactorProps> = ({cancel, repo, isChanged, changedRepo}) => {
    const [x, setX] = useState<string>(repo.x)
    const [y, setY] = useState<string>(repo.y)
    const [ip, setIP] = useState<string>(repo.ip)
    const [clear, setClear] = useState<boolean>(false)
    // копия изначальной пачки данных (использую useState, тк не обновляется после первого добавления)
    const [repoCopy, setRepoCopy] = useState<Tests>(repo)

    // отслеживание и отправка изменений
    useEffect(() => {
        changedRepo(
            {
                id: repoCopy.id,
                user: repoCopy.user,
                zone: repoCopy.zone,
                x: x,
                y: y,
                device: repoCopy.device,
                percent: repoCopy.percent,
                beginning: repoCopy.beginning,
                ip: ip,
                status: repoCopy.status
            }
        )

        if (repoCopy.x != x || repoCopy.y != y || repoCopy.ip != ip) {
            isChanged(false)
        } else {
            isChanged(true)
        }
    }, [x, y, ip])

    // сброс данных в редакторе
    if (cancel != clear) {
        setClear(cancel)
        setX("")
        setY("")
        setIP("")
    }

    return (
        <Flex direction={{ default: 'column' }}>
            <FlexItem spacer={{ default: 'spacerMd' }}>
                x
                <TextInput id={"x"} value={x} onChange={(x)=>(setX(x))} type="number"/>
            </FlexItem>
            <FlexItem spacer={{ default: 'spacerMd' }}>
                y
                <TextInput id={"y"} value={y} onChange={(y)=>(setY(y))} type="number"/>
            </FlexItem>
            <FlexItem spacer={{ default: 'spacerMd' }}>
                IP
                <TextInput id={"ip"} value={ip} onChange={(ip)=>(setIP(ip))} type="text"/>
            </FlexItem>
        </Flex>
    )
}

export default StackRedactor;