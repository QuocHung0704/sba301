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
import { getCategories } from '../api/categories';
import { searchTour, deleteTourById } from '../api/foodTourApi';
import DeleteModal from '../components/DeleteModal';
import Pagination from '../components/Paginantion';
import Header from '../components/Header';

const PAGE_SIZE = 5;

function TourList() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tourName, setTourName] = useState('');

  const [tourList, setTourList] = useState([]);
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
    fetchTour(currentPage);
  }, [currentPage, filterCategory, filterName]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchTour = async (page) => {
    setLoading(true);
    setError('');
    try {
      const params = { page: page - 1, size: PAGE_SIZE };
      if (filterCategory) params.category = filterCategory;
      if (filterName) params.name = filterName;

      const res = await searchTour(params);
      const data = res.data;

      if (data && data.content !== undefined) {
        setTourList(data.content);
        setTotalRecords(data.totalElements);
        setTotalPages(data.totalPages || Math.ceil(data.totalElements / PAGE_SIZE) || 1);
      } else if (Array.isArray(data)) {
        setTourList(data);
        setTotalRecords(data.length);
        setTotalPages(Math.ceil(data.length / PAGE_SIZE) || 1);
      } else {
        setTourList([]);
        setTotalRecords(0);
        setTotalPages(1);
      }
    } catch (err) {
      setError('Failed to load tour list. Please check the API server.');
      setTourList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    const catObj = categories.find(c => String(c.categoryId) === String(selectedCategory));
    setFilterCategory(catObj ? catObj.categoryName : '');
    setFilterName(tourName);
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
      await deleteTourById(shoeToDelete.tourId);
      setShowModal(false);
      setSuccessMsg('Deleted successfully');
      fetchTour(currentPage);
    } catch (err) {
      setShowModal(false);
      setError('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const startRecord = tourList.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;

  return (
    <Container
      className="border bg-white p-0"
      style={{ maxWidth: '860px', minHeight: '480px', fontFamily: 'Arial, sans-serif', fontSize: '14px' }}
    >
      <Header />

      <div className="p-3">
        <div className="fw-bold mb-3">Tour List</div>

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
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3 align-items-center ps-4">
          <Col xs="auto">
            <Form.Label htmlFor="tourNameInput" className="mb-0">Tour Name:</Form.Label>
          </Col>
          <Col xs="auto">
            <Form.Control
              id="tourNameInput"
              size="sm"
              type="text"
              value={tourName}
              onChange={(e) => setTourName(e.target.value)}
              style={{ width: '280px' }}
            />
          </Col>
          <Col xs="auto">
            <Button id="btnFilter" variant="secondary" size="sm" onClick={handleFilter}>
              Filter
            </Button>
          </Col>
          <Col xs="auto">
            <Button id="btnAddNew" variant="secondary" size="sm" onClick={() => navigate('/foodtour/add')}>
              Add New
            </Button>
          </Col>
        </Row>

        <div className="fw-bold mb-2">Tour List</div>

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <Table bordered size="sm" className="mb-2">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Tour Name</th>
                <th>Category</th>
                <th>Price(d)</th>
                <th>Duration</th>
                <th>Departure</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tourList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-3">
                    No records found
                  </td>
                </tr>
              ) : (
                tourList.map((tour, index) => (
                  <tr key={tour.tourId}>
                    <td>{startRecord + index}</td>
                    <td>{tour.tourName}</td>
                    <td>{tour.category?.categoryName || tour.categoryName || ''}</td>
                    <td>{tour.price}</td>
                    <td>{tour.duration}</td>
                    <td>{tour.departureAt}</td>
                    <td>
                      <Button
                        id={`btnDelete-${tour.tourId}`}
                        variant="link"
                        size="sm"
                        className="p-0 text-decoration-underline"
                        onClick={() => handleDeleteClick(tour)}
                      >
                        Delete
                      </Button>
                      {' | '}
                      <Link
                        id={`btnView-${tour.tourId}`}
                        to={`/foodtour/${tour.tourId}`}
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
        tourName={shoeToDelete?.tourName}
        onConfirm={handleConfirmDelete}
        onClose={() => setShowModal(false)}
      />
    </Container>
  );
}

export default TourList;
