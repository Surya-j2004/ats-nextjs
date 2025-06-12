import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// Normalize: lowercase, remove non-alphanum, trim
function normalize(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}

// Forgiving partial match for text fields
function fieldMatch(reqValue, resValue) {
  if (!reqValue) return true;
  return normalize(resValue).includes(normalize(reqValue));
}

export async function POST(req) {
  try {
    const requirements = await req.json();
    
    const reqDomain = normalize(requirements.domain);
    const reqEdu = normalize(requirements.edu);
    const reqLocation = normalize(requirements.location);
    // Accept "5 years" or "5" etc.
    const reqExp = parseInt((requirements.exp || '').toString().replace(/\D/g, ''), 10) || 0;

    const dbResumes = await prisma.resume.findMany({
      select: {
        id: true,
        name: true,
        email: true,
       
        experience: true,
        domain: true,
        education: true,
        location: true,
        summary: true,
        fileName: true
      }
    });

    const shortlisted = dbResumes.filter(resume => {
      // Normalize and split resume skills
      
      
      const domainMatched = fieldMatch(reqDomain, resume.domain);
      const eduMatched = fieldMatch(reqEdu, resume.education);
      const locationMatched = fieldMatch(reqLocation, resume.location);
      const expMatched =
        parseInt((resume.experience || '').toString().replace(/\D/g, ''), 10) >= reqExp;

      // Uncomment for debugging:
      // console.log({
      //   name: resume.name,
      //   skillsMatched,
      //   domainMatched,
      //   eduMatched,
      //   locationMatched,
      //   expMatched,
      //   reqSkills,
      //   resSkills,
      //   reqDomain,
      //   resumeDomain: normalize(resume.domain),
      //   reqEdu,
      //   resumeEdu: normalize(resume.education),
      //   reqLocation,
      //   resumeLocation: normalize(resume.location),
      //   reqExp,
      //   resumeExp: parseInt(resume.experience, 10)
      // });

      return (
        domainMatched &&
        eduMatched &&
        locationMatched &&
        expMatched
      );
    });

    return NextResponse.json({
      shortlisted: shortlisted.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        fileName: r.fileName
      }))
    });

  } catch (_err) {
    console.error("Shortlist error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
