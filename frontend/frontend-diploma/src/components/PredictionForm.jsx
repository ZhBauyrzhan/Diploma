import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    AGE: '16-25',
    GENDER: 'female',
    RACE: 'majority',
    DRIVING_EXPERIENCE: '0-9y',
    EDUCATION: 'high school',
    POSTAL_CODE: '10238',
    INCOME: 'upper class',
    CREDIT_SCORE: 0.6,
    VEHICLE_OWNERSHIP: true,
    VEHICLE_YEAR: 'after 2015',
    MARRIED: true,
    CHILDREN: true,
    ANNUAL_MILEAGE: 12000,
    VEHICLE_TYPE: 'sedan',
    SPEEDING_VIOLATIONS: 0,
    DUIS: 0,
    PAST_ACCIDENTS: 0
  });

  const [prediction, setPrediction] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(formData);
      const request_data = JSON.stringify(formData);
      // console.log(request_data);
      const response = await axios.post('http://127.0.0.1:8000/prediction/make-prediction/', request_data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data['prediction']);
      setPrediction(response.data['prediction']);
      // console.log(prediction);
    } catch (error) {
      console.error('Prediction error:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Car Insurance Risk Prediction</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Age group</Form.Label>
              <Form.Select
                name="AGE"
                value={formData.Age}
                onChange={handleChange}
              >

                <option value="16-25">16-25 years</option>
                <option value="26-39">26-39 years</option>
                <option value="40-64">40-64 years</option>
                <option value="65+">65+ years</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select name="GENDER" value={formData.GENDER} onChange={handleChange}>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Race</Form.Label>
              <Form.Select name="Race" value={formData.RACE} onChange={handleChange}>
                <option value="majority">Majority</option>
                <option value="Minority">Minority</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Driving Experience</Form.Label>
              <Form.Select
                name="DRIVING_EXPERIENCE"
                value={formData.DRIVING_EXPERIENCE}
                onChange={handleChange}
              >
                <option value="0-9y">0-9 years</option>
                <option value="10-19y">10-19 years</option>
                <option value="20-29y">20-29 years</option>
                <option value="30y+">30+ years</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Education</Form.Label>
              <Form.Select
                name="EDUCATION"
                value={formData.EDUCATION}
                onChange={handleChange}
              >
                <option value="high school">high school</option>
                <option value="university">university</option>
                <option value="none">none</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                type="text"
                name="POSTAL_CODE"
                value={formData.POSTAL_CODE}
                onChange={handleChange}
                pattern="\d{5}"  // Validates 5-digit format
                title="Please enter a 5-digit postal code"
                required
              />
              <Form.Text className="text-muted">
                Enter a 5-digit postal code
              </Form.Text>
            </Form.Group>


          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Credit Score</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                max="1"
                name="CREDIT_SCORE"
                value={formData.CREDIT_SCORE}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Type</Form.Label>
              <Form.Select
                name="VEHICLE_TYPE"
                value={formData.VEHICLE_TYPE}
                onChange={handleChange}
                required
              >
                <option value="sedan">Sedan</option>
                <option value="sports car">Sports Car</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vehicle Owner</Form.Label>
              <Form.Select
                name="VEHICLE_OWNER"
                value={formData.VEHICLE_OWNER}
                onChange={handleChange}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vehicle Year</Form.Label>
              <Form.Select
                name="VEHICLE_YEAR"
                value={formData.VEHICLE_YEAR}
                onChange={handleChange}
              >
                <option value="before 2015">Before 2015</option>
                <option value="after 2015">After 2015</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Married</Form.Label>
              <Form.Select
                name="MARRIED"
                value={formData.MARRIED}
                onChange={handleChange}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Form.Select>
            </Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>Has children</Form.Label>
              <Form.Select
                name="CHILDREN"
                value={formData.CHILDREN}
                onChange={handleChange}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>

            <Form.Group className="mb-3">
              <Form.Label>INCOME</Form.Label>
              <Form.Select
                name="EDUCATION"
                value={formData.EDUCATION}
                onChange={handleChange}
              >
                <option value="upper class">upper class</option>
                <option value="middle class">middle class</option>
                <option value="working class">working class</option>
                <option value="poverty">poverty</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Speeding Violations (Last 3 Years)</Form.Label>
              <Form.Control
                type="number"
                name="SPEEDING_VIOLATIONS"
                value={formData.SPEEDING_VIOLATIONS}
                onChange={handleChange}
                min="0"
                max="99"
                required
              />
            </Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>DUIs (Last 5 Years)</Form.Label>
              <Form.Control
                type="number"
                name="DUIS"
                value={formData.DUIS}
                onChange={handleChange}
                min="0"
                max="10"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Past Accidents (Last 5 Years)</Form.Label>
              <Form.Control
                type="number"
                name="PAST_ACCIDENTS"
                value={formData.PAST_ACCIDENTS}
                onChange={handleChange}
                min="0"
                max="20"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Annual Mileage</Form.Label>
              <Form.Control
                type="number"
                name="ANNUAL_MILEAGE"
                value={formData.ANNUAL_MILEAGE}
                onChange={handleChange}
                min="1000"
                max="100000"
                step="1000"
                required
              />
              <Form.Text className="text-muted">
                Enter estimated annual mileage (e.g., 12000)
              </Form.Text>
            </Form.Group>

          </Col>
        </Row>

        <div className="text-center">
          <Button variant="primary" type="submit" size="lg">
            Get Prediction
          </Button>
        </div>
      </Form>

      {prediction !== null && (
        <Card className="mt-5">
          <Card.Body>
            <Card.Title>Prediction Result</Card.Title>
            <Card.Text>
              {prediction === 1
                ? "Client is most likely to claim their loan"
                : "Client is unlikely to claim their loan"}
            </Card.Text>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default PredictionForm;