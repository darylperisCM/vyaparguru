import { Link } from 'react-router-dom';

export default function Footer() {
  const legalLinks = [
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Refund and Cancellation Policy', href: '/refund-policy' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
    { name: 'Acceptable Use Policy', href: '/acceptable-use-policy' },
  ];

  return (
    <footer className="bg-muted border-t">
      <div className="container py-8 px-4 sm:px-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/assets/footer-logo.png" 
              alt="VyaparGuru - व्यापार गुरु" 
              className="mx-auto w-24 h-24 object-contain"
            />
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} VyaparGuru. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
