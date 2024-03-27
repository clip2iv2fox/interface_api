import React, { useEffect, useState } from "react"

import { Flex, FlexItem, TextInput } from "@patternfly/react-core";
import { Stack } from "@app/types/Types";

type StackRedactorProps = {
    cancel: boolean;                            // флаг сброса изменений
    repo: Stack;                                // передаваемые данные
    isChanged: (flag: boolean) => void;         // флаг были ли произведены изменения
    changedRepo: (newRepo: Stack) => void;      // изменеённая пачка данных
}

const StandRedactor: React.FC<StackRedactorProps> = ({cancel, repo, isChanged, changedRepo}) => {
    let id: string = repo.id
    const [x, setX] = useState<string>(repo.x)
    const [y, setY] = useState<string>(repo.y)
    const [name, setName] = useState<string>(repo.name)
    const [clear, setClear] = useState<boolean>(false)
    // копия изначальной пачки данных (использую useState, тк не обновляется после первого добавления)
    const [repoCopy, setRepoCopy] = useState<Stack>(repo)

    // отслеживание и отправка изменений
    useEffect(() => {
        changedRepo(
            {
                id: id,
                x: x,
                y: y,
                name: name
            }
        )

        if (repoCopy.x != x || repoCopy.y != y || repoCopy.name != name) {
            isChanged(false)
        } else {
            isChanged(true)
        }
    }, [x, y, name])

    // сброс данных в редакторе
    if (cancel != clear) {
        setClear(cancel)
        setX("")
        setY("")
        setName("")
    }

    return (
        <Flex direction={{ default: 'column' }}>
            <FlexItem spacer={{ default: 'spacerMd' }}>
                Name
                <TextInput id={"name"} value={name} onChange={(name)=>(setName(name))} type="text"/>
            </FlexItem>
            <FlexItem spacer={{ default: 'spacerMd' }}>
                x
                <TextInput id={"x"} value={x} onChange={(x)=>(setX(x))} isDisabled type="number"/>
            </FlexItem>
            <FlexItem spacer={{ default: 'spacerMd' }}>
                y
                <TextInput id={"y"} value={y} onChange={(y)=>(setY(y))} isDisabled type="number"/>
            </FlexItem>
        </Flex>
    )
}

export default StandRedactor;