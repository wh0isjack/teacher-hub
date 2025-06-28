/**
 * Distributes lessons across weeks within a bimester
 */

interface WeekDistribution {
  weekIndex: number;
  lessonNumbers: number[];
  startLesson: number;
  endLesson: number;
}

/**
 * Gets the number of weeks for a given bimester
 */
function getWeeksInBimester(bimestre: string): number {
  const bimestreNumber = bimestre.replace('º', '');
  return bimestreNumber === '3' ? 10 : 11;
}

/**
 * Calculates which lesson numbers belong to a specific week
 */
export function getLessonsForWeek(
  bimestre: string,
  semana: string,
  totalAulas: number
): number[] {
  // Extract week number from "SEMANA N" format
  const weekMatch = semana.match(/SEMANA (\d+)/);
  if (!weekMatch) return [];
  
  const weekNumber = parseInt(weekMatch[1]);
  const weekIndex = weekNumber - 1; // Convert to 0-based index
  
  const totalWeeks = getWeeksInBimester(bimestre);
  
  // Calculate base lessons per week
  const baseLessonsPerWeek = Math.floor(totalAulas / totalWeeks);
  const remainder = totalAulas % totalWeeks;
  
  // Calculate lessons for each week
  let currentLesson = 1;
  const weekDistributions: WeekDistribution[] = [];
  
  for (let i = 0; i < totalWeeks; i++) {
    // First 'remainder' weeks get one extra lesson
    const lessonsInThisWeek = baseLessonsPerWeek + (i < remainder ? 1 : 0);
    
    const startLesson = currentLesson;
    const endLesson = currentLesson + lessonsInThisWeek - 1;
    
    const lessonNumbers: number[] = [];
    for (let lesson = startLesson; lesson <= endLesson; lesson++) {
      lessonNumbers.push(lesson);
    }
    
    weekDistributions.push({
      weekIndex: i,
      lessonNumbers,
      startLesson,
      endLesson
    });
    
    currentLesson += lessonsInThisWeek;
  }
  
  // Return lessons for the requested week
  const targetWeek = weekDistributions[weekIndex];
  return targetWeek ? targetWeek.lessonNumbers : [];
}

/**
 * Gets all week distributions for a bimester (useful for debugging/preview)
 */
export function getAllWeekDistributions(
  bimestre: string,
  totalAulas: number
): WeekDistribution[] {
  const totalWeeks = getWeeksInBimester(bimestre);
  const baseLessonsPerWeek = Math.floor(totalAulas / totalWeeks);
  const remainder = totalAulas % totalWeeks;
  
  let currentLesson = 1;
  const distributions: WeekDistribution[] = [];
  
  for (let i = 0; i < totalWeeks; i++) {
    const lessonsInThisWeek = baseLessonsPerWeek + (i < remainder ? 1 : 0);
    
    const startLesson = currentLesson;
    const endLesson = currentLesson + lessonsInThisWeek - 1;
    
    const lessonNumbers: number[] = [];
    for (let lesson = startLesson; lesson <= endLesson; lesson++) {
      lessonNumbers.push(lesson);
    }
    
    distributions.push({
      weekIndex: i,
      lessonNumbers,
      startLesson,
      endLesson
    });
    
    currentLesson += lessonsInThisWeek;
  }
  
  return distributions;
}