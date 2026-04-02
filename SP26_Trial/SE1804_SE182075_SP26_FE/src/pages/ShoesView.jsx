import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Spinner, Table } from 'react-bootstrap';
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

  return (
    <Container
      className="border bg-white my-4"
      style={{ maxWidth: '500px', fontFamily: 'Arial, sans-serif', fontSize: '14px' }}
    >
      <div className="fw-bold my-3 fs-6">VIEW DETAILS</div>

      {loading && (
        <div className="text-center py-3">
          <Spinner animation="border" size="sm" />
        </div>
      )}
      {error && <p className="text-danger">{error}</p>}

      {shoe && (
        <>
          <Table borderless size="sm" className="mb-3">
            <tbody>
              <tr>
                <td className="text-end fw-semibold" style={{ width: '45%' }}>Shoes Name:</td>
                <td>{shoe.name}</td>
              </tr>
              <tr>
                <td className="text-end fw-semibold">Manufacturer:</td>
                <td>{shoe.manufacturer}</td>
              </tr>
              <tr>
                <td className="text-end fw-semibold">Type:</td>
                <td>{shoe.category?.name || shoe.categoryName || ''}</td>
              </tr>
              <tr>
                <td className="text-end fw-semibold">Price (d):</td>
                <td>{shoe.price}</td>
              </tr>
              <tr>
                <td className="text-end fw-semibold">Production date:</td>
                <td>{shoe.productionDate}</td>
              </tr>
              <tr>
                <td className="text-end fw-semibold">Import Date:</td>
                <td>{shoe.importDate}</td>
              </tr>
            </tbody>
          </Table>

          <div className="text-center mb-4">
            <Button
              id="btnQuayLai"
              variant="secondary"
              size="sm"
              onClick={() => navigate('/')}
            >
              Back
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}

export default ShoesView;
