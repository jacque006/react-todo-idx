import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { useIDX } from '../hooks/idx';

export default function TODOPage() {
    const { isAuthenticated, error, idx } = useIDX();

    if (error) {
        return <Typography color='error'>{`Error: ${error}`}</Typography>
    }

    if (!isAuthenticated) {
        return <div>
            <CircularProgress />
            <Typography>Authenticating...</Typography>
        </div>
    }

    return (
        <Typography>{`IDX ID: ${idx?.id}`}</Typography>
    )
}
