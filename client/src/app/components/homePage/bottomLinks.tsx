// BottomLinks.tsx
import React from 'react';

const styles: { [key: string]: React.CSSProperties } = {
  bottomLinks: {
    marginTop: '5rem',
    display: 'flex',
    
    flexDirection: 'column',
    gap: '0px',
   
  },
  
  bottomLink: {

    
    marginRight: '20px',
    color: '#007BFF',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  
};

const BottomLinks: React.FC = () => {
  return (
    <div style={styles.bottomLinks}>
      <div><h3>Get In Touch With US</h3></div>
      <div style={styles.links} >
      <a href="https://www.instagram.com/yourusername" target="_blank" rel="noopener noreferrer" style={styles.bottomLink}>
        Instagram
      </a>
      <a href="mailto:youremail@example.com" style={styles.bottomLink}>
        Email Us
      </a>
      <a href="/contact" style={styles.bottomLink}>
        Contact
      </a>
      </div>
    </div>
  );
};

export default BottomLinks;
