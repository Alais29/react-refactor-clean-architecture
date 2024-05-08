import * as React from "react";
import Link from "@mui/material/Link";
import { Box, Container, Typography } from "@mui/material";

export const Footer: React.FC = () => {
    return (
        <Box
            sx={{
                backgroundColor: theme =>
                    theme.palette.mode === "light"
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
                p: 6,
            }}
            component="footer"
        >
            <Container maxWidth="sm">
                <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                    {"Copyright © "}
                    <Link color="inherit" href="https://xurxodev.com/">
                        xurxodev.com
                    </Link>{" "}
                    {new Date().getFullYear()}
                    {"."}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                    {"Suscribete a la newsletter: "}
                    <Link color="inherit" href="https://xurxodev.com/#/portal/signup">
                        aquí
                    </Link>
                    {"."}
                </Typography>
            </Container>
        </Box>
    );
};
