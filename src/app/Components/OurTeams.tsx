"use client";
import React from 'react';
import TicketButton from './contact-button';
import TeamMemberCard from './TeamMemberCard';

function OurTeams() {
  const teamMembers = [
    { 
      name: 'PRAGYA SINGH', 
      role: 'FOUNDER',
      imageSrc: '/image/team/team1.png',
      bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to specimen book. ",
      socialLinks: {
        instagram: 'https://instagram.com/',
        twitter: 'https://twitter.com/',
        linkedin: 'https://linkedin.com',
        facebook: 'https://facebook.com'
      }
    },
    { 
      name: 'VIJENDRA SAHAANI', 
      role: 'CO-FOUNDER',
      imageSrc: '/image/team/team2.png',
      bio: " Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to specimen book. ",
      socialLinks: {
        instagram: 'https://instagram.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com',
        facebook: 'https://facebook.com'
      }
    },
    { 
      name: 'MANIKA SHARMA', 
      role: 'WRITER, DIRECTOR',
      imageSrc: '/image/team/team3.png',
      bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to specimen book. ",
      socialLinks: {
        instagram: 'https://instagram.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com',
        facebook: 'https://facebook.com'
      }
    },
    { 
      name: 'ALEX RIVERA', 
      role: 'CINEMATOGRAPHER',
      imageSrc: '/image/team/team1.png',
      bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to specimen book. ",
      socialLinks: {
        instagram: 'https://instagram.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com',
        facebook: 'https://facebook.com'
      }
    },
    { 
      name: 'RAJAT KHANNA', 
      role: 'PRODUCER',
      imageSrc: '/image/team/team2.png',
      bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to specimen book. ",
      socialLinks: {
        instagram: 'https://instagram.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com',
        facebook: 'https://facebook.com'
      }
    },
    { 
      name: 'NEHA SHARMA', 
      role: 'ART DIRECTOR',
      imageSrc: '/image/team/team3.png',
      bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to specimen book. ",
      socialLinks: {
        instagram: 'https://instagram.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com',
        facebook: 'https://facebook.com'
      }
    },
  ];

  return (
    <div className="team-section w-full bg-black text-white py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl md:text-5xl font-medium ">Meet Our Team</h2>
          <div className="hidden sm:block">
            <TicketButton label="Meet All" href="#" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <TeamMemberCard
              key={index}
              name={member.name}
              role={member.role}
              imageSrc={member.imageSrc}
              bio={member.bio}
              socialLinks={member.socialLinks}
            />
          ))}
        </div>
        
        {/* Button for small devices only */}
        <div className="mt-8 w-full text-center block sm:hidden">
          <TicketButton label="Meet All" href="#" />
        </div>
      </div>
    </div>
  );
}

export default OurTeams;