// src/utils/ats.js
export function calculateATSScore(resumeSkills = [], jdSkills = []) {
  if (!jdSkills || jdSkills.length === 0) return null;
  if (!resumeSkills || resumeSkills.length === 0) return 0;
  const normalizedJDSkills = jdSkills.map(skill => skill.toLowerCase().trim());
  const normalizedResumeSkills = resumeSkills.map(skill => skill.toLowerCase().trim());
  const matched = normalizedResumeSkills.filter(skill =>
    normalizedJDSkills.includes(skill)
  );
  return Math.round((matched.length / normalizedJDSkills.length) * 100);
}
