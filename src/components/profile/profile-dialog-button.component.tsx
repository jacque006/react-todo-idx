import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import React from 'react'
import { useIDX } from '../../hooks/idx';

type Props = {
    classes: {
        root: string,
    },
}

export default function ProfileDialogButton({ classes }: Props) {
    const { isAuthenticated, idx } = useIDX();
    const [initials, setInitials] = React.useState('');

    const getInitials = React.useCallback(async () => {
        try {
            const { name } = await idx?.get<{ name?: string }>('basicProfile') || {}
            const initialsValue = name?.split(" ").reduce((acc, val) => `${acc}${val.length ? val[0] : ''}`, '') || '';
            setInitials(initialsValue);
        } catch (err) {
            console.error(err);
        }
    }, [idx]);

    React.useEffect(() => {
        getInitials();   
    }, [getInitials]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <IconButton className={classes.root}>
            <Avatar>{initials}</Avatar>
        </IconButton>
    )
}