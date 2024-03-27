import React, { useEffect, useState } from 'react';
import { Modal, ModalVariant, Button, SearchInput, Split, SplitItem, TreeViewDataItem } from '@patternfly/react-core';
import './LogModal.css'
import { ArrowCircleDownIcon, ArrowCircleUpIcon } from '@patternfly/react-icons';
import LogsTree from './LogsTree';
import { Tests } from '@app/types/Types';
import { disconnect } from '@app/configs/webSocket_configs';

type LogModalProps = {
    isModalOpen: boolean,
    closeModal: (flag: boolean) => void;
    card?: Tests
}

export const LogModal: React.FC<LogModalProps> = ({isModalOpen, closeModal, card}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [matches, setMatches] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const logs = [
        {"result": true, "message": "Added to broadcast connection named 'local broadcast'"},
        {"type": "show", "data": {"entity": "stage_finished", "tags": ["print_action"], "result": true, "@timestamp": "2023-08-01T11:51:04.009675"}, "stage": "stage1"},
        {"type": "show", "data": {"entity": "stage_finished", "tags": ["print_action"], "result": true, "@timestamp": "2023-08-01T11:51:11.799530"}, "stage": "preburn"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "cpu device inventarization", "@timestamp": "2023-08-01T11:51:21.808215", "subtest_name": "Processor Intel Celeron G4900", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "result_record_subtests", "test_name": "cpu device inventarization", "@timestamp": "2023-08-01T11:51:21.983673"}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["verbose_print", "print_action"], "result": null, "entity": "skipped_single_test", "test_name": "all installed memory is visible", "@timestamp": "2023-08-01T11:51:22.428567"}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:24.546589", "subtest_name": "Processor Host Bridge/DRAM Registers", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:24.698208", "subtest_name": "Processor PCIe Controller x16", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:24.818151", "subtest_name": "Network Card I350 | PCIE6 | (Processor PCIe Controller x8)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:24.938704", "subtest_name": "Processor Gaussian Mixture Model", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:25.055009", "subtest_name": "Processor Thermal Controller", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:25.174007", "subtest_name": "Processor USB 3.1 xHCI Host Controller", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:25.300632", "subtest_name": "Processor Shared SRAM", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:25.417276", "subtest_name": "Processor Serial IO I2C Controller #0", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:25.524844", "subtest_name": "Processor Serial IO I2C Controller #1", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:25.634606", "subtest_name": "Processor SATA AHCI Controller", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:25.744974", "subtest_name": "Processor PCI Express Root Port #17", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:25.854644", "subtest_name": "Onboard Network Adapter I210 | LAN1 | (Processor PCI Express Root Port #21)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:25.961121", "subtest_name": "Onboard Network Adapter I210 | LAN2 | (Processor PCI Express Root Port #22)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:26.063388", "subtest_name": "Onboard Network Adapter I210 | LAN3 | (Processor PCI Express Root Port #23)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:26.176835", "subtest_name": "Onboard Network Adapter I210 | LAN4 | (Processor PCI Express Root Port #24)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:26.288187", "subtest_name": "ASPEED AST2510 | QU1 | (Processor PCI Express Root Port #9)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:26.401239", "subtest_name": "ASMEDIA ASM1083 | U14 | (Processor PCI Express Root Port #12)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:26.506051", "subtest_name": "Processor Serial IO UART Host Controller", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:26.613253", "subtest_name": "Processor LPC Controller", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:26.718677", "subtest_name": "Processor SMBus Controller", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:26.831399", "subtest_name": "Processor SPI Controller", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:26.944345", "subtest_name": "Network Card I350 | PCIE6 | (enp2s0f0)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:27.062607", "subtest_name": "Network Card I350 | PCIE6 | (enp2s0f1)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:27.173683", "subtest_name": "Onboard Network Adapter I210 | LAN1 | (enp4s0)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:27.279503", "subtest_name": "Onboard Network Adapter I210 | LAN2 | (enp5s0)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:27.393302", "subtest_name": "Onboard Network Adapter I210 | LAN3 | (enp6s0)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:27.507626", "subtest_name": "Onboard Network Adapter I210 | LAN4 | (enp7s0)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:27.613258", "subtest_name": "ASPEED AST2510 | QU1 |", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:27.714593", "subtest_name": "ASPEED AST2510 | QU1 |", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:27.813662", "subtest_name": "ASMEDIA ASM1083 | U14 |", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "result_record_subtests", "test_name": "pci device inventarization", "@timestamp": "2023-08-01T11:51:27.926289"}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["verbose_print", "print_action"], "result": null, "entity": "skipped_single_test", "test_name": "all installed memory is visible", "@timestamp": "2023-08-01T11:51:28.394146"}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "bios device inventarization", "@timestamp": "2023-08-01T11:51:30.227503", "subtest_name": "bios inventory subtest", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "result_record_subtests", "test_name": "bios device inventarization", "@timestamp": "2023-08-01T11:51:30.363612"}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["verbose_print", "print_action"], "result": null, "entity": "skipped_single_test", "test_name": "all installed memory is visible", "@timestamp": "2023-08-01T11:51:30.798468"}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "memory_spd device inventarization", "@timestamp": "2023-08-01T11:51:32.720547", "subtest_name": "RAM | DIMM_A1 |", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "result_record_subtests", "test_name": "memory_spd device inventarization", "@timestamp": "2023-08-01T11:51:32.868251"}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["verbose_print", "print_action"], "result": true, "entity": "single_test", "test_name": "all installed memory is visible", "@timestamp": "2023-08-01T11:51:34.132913"}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "dmidecode_baseboard device inventarization", "@timestamp": "2023-08-01T11:51:36.032271", "subtest_name": "dmidecode_baseboard inventory subtest", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "result_record_subtests", "test_name": "dmidecode_baseboard device inventarization", "@timestamp": "2023-08-01T11:51:36.165437"}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["verbose_print", "print_action"], "result": null, "entity": "skipped_single_test", "test_name": "all installed memory is visible", "@timestamp": "2023-08-01T11:51:36.619926"}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "network device inventarization", "@timestamp": "2023-08-01T11:51:38.652963", "subtest_name": "Onboard Network Adapter I210 | LAN3 | (enp6s0)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "network device inventarization", "@timestamp": "2023-08-01T11:51:38.793847", "subtest_name": "Network Card I350 | PCIE6 | (enp2s0f1)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "network device inventarization", "@timestamp": "2023-08-01T11:51:38.910309", "subtest_name": "USB Network Adapter | DM_LAN1_USB3_56 | <Down> (bootdev.120)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "network device inventarization", "@timestamp": "2023-08-01T11:51:39.017164", "subtest_name": "Onboard Network Adapter I210 | LAN2 | (enp5s0)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "network device inventarization", "@timestamp": "2023-08-01T11:51:39.126772", "subtest_name": "USB Network Adapter | DM_LAN1_USB3_56 | <Down> (bootdev)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "network device inventarization", "@timestamp": "2023-08-01T11:51:39.298750", "subtest_name": "Onboard Network Adapter I210 | LAN1 | (enp4s0)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "network device inventarization", "@timestamp": "2023-08-01T11:51:39.403546", "subtest_name": "Network Card I350 | PCIE6 | (enp2s0f0)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "network device inventarization", "@timestamp": "2023-08-01T11:51:39.516623", "subtest_name": "Onboard Network Adapter I210 | LAN4 | (enp7s0)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "result_record_subtests", "test_name": "network device inventarization", "@timestamp": "2023-08-01T11:51:39.625433"}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["verbose_print", "print_action"], "result": null, "entity": "skipped_single_test", "test_name": "all installed memory is visible", "@timestamp": "2023-08-01T11:51:40.079867"}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "storage device inventarization", "@timestamp": "2023-08-01T11:51:42.183829", "subtest_name": "SSD SATA Drive M.2 | NGFF1 | (pci0000:00/0000:00:17.0/ata5)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "storage device inventarization", "@timestamp": "2023-08-01T11:51:42.333036", "subtest_name": "HDD SATA Drive 3.5 | SATA6 | (pci0000:00/0000:00:17.0/ata6)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "storage device inventarization", "@timestamp": "2023-08-01T11:51:42.446123", "subtest_name": "USB Flash Drive | USB31_12 | <Down> (pci0000:00/0000:00:14.0/usb2/2-1/2-1:1.0)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "storage device inventarization", "@timestamp": "2023-08-01T11:51:42.554935", "subtest_name": "USB Flash Drive | DM_LAN1_USB3_56 | <Up> (pci0000:00/0000:00:14.0/usb2/2-5/2-5:1.0)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "storage device inventarization", "@timestamp": "2023-08-01T11:51:42.662026", "subtest_name": "USB Flash Drive | USB31_12 | <Up> (pci0000:00/0000:00:14.0/usb2/2-2/2-2:1.0)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "result_record_subtests", "test_name": "storage device inventarization", "@timestamp": "2023-08-01T11:51:42.770238"}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["verbose_print", "print_action"], "result": null, "entity": "skipped_single_test", "test_name": "all installed memory is visible", "@timestamp": "2023-08-01T11:51:43.265700"}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "usb device inventarization", "@timestamp": "2023-08-01T11:51:45.257139", "subtest_name": "Linux Foundation 3.0 root hub (bus: 02 port: 1)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "usb device inventarization", "@timestamp": "2023-08-01T11:51:45.412668", "subtest_name": "USB Flash Drive | USB31_12 | <Down> (bus: 02 port: 1:1)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "usb device inventarization", "@timestamp": "2023-08-01T11:51:45.530138", "subtest_name": "USB Flash Drive | USB31_12 | <Up> (bus: 02 port: 1:2)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "usb device inventarization", "@timestamp": "2023-08-01T11:51:45.634567", "subtest_name": "USB Flash Drive | DM_LAN1_USB3_56 | <Up> (bus: 02 port: 1:5)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "subtest", "test_name": "usb device inventarization", "@timestamp": "2023-08-01T11:51:45.736469", "subtest_name": "USB Network Adapter | DM_LAN1_USB3_56 | <Down> (bus: 02 port: 1:6)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": true, "entity": "subtest", "test_name": "usb device inventarization", "@timestamp": "2023-08-01T11:51:45.848538", "subtest_name": "Linux Foundation 2.0 root hub (bus: 01 port: 1)", "diff": {}}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["print_action"], "result": false, "entity": "result_record_subtests", "test_name": "usb device inventarization", "@timestamp": "2023-08-01T11:51:45.961476"}, "stage": "inventory"},
        {"type": "show", "data": {"tags": ["verbose_print", "print_action"], "result": null, "entity": "skipped_single_test", "test_name": "all installed memory is visible", "@timestamp": "2023-08-01T11:51:46.505216"}, "stage": "inventory"},
        {"type": "interaction", "data": {"command": "error_message", "message": "ansible", "tags": ["print_action", "no_send_to_elastic"], "type": "interaction"}, "stage": "inventory"},
        {"type": "interaction", "data": {"command": "stage_failed", "tags": ["print_action", "no_send_to_elastic"], "type": "interaction"}, "stage": "inventory"},
    ]

    const handleSearch = () => {
        const selector = "#realTimeContents";
        const searchTermRegEx = new RegExp(searchTerm, "ig");
        const contentElement = document.querySelector(selector);
        const content = contentElement?.textContent;
        const matches = content?.match(searchTermRegEx);

        if (matches && matches.length > 0) {
            setMatches(matches);

            const highlighted = document.querySelectorAll('.highlighted');
            highlighted.forEach((element) => {
                element.classList.remove('highlighted');
            });

            const updatedContent = content?.replace(searchTermRegEx, `<span class='match'>${searchTerm}</span>`);
            if (contentElement) {
                contentElement.innerHTML = updatedContent || '';
                const firstMatch = document.querySelector('.match:first-child');
                firstMatch?.classList.add('highlighted');
                scrollToMatch(firstMatch);
            }
        }
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => {
        let newIndex = prevIndex + 1;
        if (newIndex >= matches.length) {
            newIndex = 0;
        }
        const nextMatch = document.querySelectorAll('.match')[newIndex];
        nextMatch?.classList.add('highlighted');
        scrollToMatch(nextMatch);
        return newIndex;
        });
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => {
            let newIndex = prevIndex - 1;
            if (newIndex < 0) {
                newIndex = matches.length - 1;
            }
            const prevMatch = document.querySelectorAll('.match')[newIndex];
            prevMatch?.classList.add('highlighted');
            scrollToMatch(prevMatch);
            return newIndex;
        });
    };

    const scrollToMatch = (matchElement: Element | null) => {
        if (matchElement) {
            matchElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (matches.length > 0) {
            scrollToMatch(document.querySelector('.match:first-child'));
        }
    }, [matches]);

    const ref: React.MutableRefObject<HTMLInputElement | null> = React.useRef(null);

    function correctedLogs(logs) {
        const elements: TreeViewDataItem[] = [];
        const sub_elements: TreeViewDataItem[] = [];

        for (let i = 1; i < logs.length; i++) {
            if (logs[i].data?.entity === "subtest") {
                const test_name = logs[i].data?.test_name;
                while (logs[i].data?.entity != "result_record_subtests") {
                    sub_elements.push({
                        name:
                            <div style={{display: "flex", flexDirection: "row"}}>
                                <div style={{color: `${logs[i].data.result ? "#49B487" : "#be1600"}`}}>
                                    {`${logs[i].data.result}`}
                                </div>
                                -{logs[i].stage}: {logs[i].data.subtest_name}
                            </div>,
                        id: `${i}-${logs[i].data.subtest_name}`,
                    });
                    i++;
                }
                elements.push({
                    name:
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <div style={{color: `${logs[i].data.result ? "#49B487" : "#be1600"}`}}>
                                {`${logs[i].data.result}`}
                            </div>
                            -{logs[i].stage}: {test_name}
                        </div>,
                    id: `${i}-${test_name}`,
                    children: sub_elements,
                });
            } else if (
                logs[i].data?.entity === "single_test" ||
                logs[i].data?.entity === "stage_finished"
            ) {
                const test_name = logs[i].data.test_name || '';
                elements.push({
                    name:
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <div style={{color: `${logs[i].data.result ? "#49B487" : "#be1600"}`}}>
                                {`${logs[i].data.result}`}
                            </div>
                            -{logs[i].stage}: {test_name} {card?.device}
                        </div>,
                    id: `${i}-${test_name}`,
                });
            } else if (logs[i].data?.entity === "skipped_single_test") {
                const test_name = logs[i].data.test_name || '';
                elements.push({
                    name: `${logs[i].stage}: ${test_name} Device_name`,
                    id: `${i}-${test_name}`,
                });
            }
        }

        return elements;
    }

    const logs_pack = correctedLogs(logs)

    const searcher = (
        <Split hasGutter>
            <SplitItem isFilled>
                <SearchInput
                    placeholder="Найти log"
                    ref={ref}
                    value={searchTerm}
                    onChange={(_event, value) => setSearchTerm(value)}
                    onClear={() => setSearchTerm("")}
                />
            </SplitItem>
            <SplitItem>
                <Button onClick={handleSearch} variant="secondary">
                    поиск
                </Button>
            </SplitItem>
            <SplitItem>
                <Button onClick={handleNext} variant="secondary">
                    <ArrowCircleDownIcon/>
                </Button>
            </SplitItem>
            <SplitItem>
                <Button onClick={handlePrevious} variant="secondary">
                    <ArrowCircleUpIcon/>
                </Button>
            </SplitItem>
        </Split>
    )

    return (
        <React.Fragment>
            <Modal
                bodyAriaLabel="Scrollable modal content"
                tabIndex={0}
                variant={ModalVariant.large}
                title=""
                isOpen={isModalOpen}
                onClose={()=>{closeModal(false), disconnect()}}
                aria-labelledby="modal-log-label"
                aria-describedby="modal-log-description"
            >
                {/* <div className="searchContend_h">
                    <div className="ui-grid-c">
                        <div id="realTimeContents" style={{display: "flex" ,flexDirection: "column"}}>
                        </div>
                    </div>
                </div> */}
                <LogsTree logs={logs_pack}/>
            </Modal>
        </React.Fragment>
    );
};