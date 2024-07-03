const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#FFFFB0",
        color: "#FF6C5D",
        fontFamily: "Arimo",
        padding: "20px",
        fontWeight:"bold"
      }}>
      <p>© 2024 Ammar Haider</p>
      <div style={{ marginTop: "10px" }}>
        <a
          href="https://github.com/ammarhaider16"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#FF6C5D",
            marginRight: "10px",
          }}>
          GitHub
        </a>
      </div>
      <div style={{ marginTop: "10px" }}>
        <a href="mailto:ammarhaider1629@gmail.com" style={{ color: "#FF6C5D" }}>
          Email
        </a>
      </div>
      <div style={{ marginTop: "10px" }}>
        <a href="https://www.vecteezy.com/free-vector/social-media-pattern">
          Vecteezy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
