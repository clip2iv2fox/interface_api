export type Users = {
    id: string;
    name: string;
    number: string;
    password: string;
    token: string;
    access: string;
}

export type Tests = {
    id: string;
    user: string;
    zone: string;
    x: string;
    y: string;
    device: string;
    percent: string;
    beginning: string;
    status: string;
    ip: string;
}

export type Devices = {
    id: string;
    serial: string;
    mac: string;
    place: string;
    property: string;
}

export type Stack = {
    id: string;
    name: string;
    x: string;
    y: string;
}

export type Stack_server = {
    id?: string;
    stand_name: string;
    stand_x: string;
    stand_y: string;
}

export type Devices_server = {
    id?: string,
    serial_number: string,
    mac: string,
    place_number: string,
    properties: string
}

export type Tests_server = {
    id?: string,
    id_user: string,
    id_zone: string,
    x_coord: string,
    y_coord: string,
    id_device: string,
    id_stage: string,
    create_at?: string,
    start_time?: string,
    ip: string,
    status: string
}

export type Users_server = {
    id?: string,
    fio: string,
    tabnumber: string,
    password: string,
    token: string,
    access: string,
}

export type Stack_card = {
    id: string,
    time: string,
    stage: string,
    type: string
}

export type Stand = {
    id?: string,
    name: string,
    x: string,
    y: string,
    create_at: string,
    modified_at: string,
}

export type Stand_server = {
    id?: string,
    stand_name: string,
    stand_x: string,
    stand_y: string,
    create_at: string,
    modified_at: string,
}
