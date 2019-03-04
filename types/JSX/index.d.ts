import React from 'react';
import { Widgets } from 'blessed';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type Element = {
    key?: string
    children?: React.ReactElement | React.ReactElement[] | React.ReactNode | React.ReactNode[] | string | undefined 
};

type Box = Omit<Widgets.BoxOptions, 'children'> & Element;


declare global {
    module JSX {
        interface IntrinsicElements {
            box: Box,
        }
    }
}