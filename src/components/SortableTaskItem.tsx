import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Check, Repeat, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/hooks/useTasks';
import { EditTaskDialog } from './EditTaskDialog';
import { DeleteTaskDialog } from './DeleteTaskDialog';
import { Button } from '@/components/ui/button';

interface SortableTaskItemProps {
  task: Task;
  isCompleted: boolean;
  onToggle: () => void;
  onDeleteAll: () => void;
  onEndTask: () => void;
  onDeleteToday: () => void;
  onEdit: (taskId: string, updates: {
    title: string;
    description?: string | null;
    repeat_type: 'none' | 'daily' | 'weekly' | 'fortnightly';
    repeat_day?: number | null;
  }) => void;
  canComplete: boolean;
  isPast: boolean;
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function renderDescriptionWithLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
        {part}
      </a>
    ) : (
      part
    )
  );
}

export function SortableTaskItem({ 
  task, 
  isCompleted, 
  onToggle, 
  onDeleteAll, 
  onEndTask,
  onDeleteToday, 
  onEdit, 
  canComplete,
  isPast,
}: SortableTaskItemProps) {
  const [showDescription, setShowDescription] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getRepeatLabel = () => {
    if (task.repeat_type === 'daily') return 'Every day';
    if (task.repeat_type === 'weekly' && task.repeat_day !== null) {
      return `Every ${dayNames[task.repeat_day]}`;
    }
    if (task.repeat_type === 'fortnightly') return 'Every 2 weeks';
    return null;
  };

  const repeatLabel = getRepeatLabel();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group w-full max-w-full min-w-0 overflow-hidden rounded-lg border p-3 transition-all duration-200",
        isCompleted
          ? "bg-task-complete-bg border-task-complete-border"
          : "bg-card border-border hover:border-primary/30",
        isDragging && "opacity-50 shadow-lg z-50",
      )}
    >
      <div className="grid grid-cols-[auto,auto,minmax(0,1fr),auto] items-start gap-2">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="flex-shrink-0 self-start w-6 h-6 flex items-center justify-center text-muted-foreground/50 hover:text-muted-foreground cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Completion toggle */}
        <button
          onClick={onToggle}
          disabled={!canComplete}
          className={cn(
            "flex-shrink-0 self-start w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
            isCompleted
              ? "bg-task-complete-border border-task-complete-border text-primary-foreground"
              : "border-muted-foreground/30 hover:border-primary",
            !canComplete && "opacity-50 cursor-not-allowed",
          )}
        >
          {isCompleted && <Check className="w-4 h-4" />}
        </button>

        {/* Task content */}
        <div className="min-w-0">
          <p
            className={cn(
              "font-medium leading-snug break-words whitespace-normal transition-all duration-200",
              isCompleted && "line-through text-muted-foreground",
            )}
          >
            {task.title}
          </p>

          {repeatLabel && (
            <div className="flex min-w-0 items-start gap-1 mt-1">
              <Repeat className="mt-0.5 w-3 h-3 flex-shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 text-xs leading-snug text-muted-foreground break-words whitespace-normal">
                {repeatLabel}
              </span>
            </div>
          )}

          {task.repeat_type === 'none' && (
            <div className="flex min-w-0 items-start gap-1 mt-1">
              <Calendar className="mt-0.5 w-3 h-3 flex-shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 text-xs leading-snug text-muted-foreground break-words whitespace-normal">
                One-time
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-shrink-0 self-start gap-1">
          {task.description && (
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 self-start h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => setShowDescription(!showDescription)}
            >
              {showDescription ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          )}
          <EditTaskDialog task={task} onEdit={onEdit} />
          <DeleteTaskDialog
            task={task}
            onDeleteAll={onDeleteAll}
            onEndTask={onEndTask}
            onDeleteToday={onDeleteToday}
          />
        </div>
      </div>

      {showDescription && task.description && (
        <p className="mt-2 leading-snug break-all whitespace-pre-wrap text-muted-foreground">
          {renderDescriptionWithLinks(task.description)}
        </p>
      )}
    </div>
  );
}
