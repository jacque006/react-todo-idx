import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MUIAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ProfileDialogButton from './profile/profile-dialog-button.component';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
        justifyContent: 'space-between',
    },
    profileButton: {
        marginRight: theme.spacing(2),
    },
  }),
);

export default function AppBar() {
    const classes = useStyles();

    return (
        <MUIAppBar position="static">
            <Toolbar classes={{ root: classes.toolbar }}>
                <Typography variant="h6">
                    React TODO IDX
                </Typography>
                <ProfileDialogButton classes={{ root: classes.profileButton }}/>
            </Toolbar>
        </MUIAppBar>
    );
}

