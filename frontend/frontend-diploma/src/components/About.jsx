import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaLinkedin, FaGithub, FaTelegram } from 'react-icons/fa';


const AboutPage = () => {
    return (
        <Container className="my-5">
            <Row className="mb-4">
                <Col>
                    <h1>About This Project</h1>
                    <p>This project focuses on risk assessment in car insurance by developing a machine
                        learning (ML)-based solution for dynamic redicting refund probability.
                        The model utilizes key input features such as vehicle age, driver demographics,
                        accident history, and regional risk classification.
                    </p>
                    <p>Several ML algorithms were evaluated during development, including Neural Network,
                        XGBoost, and Random Forest. However,
                        the CatBoost algorithm was ultimately selected for its strong performance
                        with categorical features and ability to model complex, nonlinear patterns.
                        The final model achieved an 85% accuracy rate in predicting refunds, significantly
                        outperforming traditional statistical methods.
                    </p>
                    <p>
                        The system was built to support real-time data processing, allowing for continuous
                        model recalibration in response to market fluctuations. A robust data pipeline was
                        implemented to integrate multiple data sources while ensuring strict compliance with
                        data privacy and security standards. Key challenges—such as seamless data integration,
                        model scalability, and maintaining performance in a dynamic environment—were addressed through
                        automated retraining and advanced engineering solutions.
                        The successful deployment of this CatBoost-based pricing framework
                        highlights the potential of modern ML approaches to enhance risk assessment
                        and optimize insurance pricing strategies. F
                    </p>
                    <p>Future work will focus on incorporating additional
                        predictive features and improving computational efficiency to further enhance model accuracy and
                        responsiveness.</p>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <h2>Importance of the Project</h2>
                    <p>
                        Traditional methods often fail to capture complex patterns in customer behavior and risk factors.
                        Machine learning models help uncover hidden insights, leading to better risk profiling and more accurate pricing strategies.
                    </p>
                </Col>
            </Row>



            <Row className="mt-5">
                <Col>
                    <h2>More Results</h2>
                    <Row>
                        <Col md={6} lg={6}>
                            <img
                                src="/CatBoost-ROC.png"
                                alt="ROC Curve"
                                className="img-fluid rounded shadow mb-3"
                            />
                            <small className="text-muted d-block">ROC Curve</small>
                        </Col>
                        <Col md={6} lg={6}>
                            <img
                                src="/CatBoost-confusion-matrix.png"
                                alt="Confusion Matrix"
                                className="img-fluid rounded shadow mb-3"
                            />
                            <small className="text-muted d-block">Confusion Matrix</small>
                        </Col>
                    </Row>

                    <Row className="mt-4">
                        <Col>
                            <h2>Feature Importance</h2>
                            <img
                                src="public/shap_summary_plot.png"
                                alt="Feature Importance (SHAP)"
                                className="img-fluid rounded shadow"
                                style={{ maxWidth: '600px', width: '100%' }}
                            />
                            <small className="text-muted d-block mt-2">SHAP values showing the most influential features in the CatBoost model.</small>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row className="mb-6">
                <Col md={12}>
                    <h2>Contact Information</h2>
                    <Card className="p-3">
                        <p>
                            <FaLinkedin size={20} style={{ marginRight: '8px' }} />
                            <strong>LinkedIn:</strong>{' '}
                            <a href="https://www.linkedin.com/in/zhonkebayev/" target="_blank" rel="noopener noreferrer">
                                Bauyrzhan
                            </a>
                        </p>

                        <p>
                            <FaGithub size={20} style={{ marginRight: '8px' }} />
                            <strong>GitHub:</strong>{' '}
                            <a href="https://github.com/ZhBauyrzhan" target="_blank" rel="noopener noreferrer">
                                ZhBauyrzhan
                            </a>
                        </p>

                        <p>
                            <FaTelegram size={20} style={{ marginRight: '8px' }} />
                            <strong>Telegram:</strong>{' '}
                            <a href="https://t.me/bnzhn" target="_blank" rel="noopener noreferrer">
                                @bnzhn
                            </a>
                        </p>

                        <p>
                            <strong>Group:</strong>{' '}
                            IT-2206
                        </p>
                    </Card>

                </Col>

            </Row>
        </Container >
    );
};

export default AboutPage;
