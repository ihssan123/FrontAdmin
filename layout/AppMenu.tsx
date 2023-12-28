/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: '',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: '',
            items: [
                { label: 'Personnel information', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
                
                { label: 'Clients', icon: 'pi pi-fw pi-user', to: '/uikit/table' },
             
                {
                    label: 'Our Rooms',
                    icon: 'pi pi-fw pi-building',
                    to: '/pages/crud'
                },
            ]
        },
        
        
    ]
    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

               
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
