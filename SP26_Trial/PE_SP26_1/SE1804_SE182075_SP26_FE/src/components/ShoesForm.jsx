import { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { createShoes, getCategories, searchShoes, updateShoes, getShoesById } from '../api/shoesApi';

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

  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

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
      productionDate: form.productionDate,
      importDate: form.importDate || null,
      categoryId: Number(form.categoryId),
    };

    // Duplicate check
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

  /* Shared input style */
  const inputStyle = {
    padding: '3px 6px',
    border: '1px solid #999',
    fontSize: '14px',
  };

  const labelStyle = {
    minWidth: '120px',
    textAlign: 'right',
    marginRight: '10px',
    display: 'inline-block',
    fontSize: '14px',
  };

  const errorStyle = {
    color: 'red',
    fontSize: '12px',
    marginLeft: '130px',
    display: 'block',
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
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Header row: Logo | Date ── */}
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

      {/* ── Body ── */}
      <div style={{ padding: '14px 20px', flex: 1 }}>
        <div style={{ fontWeight: 'bold', marginBottom: '20px' }}>
          {isEdit ? 'Update Shoes' : 'Add New Shoes'}
        </div>

        {successMsg && (
          <Alert variant="success" style={{ padding: '4px 10px', fontSize: '13px' }}>
            {successMsg}
          </Alert>
        )}
        {submitError && (
          <Alert variant="danger" style={{ padding: '4px 10px', fontSize: '13px' }}>
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Shoes name */}
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="inputShoesName" style={labelStyle}>Shoes name:</label>
            <input
              id="inputShoesName"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              maxLength={100}
              style={{ ...inputStyle, width: '340px' }}
            />
            {errors.name && <span style={errorStyle}>{errors.name}</span>}
          </div>

          {/* Price */}
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="inputPrice" style={labelStyle}>Price:</label>
            <input
              id="inputPrice"
              type="text"
              name="price"
              value={form.price}
              onChange={handleChange}
              maxLength={5}
              style={{ ...inputStyle, width: '80px' }}
            />
            {errors.price && <span style={errorStyle}>{errors.price}</span>}
          </div>

          {/* Manufacture */}
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="inputManufacturer" style={labelStyle}>Manufacture:</label>
            <input
              id="inputManufacturer"
              type="text"
              name="manufacturer"
              value={form.manufacturer}
              onChange={handleChange}
              maxLength={100}
              style={{ ...inputStyle, width: '340px' }}
            />
            {errors.manufacturer && <span style={errorStyle}>{errors.manufacturer}</span>}
          </div>

          {/* Production Date + Import Date (same row) */}
          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
            <label htmlFor="inputProductionDate" style={labelStyle}>Production Date</label>
            <input
              id="inputProductionDate"
              type="text"
              name="productionDate"
              placeholder="dd/MM/yyyy"
              value={form.productionDate}
              onChange={handleChange}
              maxLength={10}
              style={{ ...inputStyle, width: '110px' }}
            />
            <label
              htmlFor="inputImportDate"
              style={{ marginLeft: '20px', marginRight: '10px', fontSize: '14px' }}
            >
              Import Date
            </label>
            <input
              id="inputImportDate"
              type="text"
              name="importDate"
              placeholder="dd/MM/yyyy"
              value={form.importDate}
              onChange={handleChange}
              maxLength={10}
              style={{ ...inputStyle, width: '110px' }}
            />
          </div>
          {(errors.productionDate || errors.importDate) && (
            <div style={{ marginBottom: '8px' }}>
              {errors.productionDate && <span style={errorStyle}>{errors.productionDate}</span>}
              {errors.importDate && <span style={{ ...errorStyle, marginLeft: '0', paddingLeft: '130px' }}>{errors.importDate}</span>}
            </div>
          )}

          {/* Category */}
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="selectCategory" style={labelStyle}>Category:</label>
            <select
              id="selectCategory"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              style={{ ...inputStyle, width: '150px' }}
            >
              <option value=""></option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <span style={errorStyle}>{errors.categoryId}</span>}
          </div>

          {/* Buttons */}
          <div style={{ marginLeft: '130px' }}>
            <button
              id="btnSave"
              type="submit"
              style={{
                padding: '5px 22px',
                border: '1px solid #999',
                background: '#e9ecef',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            >
              Save
            </button>
            <button
              id="btnBack"
              type="button"
              onClick={() => navigate('/')}
              style={{
                padding: '5px 22px',
                border: '1px solid #999',
                background: '#e9ecef',
                cursor: 'pointer',
              }}
            >
              Back
            </button>
          </div>
        </form>
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          borderTop: '1px solid #ddd',
          padding: '8px 20px',
          fontSize: '13px',
          color: '#555',
        }}
      >
        @Copyright 2026
      </div>
    </div>
  );
}

export default ShoesForm;
