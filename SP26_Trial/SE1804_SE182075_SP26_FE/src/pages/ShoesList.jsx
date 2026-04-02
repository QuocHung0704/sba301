import { useState, useEffect } from 'react';
import {
  Alert,
  Spinner,
  Table,
  Button,
  Form,
  Row,
  Col,
  Container,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { searchShoes, getCategories, deleteShoesById } from '../api/shoesApi';
import Header from '../components/Header';
import Pagination from '../components/Pagination';
import DeleteModal from '../components/DeleteModal';

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

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchShoes(currentPage);
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

  return (
    <Container
      className="border bg-white p-0"
      style={{ maxWidth: '860px', minHeight: '480px', fontFamily: 'Arial, sans-serif', fontSize: '14px' }}
    >
      <Header />

      <div className="p-3">
        <div className="fw-bold mb-3">Shoes List</div>

        {successMsg && (
          <Alert variant="success" dismissible onClose={() => setSuccessMsg('')} className="py-1 px-2 small">
            {successMsg}
          </Alert>
        )}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')} className="py-1 px-2 small">
            {error}
          </Alert>
        )}

        {/* Filter bar */}
        <Row className="mb-2 align-items-center ps-4">
          <Col xs="auto">
            <Form.Label htmlFor="categorySelect" className="mb-0">Category:</Form.Label>
          </Col>
          <Col xs="auto">
            <Form.Select
              id="categorySelect"
              size="sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value=""></option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3 align-items-center ps-4">
          <Col xs="auto">
            <Form.Label htmlFor="shoesNameInput" className="mb-0">Shoes Name:</Form.Label>
          </Col>
          <Col xs="auto">
            <Form.Control
              id="shoesNameInput"
              size="sm"
              type="text"
              value={shoesName}
              onChange={(e) => setShoesName(e.target.value)}
              style={{ width: '280px' }}
            />
          </Col>
          <Col xs="auto">
            <Button id="btnFilter" variant="secondary" size="sm" onClick={handleFilter}>
              Filter
            </Button>
          </Col>
          <Col xs="auto">
            <Button id="btnAddNew" variant="secondary" size="sm" onClick={() => navigate('/shoes/add')}>
              Add New
            </Button>
          </Col>
        </Row>

        <div className="fw-bold mb-2">Shoes List</div>

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <Table bordered size="sm" className="mb-2">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Shoes Name</th>
                <th>Category</th>
                <th>Manufacturer</th>
                <th>Price(d)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shoesList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-3">
                    No records found
                  </td>
                </tr>
              ) : (
                shoesList.map((shoe, index) => (
                  <tr key={shoe.id}>
                    <td>{startRecord + index}</td>
                    <td>{shoe.name}</td>
                    <td>{shoe.category?.name || shoe.categoryName || ''}</td>
                    <td>{shoe.manufacturer}</td>
                    <td>{shoe.price}</td>
                    <td>
                      <Button
                        id={`btnDelete-${shoe.id}`}
                        variant="link"
                        size="sm"
                        className="p-0 text-decoration-underline"
                        onClick={() => handleDeleteClick(shoe)}
                      >
                        Delete
                      </Button>
                      {' | '}
                      <Link
                        id={`btnView-${shoe.id}`}
                        to={`/shoes/view/${shoe.id}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}

        <Row className="align-items-center">
          <Col>
            <small>Show {startRecord} of {totalRecords} records</small>
          </Col>
          <Col xs="auto">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </Col>
        </Row>
      </div>

      <DeleteModal
        show={showModal}
        shoeName={shoeToDelete?.name}
        onConfirm={handleConfirmDelete}
        onClose={() => setShowModal(false)}
      />
    </Container>
  );
}

export default ShoesList;
