import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { lessonTitle, question, context } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        answer: "Olá! Como assistente IA da plataforma Gray Hat, posso ajudar a tirar dúvidas sobre " + lessonTitle + ". Para habilitar respostas personalizadas com Gemini em tempo real, certifique-se de configurar a chave GEMINI_API_KEY nos segredos do projeto."
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

    const prompt = `Você é o Tutor IA oficial do Gray Hat ("tudo que os gurus ensinam sobre como ganhar dinheiro no digital").
A plataforma é um repositório aberto de conhecimento gratuito.
Sua missão é responder dúvidas dos alunos de forma extremamente ética, técnica, pé no chão e sem falsa promessa de enriquecimento rápido.

Contexto da aula atual: "${lessonTitle}"
Detalhes da aula: ${context || 'General digital business lesson'}

Dúvida do aluno: "${question}"

Responda em português do Brasil de forma concisa, encorajadora e didática.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    return NextResponse.json({ answer: response.text || 'Sem resposta no momento.' });
  } catch (error) {
    console.error('Gemini Tutor API Error:', error);
    return NextResponse.json(
      { answer: 'Desculpe, ocorreu um erro ao consultar o Tutor IA. Tente reformular a pergunta.' },
      { status: 500 }
    );
  }
}
