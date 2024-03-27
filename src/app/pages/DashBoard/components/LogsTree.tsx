import React, { useState, ChangeEvent } from 'react';
import {
    Toolbar,
    ToolbarContent,
    ToolbarItem,
    TreeView,
    TreeViewSearch,
    TreeViewDataItem,
} from '@patternfly/react-core';

import { TruckIcon } from '@patternfly/react-icons';

type LogsTreeProps = {
    logs: TreeViewDataItem[];
}

const LogsTree: React.FC<LogsTreeProps> = ({logs}) => {
    const options: TreeViewDataItem[] = logs
    // [
    //     {
    //       name: <div style={{color: "green"}}>'Application launcher'</div>,
    //       id: 'example8-AppLaunch',
    //       children: [
    //         {
    //           name: 'Application 1',
    //           id: 'example8-App1',
    //           children: [
    //             { name: 'Settings', id: 'example8-App1Settings' },
    //             { name: 'Current', id: 'example8-App1Current' }
    //           ]
    //         },
    //         {
    //           name: 'Application 2',
    //           id: 'example8-App2',
    //           children: [
    //             { name: 'Settings', id: 'example8-App2Settings' },
    //             {
    //               name: 'Loader',
    //               id: 'example8-App2Loader',
    //               children: [
    //                 { name: 'Loading App 1', id: 'example8-LoadApp1' },
    //                 { name: 'Loading App 2', id: 'example8-LoadApp2' },
    //                 { name: 'Loading App 3', id: 'example8-LoadApp3' }
    //               ]
    //             }
    //           ]
    //         }
    //       ],
    //       defaultExpanded: true
    //     },
    //     {
    //       name: 'Cost management',
    //       id: 'example8-Cost',
    //       children: [
    //         {
    //           name: 'Application 3',
    //           id: 'example8-App3',
    //           children: [
    //             { name: 'Settings', id: 'example8-App3Settings' },
    //             { name: 'Current', id: 'example8-App3Current' }
    //           ]
    //         }
    //       ]
    //     },
    //     {
    //       name: 'Sources',
    //       id: 'example8-Sources',
    //       children: [
    //         { name: 'Application 4', id: 'example8-App4', children: [{ name: 'Settings', id: 'example8-App4Settings' }] }
    //       ]
    //     },
    //     {
    //       name: 'Really really really long folder name that overflows the container it is in',
    //       id: 'example8-Long',
    //       children: [{ name: 'Application 5', id: 'example8-App5' }]
    //     }
    // ];

    return <TreeView data={options} hasGuides={true}/>;
};

export default LogsTree;
