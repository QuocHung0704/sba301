import { useState, useEffect } from 'react';
import {
  Alert,
  Button,
  Container,
  Form,
  Row,
  Col,
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createTour,
  searchTour,
  updateTour,
  getTourById,
} from '../api/foodTourApi';

import { getCategories } from '../api/categories';
import Header from '../components/Header';
import Footer from '../components/Footer';

//fix
function TourForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    duration: '',
    departureAt: '',
    categoryId: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');


  //fix
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catRes = await getCategories();
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();

    if (isEdit) {
      const fetchTour = async () => {
        try {
          const res = await getTourById(id);
          const s = res.data;
          const catRes = await getCategories();
          const allCats = Array.isArray(catRes.data) ? catRes.data : [];
          const matchedCat = allCats.find(
            (c) => c.categoryName === s.categoryName
          );
          setForm({
            name: s.tourName || '',
            price: String(s.price || ''),
            duration: Number(s.duration || ''),
            departureAt: s.departureAt || '',
            categoryId: matchedCat ? String(matchedCat.categoryId) : '',
          });
        } catch (err) {
          setSubmitError('Failed to load tour data');
        }
      };
      fetchTour();
    }
  }, [id, isEdit]);

  //ok
  const isValidDate = (str) => {
    if (!str) return false;
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(str)) return false;
    const [day, month, year] = str.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  //fix
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Tour Name is required.';
    } else if (form.name.length > 100) {
      newErrors.name = 'Tour Name must be at most 100 characters.';
    }

    if (!form.price.trim()) {
      newErrors.price = 'Price is required.';
    } else if (isNaN(form.price)) {
      newErrors.price = 'Price must be a number.';
    } else {
      const priceNum = Number(form.price);
      if (priceNum <= 0 || priceNum >= 10000) {
        newErrors.price = 'Price must be greater than 0 and less than 10000.';
      }
    }

    if (!form.duration.trim()) {
      newErrors.duration = 'Duration is required.';
    } else if (isNaN(form.duration)) {
      newErrors.duration = 'Duration must be a number.';
    } else {
      const durationNum = Number(form.duration)
      if (durationNum <= 0 || durationNum >= 24) {
        newErrors.duration = 'Duration must be greater than 0 and less than 24.';
      }
    }

    if (!form.departureAt.trim()) {
      newErrors.departureAt = 'Production Date is required.';
    } else if (!isValidDate(form.departureAt)) {
      newErrors.departureAt = 'Production Date must be in dd/MM/yyyy format.';
    }


    if (!form.categoryId) {
      newErrors.categoryId = 'Category is required.';
    }

    return newErrors;
  };

  //ok
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setSubmitError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    //fix
    const payload = {
      tourName: form.name.trim(),
      price: Number(form.price),
      duration: Number(form.duration),
      departureAt: form.departureAt,
      category: {
        categoryId: Number(form.categoryId),
      },
    };

    //fix
    try {
      const searchRes = await searchTour({ name: payload.tourName });
      const existing = searchRes.data.content || searchRes.data;
      if (Array.isArray(existing)) {
        const isDuplicate = existing.some(
          (s) =>
            s.tourName.toLowerCase() === payload.tourName.toLowerCase() &&
            (isEdit ? Number(s.tourId) !== Number(id) : true)
        );
        if (isDuplicate) {
          setErrors((prev) => ({ ...prev, name: 'No duplicate' }));
          return;
        }
      }
    } catch (err) {
      console.error('Check duplicate failed', err);
    }

    try {
      if (isEdit) {
        await updateTour(id, payload);
        setSuccessMsg('Updated tour successfully');
      } else {
        await createTour(payload);
        setSuccessMsg('Created new tour successfully');
      }
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setSubmitError('Save failed: ' + msg);
    }
  };

  //fix
  return (
    <Container
      className="border bg-white p-0 d-flex flex-column"
      style={{ maxWidth: '860px', minHeight: '480px', fontFamily: 'Arial, sans-serif', fontSize: '14px' }}
    >
      <Header />

      <div className="p-3 flex-grow-1">
        <div className="fw-bold mb-3">
          {isEdit ? 'Update Tour' : 'Add New Tour'}
        </div>

        {successMsg && (
          <Alert variant="success" className="py-1 px-2 small">
            {successMsg}
          </Alert>
        )}
        {submitError && (
          <Alert variant="danger" className="py-1 px-2 small">
            {submitError}
          </Alert>
        )}

        {/* fix */}
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className="mb-2 align-items-start">
            <Form.Label column xs="auto" htmlFor="inputTourName" className="text-end" style={{ minWidth: '130px' }}>
              Tour name:
            </Form.Label>
            <Col>
              <Form.Control
                id="inputTourName"
                type="text"
                name="name"
                size="sm"
                value={form.name}
                onChange={handleChange}
                maxLength={100}
                style={{ width: '340px' }}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Col>
          </Form.Group>

          {/* fix */}
          <Form.Group as={Row} className="mb-2 align-items-start">
            <Form.Label column xs="auto" htmlFor="inputPrice" className="text-end" style={{ minWidth: '130px' }}>
              Price:
            </Form.Label>
            <Col>
              <Form.Control
                id="inputPrice"
                type="text"
                name="price"
                size="sm"
                value={form.price}
                onChange={handleChange}
                maxLength={7}
                style={{ width: '80px' }}
                isInvalid={!!errors.price}
              />
              <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-2 align-items-start">
            <Form.Label column xs="auto" htmlFor="inputDuration" className="text-end" style={{ minWidth: '130px' }}>
              Duration:
            </Form.Label>
            <Col>
              <Form.Control
                id="inputDuration"
                type="text"
                name="duration"
                size="sm"
                value={form.duration}
                onChange={handleChange}
                maxLength={7}
                style={{ width: '80px' }}
                isInvalid={!!errors.duration}
              />
              <Form.Control.Feedback type="invalid">{errors.duration}</Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-2 align-items-start">
            <Form.Label column xs="auto" htmlFor="inputDeparture" className="text-end" style={{ minWidth: '130px' }}>
              Departure Date
            </Form.Label>
            <Col xs="auto">
              <Form.Control
                id="inputDeparture"
                type="text"
                name="departureAt"
                size="sm"
                placeholder="dd/MM/yyyy"
                value={form.departureAt}
                onChange={handleChange}
                maxLength={10}
                style={{ width: '110px' }}
                isInvalid={!!errors.departureAt}
              />
              <Form.Control.Feedback type="invalid">{errors.departureAt}</Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3 align-items-start">
            <Form.Label column xs="auto" htmlFor="selectCategory" className="text-end" style={{ minWidth: '130px' }}>
              Category:
            </Form.Label>
            <Col>
              <Form.Select
                id="selectCategory"
                name="categoryId"
                size="sm"
                value={form.categoryId}
                onChange={handleChange}
                style={{ width: '150px' }}
                isInvalid={!!errors.categoryId}
              >
                <option value=""></option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.categoryId}</Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Row>
            <Col xs={{ offset: 2 }} className="d-flex gap-2">
              <Button id="btnSave" type="submit" variant="secondary" size="sm">
                Save
              </Button>
              <Button id="btnBack" type="button" variant="secondary" size="sm" onClick={() => navigate('/')}>
                Back
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      <Footer />
    </Container>
  );
}

export default TourForm;
