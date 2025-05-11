import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaLinkedin, FaGithub, FaTelegram } from 'react-icons/fa';


const AboutPage = () => {
    return (
        <Container className="my-5">
            <Row className="mb-4">
                <Col>
                    <h1>About This Project</h1>
                    <p>
                        This project focuses on risk assesment for car insurance.
                        This diploma project presents a machine learning (ML)-based solution for dynamic
                        car insurance pricing, focusing on refund probability prediction. Using
                        key input variables such as vehicle age, driver demographics, accident history, and re-
                        gional risk classification, several models were evaluated, including Linear Regression,
                        XGBoost, and Random Forest. A neural network was ultimately selected due to its
                        superior ability to capture complex, nonlinear relationships, achieving 86% accuracy
                        in refund prediction—significantly outperforming traditional statistical methods. The
                        system was designed for real-time data processing, ensuring continuous recalibration to
                        adapt to market fluctuations. A robust data pipeline integrated various data sources
                        while maintaining strict data privacy and security compliance. Key challenges, such
                        as seamless data integration and model scalability, were addressed through automatic
                        recalibration and advanced engineering techniques. The successful deployment of this
                        ML-driven pricing framework demonstrates the potential of neural networks to enhance
                        risk assessment and optimize insurance pricing strategies. Future research should explore
                        additional input variables and improve computational efficiency to further refine predic-
                        tive accuracy.
                    </p>
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
                        <Col md={4}>
                            <img
                                src="/Neural Network-roc.png"
                                alt="ROC Curve"
                                className="img-fluid rounded shadow mb-3"
                            />
                            <small className="text-muted d-block">ROC Curve of different models</small>
                        </Col>
                        <Col md={4}>
                            <img
                                src="f1.png"
                                alt="Confusion Matrix"
                                className="img-fluid rounded shadow mb-3"
                            />
                            <small className="text-muted d-block">Confusion Matrix</small>
                        </Col>

                        <Col md={4}>
                            <h2>Model Performance</h2>
                            <img
                                src="accuracy.png"
                                alt="Model Accuracy Comparison"
                                className="img-fluid rounded shadow"
                            />
                            <small className="text-muted d-block mt-2">Comparison of model accuracies</small>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="mb-6">
                <Col md={6}>
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
        </Container>
    );
};

export default AboutPage;
