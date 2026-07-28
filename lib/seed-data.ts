import { Category, Course, User, ContentReport, CourseComment, CourseReview } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-aluno-1',
    name: 'Lucas Silva',
    email: 'lucas@grayhat.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'aluno',
    xp: 1450,
    level: 4,
    streakDays: 6,
    lastActiveDate: new Date().toISOString(),
    totalHoursStudied: 18.5,
    completedCoursesCount: 2,
    medals: [
      { id: 'm1', title: 'Primeiros Passos', description: 'Completou a primeira aula na plataforma Gray Hat', icon: 'Rocket', unlockedAt: '2026-07-01' },
      { id: 'm2', title: 'Mestre da IA', description: 'Concluiu um curso completo de Inteligência Artificial', icon: 'Cpu', unlockedAt: '2026-07-15' },
      { id: 'm3', title: 'Sequência de 5 Dias', description: 'Acessou a plataforma por 5 dias seguidos', icon: 'Flame', unlockedAt: '2026-07-20' },
    ],
    bio: 'Entusiasta de Inteligência Artificial, Tráfego Pago e Automações.',
  },
  {
    id: 'user-criador-1',
    name: 'Gabriel "Gray" Santos',
    email: 'gabriel@grayhat.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    role: 'criador',
    xp: 4800,
    level: 12,
    streakDays: 14,
    lastActiveDate: new Date().toISOString(),
    totalHoursStudied: 84.0,
    completedCoursesCount: 10,
    medals: [
      { id: 'm4', title: 'Criador Estrela', description: 'Publicou mais de 3 cursos com avaliação superior a 4.8', icon: 'Star', unlockedAt: '2026-05-10' },
      { id: 'm5', title: 'Educador Comunitário', description: 'Ajudou mais de 1000 alunos gratuitamente', icon: 'Users', unlockedAt: '2026-06-01' },
    ],
    bio: 'Engenheiro de Software & Especialista em Automações de IA e Tráfego Direto.',
    youtubeUrl: 'https://youtube.com',
    githubUrl: 'https://github.com',
    followersCount: 1420,
  },
  {
    id: 'user-admin-1',
    name: 'Elena Rostova (Admin)',
    email: 'admin@grayhat.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    xp: 9900,
    level: 25,
    streakDays: 30,
    lastActiveDate: new Date().toISOString(),
    totalHoursStudied: 220.0,
    completedCoursesCount: 25,
    medals: [
      { id: 'm6', title: 'Guardião do Repositório', description: 'Moderador oficial e revisor de conteúdos', icon: 'ShieldCheck', unlockedAt: '2026-01-01' },
    ],
    bio: 'Administradora de Conteúdo da Gray Hat Platform. Mantendo a qualidade do conhecimento livre.',
  },
];

export const CATEGORIES: Category[] = [
  { id: 'cat-ia', name: 'Inteligência Artificial', slug: 'inteligencia-artificial', icon: 'Cpu', description: 'Copilotos, agentes, prompts avançados, Midjourney e automação generativa', courseCount: 12 },
  { id: 'cat-tiktok', name: 'TikTok Shop', slug: 'tiktok-shop', icon: 'ShoppingBag', description: 'Vendas orgânicas, afiliados, mineração de produtos e vídeos virais', courseCount: 6 },
  { id: 'cat-mkt', name: 'Marketing Digital', slug: 'marketing-digital', icon: 'TrendingUp', description: 'Estratégias de lançamento, funis de conversão, branding e vendas', courseCount: 18 },
  { id: 'cat-yt', name: 'YouTube', slug: 'youtube', icon: 'Youtube', description: 'Algoritmo, canais dark, roteirização, edição e monetização rápida', courseCount: 9 },
  { id: 'cat-prog', name: 'Programação', slug: 'programacao', icon: 'Code', description: 'Python, TypeScript, scripts de automação, APIs e lógica', courseCount: 15 },
  { id: 'cat-web', name: 'Desenvolvimento Web', slug: 'desenvolvimento-web', icon: 'Globe', description: 'Next.js, React, Tailwind CSS, landing pages de alta conversão', courseCount: 11 },
  { id: 'cat-auto', name: 'Automação', slug: 'automacao', icon: 'Zap', description: 'Make.com, n8n, Zapier, bots de WhatsApp e fluxos sem código', courseCount: 14 },
  { id: 'cat-design', name: 'Design', slug: 'design', icon: 'Palette', description: 'Figma, Canva pro, artes de alta conversão para anúncios e thumbnails', courseCount: 8 },
  { id: 'cat-copy', name: 'Copywriting', slug: 'copywriting', icon: 'PenTool', description: 'Ganchos, estruturas VSL, e-mails persuasivos e scripts de vendas', courseCount: 10 },
  { id: 'cat-trafego', name: 'Tráfego Pago', slug: 'trafego-pago', icon: 'Target', description: 'Meta Ads, Google Ads, TikTok Ads, testes de criativos e escala', courseCount: 16 },
  { id: 'cat-seo', name: 'SEO', slug: 'seo', icon: 'Search', description: 'Posicionamento orgânico no Google, SEO técnico e otimização de artigos', courseCount: 5 },
  { id: 'cat-ecom', name: 'E-commerce', slug: 'e-commerce', icon: 'Store', description: 'Shopify, operação de vendas sem estoque, fornecedores e produto vencedor', courseCount: 7 },
  { id: 'cat-emp', name: 'Empreendedorismo', slug: 'empreendedorismo', icon: 'Briefcase', description: 'Modelos de negócios digitais, gestão de times e escala operacional', courseCount: 9 },
  { id: 'cat-fin', name: 'Finanças', slug: 'financas', icon: 'DollarSign', description: 'Gestão financeira para infoprodutores, tributação e investimentos', courseCount: 4 },
  { id: 'cat-prod', name: 'Produtividade', slug: 'produtividade', icon: 'CheckSquare', description: 'Notion, gestão de tempo, fluxos de trabalho e foco profundo', courseCount: 8 },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-ia-101',
    title: 'Inteligência Artificial na Prática: Automações e Agentes com Gemini',
    slug: 'inteligencia-artificial-na-pratica-gemini',
    shortDescription: 'Aprenda a construir assistentes, automatizar fluxos de trabalho e utilizar IA para multiplicar sua produtividade digital.',
    description: 'Neste curso completo e 100% gratuito, você aprenderá do básico ao avançado como dominar Inteligência Artificial para alavancar negócios digitais. Cobrimos engenharia de prompt avançada, criação de agentes autônomos, uso do Google Gemini API, automações sem código com n8n e integrações reais.',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&auto=format&fit=crop&q=80',
    categoryId: 'cat-ia',
    teacherId: 'user-criador-1',
    teacherName: 'Gabriel "Gray" Santos',
    teacherAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    level: 'Intermediário',
    durationMinutes: 180,
    totalLessons: 8,
    totalStudents: 3420,
    rating: 4.9,
    reviewCount: 412,
    tags: ['IA', 'Gemini', 'Automação', 'Agentes', 'Productivity'],
    status: 'published',
    isFeatured: true,
    isTrending: true,
    certificateEnabled: true,
    language: 'Português',
    createdAt: '2026-06-10T10:00:00Z',
    updatedAt: '2026-07-20T10:00:00Z',
    modules: [
      {
        id: 'mod-1',
        courseId: 'course-ia-101',
        title: 'Módulo 1: Fundamentos de IA Generativa & Prompting',
        description: 'Introdução aos grandes modelos de linguagem e técnicas de instrução de alta precisão.',
        order: 1,
        lessons: [
          {
            id: 'les-1-1',
            moduleId: 'mod-1',
            title: '1. O que os Gurus Não Te Contam Sobre LLMs',
            description: 'Visão realista sobre o funcionamento das IAs modernas, limitações e oportunidades reais no mercado digital.',
            durationMinutes: 18,
            order: 1,
            videoSourceType: 'youtube',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Youtube embed ready
            textContent: `### Conteúdo Teórico da Aula
Nesta aula inicial, desmistificamos a IA Generativa. Não existe mágica: LLMs são modelos estatísticos preditivos treinados em bilhões de textos.

#### O que você precisa entender:
1. **Engenharia de Contexto**: A qualidade da resposta depende 80% do contexto fornecido no prompt.
2. **Alucinações**: Como identificar e prevenir quando a IA inventa informações.
3. **Casos de Uso Reais**: Roteiros de vídeo, geração de cópias de anúncios, sumarização de reuniões e codificação guiada.`,
            isPreview: true,
            resources: [
              { id: 'res-1', title: 'Guia de Prompts em PDF', type: 'pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', size: '1.2 MB' },
              { id: 'res-2', title: 'Planilha de Atalhos para Gemini', type: 'link', url: 'https://ai.google.dev' }
            ],
            quiz: [
              {
                id: 'q1',
                question: 'Qual é o fator principal para obter respostas precisas de uma LLM?',
                options: ['Utilizar prompts muito curtos', 'Fornecer contexto claro e instruções estruturadas', 'Reorganizar o computador', 'Pagar assinaturas mais caras'],
                correctAnswerIndex: 1,
                explanation: 'O contexto estruturado orienta o espaço de busca do modelo de linguagem, garantindo resultados de alta precisão.'
              }
            ],
            exercises: [
              { id: 'ex1', title: 'Exercício Prático 1', prompt: 'Escreva um prompt em formato persona para criar uma landing page de um produto digital.' }
            ]
          },
          {
            id: 'les-1-2',
            moduleId: 'mod-1',
            title: '2. Configurando o Google Gemini no AI Studio',
            description: 'Como obter sua chave de API e utilizar o ambiente profissional do Google AI Studio sem pagar nada.',
            durationMinutes: 22,
            order: 2,
            videoSourceType: 'youtube',
            videoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
            textContent: 'O Google AI Studio oferece cotas gratuitas generosas para desenvolvedores e criadores realizarem testes avançados.',
            resources: [
              { id: 'res-3', title: 'Link Direto para Google AI Studio', type: 'link', url: 'https://aistudio.google.com' }
            ]
          }
        ]
      },
      {
        id: 'mod-2',
        courseId: 'course-ia-101',
        title: 'Módulo 2: Construindo Seu Primeiro Agente com n8n',
        description: 'Conectando o Gemini com Telegram, WhatsApp e E-mail sem escrever código.',
        order: 2,
        lessons: [
          {
            id: 'les-2-1',
            moduleId: 'mod-2',
            title: '3. Arquitetura de Agentes e Fluxos de Automação',
            description: 'Entenda como gatilhos (triggers), nós e respostas funcionam na prática.',
            durationMinutes: 25,
            order: 3,
            videoSourceType: 'vimeo',
            videoUrl: 'https://vimeo.com/76979871',
            textContent: 'Agentes inteligentes recebem dados, processam usando modelos de linguagem e tomam ações em outros softwares.'
          },
          {
            id: 'les-2-2',
            moduleId: 'mod-2',
            title: '4. Integração do Player com Google Drive (Demonstração)',
            description: 'Como incorporar videoaulas armazenadas no Google Drive diretamente no seu ecossistema.',
            durationMinutes: 15,
            order: 4,
            videoSourceType: 'gdrive',
            videoUrl: 'https://drive.google.com/file/d/1BfS_1nE1m5p-6n3y-4m_5k/preview',
            textContent: 'Vídeos hospedados no Google Drive podem ser embedados facilmente com a sintaxe /preview.'
          }
        ]
      }
    ]
  },
  {
    id: 'course-tiktok-201',
    title: 'TikTok Shop & Afiliados Organicos: Estratégias de Venda Rápida',
    slug: 'tiktok-shop-afiliados-organicos',
    shortDescription: 'Como minerar produtos virais, criar vídeos de alta retenção e monetizar sem gastar com tráfego pago.',
    description: 'O TikTok Shop e o programa de afiliados são a maior oportunidade do mercado digital atualmente. Aprenda a encontrar produtos com alta demanda, produzir vídeos curtos persuasivos usando ganchos de 3 segundos e escalar suas vendas de forma totalmente orgânica.',
    coverUrl: 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1600&auto=format&fit=crop&q=80',
    categoryId: 'cat-tiktok',
    teacherId: 'user-criador-1',
    teacherName: 'Gabriel "Gray" Santos',
    teacherAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    level: 'Iniciante',
    durationMinutes: 120,
    totalLessons: 6,
    totalStudents: 2190,
    rating: 4.8,
    reviewCount: 280,
    tags: ['TikTok', 'TikTok Shop', 'Vendas', 'Afiliados', 'Organico'],
    status: 'published',
    isFeatured: true,
    certificateEnabled: true,
    language: 'Português',
    createdAt: '2026-06-18T10:00:00Z',
    updatedAt: '2026-07-22T10:00:00Z',
    modules: [
      {
        id: 'mod-tt-1',
        courseId: 'course-tiktok-201',
        title: 'Módulo 1: Mineração e Estrutura Viral',
        order: 1,
        lessons: [
          {
            id: 'les-tt-1',
            moduleId: 'mod-tt-1',
            title: '1. Como Encontrar Produtos Vencedores no TikTok',
            description: 'Técnicas de busca orgânica no TikTok Creative Center e ferramentas gratuitas de análise.',
            durationMinutes: 20,
            order: 1,
            videoSourceType: 'youtube',
            videoUrl: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
            isPreview: true
          }
        ]
      }
    ]
  },
  {
    id: 'course-trafego-301',
    title: 'Tráfego Pago Descomplicado: Meta Ads & Google Ads em 2026',
    slug: 'trafego-pago-descomplicado-meta-google-ads',
    shortDescription: 'Domine Pixel, API de Conversões, Públicos Semelhantes e Testes de Criativos de Alta Conversão.',
    description: 'Guia completo e direto ao ponto sobre como investir no Meta Ads (Instagram/Facebook) e Google Ads com segurança e ROI positivo.',
    coverUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1600&auto=format&fit=crop&q=80',
    categoryId: 'cat-trafego',
    teacherId: 'user-criador-1',
    teacherName: 'Gabriel "Gray" Santos',
    teacherAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    level: 'Avançado',
    durationMinutes: 240,
    totalLessons: 12,
    totalStudents: 4890,
    rating: 4.95,
    reviewCount: 650,
    tags: ['Meta Ads', 'Google Ads', 'Tráfego Pago', 'Conversão'],
    status: 'published',
    isFeatured: true,
    certificateEnabled: true,
    language: 'Português',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-07-25T10:00:00Z',
    modules: [
      {
        id: 'mod-tr-1',
        courseId: 'course-trafego-301',
        title: 'Módulo 1: Estrutura de Campanhas de Alta Conversão',
        order: 1,
        lessons: [
          {
            id: 'les-tr-1',
            moduleId: 'mod-tr-1',
            title: '1. Configurando o Gerenciador de Negócios e Pixel sem Erros',
            description: 'Passo a passo para instalar e validar eventos na sua landing page.',
            durationMinutes: 30,
            order: 1,
            videoSourceType: 'youtube',
            videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
            isPreview: true
          }
        ]
      }
    ]
  },
  {
    id: 'course-pending-01',
    title: 'Automações Avançadas com Make e n8n para Agências Digitais',
    slug: 'automacoes-avancadas-make-n8n',
    shortDescription: 'Crie ecossistemas automatizados de CRM, qualificação de leads e suporte ao cliente.',
    description: 'Curso completo cobrindo webhooks, manipuladores JSON, tratamento de erros e integração do OpenAI/Gemini com sistemas de CRM como Hubspot e RD Station.',
    coverUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop&q=80',
    categoryId: 'cat-auto',
    teacherId: 'user-criador-1',
    teacherName: 'Gabriel "Gray" Santos',
    teacherAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    level: 'Intermediário',
    durationMinutes: 150,
    totalLessons: 5,
    totalStudents: 0,
    rating: 0,
    reviewCount: 0,
    tags: ['Make', 'n8n', 'Automação', 'Webhooks'],
    status: 'pending', // Pending Admin Approval!
    certificateEnabled: true,
    language: 'Português',
    createdAt: '2026-07-27T14:30:00Z',
    updatedAt: '2026-07-27T14:30:00Z',
    modules: [
      {
        id: 'mod-p1',
        courseId: 'course-pending-01',
        title: 'Módulo 1: Conectando APIs e Webhooks',
        order: 1,
        lessons: [
          {
            id: 'les-p1-1',
            moduleId: 'mod-p1',
            title: '1. O que são Webhooks e como capturar chamadas HTTP',
            description: 'Conceito básico de Webhooks e payload JSON.',
            durationMinutes: 20,
            order: 1,
            videoSourceType: 'youtube',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          }
        ]
      }
    ]
  }
];

export const INITIAL_REVIEWS: CourseReview[] = [
  {
    id: 'rev-1',
    courseId: 'course-ia-101',
    userId: 'user-aluno-1',
    userName: 'Lucas Silva',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Excelente curso! Sem enrolação, focado no que realmente funciona. As aulas de n8n valem ouro.',
    createdAt: '2026-07-20T14:00:00Z'
  },
  {
    id: 'rev-2',
    courseId: 'course-ia-101',
    userId: 'u-99',
    userName: 'Mariana Costa',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'O posicionamento de repositório aberto é genial. Finalmente um lugar sério sem venda de ilusões.',
    createdAt: '2026-07-22T09:30:00Z'
  }
];

export const INITIAL_COMMENTS: CourseComment[] = [
  {
    id: 'comm-1',
    lessonId: 'les-1-1',
    courseId: 'course-ia-101',
    userId: 'user-aluno-1',
    userName: 'Lucas Silva',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    text: 'A explicação sobre engenharia de contexto clareou muito as minhas ideias para a automação do meu atendimento!',
    status: 'approved',
    createdAt: '2026-07-21T11:20:00Z',
    likes: 12
  }
];

export const INITIAL_REPORTS: ContentReport[] = [
  {
    id: 'rep-1',
    targetType: 'lesson',
    targetId: 'les-1-2',
    targetTitle: '2. Configurando o Google Gemini no AI Studio',
    reason: 'broken_link',
    details: 'O link do recurso complementar estava indisponível temporariamente.',
    reporterUserId: 'user-aluno-1',
    reporterName: 'Lucas Silva',
    status: 'pending',
    createdAt: '2026-07-26T16:00:00Z'
  }
];
