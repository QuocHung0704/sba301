import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShoesById } from '../api/shoesApi';

function ShoesView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShoe = async () => {
      try {
        const res = await getShoesById(id);
        setShoe(res.data);
      } catch (err) {
        setError('Failed to load shoe details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShoe();
  }, [id]);

  const fieldLabel = {
    textAlign: 'right',
    paddingRight: '10px',
    color: '#333',
    fontSize: '14px',
    whiteSpace: 'nowrap',
  };

  const fieldValue = {
    fontSize: '14px',
    color: '#333',
  };

  return (
    <div
      style={{
        margin: '30px auto',
        maxWidth: '500px',
        border: '1px solid #aaa',
        background: '#fff',
        fontFamily: 'Arial, sans-serif',
        padding: '20px 30px 28px',
      }}
    >
      {/* Title */}
      <div style={{ fontWeight: 'bold', marginBottom: '22px', fontSize: '15px' }}>
        VIEW DETAILS
      </div>

      {loading && <p style={{ color: '#888' }}>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {shoe && (
        <>
          <table style={{ borderCollapse: 'collapse', margin: '0 auto', width: '100%' }}>
            <tbody>
              <tr>
                <td style={{ ...fieldLabel, width: '45%' }}>Shoes Name:</td>
                <td style={fieldValue}>{shoe.name}</td>
              </tr>
              <tr>
                <td style={{ ...fieldLabel, paddingTop: '6px' }}>Manufacturer:</td>
                <td style={{ ...fieldValue, paddingTop: '6px' }}>{shoe.manufacturer}</td>
              </tr>
              <tr>
                <td style={{ ...fieldLabel, paddingTop: '6px' }}>Type:</td>
                <td style={{ ...fieldValue, paddingTop: '6px' }}>
                  {shoe.category?.name || shoe.categoryName || ''}
                </td>
              </tr>
              <tr>
                <td style={{ ...fieldLabel, paddingTop: '6px' }}>Price (d):</td>
                <td style={{ ...fieldValue, paddingTop: '6px' }}>{shoe.price}</td>
              </tr>
              <tr>
                <td style={{ ...fieldLabel, paddingTop: '6px' }}>Production date:</td>
                <td style={{ ...fieldValue, paddingTop: '6px' }}>{shoe.productionDate}</td>
              </tr>
              <tr>
                <td style={{ ...fieldLabel, paddingTop: '6px' }}>Import Date:</td>
                <td style={{ ...fieldValue, paddingTop: '6px' }}>{shoe.importDate}</td>
              </tr>
            </tbody>
          </table>

          {/* Quay Lại button */}
          <div style={{ textAlign: 'center', marginTop: '22px' }}>
            <button
              id="btnQuayLai"
              onClick={() => navigate('/')}
              style={{
                padding: '5px 28px',
                border: '1px solid #999',
                background: '#e9ecef',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Back
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ShoesView;
