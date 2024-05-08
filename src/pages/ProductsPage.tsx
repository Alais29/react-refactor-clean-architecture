import { Alert, Box, Container, Snackbar, Stack, TextField, Typography } from "@mui/material";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridValueFormatterParams,
} from "@mui/x-data-grid";
import { Footer } from "../components/Footer";
import { MainAppBar } from "../components/MainAppBar";
import styled from "@emotion/styled";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/useAppContext";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { useReload } from "../hooks/useReload";
import { RemoteProduct, StoreApi } from "../api/StoreApi";

const baseColumn: Partial<GridColDef<Product>> = {
    disableColumnMenu: true,
    sortable: false,
};

const storeApi =  new StoreApi();

export const ProductsPage: React.FC = () => {
    const { currentUser } = useAppContext();
    const [reloadKey, reload] = useReload();


    const [products, setProducts] = useState<Product[]>([]);
    const [snackBarError, setSnackBarError] = useState<string>();
    const [snackBarSuccess, setSnackBarSuccess] = useState<string>();

    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [priceError, setPriceError] = useState<string | undefined>(undefined);

    useEffect(() => {
        storeApi.getAll().then(response => {
            console.debug("Reloading", reloadKey);

            const remoteProducts = response as RemoteProduct[];

            const products = remoteProducts.map(buildProduct);

            setProducts(products);
        });
    }, [reloadKey]);

    const updatingQuantity = useCallback(
        async (id: number) => {
            if (id) {
                if (!currentUser.isAdmin) {
                    setSnackBarError("Only admin users can edit the price of a product");
                    return;
                }

                storeApi
                    .get(id)
                    .then(buildProduct)
                    .then(product => {
                        setEditingProduct(product);
                    })
                    .catch(() => {
                        setSnackBarError(`Product with id ${id} not found`);
                    });
            }
        },
        [currentUser]
    );

    const cancelEditPrice = useCallback(() => {
        setEditingProduct(undefined);
    }, []);


    function handleChangePrice(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        if (!editingProduct) return;

        const isValidNumber = !isNaN(+event.target.value);
        setEditingProduct({ ...editingProduct, price: event.target.value });

        if (!isValidNumber) {
            setPriceError("Only numbers are allowed");
        } else {
            if (!priceRegex.test(event.target.value)) {
                setPriceError("Invalid price format");
            } else if (+event.target.value > 999.99){
                setPriceError("The max possible price is 999.99");
            }
            else {
                setPriceError(undefined);
            }
        }
    }

    async function saveEditPrice(): Promise<void> {
        if (editingProduct) {
            const remoteProduct = await storeApi.get(editingProduct.id);

            if (!remoteProduct) return;

            const editedRemoteProduct = {
                ...remoteProduct,
                price: Number(editingProduct.price)
            };

            try {
                await storeApi.post(editedRemoteProduct);

                setSnackBarSuccess(
                    `Price ${editingProduct.price} for '${editingProduct.title}' updated`
                );
                setEditingProduct(undefined);
                reload();
            } catch (error) {
                setSnackBarSuccess(
                    `An error has ocurred updating the price ${editingProduct.price} for '${editingProduct.title}'`
                );
                setEditingProduct(undefined);
                reload();
            }
        }
    }

    const columns: GridColDef<Product>[] = useMemo(
        () => [
            { ...baseColumn, field: "id", headerName: "ID", width: 70 },
            { ...baseColumn, field: "title", headerName: "Title", width: 600 },
            {
                ...baseColumn,
                field: "image",
                headerName: "Image",
                width: 300,
                headerAlign: "center",
                align: "center",
                renderCell: params => {
                    return <ProductImage src={params.row.image} />;
                },
            },
            {
                ...baseColumn,
                field: "price",
                headerName: "Price",
                type: "number",
                width: 180,
                headerAlign: "center",
                align: "center",
                valueFormatter: (params: GridValueFormatterParams<number>) => {
                    if (params.value == null) {
                        return "";
                    }
                    return `$${params.value}`;
                },
            },
            {
                ...baseColumn,
                field: "status",
                headerName: "Status",
                width: 120,
                headerAlign: "center",
                align: "center",
                renderCell: params => {
                    const status = +params.row.price === 0 ? "inactive" : "active";

                    return (
                        <StatusContainer status={status}>
                            <Typography variant="body1">{status}</Typography>
                        </StatusContainer>
                    );
                },
            },
            {
                ...baseColumn,

                field: "actions",
                type: "actions",
                width: 100,
                getActions: cell => [
                    <GridActionsCellItem
                        label="Update price"
                        onClick={() => updatingQuantity(cell.row.id)} // openAddModal(cell.row)}
                        showInMenu
                    />,
                ],
            },
        ],
        [updatingQuantity]
    );

    return (
        <Stack direction="column" sx={{ minHeight: "100vh", overflow: "scroll" }}>
            <MainAppBar />

            <MainContainer maxWidth="xl" sx={{ flex: 1 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    {"Product price updater"}
                </Typography>
                <DataGrid<Product>
                    rowHeight={300}
                    rows={products}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                />
            </MainContainer>
            <Footer />

            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                open={snackBarError !== undefined}
                autoHideDuration={2000}
                onClose={() => setSnackBarError(undefined)}
            >
                <Alert severity="error">{snackBarError}</Alert>
            </Snackbar>

            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                open={snackBarSuccess !== undefined}
                autoHideDuration={2000}
                onClose={() => setSnackBarSuccess(undefined)}
            >
                <Alert severity="success">{snackBarSuccess}</Alert>
            </Snackbar>

            {editingProduct && (
                <ConfirmationDialog
                    isOpen={true}
                    title={"Update price"}
                    onSave={saveEditPrice}
                    onCancel={cancelEditPrice}
                >
                    <Stack direction="row">
                        <Box width={250}>
                            <ProductImage src={editingProduct.image} />
                        </Box>

                        <Stack direction="column" justifyContent="space-evenly">
                            <Typography variant="body1">{editingProduct.title}</Typography>
                            <TextField
                                label={"Price"}
                                value={editingProduct.price}
                                onChange={handleChangePrice}
                                error={priceError !== undefined}
                                helperText={priceError}
                            />
                        </Stack>
                    </Stack>
                </ConfirmationDialog>
            )}
        </Stack>
    );
};

const MainContainer = styled(Container)`
    padding: 32px 0px;
    flex: 1;
`;

const ProductImage = styled.img`
    width: 200px;
    height: 200px;
    object-fit: contain;
`;

type ProductStatus = "active" | "inactive";

export interface Product {
    id: number;
    title: string;
    image: string;
    price: string;
}

const StatusContainer = styled.div<{ status: ProductStatus }>`
    background: ${props => (props.status === "inactive" ? "red" : "green")};
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    padding: 8px;
    border-radius: 20px;
    width: 100px;
`;

function buildProduct(remoteProduct: RemoteProduct): Product {
    return {
        id: remoteProduct.id,
        title: remoteProduct.title,
        image: remoteProduct.image,
        price: remoteProduct.price.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })
    };
}

const priceRegex = /^\d+(\.\d{1,2})?$/;
