import React from 'react';
import { Widgets } from 'blessed';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type Box = Omit<Widgets.BoxOptions, 'children'> & { children?: React.ReactNode[] | string | null | undefined };

declare global {
    module JSX {
        interface IntrinsicElements {
            box: Box,
        }
    }
}