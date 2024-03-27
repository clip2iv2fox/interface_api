import { Devices_server, Stack_server, Stand_server, Tests_server, Users_server } from "@app/types/Types";
import axios from "axios";

// используемый адрес подключения к серверу
const port = "http://192.168.56.1:8000"


// get time
export const get_time = async () => {
    try {
        const result = await axios({
            method: "get",
            url: port + "/props?page=1&limit=999",
        });
        return result.data.result.content
    } catch (error) {
        return "ERROR"
    }
};

// get data
export const get_rows = async (page: string):
Promise<
    Users_server | Tests_server | Devices_server | Stack_server | Stand_server | string
> => {
    try {
        const result = await axios({
            method: "get",
            url: port + `/${page}page=1&limit=999`
        });
        return result.data.result.content
    } catch (error) {
        return "ERROR"
    }
};

// get data by id
export const get_id = async (page: string):
Promise<any> => {
    try {
        const result = await axios({
            method: "get",
            url: port + `/${page}`
        });
        return result.data.result
    } catch (error) {
        return "ERROR"
    }
};

// delete
export function delete_row (page: string, id: number) {
    axios.delete(port + `/${page}/${id}`)
}

// put
export function change_row (page: string, id: string, data: Users_server | Tests_server | Devices_server | Stack_server) {
    axios.patch(port + `/${page}/${id}`, data);
}

//post
export function post_row (page: string, data: Users_server | Tests_server | Devices_server | Stack_server) {
    axios.post(port + `/${page}`, data);
}



