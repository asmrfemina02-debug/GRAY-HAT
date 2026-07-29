export function getPublicTeacherName(teacherName?: string): string {
  const value = teacherName?.trim();
  if (!value || value.includes('@')) return 'Equipe Gray Hat';
  return value;
}
