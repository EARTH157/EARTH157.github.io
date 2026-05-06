import React from 'react';

const Hero = () => {
    return (
        <header id="about" className="hero">
            <div className="hero-content reveal active">
                <h1 className="glitch" data-text="Jirapat Chaumaungphan">Jirapat Chaumaungphan</h1>
                <h2 className="subtitle">Robotics Engineering Student</h2>
                <p className="summary">
                    Robotics Engineering student with a strong passion for ROS2, Computer Vision, and Autonomous Systems. Proven logical problem-solving skills through the development of a 5-DOF robotic arm. Experienced in Python and C++.
                </p>
                <div className="social-links">
                    <a href="https://github.com/EARTH157" target="_blank" rel="noopener noreferrer" className="btn">
                        <i className="fab fa-github"></i> GitHub
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="btn">
                        <i className="fab fa-linkedin"></i> LinkedIn
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="btn">
                        <i className="fab fa-youtube"></i> YouTube
                    </a>
                </div>
                <div className="contact-info">
                    <span><i className="fas fa-envelope"></i> earthzz.jirapat@outlook.com</span>
                    <span><i className="fas fa-phone"></i> 081-513-7835</span>
                </div>
            </div>
        </header>
    );
};

export default Hero;
