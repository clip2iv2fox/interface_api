import React, { useEffect, useState } from "react"

import { Flex, FlexItem, TextInput } from "@patternfly/react-core"
import { Users } from "@app/types/Types";

type UserRedacorProps = {
    cancel: boolean;                            // флаг сброса изменений
    repo: Users;                                // передаваемые данные
    isChanged: (flag: boolean) => void;         // флаг были ли произведены изменения
    changedRepo: (newRepo: Users) => void;      // изменеённая пачка данных
}

const UserRedacor: React.FC<UserRedacorProps> = ({cancel, repo, isChanged, changedRepo}) => {
    let id: string = repo.id
    const [name, setName] = useState<string>(repo.name)
    const [number, setNumber] = useState<string>(repo.number)
    const [password, setPassword] = useState<string>(repo.password)
    const [token, setToken] = useState<string>(repo.token)
    const [access, setAccess] = useState<string>(repo.access)
    const [clear, setClear] = useState<boolean>(false)
    // копия изначальной пачки данных (использую useState, тк не обновляется после первого добавления)
    const [repoCopy, setRepoCopy] = useState<Users>(repo)

    // отслеживание и отправка изменений
    useEffect(() => {
        changedRepo(
            {
                id: id,
                name: name,
                number: number,
                password: password,
                token: token,
                access: access,
            }
        )

        if (repoCopy.name != name ||
            repoCopy.number != number ||
            repoCopy.password != password ||
            repoCopy.token != token ||
            repoCopy.access != access
        ) {
            isChanged(false)
        } else {
            isChanged(true)
        }
    }, [name, number, password, token, access])

    // сброс данных в редакторе
    if (cancel != clear) {
        setClear(cancel)
        setName("")
        setNumber("")
        setPassword("")
        setToken("")
        setAccess("")
    }

    return (
        <Flex direction={{ default: 'column' }}>
            <FlexItem spacer={{ default: 'spacerMd' }}>
                ФИО
                <TextInput id={"name"} value={name != null ? name : ""} onChange={(name)=>setName(name)} type="text"/>
            </FlexItem>
            <FlexItem spacer={{ default: 'spacerMd' }}>
                Табельный номер
                <TextInput id={"number"} value={number != null ? number : ""} onChange={(number)=>setNumber(number)} type="text"/>
            </FlexItem>
            <FlexItem spacer={{ default: 'spacerMd' }}>
                Пароль
                <TextInput id={"password"} value={password != null ? password : ""} onChange={(password)=>setPassword(password)} type="text"/>
            </FlexItem>
            <FlexItem spacer={{ default: 'spacerMd' }}>
                Токен
                <TextInput id={"token"} value={token != null ? token : ""} onChange={(token)=>setToken(token)} type="text"/>
            </FlexItem>
            <FlexItem spacer={{ default: 'spacerMd' }}>
                Доступ
                <TextInput id={"access"} value={access != null ? access : ""} onChange={(access)=>setAccess(access)} type="text"/>
            </FlexItem>
        </Flex>
    )
}

export default UserRedacor