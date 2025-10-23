import React from 'react';

export default function Hero() {
  return (
    <>
      <style>{`
/* 🎨 HERO MAKELY STYLES */
.hero-container {
  text-align: center;
  padding: 120px 24px;
  background-color: #0a0a0a;
  color: #fff;
}

.hero-h1 {
  font-size: 92px;
  line-height: 1.05;
  letter-spacing: -0.5px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 16px;
}

.hero-h2 {
  font-size: 76px;
  font-weight: 700;
  background: linear-gradient(90deg, #ff8b00, #ffcc66);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: pulseGlow 2.5s infinite ease-in-out;
  margin-bottom: 28px;
}

.hero-text {
  max-width: 600px;
  margin: 0 auto 40px;
  font-size: 20px;
  line-height: 1.5;
  color: #dddddd;
}

.hero-cta {
  background-color: #ff7b00;
  color: #fff;
  font-weight: 600;
  font-size: 20px;
  padding: 18px 32px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hero-cta:hover {
  background: linear-gradient(90deg, #ff7b00, #ffcc66);
  box-shadow: 0 0 18px rgba(255, 150, 0, 0.6);
}

@keyframes pulseGlow {
  0% {
    opacity: 1;
    text-shadow: 0 0 12px rgba(255, 136, 0, 0.6);
  }
  50% {
    opacity: 0.85;
    text-shadow: 0 0 24px rgba(255, 170, 0, 0.9);
  }
  100% {
    opacity: 1;
    text-shadow: 0 0 12px rgba(255, 136, 0, 0.6);
  }
}

/* 📱 Responsivo */
@media (max-width: 768px) {
  .hero-h1 {
    font-size: 50px;
  }
  .hero-h2 {
    font-size: 42px;
  }
  .hero-text {
    font-size: 16px;
  }
  .hero-cta {
    font-size: 16px;
    width: 100%;
  }
}
      `}</style>
      <section className="hero-container">
        <h1 className="hero-h1">¿Tu equipo pierde horas en tareas repetitivas?</h1>
        <h2 className="hero-h2">La IA trabaja mientras tú creces.</h2>
        <p className="hero-text">
          Automatizamos tus procesos de marketing, ventas y atención al cliente...
        </p>
        <button className="hero-cta">⚡ Reserva tu diagnóstico y libera +20 h/semana con IA</button>
      </section>
    </>
  )
}
