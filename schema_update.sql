-- Run this in your Supabase SQL Editor to create the necessary table

CREATE TABLE IF NOT EXISTS subscription_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    payment_method TEXT NOT NULL,
    transaction_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT
);

-- Enable RLS (Optional, but recommended)
ALTER TABLE subscription_requests ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own requests
CREATE POLICY "Users can insert their own requests" ON subscription_requests
    FOR INSERT WITH CHECK (true); -- Simplify for now, verify by email in API

-- Allow admins (service role) to manage everything
-- (Next.js API routes use service role key for admin tasks)
