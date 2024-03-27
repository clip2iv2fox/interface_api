import React, { useEffect, useState } from "react"

import { Flex, FlexItem, TextInput } from "@patternfly/react-core";
import { Devices } from "@app/types/Types";

type DevicesRedactorProps = {
    cancel: boolean;                            // флаг сброса изменений
    repo: Devices;                              // передаваемые данные
    isChanged: (flag: boolean) => void;         // флаг были ли произведены изменения
    changedRepo: (newRepo: Devices) => void;    // изменеённая пачка данных
}

const DevicesRedactor: React.FC<DevicesRedactorProps> = ({cancel, repo, isChanged, changedRepo}) => {
    let id: string = repo.id
    const [serial, setSerial] = useState<string>(repo.serial)
    const [mac, setMAC] = useState<string>(repo.mac)
    const [place, setPlace] = useState<string>(repo.place)
    const [property, setProperty] = useState<string>(repo.property)
    const [clear, setClear] = useState<boolean>(false)
    // копия изначальной пачки данных (использую useState, тк не обновляется после первого добавления)
    const [repoCopy, setRepoCopy] = useState<Devices>(repo)

    // отслеживание и отправка изменений
    useEffect(() => {
        changedRepo(
            {
                id: id,
                serial: serial,
                mac: mac,
                place: place,
                property: property,
            }
        )

        if (repoCopy.serial != serial || repoCopy.mac != mac || repoCopy.place != place || repoCopy.property != property) {
            isChanged(false)
        } else {
            isChanged(true)
        }
    }, [serial, mac, place, property])

    // сброс данных в редакторе
    if (cancel != clear) {
        setClear(cancel)
        setSerial("")
        setMAC("")
        setPlace("")
        setProperty("")
    }

    return (
        <Flex direction={{ default: 'column' }}>
            <FlexItem spacer={{ default: 'spacerMd' }}>
                Серийный номер
                <TextInput id={"serial"} value={serial} onChange={(serial)=>(setSerial(serial))} type="text"/>
            </FlexItem>
            <FlexItem spacer={{ default: 'spacerMd' }}>
                MAC
                <TextInput id={"mac"} value={mac} onChange={(mac)=>(setMAC(mac))} type="text"/>
            </FlexItem>
            <FlexItem spacer={{ default: 'spacerMd' }}>
                Номер места
                <TextInput id={"place"} value={place} onChange={(place)=>(setPlace(place))} type="text"/>
            </FlexItem>
            <FlexItem spacer={{ default: 'spacerMd' }}>
                Свойства
                <TextInput id={"property"} value={property} onChange={(property)=>(setProperty(property))} type="text"/>
            </FlexItem>
        </Flex>
    )
}

export default DevicesRedactor;