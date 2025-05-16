import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Table, Spinner } from 'react-bootstrap';
import axiosInstance from '../api';
import Papa from 'papaparse';
import { useDropzone } from 'react-dropzone';

const DataUploadPage = () => {
    const [file, setFile] = useState(null);
    const [validationError, setValidationError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const [previewData, setPreviewData] = useState([]);

    const expectedColumns = [
        'ID', 'AGE', 'GENDER', 'RACE', 'DRIVING_EXPERIENCE', 'EDUCATION',
        'INCOME', 'CREDIT_SCORE', 'VEHICLE_OWNERSHIP', 'VEHICLE_YEAR', 'MARRIED',
        'CHILDREN', 'POSTAL_CODE', 'ANNUAL_MILEAGE', 'VEHICLE_TYPE',
        'SPEEDING_VIOLATIONS', 'DUIS', 'PAST_ACCIDENTS', 'OUTCOME'
    ];

    const { getRootProps, getInputProps } = useDropzone({
        accept: '.csv',
        multiple: false,
        onDrop: acceptedFiles => handleFile(acceptedFiles[0])
    });

    const validateCSV = (data) => {
        // const headers = Object.keys(data[0]);
        // return headers.every(header => expectedColumns.includes(header)) &&
        //        headers.length === expectedColumns.length;
        return true;
    };

    const handleFile = (file) => {
        setFile(file);
        setValidationError('');
        setUploadResult(null);

        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (!validateCSV(results.data)) {
                    setValidationError('CSV structure does not match required format');
                    return;
                }
                setPreviewData(results.data.slice(0, 5));
            },
            error: (error) => {
                setValidationError('Error parsing CSV file: ' + error.message);
            }
        });
    };

    const handleUpload = async () => {
        setUploading(true);
        try {
            const response = await axiosInstance.post(
                "claims/drivers/csv-upload/" + file.name+"/",
                file,
                {
                    headers: {
                        'Content-Type': 'application/octet-stream',
                    }
                }
            );

            setUploadResult({
                success: true,
                message: `Successfully uploaded ${response.data.processed} records`
            });

        } catch (error) {
            setUploadResult({
                success: false,
                message: error.response?.data?.message || 'Upload failed'
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Container className="my-5">
            <Card className="shadow">
                <Card.Header className="bg-primary text-white">
                    <h4>Insurance Data Upload</h4>
                    <p className="mb-0">Upload CSV files with insurance claim data</p>
                </Card.Header>

                <Card.Body>
                    <div {...getRootProps()} className="dropzone mb-4 p-4 border rounded">
                        <input {...getInputProps()} />
                        <p>Drag & drop CSV file here, or click to select</p>
                        {file && <p>Selected file: {file.name}</p>}
                    </div>

                    {validationError && <Alert variant="danger">{validationError}</Alert>}
                    {uploadResult && (
                        <Alert variant={uploadResult.success ? 'success' : 'danger'}>
                            {uploadResult.message}
                        </Alert>
                    )}

                    {previewData.length > 0 && (
                        <div className="mb-4">
                            <h5>Data Preview (First 5 Rows)</h5>
                            <div className="table-responsive">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            {expectedColumns.map(header => (
                                                <th key={header}>{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewData.map((row, index) => (
                                            <tr key={index}>
                                                {expectedColumns.map(column => (
                                                    <td key={column}>{row[column]}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )}

                    <div className="d-flex justify-content-end gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setFile(null);
                                setPreviewData([]);
                                setValidationError('');
                            }}
                            disabled={!file}
                        >
                            Reset
                        </Button>

                        <Button
                            variant="primary"
                            onClick={handleUpload}
                            disabled={!file || !!validationError || uploading}
                        >
                            {uploading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    <span className="ms-2">Uploading...</span>
                                </>
                            ) : (
                                'Upload Data'
                            )}
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default DataUploadPage;
