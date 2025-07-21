import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => (
  <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)', display: 'flex', alignItems: 'center' }}>
    <Container className="py-5">
      <Row className="align-items-center flex-column-reverse flex-md-row">
        <Col md={6} className="mb-4 mb-md-0 text-center text-md-start">
          <h1 className="display-3 fw-bold mb-3" style={{ color: '#1e293b', letterSpacing: '-2px' }}>Judging Review System</h1>
          <p className="lead mb-4" style={{ color: '#334155', fontSize: '1.25rem' }}>
            Platform pengurusan & penilaian pertandingan inovasi dengan data analytics.<br/>
            <b>4 peranan:</b> Admin, Judge, Committee, Participant.<br/>
            <b>Fungsi:</b> Dashboard masa nyata, skor rubrik, akses ikut peranan, dan banyak lagi.
          </p>
          <div className="d-flex gap-3 justify-content-center justify-content-md-start">
            <Button as={Link} to="/login" variant="primary" size="lg" className="shadow">Login</Button>
            <Button as={Link} to="/register" variant="outline-primary" size="lg" className="shadow">Register</Button>
          </div>
        </Col>
        <Col md={6} className="mb-4 mb-md-0">
          <Card className="shadow-lg border-0 mx-auto" style={{ background: 'rgba(255,255,255,0.97)', maxWidth: 420 }}>
            <Card.Body>
              <h4 className="mb-3 text-primary">Kenapa pilih sistem ini?</h4>
              <ul className="mb-0 ps-3" style={{ color: '#475569', fontSize: '1.1rem', listStyle: 'disc' }}>
                <li>📊 Dashboard masa nyata untuk semua</li>
                <li>📝 Hantar & semak penyertaan dengan mudah</li>
                <li>⭐ Penjurian ikut borang rubrik</li>
                <li>📈 Skor & laporan telus</li>
                <li>🔒 Akses selamat ikut peranan</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>
);

export default Home; 