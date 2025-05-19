import React, { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import axiosInstance from '../api';

const TrainModel = () => {
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const handleTrainModel = async () => {
    setError(null);
    setResponse(null);

    try {
      const response = await axiosInstance.post('/prediction/async-train-model/');
      setResponse(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Training failed');
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
          {response.status === 'Training started'
            ? 'Training started. Wait results on your email'
            : 'Training request received'}
        </Alert>
      )}

      <Button
        variant="primary"
        onClick={handleTrainModel}
        className="mt-3"
      >
        Start Training
      </Button>
    </div>
  );
};

export default TrainModel;
