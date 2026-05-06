import React from 'react';

const Hero = () => {
    return (
        <header id="about" className="hero">
            <div className="hero-content-wrapper">
                <div className="hero-text reveal active">
                    <h1 className="glitch" data-text="Jirapat Chaumaungphan">Jirapat Chaumaungphan</h1>
                    <h2 className="subtitle">Robotics Engineering Student</h2>
                    <p className="summary">
                        Robotics Engineering student with a strong passion for ROS2, Computer Vision, and Autonomous Systems. Proven logical problem-solving skills through the development of a 5-DOF robotic arm. Experienced in Python and C++.
                    </p>
                    <div className="social-links">
                        <a href="https://github.com/EARTH157" target="_blank" rel="noopener noreferrer" className="btn">
                            <i className="fab fa-github"></i> GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/jirapat-chaumaungphan-6a8875296/" target="_blank" rel="noopener noreferrer" className="btn">
                            <i className="fab fa-linkedin"></i> LinkedIn
                        </a>
                        <a href="https://www.youtube.com/@jirapatchaumaungphan6870" target="_blank" rel="noopener noreferrer" className="btn">
                            <i className="fab fa-youtube"></i> YouTube
                        </a>
                    </div>
                    <div className="contact-info">
                        <span><i className="fas fa-envelope"></i> earthzz.jirapat@outlook.com</span>
                        <span><i className="fas fa-phone"></i> 081-513-7835</span>
                    </div>
                </div>
                <div className="hero-image reveal active">
                    <img src="/assets/profile.png" alt="Jirapat Chaumaungphan Silhouette" />
                </div>
            </div>
        </header>
    );
};

export default Hero;
