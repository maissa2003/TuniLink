import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Wallet, 
  Handshake, 
  Building2, 
  ArrowRight, 
  Shield, 
  UserCircle,
  Briefcase
} from 'lucide-react';
import workImg from '../assets/images/work.jpg';
import clientImg from '../assets/images/client.jpg';
import hrImg from '../assets/images/hr.jpg';
import financialImg from '../assets/images/financial.jpg';
import logoImg from '../assets/images/logo (3).png';
import { Button } from './ui/button';
import CareersApplyModal from './CareersApplyModal';

export function removeLandingStylesheets() {
  // Keeping this empty function in case it's called elsewhere, 
  // but we are no longer injecting stylesheets here.
}

export default function LandingPage() {
  useEffect(() => {
    document.title = 'TuniLink - Smart Workforce & Payroll Management';
  }, []);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const roles = [
    {
      title: 'Super Admin',
      desc: 'Manage companies, users, roles, and platform settings.',
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: 'Agency Manager',
      desc: 'Access HR, Finance, Employees, and company administration.',
      icon: <Briefcase className="w-6 h-6" />
    },
    {
      title: 'HR',
      desc: 'Manage employees, contracts, documents, leave requests, and payroll inputs.',
      icon: <Users className="w-6 h-6" />
    },
    {
      title: 'Finance',
      desc: 'Manage infrastructure costs, payroll, margins, taxes, and invoices.',
      icon: <Wallet className="w-6 h-6" />
    },
    {
      title: 'Employee',
      desc: 'Upload personal documents, request leave, view contracts, and access payroll information.',
      icon: <UserCircle className="w-6 h-6" />
    },
    {
      title: 'Canadian Client',
      desc: 'Track assigned employees, run simulations, download invoices, and view project history.',
      icon: <Handshake className="w-6 h-6" />
    }
  ];

  const steps = [
    { title: "Client Request", desc: "Client requests an employee." },
    { title: "HR Processing", desc: "HR prepares recruitment." },
    { title: "Payroll & Margins", desc: "Finance calculates payroll and margins." },
    { title: "Simulation", desc: "Simulation is generated." },
    { title: "Invoicing", desc: "Invoice is sent to the Canadian client." }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-200">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50 py-8">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="TuniLink" className="h-20 w-auto" />
          </div>
          <div className="hidden md:flex items-center gap-8 text-white/90 font-medium">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#roles" className="hover:text-white transition-colors">Roles</a>
          </div>
          <div>
            <Link to="/login">
              <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-6 font-semibold">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105 transform" 
          style={{ backgroundImage: `url(${workImg})` }}
        />
        <div className="absolute inset-0 bg-slate-950/75 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
        
        <div className="relative z-20 container mx-auto px-6 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-200 text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            B2B SaaS Platform for Tunisia–Canada
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 max-w-5xl leading-tight">
            Smart Workforce & <br className="hidden md:block"/> Payroll Management
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            TuniLink centralizes recruitment, payroll calculations, employee management, contracts, simulations, and client collaboration between Tunisia and Canada.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 text-lg rounded-full h-14 shadow-lg shadow-blue-600/30">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/5 text-white border-white/20 hover:bg-white/10 px-8 text-lg rounded-full h-14 backdrop-blur-sm">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50 relative z-20 -mt-8 rounded-t-3xl">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Powerful Features for Every Role</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">One centralized platform to manage the entire lifecycle of international recruitment.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              image={hrImg} 
              title="Human Resources" 
              description="Manage employees, contracts, leave requests, documents, and payroll inputs."
              icon={<Users className="w-6 h-6" />}
            />
            <FeatureCard 
              image={financialImg} 
              title="Finance & Payroll" 
              description="Calculate payroll, company costs, margins, invoices, and profitability."
              icon={<Wallet className="w-6 h-6" />}
            />
            <FeatureCard 
              image={clientImg} 
              title="Canadian Clients" 
              description="Monitor assigned employees, view invoices, run salary simulations, and track project history."
              icon={<Handshake className="w-6 h-6" />}
            />
            <FeatureCard 
              image={workImg} 
              title="Infrastructure & Operations" 
              description="Manage operational costs, equipment, internet, office expenses, and infrastructure resources."
              icon={<Building2 className="w-6 h-6" />}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">How It Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">A seamless workflow from request to invoice.</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-6 relative pb-12 last:pb-0 group">
                  {idx !== steps.length - 1 && (
                    <div className="absolute top-12 bottom-0 left-6 w-0.5 bg-blue-100 group-hover:bg-blue-300 transition-colors -translate-x-1/2"></div>
                  )}
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 z-10 font-bold text-lg border-2 border-blue-100 shadow-sm">
                    {idx + 1}
                  </div>
                  <div className="bg-white border border-slate-100 p-6 rounded-2xl flex-1 shadow-sm hover:shadow-md transition-shadow group-hover:border-blue-100">
                    <h4 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h4>
                    <p className="text-slate-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section id="careers" className="py-24 bg-blue-50 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-10 md:p-16 text-center shadow-xl border border-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-indigo-100 rounded-full opacity-50 blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                <Briefcase className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Join the TuniLink Talent Pool</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                We are constantly looking for talented professionals to match with top-tier Canadian companies. 
                Submit your CV today and let our HR team find the perfect opportunity for your skills.
              </p>
              <Button 
                onClick={() => setIsApplyModalOpen(true)}
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 text-lg rounded-full h-14 shadow-lg shadow-blue-600/30"
              >
                Apply Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-24 bg-slate-950 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-white">Platform Roles</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Dedicated workspaces designed for every stakeholder in the process.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map(role => (
              <div key={role.title} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:bg-slate-800/80 hover:border-slate-700 transition-all duration-300 group">
                <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                  {role.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{role.title}</h3>
                <p className="text-slate-400 leading-relaxed">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 tracking-tight">500+</div>
              <div className="text-slate-500 font-medium">Employees Managed</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 tracking-tight">150+</div>
              <div className="text-slate-500 font-medium">Payroll Simulations</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 tracking-tight">25+</div>
              <div className="text-slate-500 font-medium">Companies</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 tracking-tight">99%</div>
              <div className="text-slate-500 font-medium">Data Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-24 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Ready to optimize your workforce?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-light">
            Manage employees, finance, contracts, and payroll from one platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-slate-50 px-8 text-lg rounded-full h-14 font-semibold shadow-xl shadow-blue-900/20">
                Login to Platform
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 px-8 text-lg rounded-full h-14 font-semibold">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img src={logoImg} alt="TuniLink" className="h-16 w-auto" />
              </div>
              <p className="text-sm leading-relaxed mb-6">
                The modern B2B SaaS platform for Tunisia–Canada recruitment and payroll management.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Payroll</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Simulation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reports</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800/50 text-sm flex flex-col md:flex-row items-center justify-between">
            <p>© 2026 TuniLink. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      <CareersApplyModal 
        isOpen={isApplyModalOpen} 
        onClose={() => setIsApplyModalOpen(false)} 
      />
    </div>
  );
}

function FeatureCard({ image, title, description, icon }: { image: string, title: string, description: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className="h-48 overflow-hidden relative">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md p-2.5 rounded-xl text-white shadow-lg border border-white/20">
          {icon}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}