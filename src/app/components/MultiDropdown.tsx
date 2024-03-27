import React, { useRef, useState } from 'react';
import {
    Select,
    SelectVariant,
    SelectOption,
    SelectOptionObject,
} from '@patternfly/react-core';

interface Option {                          // типизация пункта списка для Dropdown
    value: string;                          // выводимый пункт
    disabled: boolean;                      // доступность
}

type MultiDropdownProps = {
    options: Option[];                      // набор выводимых пунктов
    chosen: (value: string) => void;        // выбранный пункт
    firstItem: string                       // изначальный выводимый пункт
}

export const MultiDropdown:  React.FC<MultiDropdownProps> = ({options, chosen, firstItem}) => {
    const toggleRef = useRef<HTMLButtonElement>(null);
    // открыт ли MultiDropdown
    const [isOpen, setIsOpen] = useState(false);
    // выбранный элемент
    const [selected, setSelected] = useState<string | SelectOptionObject | null>(firstItem);

    // нажатие на MultiDropdown
    const onToggle = (isOpen: boolean) => {
        setIsOpen(isOpen);
    };

    // выбор пункта
    const onSelect = (
        event: React.MouseEvent | React.ChangeEvent,
        selection: string | SelectOptionObject | (string | SelectOptionObject)[],
        isPlaceholder?: boolean
    ) => {
        if (isPlaceholder) {
            clearSelection();
        } else {
            setSelected(selection);
            chosen(selection as string)
            setIsOpen(false);
            if (toggleRef.current) {
                toggleRef.current.focus();
            }
        }
    };

    const clearSelection = () => {
        setSelected(null);
        setIsOpen(false);
    };

    const titleId = 'select-descriptions-title';

    return (
        <Select
            variant={SelectVariant.single}
            placeholderText="Select an option"
            aria-label="Select Input with descriptions"
            onToggle={onToggle}
            toggleRef={toggleRef}
            onSelect={onSelect}
            selections={selected as string}
            isOpen={isOpen}
            aria-labelledby={titleId}
            isDisabled={false}
            style={{marginTop: "7px"}}
        >
            {options.map((option, index) => (
            <SelectOption
                isDisabled={option.disabled}
                key={index}
                value={option.value}
                isPlaceholder={false}
            />
            ))}
        </Select>
    );
};