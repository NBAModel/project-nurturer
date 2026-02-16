
-- Ensure sort_order is non-negative
ALTER TABLE tasks ADD CONSTRAINT check_sort_order CHECK (sort_order >= 0);

-- Prevent excessively long titles
ALTER TABLE tasks ADD CONSTRAINT check_title_length CHECK (length(title) <= 500);

-- Ensure logical date ordering
ALTER TABLE tasks ADD CONSTRAINT check_date_order CHECK (end_date IS NULL OR end_date >= start_date);
