import React, { useState, useEffect } from 'react';
import { Table, Pagination, Spinner, Form } from 'react-bootstrap';
import axiosInstance from '../api';

const DriversList = () => {
    const [drivers, setDrivers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchDrivers = async (page = 1, perPage = 10) => {
        try {
            setLoading(true);
            setError('');
            const response = await axiosInstance.get('/claims/drivers/', {
                params: {
                    page: page,
                    per_page: perPage
                }
            });
            setDrivers(response.data.drivers);
            setTotalPages(response.data.pagination.total_pages);
            setCurrentPage(response.data.pagination.current_page);
        } catch (err) {
            setError('Failed to load drivers: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const handleItemsPerPageChange = (e) => {
        const newPerPage = parseInt(e.target.value);
        setItemsPerPage(newPerPage);
        setCurrentPage(1);
    };

    const renderCompactPagination = () => {
        const visiblePages = 5;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (currentPage <= 3) {
            endPage = Math.min(5, totalPages);
        }
        if (currentPage >= totalPages - 2) {
            startPage = Math.max(totalPages - 4, 1);
        }

        return (
            <div className="d-flex align-items-center gap-2">
                <Pagination size="sm">
                    <Pagination.First
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(1)}
                    />
                    <Pagination.Prev
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                    />

                    {startPage > 1 && <Pagination.Ellipsis disabled />}

                    {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                        const pageNumber = startPage + i;
                        return (
                            <Pagination.Item
                                key={pageNumber}
                                active={pageNumber === currentPage}
                                onClick={() => setCurrentPage(pageNumber)}
                            >
                                {pageNumber}
                            </Pagination.Item>
                        );
                    })}

                    {endPage < totalPages && <Pagination.Ellipsis disabled />}

                    <Pagination.Next
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                    />
                    <Pagination.Last
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                    />
                </Pagination>

                <Form.Select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    size="sm"
                    style={{ width: '130px' }}
                >
                    <option value="10">10/page</option>
                    <option value="20">20/page</option>
                    <option value="50">50/page</option>
                    <option value="100">100/page</option>
                </Form.Select>
            </div>
        );
    };

    return (
        <div className="p-3" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div className="bg-white rounded-3 shadow-sm p-4">
                <h4 className="mb-3 text-primary">Drivers Overview</h4>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="text-muted small">
                        Showing {(currentPage - 1) * itemsPerPage + 1} -
                        {Math.min(currentPage * itemsPerPage, totalPages * itemsPerPage)} of {totalPages * itemsPerPage}
                    </div>
                    {renderCompactPagination()}
                </div>

                {error && <div className="alert alert-danger mb-3">{error}</div>}

                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <div className="table-responsive rounded">
                        <Table hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Age</th>
                                    <th>Gender</th>
                                    <th>Experience</th>
                                    <th>Education</th>
                                    <th className="text-end">Credit Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {drivers.map(driver => (
                                    <tr key={driver._id}>
                                        <td className="fw-medium">#{driver.id}</td>
                                        <td>{driver.age}</td>
                                        <td>{driver.gender}</td>
                                        <td>{driver.driving_experience}</td>
                                        <td>{driver.education}</td>
                                        <td className="text-end">
                                            {driver.credit_score || <span className="text-muted">N/A</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}

                {drivers.length === 0 && !loading && (
                    <div className="text-center py-4 text-muted">
                        No driver records found
                    </div>
                )}

                <div className="d-flex justify-content-end mt-3">
                    {renderCompactPagination()}
                </div>
            </div>
        </div>
    );
};

export default DriversList;
