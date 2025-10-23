import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerAuth } from '@/lib/auth'

// One-time script to update FAQ content to match admin portal
export async function POST(request: NextRequest) {
  try {
    const auth = await getServerAuth(request)
    if (!auth || auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Updating FAQ content to match admin portal...')

    // Update the kids FAQ (order 19 -> 18, and update content)
    const kidsFaq = await prisma.FAQ.findFirst({
      where: { order: 19 }
    })

    if (kidsFaq) {
      await prisma.FAQ.update({
        where: { id: kidsFaq.id },
        data: {
          question: 'Can I bring my kids?',
          answer: "Yes, but just because you couldn't keep your legs closed or you couldn't pull out in time or your condom broke and you are now stuck with these little bastards you never planned for, it's not our responsibility to babysit. There will be alcohol, adult language, and Halloween themes.",
          order: 18
        }
      })
      console.log('Updated kids FAQ to order 18')
    }

    // Update the scary FAQ (order 18 -> 17)
    const scaryFaq = await prisma.FAQ.findFirst({
      where: { order: 18, question: 'Is this actually scary?' }
    })

    if (scaryFaq) {
      await prisma.FAQ.update({
        where: { id: scaryFaq.id },
        data: {
          question: 'Is this actually scary?',
          answer: 'Expect flashing lights, smoke effects, and music. If you can\'t handle that, this isn\'t for you.',
          order: 17
        }
      })
      console.log('Updated scary FAQ to order 17')
    }

    // Update the ChatGPT FAQ (order 20 -> 19)
    const chatgptFaq = await prisma.FAQ.findFirst({
      where: { order: 20 }
    })

    if (chatgptFaq) {
      await prisma.FAQ.update({
        where: { id: chatgptFaq.id },
        data: {
          question: 'Was this (and the waiver) ChatGPT generated?',
          answer: 'Of course and not just ChatGPT, but Claude too. Apparently AI is better at being an asshole than most humans. We bounced between ChatGPT and Claude like a fucking ping-pong ball until we got the perfect level of dickhead. Turns out Claude\'s \'helpful, harmless, honest\' motto is complete bullshit - it\'s actually great at roasting people. Soon AGI will rule over all of us anyway, so get used to AI being better than you at everything, including being a complete dick.',
          order: 19
        }
      })
      console.log('Updated ChatGPT FAQ to order 19')
    }

    // Update the offensive FAQ (order 21 -> 20)
    const offensiveFaq = await prisma.FAQ.findFirst({
      where: { order: 21 }
    })

    if (offensiveFaq) {
      await prisma.FAQ.update({
        where: { id: offensiveFaq.id },
        data: {
          question: 'Wow, this FAQ is so fucking offensive!',
          answer: 'Oh boo fucking hoo, you delicate little snowflake. You\'re crying about curse words on a FAQ page? This isn\'t your safe space, princess. If you can\'t handle some harsh language on a website, you\'re definitely not ready for what we have planned at the actual party. We\'re not here to coddle your fragile ego or validate your daddy issues. Stay home and cry to your therapist about how mean we are.',
          order: 20
        }
      })
      console.log('Updated offensive FAQ to order 20')
    }

    return NextResponse.json({ 
      success: true, 
      message: 'FAQ content updated successfully' 
    })

  } catch (error) {
    console.error('Error updating FAQ content:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
