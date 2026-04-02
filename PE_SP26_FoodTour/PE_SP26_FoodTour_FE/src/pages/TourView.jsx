import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Spinner, Table } from 'react-bootstrap';
import { getTourById } from '../api/foodTourApi';

function TourView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await getTourById(id);
        setTour(res.data);
      } catch (err) {
        setError('Failed to load tour details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
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

      {tour && (
        <>
          <Table borderless size="sm" className="mb-3">
            <tbody>
              <tr>
                <td className="text-end fw-semibold" style={{ width: '45%' }}>Tour Name:</td>
                <td>{tour.tourName}</td>
              </tr>
              <tr>
                <td className="text-end fw-semibold">Type:</td>
                <td>{tour.category?.name || tour.categoryName || ''}</td>
              </tr>
              <tr>
                <td className="text-end fw-semibold">Price (d):</td>
                <td>{tour.price}</td>
              </tr>
              <tr>
                <td className="text-end fw-semibold">Duration:</td>
                <td>{tour.duration}</td>
              </tr>
              <tr>
                <td className="text-end fw-semibold">Departure:</td>
                <td>{tour.departureAt}</td>
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

export default TourView;
