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

  const [page, setPage] = useState(1);

  const [prediction, setPrediction] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const request_data = JSON.stringify(formData);
      console.log(request_data);
      const response = await axios.post('https://backend-rough-wildflower-2218.fly.dev/', request_data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response);
      setPrediction(response.data);
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
        {page === 1 && (
          <Row>
            <Col md={6}>
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

              <Form.Group className="mb-3" controlId="formRace">
                <Form.Label>Race</Form.Label>
                <Form.Select name="RACE" value={formData.RACE} onChange={handleChange}>
                  <option value="majority">Majority</option>
                  <option value="minority">Minority</option>
                </Form.Select>
              </Form.Group>


            </Col>
            <Col md={6}>
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
          </Row>
        )}
        {page === 2 && (
          <Row>
            <Col md={6}>
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
                  name="VEHICLE_OWNERSHIP"
                  value={formData.VEHICLE_OWNERSHIP ? "Yes" : "No"}
                  onChange={(e) => {

                    setFormData({ ...formData, VEHICLE_OWNERSHIP: e.target.value === "Yes" });
                  }}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
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
                  value={formData.MARRIED ? "true" : "false"}
                  onChange={(e) => {
                    setFormData({ ...formData, MARRIED: e.target.value === "true" });
                  }}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Form.Select>
              </Form.Group>


              <Form.Group className="mb-3">
                <Form.Label>Has children</Form.Label>

                <Form.Select
                  name="CHILDREN"
                  value={formData.CHILDREN ? "true" : "false"}
                  onChange={(e) => {
                    setFormData({ ...formData, CHILDREN: e.target.value === "true" });
                  }}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Form.Select>
              </Form.Group>
            </Col>

          </Row>

        )}
        {page === 3 && (
          <>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>INCOME</Form.Label>
                  <Form.Select
                    name="INCOME"
                    value={formData.INCOME}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select income class</option>
                    <option value="upper class">Upper class</option>
                    <option value="middle class">Middle class</option>
                    <option value="working class">Working class</option>
                    <option value="poverty">Poverty</option>
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
              </Col>

              <Col md={6}>
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
              </Col>
            </Row>

            <Row className="mb-3 justify-content-center">
              <Col md={6}>
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
          </>
        )}
        <div className="d-flex justify-content-between mt-4">
          {page > 1 && (
            <Button
              type="button"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                setPage(page - 1);
              }}
            >
              Previous
            </Button>
          )}
          {page < 3 ? (
            <Button
              type="button"
              variant="primary"
              onClick={(e) => {
                e.preventDefault();
                setPage(page + 1);
              }}
            >
              Next
            </Button>
          ) : (
            <Button type="submit" variant="success">
              Get Prediction
            </Button>
          )}
        </div>
      </Form>
      {
        prediction !== null && (
          <Card className="mt-5">
            <Card.Body>
              <Card.Title>Prediction Result</Card.Title>
              {prediction.status === 'success' ? (
                <>
                  <Card.Text>
                    {prediction.prediction === 1 ? "Client is likely to make an insurance claim in the next year"
                      : "Client is unlikely to make an insurance claim in the next year"}
                  </Card.Text>
                  <Card.Text>
                    Probability: {(prediction.probability * 100).toFixed(2)}%
                  </Card.Text>
                </>
              ) : (
                <Card.Text className="text-danger">
                  Error: {prediction.error || 'Failed to get prediction'}
                </Card.Text>
              )}
            </Card.Body>
          </Card>
        )
      }
    </Container >

  )
}
export default PredictionForm;
