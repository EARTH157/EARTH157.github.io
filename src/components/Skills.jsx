import React from 'react';

const Skills = () => {
    return (
        <section id="skills" className="section">
            <h2 className="section-title reveal">Technical Skills</h2>
            <div className="skills-container">
                <div className="skill-category glass-panel reveal">
                    <h3><i className="fas fa-code"></i> Programming</h3>
                    <div className="tags">
                        <span>Python</span><span>C++</span><span>C</span><span>Lua</span>
                    </div>
                </div>
                <div className="skill-category glass-panel reveal">
                    <h3><i className="fas fa-microchip"></i> Hardware</h3>
                    <div className="tags">
                        <span>TurtleBot3</span><span>2D LiDAR</span><span>OpenCR</span><span>Raspberry Pi</span><span>ESP32</span><span>Arduino Uno</span>
                    </div>
                </div>
                <div className="skill-category glass-panel reveal">
                    <h3><i className="fas fa-map-marked-alt"></i> Navigation & SLAM</h3>
                    <div className="tags">
                        <span>Lidar SLAM</span><span>Nav2</span><span>RRT / RRT* / A*</span>
                    </div>
                </div>
                <div className="skill-category glass-panel reveal">
                    <h3><i className="fas fa-robot"></i> Frameworks & Tools</h3>
                    <div className="tags">
                        <span>ROS2 (Foxy, Humble)</span><span>Rviz2</span><span>Gazebo Classic</span>
                    </div>
                </div>
                <div className="skill-category glass-panel reveal">
                    <h3><i className="fas fa-eye"></i> Vision & AI</h3>
                    <div className="tags">
                        <span>OpenCV</span><span>YOLOv8</span><span>Image Processing</span><span>Roboflow</span><span>LLMs (ChatGPT/Gemini)</span>
                    </div>
                </div>
                <div className="skill-category glass-panel reveal">
                    <h3><i className="fas fa-industry"></i> Industrial Automation</h3>
                    <div className="tags">
                        <span>Siemens PLC</span><span>HMI Design</span><span>TIA Portal v16</span><span>Ladder Logic</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;
