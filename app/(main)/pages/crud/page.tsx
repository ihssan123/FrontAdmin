/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../../demo/service/ProductService';
import { Demo } from '../../../../types/types';
import axios from 'axios';
const Crud = () => {

    interface Room {
        id: string;
        name: string;
        capacity: number;
        price: number;
        surface: number;
        roomEquipement: string;
        entertaiment: string;
        other: string;
      }
/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
let emptyProduct: {
    id: string;
    name: string;
    capacity: number;
    price: number;
    surface: number;
    roomEquipement: string;
    entertaiment: string;
    other: string;
} = {
    id: '',
    name: '',
    capacity: 0,
    price: 0,
    surface: 0,
    roomEquipement: '',
    entertaiment: '',
    other: '',
};

const storedToken = localStorage.getItem('token');

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoom, setNewRoom] = useState({
    name: '',
    capacity: 0,
    price: '0.00',
    surface: '0.0',
    roomEquipement: '',
    entertaiment: '',
    other: '',
  });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/auth/rooms/all', {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,                    },
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };
    
        fetchData();
    }, [[storedToken]]);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };
    const actionBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    const openNew = () => {
       
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

   

    const editProduct = (product: Demo.Product) => {
       
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product: Demo.Product) => {
      
        setDeleteProductDialog(true);
    };

    

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (products as any)?.length; i++) {
            if ((products as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    

    
    

  

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !(selectedProducts as any).length} />
                </div>
            </React.Fragment>
        );
    };
    const capacityBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">Capacity</span>
                {rowData.capacity}
            </>
        );
    };
    
    const surfaceBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">Surface</span>
                {rowData.surface}
            </>
        );
    };
    
    const equipementBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">Equipement</span>
                {rowData.roomEquipement}
            </>
        );
    };
    
    const entertainmentBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">Entertainment</span>
                {rowData.entertaiment}
            </>
        );
    };
    
    const otherBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">Other</span>
                {rowData.other}
            </>
        );
    };
    


    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.code}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const imageBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };

    const priceBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.price as number)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
            </>
        );
    };

    const ratingBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <Rating value={rowData.rating} readOnly cancel={false} />
            </>
        );
    };

    const statusBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.inventoryStatus?.toLowerCase()}`}>{rowData.inventoryStatus}</span>
            </>
        );
    };

    const addRoom = async () => {
        try {
          const response = await axios.post(
            'http://localhost:8080/api/auth/rooms/add',
            newRoom,
            {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            }
          );
          setRooms([...rooms, response.data]); 
          setNewRoom({
            name: '',
            capacity: 0,
            price: '0.00',
            surface: '0.0',
            roomEquipement: '',
            entertaiment: '',
            other: '',
          });
        } catch (error) {
          console.error('Error adding room:', error);
        }
      };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Products</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text  onClick={addRoom} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" text  />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" text  />
        </>
    );
   
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                       <Column field="name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
<Column field="capacity" header="Capacity" body={capacityBodyTemplate}></Column>
<Column field="price" header="Price" body={priceBodyTemplate} sortable></Column>
<Column field="surface" header="Surface" body={surfaceBodyTemplate}></Column>
<Column field="roomEquipement" header="Equipement" body={equipementBodyTemplate}></Column>
<Column field="entertaiment" header="Entertainment" body={entertainmentBodyTemplate}></Column>
<Column field="other" header="Other" body={otherBodyTemplate}></Column>
<Column header="Actions" body={actionBodyTemplate} style={{ textAlign: 'center', width: '8em' }} />
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Room Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={newRoom.name}
                                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted 
                                })}
                            />
                            {submitted && <small className="p-invalid">Name is required.</small>}
                        </div>
                       
                        <div className="field">
                            <label htmlFor="name">Capacity</label>
                            <InputText
                                id="name"
                                type="number"
                                value={newRoom.capacity.toString()}
                                onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value, 10) })}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted 
                                })}
                            />
                            {submitted && <small className="p-invalid">Capacity is required.</small>}
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Price</label>
                                <InputText id="price" 
                                value={newRoom.price}
                                onChange={(e) => setNewRoom({ ...newRoom, price:e.target.value })}
                                 />
                            </div>
                           
                        </div>
                        <div>
                            {submitted && <small className="p-invalid">Price is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Room equipement</label>
                            <InputTextarea id="description"    value={newRoom.roomEquipement}
                                onChange={(e) => setNewRoom({ ...newRoom, roomEquipement:e.target.value })} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="description">entertaiment</label>
                            <InputTextarea id="description"  value={newRoom.entertaiment}
                                onChange={(e) => setNewRoom({ ...newRoom, entertaiment:e.target.value })} required rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="description">Other</label>
                            <InputTextarea id="description"  value={newRoom.other}
                                onChange={(e) => setNewRoom({ ...newRoom, other:e.target.value })} required rows={3} cols={20} />
                        </div>

                        
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                           
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
