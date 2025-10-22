import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    console.log('Creating FAQ table with raw SQL...')
    
    // Create the FAQ table using raw SQL
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "faqs" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "question" TEXT NOT NULL,
        "answer" TEXT NOT NULL,
        "order" INTEGER NOT NULL DEFAULT 0,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL
      );
    `
    
    // Create indexes
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "faqs_is_active_idx" ON "faqs"("is_active");`
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "faqs_order_idx" ON "faqs"("order");`
    
    console.log('FAQ table created successfully!')
    
    // Insert sample FAQs
    const faqs = [
      {
        id: 'faq-1',
        question: 'What is The Black Lotus Murder Mystery?',
        answer: "It's a goddamn murder mystery party. You know, where someone pretends to be dead and you pretend to care enough to figure out who did it. It's like Clue, but with real people who are probably more interesting than you. We've been planning this for months, so try to keep up.",
        order: 1
      },
      {
        id: 'faq-2',
        question: 'What happens at this party?',
        answer: "Someone dies. Figuratively, of course - though we can't guarantee your social life won't die a little too. You'll get a character, wear a costume, and pretend to solve a murder while eating snacks and judging everyone else's acting abilities. It's basically a four-hour exercise in human interaction.",
        order: 2
      },
      {
        id: 'faq-3',
        question: 'How long does this last?',
        answer: "Until your dumbass mind solves the mystery. Could be four hours, could be all night, could be never. We're not responsible for your lack of deductive reasoning skills. If you're still here at sunrise, we'll probably just kick your shitty ass out.",
        order: 3
      }
    ]
    
    for (const faq of faqs) {
      await prisma.$executeRaw`
        INSERT INTO "faqs" ("id", "question", "answer", "order", "is_active", "created_at", "updated_at")
        VALUES (${faq.id}, ${faq.question}, ${faq.answer}, ${faq.order}, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT ("id") DO NOTHING;
      `
    }
    
    console.log('Sample FAQs inserted!')
    
    return NextResponse.json({ 
      success: true, 
      message: 'FAQ table created and sample data inserted!'
    })
    
  } catch (error) {
    console.error('Error creating FAQ table:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
