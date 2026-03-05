import React from 'react';

type TestProps = {
    message: string;
};

export function Test({ message }: TestProps) {
    return <div>{message}</div>;
}