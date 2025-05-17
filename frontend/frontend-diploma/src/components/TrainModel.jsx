import React, { useState } from 'react';
import { Button, Alert, Spinner } from 'react-bootstrap';
import axiosInstance from '../api';

const TrainModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const handleTrainModel = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const response = await axiosInstance.post('http://127.0.0.1:8000/prediction/retrain-model/');
      console.log(response);
      setResponse(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Training failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2>Train ML Model</h2>

      {error && (
        <Alert variant="danger" className="mt-3" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {response && (
        <Alert variant="success" className="mt-3" onClose={() => setResponse(null)} dismissible>
          Training started successfully!<br/>
        </Alert>
      )}

      <Button
        variant="primary"
        onClick={handleTrainModel}
        disabled={loading}
        className="mt-3"
      >
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            <span className="ms-2">Training...</span>
          </>
        ) : (
          'Start Training'
        )}
      </Button>
    </div>
  );
};

export default TrainModel;
