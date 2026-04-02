import { useState, useEffect } from 'react';
import { Modal, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { searchShoes, getCategories, deleteShoesById } from '../api/shoesApi';

const PAGE_SIZE = 5;

function ShoesList() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [shoesName, setShoesName] = useState('');

  const [shoesList, setShoesList] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [filterCategory, setFilterCategory] = useState('');
  const [filterName, setFilterName] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [shoeToDelete, setShoeToDelete] = useState(null);

  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchShoes(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterCategory, filterName]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchShoes = async (page) => {
    setLoading(true);
    setError('');
    try {
      const params = { page: page - 1, size: PAGE_SIZE };
      if (filterCategory) params.categoryId = filterCategory;
      if (filterName) params.name = filterName;

      const res = await searchShoes(params);
      const data = res.data;

      if (data && data.content !== undefined) {
        setShoesList(data.content);
        setTotalRecords(data.totalElements);
        setTotalPages(data.totalPages || Math.ceil(data.totalElements / PAGE_SIZE) || 1);
      } else if (Array.isArray(data)) {
        setShoesList(data);
        setTotalRecords(data.length);
        setTotalPages(Math.ceil(data.length / PAGE_SIZE) || 1);
      } else {
        setShoesList([]);
        setTotalRecords(0);
        setTotalPages(1);
      }
    } catch (err) {
      setError('Failed to load shoes list. Please check the API server.');
      setShoesList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setFilterCategory(selectedCategory);
    setFilterName(shoesName);
    setCurrentPage(1);
  };

  const handleDeleteClick = (shoe) => {
    setShoeToDelete(shoe);
    setSuccessMsg('');
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!shoeToDelete) return;
    try {
      await deleteShoesById(shoeToDelete.id);
      setShowModal(false);
      setSuccessMsg('Deleted successfully');
      fetchShoes(currentPage);
    } catch (err) {
      setShowModal(false);
      setError('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const startRecord = shoesList.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;

  const renderPagination = () => {
    const items = [];

    items.push(
      <span
        key="prev"
        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        style={{
          cursor: currentPage > 1 ? 'pointer' : 'default',
          color: currentPage > 1 ? '#0d6efd' : '#aaa',
          marginRight: '4px',
        }}
      >
        Previous
      </span>
    );

    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <span
          key={i}
          onClick={() => setCurrentPage(i)}
          style={{
            cursor: 'pointer',
            color: i === currentPage ? '#000' : '#0d6efd',
            fontWeight: i === currentPage ? 'bold' : 'normal',
            marginRight: '4px',
          }}
        >
          {i}
          {i < totalPages ? ',' : ''}
        </span>
      );
    }

    if (totalPages > 1) {
      items.push(
        <span key="dots" style={{ marginRight: '4px' }}>
          ....
        </span>
      );
    }

    items.push(
      <span
        key="next"
        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
        style={{
          cursor: currentPage < totalPages ? 'pointer' : 'default',
          color: currentPage < totalPages ? '#0d6efd' : '#aaa',
        }}
      >
        Next
      </span>
    );

    return items;
  };

  return (
    <div
      style={{
        border: '1px solid #999',
        margin: '0 auto',
        maxWidth: '860px',
        minHeight: '480px',
        background: '#fff',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', borderBottom: '1px solid #999' }}>
        <tbody>
          <tr>
            <td
              style={{
                width: '80px',
                borderRight: '1px solid #999',
                padding: '8px 12px',
                fontWeight: 'bold',
                verticalAlign: 'middle',
              }}
            >
              Logo
            </td>
            <td style={{ padding: '6px 12px', textAlign: 'right', verticalAlign: 'top' }}>
              Date: {formattedDate}
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ padding: '10px 20px 20px 20px' }}>

        <div style={{ fontWeight: 'bold', marginBottom: '14px' }}>Shoes List</div>

        {successMsg && (
          <Alert
            variant="success"
            onClose={() => setSuccessMsg('')}
            dismissible
            style={{ padding: '4px 10px', fontSize: '13px' }}
          >
            {successMsg}
          </Alert>
        )}
        {error && (
          <Alert
            variant="danger"
            onClose={() => setError('')}
            dismissible
            style={{ padding: '4px 10px', fontSize: '13px' }}
          >
            {error}
          </Alert>
        )}

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginLeft: '40px' }}>
          <label htmlFor="categorySelect" style={{ minWidth: '90px', textAlign: 'right', marginRight: '10px' }}>
            Category:
          </label>
          <select
            id="categorySelect"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ minWidth: '150px', padding: '3px 6px', border: '1px solid #999' }}
          >
            <option value=""></option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '18px', marginLeft: '40px' }}>
          <label htmlFor="shoesNameInput" style={{ minWidth: '90px', textAlign: 'right', marginRight: '10px' }}>
            Shoes Name:
          </label>
          <input
            id="shoesNameInput"
            type="text"
            value={shoesName}
            onChange={(e) => setShoesName(e.target.value)}
            style={{ flex: 1, maxWidth: '280px', padding: '3px 6px', border: '1px solid #999' }}
          />
          <button
            id="btnFilter"
            onClick={handleFilter}
            style={{
              marginLeft: '10px',
              padding: '4px 18px',
              border: '1px solid #999',
              background: '#e9ecef',
              cursor: 'pointer',
            }}
          >
            Filter
          </button>
          <button
            id="btnAddNew"
            onClick={() => navigate('/shoes/add')}
            style={{
              marginLeft: '6px',
              padding: '4px 14px',
              border: '1px solid #999',
              background: '#e9ecef',
              cursor: 'pointer',
            }}
          >
            Add New
          </button>
        </div>

        <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>Shoes List</div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #999',
              marginBottom: '14px',
            }}
          >
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Shoes Name</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Manufacturer</th>
                <th style={thStyle}>Price(d)</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {shoesList.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '10px', textAlign: 'center', color: '#888' }}>
                    No records found
                  </td>
                </tr>
              ) : (
                shoesList.map((shoe, index) => (
                  <tr key={shoe.id}>
                    <td style={tdStyle}>{startRecord + index}</td>
                    <td style={tdStyle}>{shoe.name}</td>
                    <td style={tdStyle}>{shoe.category?.name || shoe.categoryName || ''}</td>
                    <td style={tdStyle}>{shoe.manufacturer}</td>
                    <td style={tdStyle}>{shoe.price}</td>
                    <td style={tdStyle}>
                      <span
                        id={`btnDelete-${shoe.id}`}
                        style={{ color: '#00c', cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => handleDeleteClick(shoe)}
                      >
                        Delete
                      </span>
                      {' | '}
                      <Link
                        id={`btnView-${shoe.id}`}
                        to={`/shoes/view/${shoe.id}`}
                        style={{ color: '#00c' }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            Show {startRecord} of {totalRecords} records
          </span>
          <span>{renderPagination()}</span>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header style={{ justifyContent: 'center', borderBottom: 'none' }}>
          <Modal.Title style={{ fontSize: '16px', fontWeight: 'bold' }}>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: 'center' }}>
          Are you sure you want to delete shoes &quot;{shoeToDelete?.name}&quot;?
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: 'center', borderTop: 'none', paddingBottom: '20px' }}>
          <button
            id="btnConfirmYes"
            onClick={handleConfirmDelete}
            style={{
              background: '#dfdfdf',
              border: '1px solid #555',
              padding: '4px 30px',
              marginRight: '60px',
              cursor: 'pointer',
              borderRadius: '0',
            }}
          >
            Yes
          </button>
          <button
            id="btnConfirmClose"
            onClick={() => setShowModal(false)}
            style={{
              background: '#dfdfdf',
              border: '1px solid #555',
              padding: '4px 30px',
              cursor: 'pointer',
              borderRadius: '0',
            }}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

const thStyle = {
  padding: '6px 10px',
  border: '1px solid #999',
  textAlign: 'left',
  fontWeight: 'bold',
  background: '#f0f0f0',
};

const tdStyle = {
  padding: '5px 10px',
  border: '1px solid #999',
};

export default ShoesList;
