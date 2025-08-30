import React from 'react';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  BarChart3, 
  Star, 
  Check, 
  CircleDot,
  ArrowRight,
  Shield,
  Clock,
  Smartphone
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const modules = [
    {
      icon: BarChart3,
      title: 'Dashboard',
      description: 'Visão geral completa dos seus alunos, pagamentos e métricas importantes'
    },
    {
      icon: Users,
      title: 'Alunos',
      description: 'Gerencie informações completas dos alunos, turmas e responsáveis'
    },
    {
      icon: CreditCard,
      title: 'Mensalidades',
      description: 'Controle total sobre pagamentos, pendências e histórico financeiro'
    },
    {
      icon: TrendingUp,
      title: 'Financeiro',
      description: 'Relatórios detalhados e análises para tomada de decisões'
    }
  ];

  const testimonials = [
    {
      name: 'Carlos Silva',
      role: 'Proprietário - Arena Beach Sports',
      content: 'Desde que comecei a usar o TM Marinho Sports, minha gestão ficou muito mais organizada. Não perco mais nenhum pagamento!',
      rating: 5
    },
    {
      name: 'Ana Costa',
      role: 'Gestora - Quadra do Sol',
      content: 'A facilidade para controlar as mensalidades e gerar relatórios me economiza horas de trabalho todo mês.',
      rating: 5
    },
    {
      name: 'Roberto Mendes',
      role: 'Instrutor - Futevôlei Pro',
      content: 'Interface simples e intuitiva. Consigo acessar tudo que preciso rapidamente, até mesmo pelo celular.',
      rating: 5
    }
  ];

  const features = [
    'Gestão completa de alunos',
    'Controle de mensalidades',
    'Relatórios financeiros',
    'Acesso via celular',
    'Backup automático',
    'Suporte técnico'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-700 rounded-full flex items-center justify-center">
                <CircleDot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TM Marinho Sports</span>
            </div>
            <button
              onClick={onGetStarted}
              className="bg-orange-700 text-white px-6 py-2 rounded-lg hover:bg-orange-800 transition-colors font-medium"
            >
              Entrar
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            TM Marinho Sports
            <span className="block text-2xl md:text-3xl font-normal mt-2">
              Gestão de Alunos
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Organize alunos, mensalidades e finanças em um só lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onGetStarted}
              className="bg-white text-orange-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-bold text-lg flex items-center space-x-2 shadow-lg"
            >
              <span>Cadastre-se / Login</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2 text-orange-100">
              <Shield className="w-5 h-5" />
              <span>100% Seguro e Confiável</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para gerenciar seus alunos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uma solução completa para gestão de esportes e atividades físicas em qualquer modalidade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {modules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{module.title}</h3>
                  <p className="text-gray-600">{module.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-gray-600">
              Mais de 100 quadras já confiam no TM Marinho Sports
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Plano Simples e Transparente
            </h2>
            <p className="text-xl text-gray-600">
              Sem pegadinhas, sem taxas ocultas
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-orange-500">
              <div className="bg-orange-500 text-white text-center py-4">
                <h3 className="text-2xl font-bold">Plano Completo</h3>
                <p className="text-orange-100">Tudo que você precisa</p>
              </div>
              
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">R$ 99</span>
                    <span className="text-2xl text-gray-600">,90</span>
                    <span className="text-gray-600 ml-2">/mês</span>
                  </div>
                  <p className="text-gray-600 mt-2">Sem limite de alunos</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onGetStarted}
                  className="w-full bg-orange-700 text-white py-4 rounded-lg hover:bg-orange-800 transition-colors font-bold text-lg"
                >
                  Começar Agora
                </button>
                
                <p className="text-center text-sm text-gray-600 mt-4">
                  Cancele quando quiser • Sem fidelidade
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para revolucionar sua gestão?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de proprietários que já transformaram sua gestão com o TM Marinho Sports
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onGetStarted}
              className="bg-white text-orange-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-bold text-lg flex items-center space-x-2"
            >
              <span>Cadastre-se Grátis</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-6 text-orange-100">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Setup em 5 minutos</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5" />
                <span>Acesso mobile</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-orange-700 rounded-full flex items-center justify-center">
                <CircleDot className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">TM Marinho Sports</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">
                © 2025 TM Marinho Sports. Todos os direitos reservados.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Gestão profissional para quadras de futevôlei
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;