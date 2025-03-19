// import React from 'react';
// import Image from 'next/image';

// const AboutUs: React.FC = () => {
//   return (
//     <div className="about-us">
    
//       <div className="energex-section">
        
//         <div className="image-placeholder" style={{width:'100%'}}>
//           <Image 
//           src="/aboutus.png" 
//           alt="EnerGex"
//           layout='responsive' 
//           width= {1200}
//           height={300} />
//         </div>
//       </div>

//      <div className="mission-section" style={{ padding: '20px' }}>
//       {/* Heading above the image */}
//       <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
//         Empowering smarter energy choices
//       </h2>

//       {/* Flex container for text and image */}
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//         {/* Text content on the left */}
//         <div className="text-content" style={{ flex: 1, maxWidth: '60%', paddingRight: '20px' }}>
//           <p style={{ fontSize: '1.25rem', lineHeight: '1.6' }}>
//             We strive to reduce cost in most of our unique energy-trustful data into sustainable images and power a smarter world.
//           </p>
//         </div>

//         {/* Image placeholder on the right */}
//         <div className="image-placeholder" style={{ flex: 1, textAlign: 'right' }}>
//           <Image
//             src="/aboutus1.png"
//             alt="Sustainable Energy"
//             width={500}
//             height={300}
//             style={{ maxWidth: '100%', height: 'auto' }}
//           />
//         </div>
//       </div>
//     </div>

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
//     </div>
//   );
// };

// export default AboutUs;
'use client'; // Add this line to mark the component as a Client Component

import React from 'react';
import Image from 'next/image';

const AboutUs: React.FC = () => {
  return (
    <div className="about-us">
      <div className="energex-section">
        <div className="image-placeholder" style={{ width: '100%' }}>
          <Image
            src="/aboutus.png"
            alt="EnerGex"
            layout="responsive"
            width={1200}
            height={300}
          />
        </div>
      </div>

      <div className="mission-section" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
          Empowering smarter energy choices
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="text-content" style={{ flex: 1, maxWidth: '60%', paddingRight: '20px' }}>
            <p style={{ fontSize: '1.25rem', lineHeight: '1.6' }}>
              We strive to reduce cost in most of our unique energy-trustful data into sustainable images and power a smarter world.
            </p>
          </div>

          <div className="image-placeholder" style={{ flex: 1, textAlign: 'right' }}>
            <Image
              src="/aboutus1.png"
              alt="Sustainable Energy"
              width={500}
              height={300}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </div>

      <div className="rationale-section">
        <h2>Our Rationale</h2>
        <p>
          Our rationale is to leverage AI and IoT to bring energy optimisation into the ecosystem's decisions.
        </p>
        <div className="image-placeholder">
          <Image src="/path-to-your-image.png" alt="AI and IoT" width={500} height={300} />
        </div>
      </div>

      <div className="future-section">
        <h2>Pioneering the Future</h2>
        <p>
          We use pioneering a future where energy consumption is much less measured, but multiplying potential. A growing range of partners and applying AI-driven insights, we ensure that every device serves its purpose.
        </p>
        <div className="image-placeholder">
          <Image src="/path-to-your-image.png" alt="Future Energy" width={500} height={300} />
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .mission-section, .rationale-section, .future-section {
            padding: 10px;
          }

          .mission-section h2, .rationale-section h2, .future-section h2 {
            font-size: 2rem;
          }

          .mission-section p, .rationale-section p, .future-section p {
            font-size: 1rem;
          }

          .mission-section div {
            flex-direction: column;
            text-align: center;
          }

          .mission-section .text-content {
            max-width: 100%;
            padding-right: 0;
            margin-bottom: 20px;
          }

          .mission-section .image-placeholder {
            text-align: center;
          }

          .rationale-section .image-placeholder, .future-section .image-placeholder {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutUs;