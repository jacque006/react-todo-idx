import React from 'react'
import { useIDX } from '../hooks/idx';

export default function TODOPage() {
    const { isAuthenticated, error, idx } = useIDX();

    if (error) {
        return <div>{`Error: ${error}`}</div>
    }

    if (!isAuthenticated) {
        return <div>Authenticating...</div>
    }

    return (
        <div>{`IDX ID: ${idx?.id}`}</div>
    )
}