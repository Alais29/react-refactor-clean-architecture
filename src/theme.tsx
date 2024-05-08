import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import type {} from "@mui/x-data-grid/themeAugmentation";

// A custom theme for this app
const theme = responsiveFontSizes(
    createTheme({
        palette: {
            primary: {
                main: "#5271FF",
            },
            secondary: {
                main: "#FFFFFF",
            },
            error: {
                main: red.A400,
            },
        },
        typography: {
            fontSize: 14,
        },
        components: {
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        "& .MuiDataGrid-cell:focus": {
                            outline: "none",
                        },
                        "& .MuiDataGrid-cell:focus-within": {
                            outline: "none",
                        },
                        "& .MuiDataGrid-columnHeader:focus": {
                            outline: "none",
                        },
                        "& .MuiDataGrid-columnHeader:focus-within": {
                            outline: "none",
                        },
                    },
                },
            },
        },
    })
);

export default theme;
