-- Create clothing_items table
CREATE TABLE IF NOT EXISTS public.clothing_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  size TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reservations table
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.clothing_items(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  reserved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled'))
);

-- Enable Row Level Security
ALTER TABLE public.clothing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clothing_items (public read access)
CREATE POLICY "Anyone can view clothing items"
  ON public.clothing_items FOR SELECT
  USING (true);

-- RLS Policies for reservations (users can view their own reservations)
CREATE POLICY "Users can view their own reservations"
  ON public.reservations FOR SELECT
  USING (true);

CREATE POLICY "Users can create reservations"
  ON public.reservations FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clothing_items_available ON public.clothing_items(available);
CREATE INDEX IF NOT EXISTS idx_reservations_item_id ON public.reservations(item_id);
CREATE INDEX IF NOT EXISTS idx_reservations_user_email ON public.reservations(user_email);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);
