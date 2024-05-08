import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import xurxodevLogo from "../assets/xurxodev.png";
import styled from "@emotion/styled";
import { Button, Menu, MenuItem } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useAppContext } from "../context/useAppContext";
import { User } from "../context/AppContext";

export const MainAppBar: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { users, currentUser, onCurrentUserChange } = useAppContext();

    const handleParentMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleUserClick = (user: User) => {
        onCurrentUserChange(user.id);
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <img src={xurxodevLogo} width={200} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Refactoring a Clean Architecture in React
                </Typography>
                <MenuButton
                    color="secondary"
                    id="users"
                    aria-controls="users"
                    aria-haspopup="true"
                    onClick={handleParentMenuClick}
                    endIcon={anchorEl?.id === "users" ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                    {`User: ${currentUser.name}`}
                </MenuButton>
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={anchorEl?.id === "users"}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    {users.map(user => {
                        return (
                            <MenuItem key={user.id} onClick={() => handleUserClick(user)}>
                                {user.name}
                            </MenuItem>
                        );
                    })}
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

const MenuButton = styled(Button)`
    margin: 16px 16px;
    text-transform: none;
`;
