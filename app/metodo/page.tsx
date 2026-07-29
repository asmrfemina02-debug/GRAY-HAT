import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleGauge,
  FlaskConical,
  Scale,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'White Hat, Gray Hat e Black Hat no Marketing Digital | Gray Hat',
  description:
    'Entenda as três abordagens do marketing digital, seus riscos, limites e por que esse contexto raramente aparece em promessas de gurus.',
};

const approaches = [
  {
    id: 'white-hat',
    name: 'White Hat',
    eyebrow: 'Construir',
    description:
      'Estratégias alinhadas às políticas das plataformas, à transparência e à criação de valor real para o público.',
    icon: ShieldCheck,
    accent: 'emerald',
    risk: 'Baixo',
    horizon: 'Longo prazo',
    sustainability: 'Alta',
    items: [
      'Conteúdo original e útil',
      'SEO baseado em qualidade',
      'Lista de e-mails com consentimento',
      'Anúncios dentro das políticas',
      'Marca, comunidade e reputação',
    ],
  },
  {
    id: 'gray-hat',
    name: 'Gray Hat',
    eyebrow: 'Experimentar',
    description:
      'Testes em áreas novas ou pouco definidas, com avaliação constante de risco, impacto e mudanças nas regras.',
    icon: FlaskConical,
    accent: 'amber',
    risk: 'Médio',
    horizon: 'Variável',
    sustainability: 'Média',
    items: [
      'Testar formatos recém-lançados',
      'Explorar oportunidades ainda pouco conhecidas',
      'Automatizar sem enganar pessoas ou plataformas',
      'Documentar hipóteses, limites e resultados',
      'Interromper o teste quando a regra ou o risco mudar',
    ],
  },
  {
    id: 'black-hat',
    name: 'Black Hat',
    eyebrow: 'Compreender e evitar',
    description:
      'Práticas que violam deliberadamente regras, manipulam sistemas ou enganam usuários em busca de vantagem rápida.',
    icon: AlertTriangle,
    accent: 'rose',
    risk: 'Alto',
    horizon: 'Curto prazo',
    sustainability: 'Baixa',
    items: [
      'Compra ou fabricação de engajamento',
      'Spam e contas falsas',
      'Cloaking e conteúdo enganoso',
      'Cópia não autorizada de conteúdo',
      'Fraude ou manipulação artificial de métricas',
    ],
  },
] as const;

const accentClasses = {
  emerald: {
    border: 'border-emerald-400/25',
    surface: 'bg-emerald-400/[0.06]',
    text: 'text-emerald-300',
    icon: 'bg-emerald-400/10 border-emerald-400/20',
  },
  amber: {
    border: 'border-amber-300/25',
    surface: 'bg-amber-300/[0.06]',
    text: 'text-amber-200',
    icon: 'bg-amber-300/10 border-amber-300/20',
  },
  rose: {
    border: 'border-rose-400/25',
    surface: 'bg-rose-400/[0.06]',
    text: 'text-rose-300',
    icon: 'bg-rose-400/10 border-rose-400/20',
  },
};

export default function MethodPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5]">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-white/10 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-white/[0.035] blur-[120px]" />
          <div className="relative mx-auto max-w-5xl text-center">
            <div className="mx-auto mb-7 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
              <Scale className="h-3.5 w-3.5 text-amber-300" />
              Marketing digital sem atalhos na explicação
            </div>

            <h1 className="font-serif text-4xl font-medium italic leading-tight text-white sm:text-6xl lg:text-7xl">
              White, Gray e Black Hat:
              <span className="mt-2 block font-sans not-italic font-extrabold">
                as três abordagens do mercado digital
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-base leading-relaxed text-white/60 sm:text-lg">
              Os três termos ajudam a entender como uma estratégia se relaciona com regras,
              risco, ética e sustentabilidade. Eles não são categorias legais universais:
              o limite depende da prática, da plataforma e do contexto.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a
                href="#tres-abordagens"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-white/85"
              >
                Entender as abordagens
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#gurus"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
              >
                Por que isso quase não é ensinado?
              </a>
            </div>
          </div>
        </section>

        <section id="tres-abordagens" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                O mapa completo
              </p>
              <h2 className="font-serif text-3xl italic text-white sm:text-4xl">
                Três funções diferentes dentro do marketing
              </h2>
              <p className="mt-4 leading-relaxed text-white/55">
                Não se trata de escolher uma cor como identidade. O objetivo é reconhecer a
                natureza de cada decisão antes de investir tempo, dinheiro ou reputação.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {approaches.map(approach => {
                const Icon = approach.icon;
                const colors = accentClasses[approach.accent];

                return (
                  <article
                    key={approach.id}
                    id={approach.id}
                    className={`scroll-mt-24 rounded-2xl border p-6 ${colors.border} ${colors.surface}`}
                  >
                    <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl border ${colors.icon}`}>
                      <Icon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${colors.text}`}>
                      {approach.eyebrow}
                    </p>
                    <h3 className="mt-2 font-serif text-3xl italic text-white">{approach.name}</h3>
                    <p className="mt-4 min-h-24 text-sm leading-relaxed text-white/60">
                      {approach.description}
                    </p>

                    <dl className="my-6 grid grid-cols-3 gap-2 border-y border-white/10 py-4 text-center">
                      <div>
                        <dt className="font-mono text-[9px] uppercase text-white/35">Risco</dt>
                        <dd className="mt-1 text-xs text-white/80">{approach.risk}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[9px] uppercase text-white/35">Horizonte</dt>
                        <dd className="mt-1 text-xs text-white/80">{approach.horizon}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[9px] uppercase text-white/35">Duração</dt>
                        <dd className="mt-1 text-xs text-white/80">{approach.sustainability}</dd>
                      </div>
                    </dl>

                    <ul className="space-y-3">
                      {approach.items.map(item => (
                        <li key={item} className="flex gap-3 text-sm text-white/65">
                          {approach.accent === 'rose' ? (
                            <XCircle className={`mt-0.5 h-4 w-4 shrink-0 ${colors.text}`} />
                          ) : (
                            <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${colors.text}`} />
                          )}
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#090909] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-300/70">
                White Hat na prática
              </p>
              <h2 className="font-serif text-3xl italic text-white sm:text-4xl">
                Crescer porque o público encontra valor
              </h2>
              <p className="mt-5 leading-relaxed text-white/55">
                Plataformas mudam, mas continuam procurando sinais semelhantes: atenção,
                satisfação, confiança e retorno do público. White Hat transforma esses sinais
                em um ativo que sobrevive melhor às mudanças de algoritmo.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['TikTok e Reels', 'Retenção, originalidade, consistência e interação genuína.'],
                ['YouTube', 'Título honesto, boa miniatura, tempo assistido e retorno do espectador.'],
                ['SEO', 'Conteúdo original, site rápido, estrutura clara e links naturais.'],
                ['E-mail', 'Consentimento, relevância, segmentação e descadastro simples.'],
                ['Comunidade', 'Responder dúvidas, ouvir o público e criar confiança recorrente.'],
                ['Marca', 'Ser procurado pelo nome, sem depender somente da próxima tendência.'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
                  <h3 className="text-sm font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/50">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl border border-amber-300/20 bg-amber-300/[0.04] p-7 sm:p-10">
              <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10">
                    <CircleGauge className="h-5 w-5 text-amber-200" />
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-200/70">
                    Gray Hat com responsabilidade
                  </p>
                  <h2 className="mt-3 font-serif text-3xl italic text-white">
                    Experimentar não significa agir sem limite
                  </h2>
                  <p className="mt-5 leading-relaxed text-white/60">
                    Um teste responsável começa com uma pergunta clara, respeita pessoas e
                    dados, observa as políticas vigentes e possui um critério de interrupção.
                    Se a estratégia depende de enganar alguém ou esconder uma violação, ela
                    deixou de ser uma experimentação legítima.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    'A prática respeita a lei e o consentimento?',
                    'A política da plataforma permite ou não define claramente o uso?',
                    'O usuário seria prejudicado se soubesse como o processo funciona?',
                    'Existe um plano caso a plataforma mude a regra?',
                    'Você publicaria esse teste com transparência?',
                  ].map(question => (
                    <div key={question} className="flex gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
                      <p className="text-sm text-white/65">{question}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#090909] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="max-w-3xl">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-rose-300/70">
                Black Hat como tema educativo
              </p>
              <h2 className="font-serif text-3xl italic text-white sm:text-4xl">
                Conhecer o risco não é ensinar a cometer o abuso
              </h2>
              <p className="mt-5 leading-relaxed text-white/55">
                Estudar Black Hat ajuda a reconhecer manipulação, proteger uma operação e
                entender penalizações. Esta plataforma trata o tema por categorias, impactos
                e alternativas seguras — não oferece instruções para fraudar sistemas.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                ['Contas e alcance', 'Restrição de distribuição, remoção de conteúdo e banimento.'],
                ['Receita', 'Perda de monetização, bloqueio de pagamentos e campanhas suspensas.'],
                ['Reputação', 'Desconfiança do público, parceiros e anunciantes.'],
                ['Responsabilidade', 'Consequências contratuais ou legais, conforme a prática.'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-rose-400/15 bg-rose-400/[0.035] p-5">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                    <AlertTriangle className="h-4 w-4 text-rose-300" />
                    {title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/50">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="gurus" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                  O que fica fora da promessa
                </p>
                <h2 className="font-serif text-3xl italic text-white sm:text-4xl">
                  Por que muitos “gurus” não ensinam esse contexto?
                </h2>
                <p className="mt-5 leading-relaxed text-white/55">
                  Não existe uma única explicação e nem todo educador age da mesma forma.
                  Mas certos incentivos tornam uma narrativa simples mais vendável do que uma
                  análise completa de risco.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  ['Promessas simples vendem melhor', '“Método secreto” é uma mensagem mais atraente do que explicar incerteza, políticas e limites.'],
                  ['Resultado não é contexto', 'Um caso de sucesso isolado pode omitir tentativas fracassadas, custos, timing e risco assumido.'],
                  ['Estratégias expiram', 'Táticas baseadas em brechas perdem valor quando se popularizam ou quando a plataforma muda.'],
                  ['Existe risco reputacional', 'Ensinar práticas agressivas ou proibidas pode comprometer contas, parcerias e a própria marca.'],
                  ['Métodos são protegidos', 'Alguns profissionais compartilham princípios, mas preservam processos que consideram vantagem competitiva.'],
                  ['A responsabilidade é menos chamativa', 'Consentimento, medição, documentação e conformidade parecem lentos, embora sustentem operações reais.'],
                ].map(([title, text], index) => (
                  <div key={title} className="grid grid-cols-[auto_1fr] gap-4 rounded-xl border border-white/10 bg-white/[0.025] p-5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 font-mono text-[10px] text-white/60">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{title}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-white/50">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-3xl border border-white/15 bg-white/[0.04] p-8 text-center sm:p-12">
            <Scale className="mx-auto h-7 w-7 text-white/70" />
            <h2 className="mt-5 font-serif text-3xl italic text-white">
              A posição da Gray Hat
            </h2>
            <blockquote className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/70">
              “Analisamos e ensinamos estratégias avançadas do mercado digital,
              explicando benefícios, riscos, limitações e o momento em que deixam de ser
              recomendadas.”
            </blockquote>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/45">
              O objetivo é formar decisões informadas. Fraude, violação deliberada de regras
              e prejuízo a terceiros não fazem parte da proposta.
            </p>
            <Link
              href="/cursos"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-white/85"
            >
              Explorar conteúdos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
