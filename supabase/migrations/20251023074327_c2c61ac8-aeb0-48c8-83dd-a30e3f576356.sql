-- 1) Remove exact duplicate line items, keep first per unique combo
WITH dupes AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY quote_id, service_item, COALESCE(description, ''), unit, quantity, unit_rate, line_total
      ORDER BY id
    ) AS rn
  FROM public.quote_line_items
)
DELETE FROM public.quote_line_items
WHERE id IN (SELECT id FROM dupes WHERE rn > 1);

-- 2) Renumber sort_order per quote to be sequential and unique
WITH ordered AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY quote_id
      ORDER BY COALESCE(sort_order, 0), id
    ) - 1 AS new_sort
  FROM public.quote_line_items
)
UPDATE public.quote_line_items qli
SET sort_order = ordered.new_sort
FROM ordered
WHERE qli.id = ordered.id;

-- 3) Add a unique constraint to prevent duplicates on the same position
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'uq_quote_line_items_quote_sort_order'
  ) THEN
    ALTER TABLE public.quote_line_items
    ADD CONSTRAINT uq_quote_line_items_quote_sort_order
    UNIQUE (quote_id, sort_order);
  END IF;
END $$;
