import React from 'react';

const Projects = () => {
    return (
        <section id="projects" className="section">
            <h2 className="section-title reveal">Projects</h2>
            <div className="projects-grid">
                <div className="project-card glass-panel reveal">
                    <div className="project-img">
                        <img src="/assets/turtlebot_slam.png" alt="Turtlebot3 Navigation" />
                    </div>
                    <div className="project-info">
                        <h3>Turtlebot3: SLAM Navigation</h3>
                        <span className="date">Jan 2024 - Feb 2024</span>
                        <p>Deployed Lidar-based SLAM and Nav2 stack for autonomous environment mapping and path planning. Visualized transform trees (TF) and laser scan data via Rviz2 and Gazebo.</p>
                        <div className="project-links">
                            <a href="#" className="btn-small"><i className="fab fa-github"></i> Code</a>
                            <a href="#" className="btn-small btn-primary"><i className="fas fa-play"></i> Demo</a>
                        </div>
                    </div>
                </div>

                <div className="project-card glass-panel reveal">
                    <div className="project-img">
                        <img src="/assets/orange_robot.png" alt="Orange Robot Platform" />
                    </div>
                    <div className="project-info">
                        <h3>Orange Robot Platform</h3>
                        <span className="date">Feb 2024 - Mar 2024</span>
                        <p>Developed a mobile robot platform integrated with a 5-DOF robotic arm for a Teleoperation system. Simulated kinematics in Gazebo using ROS2. Performed precise orange box pick-up tasks.</p>
                        <div className="project-links">
                            <a href="#" className="btn-small"><i className="fab fa-github"></i> Code</a>
                            <a href="#" className="btn-small btn-primary"><i className="fas fa-play"></i> Demo</a>
                        </div>
                    </div>
                </div>

                <div className="project-card glass-panel reveal">
                    <div className="project-img">
                        <img src="/assets/dental_robot.png" alt="Service Robot for Dental Clinic" />
                    </div>
                    <div className="project-info">
                        <h3>Service Robot for Dental Clinic</h3>
                        <span className="date">Jun 2024 - Oct 2024</span>
                        <p>Designed a Service Robot prototype for dental clinics, integrated with a 5-DOF robotic arm. Built to transport dental trays from sterilization rooms to treatment rooms.</p>
                        <div className="project-links">
                            <a href="#" className="btn-small"><i className="fab fa-github"></i> Code</a>
                            <a href="#" className="btn-small btn-primary"><i className="fas fa-play"></i> Demo</a>
                        </div>
                    </div>
                </div>

                <div className="project-card glass-panel reveal">
                    <div className="project-img">
                        <img src="/assets/white_post_robot.png" alt="White Post Delivery Robot" />
                    </div>
                    <div className="project-info">
                        <h3>White Post: Document Delivery Robot</h3>
                        <span className="date">Jun 2025 - Mar 2026</span>
                        <p>Implemented an automated delivery system with a multi-terrain tracked base. Features full Inverse/Forward Kinematics control for the 5-DOF arm, and a custom YOLOv8 model (OpenCV) to identify and track elevator buttons.</p>
                        <div className="project-links">
                            <a href="#" className="btn-small"><i className="fab fa-github"></i> Code</a>
                            <a href="#" className="btn-small btn-primary"><i className="fas fa-play"></i> Demo</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Projects;
