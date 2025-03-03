// Demo code example for the hero section
export const codeExample = `
import React from 'react';

const Button = ({ children, onClick }) => (
  <button 
    onClick={onClick}
    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
  >
    {children}
  </button>
);

export default Button;
`;

// Testimonials data
export const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Frontend Developer",
    company: "TechCorp",
    text: "This tool has revolutionized our development workflow. Converting designs to code has never been faster!",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "UI/UX Designer",
    company: "DesignHub",
    text: "The accuracy and speed of the code generation is impressive. It's like having an extra developer on the team.",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Product Manager",
    company: "InnovateLabs",
    text: "We've cut our development time in half. The code quality is consistently high and requires minimal tweaking.",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg"
  }
];
