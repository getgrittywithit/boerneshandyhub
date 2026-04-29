import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';
import { topLevelCategories } from '@/data/serviceCategories';
import type {
  NewsletterSections,
  SeasonalServiceItem,
  GeneratedContent
} from '@/types/newsletter';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get current season based on month
function getSeason(month: number): string {
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
}

// Get seasonal services based on current time of year
function getSeasonalServices(season: string): SeasonalServiceItem[] {
  const seasonalMap: Record<string, SeasonalServiceItem[]> = {
    spring: [
      { id: 'hvac-spring', name: 'AC Tune-Up', icon: '❄️', description: 'Prepare your AC for Texas summer heat', link: '/services/home/hvac' },
      { id: 'landscaping-spring', name: 'Lawn Care', icon: '🌿', description: 'Spring lawn fertilization and weed control', link: '/services/home/landscaping' },
      { id: 'gutters-spring', name: 'Gutter Cleaning', icon: '🌧️', description: 'Clear winter debris before spring rains', link: '/services/home/gutters' },
      { id: 'pest-spring', name: 'Pest Prevention', icon: '🐜', description: 'Seasonal pest treatment as bugs emerge', link: '/services/home/pest-control' },
    ],
    summer: [
      { id: 'hvac-summer', name: 'AC Maintenance', icon: '❄️', description: 'Keep your AC running efficiently in the heat', link: '/services/home/hvac' },
      { id: 'pool-summer', name: 'Pool Service', icon: '🏊', description: 'Pool maintenance and cleaning', link: '/services/home/pool-service' },
      { id: 'irrigation-summer', name: 'Irrigation Check', icon: '💧', description: 'Ensure sprinklers are efficient during drought', link: '/services/home/landscaping' },
      { id: 'tree-summer', name: 'Tree Trimming', icon: '🌳', description: 'Storm prep tree maintenance', link: '/services/home/tree-service' },
    ],
    fall: [
      { id: 'hvac-fall', name: 'Furnace Check', icon: '🔥', description: 'Prepare heating system for cooler weather', link: '/services/home/hvac' },
      { id: 'gutters-fall', name: 'Gutter Cleaning', icon: '🍂', description: 'Clear leaves before winter', link: '/services/home/gutters' },
      { id: 'roofing-fall', name: 'Roof Inspection', icon: '🏠', description: 'Check for damage before winter storms', link: '/services/home/roofing' },
      { id: 'chimney-fall', name: 'Chimney Service', icon: '🔥', description: 'Clean and inspect before first fire', link: '/services/home/handyman' },
    ],
    winter: [
      { id: 'plumbing-winter', name: 'Pipe Protection', icon: '🔧', description: 'Winterize outdoor faucets and pipes', link: '/services/home/plumbing' },
      { id: 'hvac-winter', name: 'Heating Check', icon: '🔥', description: 'Ensure furnace is running efficiently', link: '/services/home/hvac' },
      { id: 'electrical-winter', name: 'Generator Service', icon: '⚡', description: 'Prepare backup power for storms', link: '/services/home/electrical' },
      { id: 'insulation-winter', name: 'Insulation Check', icon: '🏠', description: 'Improve energy efficiency', link: '/services/home/handyman' },
    ],
  };

  return seasonalMap[season] || seasonalMap.spring;
}

// Get upcoming local tips based on month
function getLocalTip(month: number): { headline: string; text: string } {
  const tips: Record<number, { headline: string; text: string }> = {
    1: {
      headline: 'Homestead Exemption Deadline Coming',
      text: 'Texas homestead exemptions must be filed by April 30th. If you bought a home last year, file with Kendall County Appraisal District to save on property taxes. This can save homeowners hundreds or even thousands of dollars annually.',
    },
    2: {
      headline: 'Prepare for Spring Allergies',
      text: 'Hill Country cedar season is winding down, but oak pollen is coming. Consider scheduling HVAC filter changes and duct cleaning to improve indoor air quality.',
    },
    3: {
      headline: 'Spring Storm Preparation',
      text: 'March brings Texas spring storms. Check your roof for winter damage, clear gutters, and trim branches near your home. Keep a trusted tree service on speed dial.',
    },
    4: {
      headline: 'Homestead Exemption Final Month',
      text: 'April 30th is the deadline for filing homestead exemptions with Kendall County Appraisal District. New homeowners: don\'t miss out on significant property tax savings!',
    },
    5: {
      headline: 'Pre-Summer AC Check',
      text: 'Before triple-digit temps arrive, schedule your AC tune-up. Texas summers are brutal, and the last thing you want is a broken AC in July. Book now before the rush.',
    },
    6: {
      headline: 'Irrigation System Check',
      text: 'With summer heat and potential drought restrictions, ensure your irrigation system is efficient. Fix leaks, adjust spray patterns, and consider smart controllers to save water.',
    },
    7: {
      headline: 'Summer Pool Safety',
      text: 'Peak pool season means regular maintenance is crucial. Check chemical levels weekly, clean filters, and ensure safety equipment is in place. Consider a pool service if you\'re heading on vacation.',
    },
    8: {
      headline: 'Back-to-School Home Prep',
      text: 'As summer winds down, tackle those delayed projects before busy fall schedules begin. Check smoke detectors, organize garages, and prep outdoor spaces for fall entertaining.',
    },
    9: {
      headline: 'Fall Landscaping Time',
      text: 'September is perfect for overseeding lawns, planting fall flowers, and preparing gardens. Cool-season improvements set you up for a beautiful spring.',
    },
    10: {
      headline: 'Heating System Check',
      text: 'Before the first cold front, schedule a furnace inspection. Texas weather can change quickly, and you don\'t want to discover heating issues during a freeze.',
    },
    11: {
      headline: 'Holiday Lighting Safety',
      text: 'Before hanging holiday lights, inspect them for frayed wires and damaged bulbs. Consider hiring an electrician for roof-line installations to stay safe.',
    },
    12: {
      headline: 'Year-End Home Review',
      text: 'Review your home maintenance for the year. Check water heater age, HVAC filter schedule, and roof condition. Planning now helps budget for 2025 projects.',
    },
  };

  return tips[month] || tips[1];
}

// Count total service categories
function getServiceStats() {
  let totalCategories = 0;
  topLevelCategories.forEach((cat) => {
    totalCategories += cat.subcategories.length;
  });
  return { totalCategories, topLevelCount: topLevelCategories.length };
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const targetMonth = body.month ? new Date(body.month) : new Date();
    targetMonth.setMonth(targetMonth.getMonth() + 1); // Default to next month

    const monthName = targetMonth.toLocaleString('en-US', { month: 'long' });
    const year = targetMonth.getFullYear();
    const monthNumber = targetMonth.getMonth() + 1;
    const season = getSeason(monthNumber);

    // Gather context data
    const seasonalServices = getSeasonalServices(season);
    const localTip = getLocalTip(monthNumber);
    const { totalCategories } = getServiceStats();

    // Generate newsletter content using AI
    const prompt = `You are writing a monthly newsletter for "Boerne's Handy Hub", a home services directory for Boerne, Texas (Hill Country area).

Context:
- Month: ${monthName} ${year}
- Season: ${season}
- Total service categories: ${totalCategories}
- Audience: Homeowners in Boerne/Kendall County, Texas

Seasonal services to highlight:
${seasonalServices.map(s => `- ${s.name}: ${s.description}`).join('\n')}

Local tip for this month:
- ${localTip.headline}: ${localTip.text}

Generate newsletter content with:
1. A compelling subject line (max 50 chars)
2. Two alternative subject lines
3. Preview text (max 100 chars, what shows in email preview)
4. An intro paragraph (2-3 sentences) welcoming readers and setting up the month's content

Respond in this exact JSON format:
{
  "subject_line": "...",
  "subject_line_alternatives": ["...", "..."],
  "preview_text": "...",
  "intro": "..."
}

Keep the tone friendly, helpful, and local. Mention Boerne or Hill Country when natural. Focus on practical homeowner value.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    const generated = JSON.parse(aiResponse) as {
      subject_line: string;
      subject_line_alternatives: string[];
      preview_text: string;
      intro: string;
    };

    // Build newsletter sections
    const sections: NewsletterSections = {
      intro: { text: generated.intro },
      seasonal: { items: seasonalServices },
      local_tip: localTip,
      events: { events: [] }, // Can be populated manually or from events API later
    };

    const generatedContent: GeneratedContent = {
      subject_line: generated.subject_line,
      subject_line_alternatives: generated.subject_line_alternatives,
      preview_text: generated.preview_text,
      sections,
    };

    // Create draft in database
    const { data: draft, error } = await supabase
      .from('newsletter_drafts')
      .insert({
        title: `${monthName} ${year} Newsletter`,
        subject_line: generatedContent.subject_line,
        subject_line_alternatives: generatedContent.subject_line_alternatives,
        preview_text: generatedContent.preview_text,
        sections: generatedContent.sections,
        status: 'draft',
        audience: 'all',
        send_stats: {},
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating draft:', error);
      return NextResponse.json(
        { error: 'Failed to create draft' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      draft,
      generated: generatedContent,
    });
  } catch (error) {
    console.error('Generate newsletter error:', error);
    return NextResponse.json(
      { error: 'Failed to generate newsletter' },
      { status: 500 }
    );
  }
}
