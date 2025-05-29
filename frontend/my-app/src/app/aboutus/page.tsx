// 'use client'; // Add this line to mark the component as a Client Component

// import React from 'react';
// import Image from 'next/image';


// const AboutUs: React.FC = () => {
//   return (
//     <div className="about-us">
//       <div className="energex-section">
//         <div className="image-placeholder" style={{ width: '100%' }}>
//           <Image
//             src="/aboutus.png"
//             alt="EnerGex"
//             layout="responsive"
//             width={1200}
//             height={300}
//           />
//         </div>
//       </div>

//       <div className="mission-section" style={{ padding: '20px' }}>
//         <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
//           Empowering smarter energy choices
//         </h2>

//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <div className="text-content" style={{ flex: 1, maxWidth: '60%', paddingRight: '20px' }}>
//             <p style={{ fontSize: '1.25rem', lineHeight: '1.6' }}>
//               We strive to reduce cost in most of our unique energy-trustful data into sustainable images and power a smarter world.
//             </p>
//           </div>

//           <div className="image-placeholder" style={{ flex: 1, textAlign: 'right' }}>
//             <Image
//               src="/aboutus1.png"
//               alt="Sustainable Energy"
//               width={500}
//               height={300}
//               style={{ maxWidth: '100%', height: 'auto' }}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="rationale-section">
//         <h2>Our Rationale</h2>
//         <p>
//           Our rationale is to leverage AI and IoT to bring energy optimisation into the ecosystem's decisions.
//         </p>
//         <div className="image-placeholder">
//           <Image src="/path-to-your-image.png" alt="AI and IoT" width={500} height={300} />
//         </div>
//       </div>

//       <div className="future-section">
//         <h2>Pioneering the Future</h2>
//         <p>
//           We use pioneering a future where energy consumption is much less measured, but multiplying potential. A growing range of partners and applying AI-driven insights, we ensure that every device serves its purpose.
//         </p>
//         <div className="image-placeholder">
//           <Image src="/path-to-your-image.png" alt="Future Energy" width={500} height={300} />
//         </div>
//       </div>

//       {/* Responsive Styles */}
//       <style jsx>{`
//         @media (max-width: 768px) {
//           .mission-section, .rationale-section, .future-section {
//             padding: 10px;
//           }

//           .mission-section h2, .rationale-section h2, .future-section h2 {
//             font-size: 2rem;
//           }

//           .mission-section p, .rationale-section p, .future-section p {
//             font-size: 1rem;
//           }

//           .mission-section div {
//             flex-direction: column;
//             text-align: center;
//           }

//           .mission-section .text-content {
//             max-width: 100%;
//             padding-right: 0;
//             margin-bottom: 20px;
//           }

//           .mission-section .image-placeholder {
//             text-align: center;
//           }

//           .rationale-section .image-placeholder, .future-section .image-placeholder {
//             text-align: center;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AboutUs;
'use client';

import React from 'react';
import Image from 'next/image';

const AboutUs: React.FC = () => {
  return (
    <div className="about-us" style={{ backgroundColor: '#ffffff' }}>
      {/* Animated Hero Section */}
      <div className="hero-section" style={{ 
        padding: '120px 20px 80px',
        textAlign: 'center',
        backgroundColor: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <h1 className="floating-heading" style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          margin: '0 auto 1.5rem',
          color: '#008080',
          display: 'inline-block',
          textShadow: '3px 3px 6px rgba(0,0,0,0.15)',
          maxWidth: '900px',
          lineHeight: '1.2'
        }}>
          Innovating Energy with AI & Edge
        </h1>
        <p style={{
          fontSize: '1.5rem',
          maxWidth: '800px',
          margin: '0 auto',
          color: '#34495e',
          position: 'relative',
          zIndex: 2
        }}>
          Bridging cutting-edge technology with sustainable energy solutions
        </p>

        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 128, 128, 0.08)',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite',
          zIndex: 1
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 128, 128, 0.05)',
          filter: 'blur(30px)',
          animation: 'float 5s ease-in-out infinite reverse',
          zIndex: 1
        }}></div>
      </div>

      {/* Mission Section */}
      <div className="mission-section" style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '60px',
          marginBottom: '80px'
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              color: '#008080'
            }}>
              Empowering Smarter Energy Choices
            </h2>
            <p style={{
              fontSize: '1.3rem',
              lineHeight: '1.7',
              color: '#34495e'
            }}>
              We transform energy data into sustainable solutions that reduce costs 
              and power a smarter world through real-time AI optimization.
            </p>
          </div>
          <div style={{
            flex: 1,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            height: '400px',
            position: 'relative'
          }}>
            <Image
              src="/energy-dashboard.jpg"
              alt="Energy Analytics Dashboard"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Edge Computing Section */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '60px',
          borderRadius: '12px',
          margin: '80px 0',
          borderLeft: '6px solid #008080',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: '#008080'
          }}>
            Edge Computing Integration
          </h3>
          <p style={{
            fontSize: '1.3rem',
            lineHeight: '1.7',
            color: '#34495e'
          }}>
            After exploring HPE's approach to edge computing, we recognized its advantages over 
            a purely cloud-based solution. Edge computing enables real-time processing, reduces 
            latency, and enhances reliability by handling critical computations closer to the 
            data source. This shift minimizes dependency on centralized cloud infrastructure, 
            improving system responsiveness and security.
          </p>
        </div>
      </div>

      {/* Technology Sections */}
      <div style={{
        padding: '80px 20px',
        backgroundColor: '#f5f7fa'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '3rem',
            textAlign: 'center',
            color: '#008080'
          }}>
            Our Technical Approach
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px'
          }}>
            {/* AI + IoT Card */}
            <div style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{
                height: '250px',
                position: 'relative',
                borderRadius: '8px',
                marginBottom: '30px',
                overflow: 'hidden'
              }}>
                <Image
                  src="/ai-iot.jpg"
                  alt="AI and IoT"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                color: '#008080'
              }}>
                AI + IoT Synergy
              </h3>
              <p style={{
                fontSize: '1.2rem',
                lineHeight: '1.6',
                color: '#7f8c8d'
              }}>
                Leveraging AI and IoT to embed energy optimization into ecosystem decisions 
                through smart, connected devices.
              </p>
            </div>

            {/* Future Vision Card */}
            <div style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{
                height: '250px',
                position: 'relative',
                borderRadius: '8px',
                marginBottom: '30px',
                overflow: 'hidden'
              }}>
                <Image
                  src="/future-grid.jpg"
                  alt="Future Energy Grid"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                color: '#008080'
              }}>
                Future Energy Networks
              </h3>
              <p style={{
                fontSize: '1.2rem',
                lineHeight: '1.6',
                color: '#7f8c8d'
              }}>
                Pioneering intelligent systems where energy consumption is dynamically 
                optimized across distributed networks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .floating-heading {
          animation: float 4s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          .hero-section {
            padding: 80px 20px 60px !important;
          }
          .hero-section h1 {
            font-size: 2.5rem !important;
            animation: float 5s ease-in-out infinite !important;
          }
          .hero-section p {
            font-size: 1.2rem !important;
          }
          .mission-section > div {
            flex-direction: column !important;
          }
          .mission-section div:first-child {
            margin-bottom: 40px !important;
          }
          .mission-section, 
          .technology-sections {
            padding: 40px 20px !important;
          }
          h2 {
            font-size: 2rem !important;
          }
          .edge-computing-section {
            padding: 40px !important;
          }
          .edge-computing-section h3 {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutUs;