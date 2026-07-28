import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { title, description, textContent } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        summary: "Resumo gerado (Modo de Demonstração offline): Esta aula aborda os conceitos essenciais do tema com foco prático, destacando ganchos de alta retenção, estratégias diretas e execução sem rodeios."
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `Você é um tutor e especialista em educação da plataforma Gray Hat.
Resuma em 3 a 4 tópicos diretos e práticos a seguinte aula:
Título: ${title}
Descrição: ${description}
Conteúdo da aula: ${textContent || 'Não informado'}

Formate a resposta com marcadores em Markdown claro, direto ao ponto e focado na aplicação prática para negócios digitais.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    return NextResponse.json({ summary: response.text || 'Sem resumo disponível.' });
  } catch (error) {
    console.error('Gemini Summarize API Error:', error);
    return NextResponse.json(
      { summary: 'Não foi possível gerar o resumo automático no momento. Tente novamente em instantes.' },
      { status: 500 }
    );
  }
}
