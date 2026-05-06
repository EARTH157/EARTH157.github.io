import React from 'react';

const Navbar = () => {
    const handleScroll = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav>
            <div className="logo">EARTH157</div>
            <ul className="nav-links">
                <li><a href="#about" onClick={(e) => handleScroll(e, 'about')}>About</a></li>
                <li><a href="#experience" onClick={(e) => handleScroll(e, 'experience')}>Experience</a></li>
                <li><a href="#projects" onClick={(e) => handleScroll(e, 'projects')}>Projects</a></li>
                <li><a href="#skills" onClick={(e) => handleScroll(e, 'skills')}>Skills</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;
