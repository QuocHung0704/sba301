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
  createShoes,
  getCategories,
  searchShoes,
  updateShoes,
  getShoesById,
} from '../api/shoesApi';
import Header from '../components/Header';
import Footer from '../components/Footer';

function ShoesForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    manufacturer: '',
    productionDate: '',
    importDate: '',
    categoryId: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
      const fetchShoe = async () => {
        try {
          const res = await getShoesById(id);
          const s = res.data;
          setForm({
            name: s.name || '',
            price: String(s.price || ''),
            manufacturer: s.manufacturer || '',
            productionDate: s.productionDate || '',
            importDate: s.importDate || '',
            categoryId: String(s.categoryId || s.category?.id || ''),
          });
        } catch (err) {
          setSubmitError('Failed to load shoe data');
        }
      };
      fetchShoe();
    }
  }, [id, isEdit]);

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

  // Chuyển dd/MM/yyyy → yyyy-MM-dd cho API (Spring Boot java.util.Date)
  const toApiDate = (str) => {
    if (!str) return null;
    const [day, month, year] = str.split('/');
    return `${year}-${month}-${day}`;
  };


  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Shoes Name is required.';
    } else if (form.name.length > 100) {
      newErrors.name = 'Shoes Name must be at most 100 characters.';
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

    if (!form.manufacturer.trim()) {
      newErrors.manufacturer = 'Manufacturer is required.';
    } else if (form.manufacturer.length > 100) {
      newErrors.manufacturer = 'Manufacturer must be at most 100 characters.';
    }

    if (!form.productionDate.trim()) {
      newErrors.productionDate = 'Production Date is required.';
    } else if (!isValidDate(form.productionDate)) {
      newErrors.productionDate = 'Production Date must be in dd/MM/yyyy format.';
    }

    if (form.importDate.trim() && !isValidDate(form.importDate)) {
      newErrors.importDate = 'Import Date must be in dd/MM/yyyy format.';
    }

    if (!form.categoryId) {
      newErrors.categoryId = 'Category is required.';
    }

    return newErrors;
  };

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

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      manufacturer: form.manufacturer.trim(),
      productionDate: toApiDate(form.productionDate),
      importDate: form.importDate ? toApiDate(form.importDate) : null,
      categoryId: Number(form.categoryId),
    };

    try {
      const searchRes = await searchShoes({ name: payload.name });
      const existing = searchRes.data.content || searchRes.data;
      if (Array.isArray(existing)) {
        const isDuplicate = existing.some(
          (s) =>
            s.name.toLowerCase() === payload.name.toLowerCase() &&
            (isEdit ? Number(s.id) !== Number(id) : true)
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
        await updateShoes(id, payload);
        setSuccessMsg('Updated shoes successfully');
      } else {
        await createShoes(payload);
        setSuccessMsg('Created new shoes successfully');
      }
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setSubmitError('Save failed: ' + msg);
    }
  };

  return (
    <Container
      className="border bg-white p-0 d-flex flex-column"
      style={{ maxWidth: '860px', minHeight: '480px', fontFamily: 'Arial, sans-serif', fontSize: '14px' }}
    >
      <Header />

      <div className="p-3 flex-grow-1">
        <div className="fw-bold mb-3">
          {isEdit ? 'Update Shoes' : 'Add New Shoes'}
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

        <Form onSubmit={handleSubmit}>
          {/* Shoes Name */}
          <Form.Group as={Row} className="mb-2 align-items-start">
            <Form.Label column xs="auto" htmlFor="inputShoesName" className="text-end" style={{ minWidth: '130px' }}>
              Shoes name:
            </Form.Label>
            <Col>
              <Form.Control
                id="inputShoesName"
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

          {/* Price */}
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
                maxLength={5}
                style={{ width: '80px' }}
                isInvalid={!!errors.price}
              />
              <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
            </Col>
          </Form.Group>

          {/* Manufacturer */}
          <Form.Group as={Row} className="mb-2 align-items-start">
            <Form.Label column xs="auto" htmlFor="inputManufacturer" className="text-end" style={{ minWidth: '130px' }}>
              Manufacture:
            </Form.Label>
            <Col>
              <Form.Control
                id="inputManufacturer"
                type="text"
                name="manufacturer"
                size="sm"
                value={form.manufacturer}
                onChange={handleChange}
                maxLength={100}
                style={{ width: '340px' }}
                isInvalid={!!errors.manufacturer}
              />
              <Form.Control.Feedback type="invalid">{errors.manufacturer}</Form.Control.Feedback>
            </Col>
          </Form.Group>

          {/* Production Date + Import Date */}
          <Form.Group as={Row} className="mb-2 align-items-start">
            <Form.Label column xs="auto" htmlFor="inputProductionDate" className="text-end" style={{ minWidth: '130px' }}>
              Production Date
            </Form.Label>
            <Col xs="auto">
              <Form.Control
                id="inputProductionDate"
                type="text"
                name="productionDate"
                size="sm"
                placeholder="dd/MM/yyyy"
                value={form.productionDate}
                onChange={handleChange}
                maxLength={10}
                style={{ width: '110px' }}
                isInvalid={!!errors.productionDate}
              />
              <Form.Control.Feedback type="invalid">{errors.productionDate}</Form.Control.Feedback>
            </Col>
            <Form.Label column xs="auto" htmlFor="inputImportDate" className="px-2">
              Import Date
            </Form.Label>
            <Col xs="auto">
              <Form.Control
                id="inputImportDate"
                type="text"
                name="importDate"
                size="sm"
                placeholder="dd/MM/yyyy"
                value={form.importDate}
                onChange={handleChange}
                maxLength={10}
                style={{ width: '110px' }}
                isInvalid={!!errors.importDate}
              />
              <Form.Control.Feedback type="invalid">{errors.importDate}</Form.Control.Feedback>
            </Col>
          </Form.Group>

          {/* Category */}
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
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.categoryId}</Form.Control.Feedback>
            </Col>
          </Form.Group>

          {/* Buttons */}
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

export default ShoesForm;
