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
import { ChangeEvent, useMemo } from "react";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { useProducts } from "../hooks/useProducts";
import { CompositionRoot } from "../../CompositionRoot";
import { ProductStatus } from "../../domain/Product";
import { ProductViewModel } from "../hooks/useProductsState";

const baseColumn: Partial<GridColDef<ProductViewModel>> = {
  disableColumnMenu: true,
  sortable: false,
};

export const ProductsPage: React.FC = () => {
  const getProductsUseCase = useMemo(
    () => CompositionRoot.getInstance().provideGetProductsUseCase(),
    []
  );
  const getProductByIdUseCase = useMemo(
    () => CompositionRoot.getInstance().provideGetProductByIdUseCase(),
    []
  );
  const updateProductPriceUseCase = useMemo(
    () => CompositionRoot.getInstance().provideUpdateProductPriceUseCase(),
    []
  );

  const {
    products,
    updatingQuantity,
    editingProduct,
    message,
    cancelEditPrice,
    priceError,
    saveEditPrice,
    onChangePrice,
    onCloseMessage,
  } = useProducts(getProductsUseCase, getProductByIdUseCase, updateProductPriceUseCase);

  function handleChangePrice(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    onChangePrice(event.target.value);
  }

  const columns: GridColDef<ProductViewModel>[] = useMemo(
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
          return (
            <StatusContainer status={params.row.status}>
              <Typography variant="body1">{params.row.status}</Typography>
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
        <DataGrid<ProductViewModel>
          columnBuffer={10}
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
        open={message !== undefined && message.type === "error"}
        autoHideDuration={2000}
        onClose={onCloseMessage}
      >
        <Alert severity="error">{message?.text}</Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={message !== undefined && message.type === "success"}
        autoHideDuration={2000}
        onClose={onCloseMessage}
      >
        <Alert severity="success">{message?.text}</Alert>
      </Snackbar>

      {editingProduct && (
        <ConfirmationDialog
          isOpen={true}
          title={"Update price"}
          onSave={saveEditPrice}
          onCancel={cancelEditPrice}
          disableSave={priceError !== undefined}
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
