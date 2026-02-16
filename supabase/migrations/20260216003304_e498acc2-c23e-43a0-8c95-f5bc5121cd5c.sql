
-- 1. Add missing UPDATE policy on task_completions
CREATE POLICY "Users can update their own completions"
ON public.task_completions
FOR UPDATE
USING (auth.uid() = user_id);

-- 2. Add description length constraint
ALTER TABLE tasks 
ADD CONSTRAINT check_description_length 
CHECK (description IS NULL OR length(description) <= 5000);
