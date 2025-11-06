import React, { useState, useEffect } from 'react';

const branches = [
  { id: 'futsal', name: 'Futsal', displayName: 'Futsal', icon: 'https://www.turktelekomspor.com.tr/media/otebufta/footballactive.png' },
  { id: 'voleybol', name: 'Voleybol', displayName: 'Voleybol', icon: 'https://www.turktelekomspor.com.tr/media/wjpf0elo/volleyballactive.png' },
  { id: 'atletizm', name: 'Atletizm', displayName: 'Atletizm', icon: 'https://www.turktelekomspor.com.tr/media/r1yjaxbv/wushuactive.png' },
  { id: 'basketbol', name: '3X3 Basketbol', displayName: '3X3 Basketbol', icon: 'https://www.turktelekomspor.com.tr/media/0dhhdnsg/basketballactive.png' },
  { id: 'gures', name: 'Güreş', displayName: 'Güreş', icon: 'https://www.turktelekomspor.com.tr/media/11ydcfad/wrestlingactive.png' },
  { id: 'bilek-guresi', name: 'Bilek Güreşi', displayName: 'Bilek Güreşi', icon: 'https://www.turktelekomspor.com.tr/media/t00dvwvg/bilekguresiactive.png' },
  { id: 'taekwondo', name: 'Taekwondo', displayName: 'Taekwondo', icon: 'https://www.turktelekomspor.com.tr/media/vord0mi4/taekwondoactive.png' },
  { id: 'okculuk', name: 'Geleneksel Türk Okçuluğu', displayName: 'Geleneksel Türk Okçuluğu', icon: 'https://www.turktelekomspor.com.tr/media/chhgaryj/okculukactive.png' },
  { id: 'badminton', name: 'Badminton', displayName: 'Badminton', icon: 'https://www.turktelekomspor.com.tr/media/uhxdtsk5/badmintonactive.png' },
  { id: 'masa-tenisi', name: 'MASA TENİSİ', displayName: 'MASA TENİSİ', icon: 'https://www.turktelekomspor.com.tr/media/q2vf53ww/tabletennisactive.png' }
];

const SportsBranches = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const branchesPerPage = 4;
  const pageCount = Math.ceil(branches.length / branchesPerPage);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleDotClick = (index) => {
    setCurrentPage(index);
  };

  return (
    <div style={{
      backgroundColor: '#E84049',
      width: '100%',
      marginTop: '5px',
      color: 'white',
      marginBottom: '40px'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '30px 15px' : '50px'
      }}>
        <div style={{
          flexGrow: 1,
          width: isMobile ? '100%' : '75%'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '10px' : '15px',
            paddingTop: isMobile ? '0' : '35px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {branches
              .slice(currentPage * branchesPerPage, (currentPage + 1) * branchesPerPage)
              .map((branch) => (
                <div key={branch.id} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  marginBottom: isMobile ? '15px' : '0',
                  width: isMobile ? '100%' : '85%',
                  margin: '0 auto'
                }}>
                  <div style={{
                    width: isMobile ? '60px' : '70px',
                    height: isMobile ? '60px' : '70px',
                    marginBottom: '5px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <img
                      src={branch.icon}
                      alt={branch.name}
                      className="max-w-full max-h-full object-contain brightness-0 invert"
                    />
                  </div>
                  <h3
                    style={{
                      fontSize: isMobile ? '14px' : '16px',
                      fontWeight: 700,
                      margin: 0,
                      textTransform: 'uppercase',
                      padding: isMobile ? '0 5px' : '0'
                    }}
                    dangerouslySetInnerHTML={{ __html: branch.displayName }}
                  ></h3>
                </div>
              ))}
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'center' : 'center',
          marginTop: isMobile ? '10px' : '0',
          width: isMobile ? '100%' : '25%',
          paddingLeft: isMobile ? '0' : '0',
          paddingRight: isMobile ? '0' : '0',
          borderTop: isMobile ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          paddingTop: isMobile ? '15px' : '35px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontFamily: '"Mulish", sans-serif',
            fontWeight: 900,
            fontStyle: 'italic',
            fontSize: isMobile ? '24px' : '32px',
            lineHeight: 1.2,
            margin: 0
          }}>BRANŞLAR</h3>

          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            marginLeft: isMobile ? '10px' : '0',
            marginTop: isMobile ? '0' : '20px',
            alignItems: 'center'
          }}>
            {[...Array(pageCount)].map((_, index) => (
              <button
                key={index}
                style={{
                  width: isMobile ? '10px' : '8px',
                  height: isMobile ? '10px' : '8px',
                  borderRadius: '50%',
                  backgroundColor: currentPage === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  margin: isMobile ? '0 5px' : '10px 0',
                  cursor: 'pointer',
                  border: 'none',
                  padding: 0
                }}
                onClick={() => handleDotClick(index)}
                aria-label={`Page ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsBranches;