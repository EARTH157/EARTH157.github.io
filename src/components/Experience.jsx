import React from 'react';

const Experience = () => {
    return (
        <section id="experience" className="section">
            <h2 className="section-title reveal">Education & Experience</h2>
            <div className="timeline">
                <div className="timeline-item reveal">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content glass-panel">
                        <h3>B.Eng. in Robotics Engineering and AI</h3>
                        <h4>Chiang Mai University</h4>
                        <span className="date">Jun 2022 - Mar 2026</span>
                        <p>GPAX: 3.05. Relevant Coursework: Robot Design Essential, Computer Vision, Robotic Engineering, System Analysis and Control, Embedded Systems, ROS2, AI for Robotics.</p>
                    </div>
                </div>
                <div className="timeline-item reveal">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content glass-panel">
                        <h3>Internship</h3>
                        <h4>TESR Co.,Ltd.</h4>
                        <span className="date">Apr 2025 - May 2025</span>
                        <p>Developed a high-payload Autonomous Mobile Robot (AMR) capable of transporting up to 300 kg. Collaborated on hardware-software integration by interfacing ROS2 with ESP32 via Serial communication to control Hub Servo Motor drivers.</p>
                    </div>
                </div>
                <div className="timeline-item reveal">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content glass-panel">
                        <h3>Robotics Competitor</h3>
                        <h4>IEEE Region 10 Robotics Competition 2024</h4>
                        <span className="date">Mar 2024 - May 2024</span>
                        <p>Qualified as Stage 2 Finalist. Developed an autonomous Floating Robot (ASV) for environmental water quality sampling.</p>
                    </div>
                </div>
                <div className="timeline-item reveal">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content glass-panel">
                        <h3>Robotics Competitor</h3>
                        <h4>Jinpao Automation Contest 2023</h4>
                        <span className="date">Nov 2022 - Feb 2023</span>
                        <p>Designed the robot's mechanical chassis and structural components for optimal stability.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
