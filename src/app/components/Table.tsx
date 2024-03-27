import React, { useState } from "react";
import { TableComposable, Thead, Tr, Th, Tbody, Td, ThProps, TableText } from "@patternfly/react-table";
import { Button } from "@patternfly/react-core";
import { Users, Tests, Devices, Stack } from "@app/types/Types";

const TableFlex = ({names, rows, ids, expanded, correct, handleDelete}) => {
    // In real usage, this data would come from some external source like an API via props.
    const repositories = rows

    const columnNames = names

    // Index of the currently sorted column
    // Note: if you intend to make columns reorderable, you may instead want to use a non-numeric key
    // as the identifier of the sorted column. See the "Compound expandable" example.
    const [activeSortIndex, setActiveSortIndex] = useState<number | null>(null);

    // Sort direction of the currently sorted column
    const [activeSortDirection, setActiveSortDirection] = useState<"asc" | "desc" | null>(null);

    // Since OnSort specifies sorted columns by index, we need sortable values for our object by column index.
    // This example is trivial since our data objects just contain strings, but if the data was more complex
    // this would be a place to return simplified string or number versions of each column to sort by.
    const getSortableRowValues = (repo: Users & Tests & Devices & Stack): (string | number)[] => {
        // контроль фильтрации страницы Users
        if (names[0] == "ФИО"){
            const {
                name,
                number,
                password,
                token,
                access
            } = repo;
            return [
                name,
                number,
                password,
                token,
                access
            ];
        // контроль фильтрации страницы Tests
        } else if (names[0] == "Пользователь"){
            const {
                user,
                zone,
                x,
                y,
                device,
                percent,
                status,
            } = repo;
            return [
                user,
                zone,
                x,
                y,
                device,
                percent,
                status,
            ];
        // контроль фильтрации страницы Stack
        } else if (names[0] == "x"){
            const {
                x,
                y,
                ip
            } = repo;
            return [
                x,
                y,
                ip
            ];
        // контроль фильтрации страницы Devices
        } else if (names[0] == "Серийный номер"){
            const {
                serial,
                mac,
                place,
                property
            } = repo;
            return [
                serial,
                mac,
                place,
                property
            ];
        // контроль фильтрации страницы Config
        } else {
            const {
                name,
                x,
                y
            } = repo;
            return [
                name,
                x,
                y
            ];
        }
    };

    // Note that we perform the sort as part of the component"s render logic and not in onSort.
    // We shouldn"t store the list of data in state because we don"t want to have to sync that with props.
    let sortedRepositories = repositories;
    if (activeSortIndex !== null) {
        sortedRepositories = repositories.sort((a: Users & Tests & Devices & Stack, b: Users & Tests & Devices & Stack) => {
            const aValue = getSortableRowValues(a)[activeSortIndex];
            const bValue = getSortableRowValues(b)[activeSortIndex];
            if (typeof aValue === "number") {
                // Numeric sort
                if (activeSortDirection === "asc") {
                    return (aValue as number) - (bValue as number);
                }
                return (bValue as number) - (aValue as number);
            } else {
                // String sort
                if (activeSortDirection === "asc") {
                    return (aValue as string).localeCompare(bValue as string);
                }
                if (typeof bValue === "string") {
                    return (bValue as string).localeCompare(aValue as string);
                } else {
                    // Handle the case when bValue is not a string (you can decide how to handle it)
                    // For example, you can return 0 or a negative value to keep the current order.
                    return 0;
                }
            }
        });
    }

    // создане нового списка во время сортировки строк
    const getSortParams = (columnIndex: number): ThProps["sort"] => ({
        sortBy: {
            index: activeSortIndex as number | undefined,
            direction: activeSortDirection as "asc" | "desc" | undefined
        },
        onSort: (_event, index, direction) => {
            setActiveSortIndex(index);
            setActiveSortDirection(direction);
        },
        columnIndex
    });

    // переход по кнопке управление
    const page_transfer = (link: string) => {
        window.open(`http://${link}:5000`);
    }

    return (
        <TableComposable 
            aria-label="Sortable table custom toolbar"
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
        >
            <Thead
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
            >
                <Tr
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    {columnNames.map((names: string, index: number)=>
                        <Th 
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}} 
                            modifier="wrap"
                            sort={getSortParams(index)}
                            key={names + index}
                        >{names}</Th>
                    )}
                </Tr>
            </Thead>
            <Tbody
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
            >
                {sortedRepositories.map((repo: Users | Tests | Devices | Stack, rowIndex: number) => (
                    <Tr 
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                        key={rowIndex}
                    >
                        {ids.map((id: string, index: number)=>
                            <Td 
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                            dataLabel={columnNames[index]} key={id + index}>{repo[id]}</Td>
                        )}
                        <Td 
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                            dataLabel={""}
                            modifier="fitContent"
                        >
                            {names[0] == "Имя" ?
                                <TableText>
                                    <Button variant="secondary" isDisabled={expanded} isDanger onClick={()=>handleDelete(repo.id)}>удалить</Button>
                                </TableText>
                            :
                                <TableText>
                                    <Button variant="secondary" isDisabled={expanded} onClick={()=>correct(repo)}>изменить</Button>
                                    {" "}
                                    <Button variant="secondary" isDisabled={expanded} isDanger onClick={()=>handleDelete(repo.id)}>удалить</Button>
                                </TableText>
                            }
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </TableComposable>
    );
};

export { TableFlex }