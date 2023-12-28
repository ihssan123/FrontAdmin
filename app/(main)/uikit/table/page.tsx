'use client';
import { CustomerService } from '../../../../demo/service/CustomerService';
import { ProductService } from '../../../../demo/service/ProductService';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Column, ColumnFilterApplyTemplateOptions, ColumnFilterClearTemplateOptions, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { DataTable, DataTableExpandedRows, DataTableFilterMeta } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { ProgressBar } from 'primereact/progressbar';
import { Rating } from 'primereact/rating';
import { Slider } from 'primereact/slider';
import { ToggleButton } from 'primereact/togglebutton';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { classNames } from 'primereact/utils';
import React, { useEffect, useState } from 'react';
import type { Demo } from '../../../../types/types';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import { Toolbar } from 'primereact/toolbar';

import { InputTextarea } from 'primereact/inputtextarea';
// ... (previous imports)
// ... (previous imports)

// ... (previous imports)

// ... (previous imports)

const TableDemo = () => {
  const storedToken = localStorage.getItem('token');
  const [customers1, setCustomers1] = useState<Demo.Customer[]>([]);
  const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
  const [loading1, setLoading1] = useState(true);
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');
  const [expandedRows, setExpandedRows] = useState<any[] | DataTableExpandedRows>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [productDialog, setProductDialog] = useState(false);
  const [newClient, setNewClient] = useState({
    username: 'oumnia2',
    email: '',
    firstName: '',
    lastName: '',
    age: 0,
    phone: '',
    password: '123045647xd8914sdc',
    roles: ['user'],
  });
  const [roomData, setRoomData] = useState<Room[]>([]);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/auth/rooms/all', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.status === 200) {
        setRoomData(response.data);
        setIsRoomDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleAddRoom = (room: Room) => {
    // Update the row data with the selected room
    setNewClient((prevClient) => ({
      ...prevClient,
      // Update the fields based on the selected room properties
      // For example: roomName: room.name
    }));

    // Close the room dialog
    setIsRoomDialogOpen(false);
  };

  const roomDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" onClick={() => setIsRoomDialogOpen(false)} />
    </>
  );

  const addUser = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/signup',
        newClient,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      setCustomers1([...customers1, newClient]);

      // Close the dialog
      setProductDialog(false);
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  const handleDetails = async (rowData: any) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/auth/user/userDetails/${rowData.username}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.status === 200) {
        // Set the selected booking when the data is successfully fetched
        setSelectedBooking(response.data[0]);

        // Open the modal
        setIsDetailsModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleModalClose = () => {
    // Clear the selected booking when the modal is closed
    setSelectedBooking(null);

    // Close the modal
    setIsDetailsModalOpen(false);
  };

  const columns = [
    { field: 'firstName', header: 'First Name' },
    { field: 'lastName', header: 'Last Name' },
    { field: 'age', header: 'Age' },
    { field: 'phone', header: 'Phone' },
    { field: 'email', header: 'Email' },
    {
      body: (rowData: any) => (
        <div>
          <Button icon="pi pi-info-circle" className="p-button-rounded p-button-info p-mr-2" onClick={() => handleDetails(rowData)} />
          <br></br>
          <Button icon="pi pi-calendar-plus" className="p-button-rounded p-button-success" onClick={() => fetchRooms()} />
        </div>
      ),
      header: 'Actions',
      sortable: false,
    },
  ];

  const roomDialogBody = (
    <DataTable value={roomData} paginator rows={10} className="p-datatable-striped">
      <Column field="name" header="Room Name" sortable filter filterMatchMode="contains" />
      <Column field="capacity" header="Capacity" sortable filter filterMatchMode="equals" />
      <Column field="price" header="Price" sortable filter filterMatchMode="equals" />
      {/* Add more columns for additional room details */}
      <Column
        body={(rowData) => (
          <Button
            icon="pi pi-plus"
            className="p-button-rounded p-button-success"
            onClick={() => handleAddRoom(rowData)}
          />
        )}
        header="Add"
        sortable={false}
      />
    </DataTable>
  );

  const openNew = () => {
    setSubmitted(false);
    setProductDialog(true);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
        </div>
      </React.Fragment>
    );
  };

  useEffect(() => {
    setLoading1(true);

    const getAllUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/user/users', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.status === 200) {
          setCustomers1(response.data);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading1(false);
      }
    };

    getAllUsers();
  }, [storedToken]);

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const productDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" text onClick={addUser} />
    </>
  );

  const handleDelete = (rowData: Demo.Customer) => {
    console.log('Delete customer:', rowData);
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilterValue1(e.target.value);
  };

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
          <h5>List of clients</h5>
          <DataTable
            value={customers1}
            paginator
            rows={10}
            loading={loading1}
            filters={filters1}
            onFilter={(e) => setFilters1(e.filters as DataTableFilterMeta)}
            globalFilter={globalFilterValue1}
            sortMode="multiple"
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
          >
            {columns.map((col, index) => (
              <Column key={index} field={col.field} header={col.header} sortable={true} filter={true} filterMatchMode={FilterMatchMode.CONTAINS} body={col.body} />
            ))}
          </DataTable>
          <Modal
            isOpen={isDetailsModalOpen}
            onRequestClose={handleModalClose}
            style={{
              content: {
                width: '50vw',
                margin: 'auto',
                marginTop: '20vh',
              },
            }}
          >
            {selectedBooking && (
              <div>
                <p>
                  <strong>ID:</strong> {selectedBooking.id}
                </p>
                <p>
                  <strong>Start Date:</strong> {selectedBooking.startDate}
                </p>
                <p>
                  <strong>End Date:</strong> {selectedBooking.endDate}
                </p>
                <p>
                  <strong>Room Information:</strong>
                </p>
                <p>
                  <strong>Room Name:</strong> {selectedBooking.room.name}
                </p>
                <p>
                  <strong>Capacity:</strong> {selectedBooking.room.capacity}
                </p>
                <p>
                  <strong>Price:</strong> {selectedBooking.room.price}
                </p>
              </div>
            )}
          </Modal>
          <Dialog
            visible={productDialog}
            style={{ width: '450px' }}
            header="Room Details"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="name">FirstName</label>
              <InputText
                id="name"
                value={newClient.firstName}
                onChange={(e) => setNewClient({ ...newClient, firstName: e.target.value })}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted,
                })}
              />
              {submitted && <small className="p-invalid">Name is required.</small>}
            </div>
            <div className="field">
              <label htmlFor="name">LastName</label>
              <InputText
                id="name"
                value={newClient.lastName}
                onChange={(e) => setNewClient({ ...newClient, lastName: e.target.value })}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted,
                })}
              />
              {submitted && <small className="p-invalid">lastname is required.</small>}
            </div>
            <div className="field">
              <label htmlFor="name">Email</label>
              <InputText
                id="name"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted,
                })}
              />
              {submitted && <small className="p-invalid">email is required.</small>}
            </div>
            <div className="field">
              <label htmlFor="name">Age</label>
              <InputText
                id="name"
                type="number"
                value={newClient.age}
                onChange={(e) => setNewClient({ ...newClient, age: parseInt(e.target.value, 10) })}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted,
                })}
              />
            </div>
            <div className="field">
              <label htmlFor="name">Phone</label>
              <InputText
                id="name"
                type="number"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted,
                })}
              />
              {submitted && <small className="p-invalid">phone is required.</small>}
            </div>
          </Dialog>
          <Dialog
            visible={isRoomDialogOpen}
            style={{ width: '800px' }}
            header="Room List"
            modal
            className="p-fluid"
            footer={roomDialogFooter}
            onHide={() => setIsRoomDialogOpen(false)}
          >
            {roomDialogBody}
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default TableDemo;
