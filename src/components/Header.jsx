function Header() {
  return (
    <header className="header">

      <div className="brand">
        <div className="brand-mark">
          SD
        </div>

        <div>
          <div className="brand-name">
            SOUND<span>DROP</span>
          </div>

          <div className="brand-subtitle">
            ACOUSTIC DATA TRANSMISSION SYSTEM
          </div>
        </div>
      </div>

      <div className="system-status">
        <span className="status-dot"></span>
        SYSTEM ONLINE
      </div>

    </header>
  );
}

export default Header;