import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gender, formData } = body;

    // ── 1. Save to Supabase if configured ──────────────────────────
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const sb = createClient(supabaseUrl, supabaseKey);

      let lifestyleStr = '{}';
      let dietStr      = '{}';
      let fitnessStr   = '{}';
      let goalsStr     = '{}';

      if (gender === 'women') {
        lifestyleStr = JSON.stringify({
          sleep: formData.sleepHours,
          stress: formData.stressLevel,
          water: formData.waterIntake,
          job: formData.jobType,
          periodsRegular: formData.periodsRegular,
          lastCycleDate: formData.lastCycleDate,
          pregnancyHistory: formData.pregnancyHistory,
          medicines: formData.medicines
        });
        dietStr = JSON.stringify({
          food: formData.foodType,
          meals: formData.mealsPerDay,
          dislikes: formData.foodDislikes,
          junk: formData.junkHabit,
          lateNight: formData.lateNightEating
        });
        fitnessStr = JSON.stringify({
          experience: formData.experience,
          activity: formData.currentActivity,
          time: formData.timeAvailable,
          place: formData.workoutPlace
        });
        goalsStr = JSON.stringify({
          main: formData.mainGoal,
          focus: formData.focusArea,
          target: formData.targetInMonth,
          why: formData.whyTransform
        });
      } else {
        // Men's fields
        lifestyleStr = JSON.stringify({
          jointIssues: formData.jointIssues,
          smokingAlcohol: formData.smokingAlcohol,
          job: formData.jobType,
          workHours: formData.workHours,
          outsideFood: formData.outsideFood,
          medicines: formData.medicines
        });
        dietStr = JSON.stringify({
          food: formData.foodType,
          meals: formData.mealsPerDay,
          dislikes: formData.foodDislikes,
          junk: formData.junkHabit,
          supplements: formData.supplements
        });
        fitnessStr = JSON.stringify({
          experience: formData.trainedBefore,
          whyStopped: formData.whyStopped,
          activity: formData.currentActivityLevel,
          previousActivity: formData.previousActivity
        });
        goalsStr = JSON.stringify({
          main: formData.primaryGoal,
          focus: formData.secondaryGoal,
          target: formData.targetInMonth,
          sportTarget: formData.sportTarget,
          why: formData.whyTransform
        });
      }

      await sb.from('intake_submissions').insert({
        gender,
        name:              formData.name,
        age:               formData.age,
        height:            formData.height,
        weight:            formData.weight,
        body_type:         formData.bodyType,
        health_conditions: Array.isArray(formData.healthConditions)
          ? formData.healthConditions.join(', ')
          : formData.healthConditions,
        lifestyle:  lifestyleStr,
        diet:       dietStr,
        fitness:    fitnessStr,
        goals:      goalsStr,
        comments:   formData.comments,
        status:     'New',
      });
    }

    // ── 2. Send email via Resend HTTP API if configured ─────────────
    const resendKey   = process.env.RESEND_API_KEY;
    const sandyEmail  = process.env.SANDY_EMAIL ?? 'sandyliftsofficial@gmail.com';

    if (resendKey) {
      const emailHtml = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#07090D;color:#F5F7FA;padding:32px;border-radius:16px">
          <h2 style="color:${gender==='women'?'#FF6B9D':'#C3FCFE'};margin-bottom:4px">
            ${gender==='women'?'🩷 New Women\'s':'💪 New Men\'s'} Intake Form
          </h2>
          <p style="color:#8B909E;margin-top:0">Submitted on ${new Date().toLocaleString('en-IN')}</p>
          <hr style="border:none;border-top:1px solid #222235;margin:20px 0"/>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#8B909E;width:40%">Name</td><td style="color:#F5F7FA;font-weight:600">${formData.name}</td></tr>
            <tr><td style="padding:8px 0;color:#8B909E">Age</td><td style="color:#F5F7FA">${formData.age} yrs</td></tr>
            <tr><td style="padding:8px 0;color:#8B909E">Height / Weight</td><td style="color:#F5F7FA">${formData.height} / ${formData.weight} kg</td></tr>
            <tr><td style="padding:8px 0;color:#8B909E">Body Type</td><td style="color:#F5F7FA">${formData.bodyType}</td></tr>
            <tr><td style="padding:8px 0;color:#8B909E">Health</td><td style="color:#F5F7FA">${Array.isArray(formData.healthConditions)?formData.healthConditions.join(', '):formData.healthConditions}</td></tr>
            <tr><td style="padding:8px 0;color:#8B909E">Main Goal</td><td style="color:#F5F7FA;font-weight:600">${formData.mainGoal}</td></tr>
            <tr><td style="padding:8px 0;color:#8B909E">Target</td><td style="color:#F5F7FA">${formData.targetInMonth}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #222235;margin:20px 0"/>
          <a href="https://sandylifts.com/admin" style="background:${gender==='women'?'#FF6B9D':'#4DA3FF'};color:#07090D;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700">
            View in Admin Dashboard →
          </a>
        </div>`;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Sandy.Lifts <onboarding@resend.dev>',
          to: [sandyEmail],
          subject: `${gender==='women'?'🩷':'💪'} New Intake Form — ${formData.name} | ${formData.mainGoal}`,
          html: emailHtml,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Intake API error:', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
