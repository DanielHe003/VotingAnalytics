import React from 'react';
const LogoIcon = '/logo192.png';

const Navbar = ({ navLinks, activeSection, setActiveSection }) => {
  const handleSetActiveSection = (sectionName) => {
    setActiveSection(sectionName);
  };

  return (
    <div style={{ padding: '0 15%' }}>
      <nav className="navbar navbar-expand-lg" style={{ borderBottom: '1px solid #000' }}>
        <div className="container-fluid d-flex flex-column align-items-center">
          <div className="navbar-brand d-flex align-items-center">
            <img src={LogoIcon} alt="Logo" style={{ height: '89px' }} />
          </div>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCenterExample"
            aria-controls="navbarCenterExample"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-center" id="navbarCenterExample">
            <ul className="navbar-nav d-flex justify-content-center">
              {navLinks.map((link, index) => (
                <li className="nav-item" key={index}>
                  <a
                    className={`nav-link ${activeSection === link.name ? 'active' : ''}`}
                    href={link.href}
                    style={{ fontSize: '18px', margin: '0 3px' }}
                    onClick={() => handleSetActiveSection(link.name)}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
