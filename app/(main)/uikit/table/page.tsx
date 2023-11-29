'use client';
import { CustomerService } from '../../../../demo/service/CustomerService';
import { ProductService } from '../../../../demo/service/ProductService';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
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
      // Handle error
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
          </div>
        ),
        header: 'Actions',
        sortable: false,
      },
    ];
    

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
          setCustomers1(response.data); // Assuming the response contains an array of customer data
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        // Handle error
      } finally {
        setLoading1(false);
      }
    };

    getAllUsers();
  }, [storedToken]);

  const handleUpdate = (rowData: Demo.Customer) => {
    // Implement your update logic here
    console.log('Update customer:', rowData);
  };

  const handleDelete = (rowData: Demo.Customer) => {
    // Implement your delete logic here
    console.log('Delete customer:', rowData);
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilterValue1(e.target.value);
  };

  return (
    <div className="grid">
    <div className="col-12">
      <div className="card">
        <h5>La liste des clients</h5>
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
              {/* Add more room details as needed */}
            </div>
          )}
        </Modal>
      </div>
    </div>
  </div>
);
};

export default TableDemo;