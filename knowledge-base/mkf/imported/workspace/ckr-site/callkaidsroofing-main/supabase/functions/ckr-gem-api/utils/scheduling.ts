import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

export async function checkSchedulingConflicts(
  supabase: SupabaseClient,
  scheduledDate: string,
  estimatedDurationHours: number,
  assignedCrew?: string[]
) {
  // Check existing jobs on the same date
  const { data: existingJobs, error } = await supabase
    .from('inspection_reports')
    .select('*')
    .eq('scheduled_date', scheduledDate)
    .not('status', 'in', '(completed,cancelled)');

  if (error) {
    throw new Error(`Failed to check scheduling conflicts: ${error.message}`);
  }

  const conflicts: any[] = [];

  if (existingJobs && existingJobs.length > 0) {
    existingJobs.forEach(job => {
      // Check crew conflicts
      if (assignedCrew && job.assigned_crew) {
        const crewOverlap = assignedCrew.filter(crew => 
          job.assigned_crew.includes(crew)
        );
        
        if (crewOverlap.length > 0) {
          conflicts.push({
            type: 'crew',
            job_id: job.id,
            conflict_detail: `Crew members ${crewOverlap.join(', ')} already assigned`,
            existing_job: job
          });
        }
      }

      // Check if there are too many jobs on the same day
      if (existingJobs.length >= 2) {
        conflicts.push({
          type: 'capacity',
          job_id: job.id,
          conflict_detail: `Already ${existingJobs.length} jobs scheduled for this date`,
          existing_job: job
        });
      }
    });
  }

  // Suggest alternative dates (next 7 days, excluding conflicts)
  const alternatives: string[] = [];
  const dateObj = new Date(scheduledDate);
  
  for (let i = 1; i <= 7; i++) {
    const altDate = new Date(dateObj);
    altDate.setDate(altDate.getDate() + i);
    const altDateStr = altDate.toISOString().split('T')[0];
    
    const { data: altJobs } = await supabase
      .from('inspection_reports')
      .select('id, assigned_crew')
      .eq('scheduled_date', altDateStr)
      .not('status', 'in', '(completed,cancelled)');

    const hasConflict = altJobs && altJobs.length > 0 && assignedCrew && altJobs.some(job => {
      return job.assigned_crew && assignedCrew.some(crew => job.assigned_crew.includes(crew));
    });

    if (!hasConflict && (!altJobs || altJobs.length < 2)) {
      alternatives.push(altDateStr);
    }

    if (alternatives.length >= 3) break;
  }

  return {
    hasConflicts: conflicts.length > 0,
    conflicts,
    alternativeDates: alternatives
  };
}

export async function generateJobChecklist(
  supabase: SupabaseClient,
  inspectionReportId: string,
  includePhotos: boolean = true,
  includeMaterials: boolean = true
) {
  const { data: report, error } = await supabase
    .from('inspection_reports')
    .select('*')
    .eq('id', inspectionReportId)
    .single();

  if (error || !report) {
    throw new Error('Inspection report not found');
  }

  const checklist: any[] = [];
  const recommendedWorks = report.recommendedWorks || [];
  let totalHours = 0;
  const materialsNeeded: Set<string> = new Set();

  // Parse recommended works and create checklist items
  const taskPriorities = {
    'pressure wash': 'high',
    'clean gutters': 'high',
    'ridge': 'medium',
    'valley': 'medium',
    'broken tiles': 'high',
    'pointing': 'medium',
    'coating': 'low',
    'seal': 'medium'
  };

  recommendedWorks.forEach((work: any, index: number) => {
    const taskName = work.task || work.name || work;
    const qty = work.quantity || work.qty || 1;
    
    // Estimate duration based on task type
    let estimatedHours = 2;
    if (taskName.toLowerCase().includes('pressure wash')) {
      estimatedHours = report.roofArea ? Math.ceil(report.roofArea / 50) : 2;
    } else if (taskName.toLowerCase().includes('ridge')) {
      estimatedHours = report.ridgeCaps ? Math.ceil(report.ridgeCaps / 20) : 3;
    } else if (taskName.toLowerCase().includes('gutter')) {
      estimatedHours = report.gutterPerimeter ? Math.ceil(report.gutterPerimeter / 30) : 1.5;
    }

    totalHours += estimatedHours;

    // Determine priority
    let priority = 'medium';
    for (const [keyword, pri] of Object.entries(taskPriorities)) {
      if (taskName.toLowerCase().includes(keyword)) {
        priority = pri;
        break;
      }
    }

    const checklistItem: any = {
      task_id: index + 1,
      description: taskName,
      quantity: qty,
      priority,
      estimated_duration: `${estimatedHours} hours`,
      completed: false
    };

    if (includePhotos) {
      checklistItem.photos = [];
      if (report.beforeDefects) checklistItem.photos.push(...(report.beforeDefects.slice(0, 2) || []));
    }

    if (includeMaterials) {
      const materials = [];
      if (taskName.toLowerCase().includes('ridge')) {
        materials.push('Ridge capping tiles', 'SupaPoint bedding', 'Premcoat sealer');
      } else if (taskName.toLowerCase().includes('valley')) {
        materials.push('Valley iron sheets', 'Screws and clips', 'Sealant');
      } else if (taskName.toLowerCase().includes('pressure wash')) {
        materials.push('Pressure washer', 'Water access', 'Safety equipment');
      }
      
      checklistItem.materials_needed = materials;
      materials.forEach(m => materialsNeeded.add(m));
    }

    checklist.push(checklistItem);
  });

  return {
    checklist,
    total_estimated_hours: totalHours,
    materials_summary: Array.from(materialsNeeded)
  };
}
