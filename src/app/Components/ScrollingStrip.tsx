import Image from 'next/image';
import Marquee from 'react-fast-marquee';
import { StaticImageData } from 'next/image';

interface ScrollingStripProps {
  starIcon: StaticImageData;
}

const ScrollingStrip = ({ starIcon }: ScrollingStripProps) => {
  const texts = [
    "Authenticity",
    "Expertise",
    "Collaboration",
    "Innovation",
    "Craftsmanship",
    "Authenticity",
    "Expertise",
    "Collaboration",
    "Innovation",
    "Craftsmanship",
    
  ];

  return (
    <div className="bg-[#DB8D12] h-[60px] sm:h-[70px] md:h-[80px] lg:h-[90px] flex items-center">
      <Marquee
        speed={40}
        gradient={false}
        className="overflow-hidden"
        pauseOnHover
      >
        {texts.map((text, index) => (
          <div key={index} className="flex items-center mx-4 sm:mx-6 md:mx-8">
            <Image
              src={starIcon}
              alt="star icon"
              width={20}
              height={20}
              className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px] md:w-[25px] md:h-[25px] lg:w-[30px] lg:h-[30px] mr-2 sm:mr-3 md:mr-4"
            />
            <span className="font-clash text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] text-[#DDDDDD] whitespace-nowrap uppercase">
              {text}
            </span>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default ScrollingStrip;