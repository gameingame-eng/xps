create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  currency_code text not null default 'USD',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_currency_code_check check (char_length(currency_code) = 3)
);

create table if not exists public.financial_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  institution text,
  kind text not null default 'checking',
  last4 text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint financial_accounts_kind_check
    check (kind in ('checking', 'savings', 'credit', 'cash', 'investment', 'loan')),
  constraint financial_accounts_last4_check
    check (last4 is null or char_length(last4) <= 4)
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  kind text not null default 'expense',
  color text,
  is_archived boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint categories_kind_check check (kind in ('income', 'expense', 'saving', 'transfer')),
  constraint categories_user_name_unique unique (user_id, name)
);

create table if not exists public.budget_periods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  start_date date not null,
  end_date date not null,
  status text not null default 'draft',
  planned_income numeric(12, 2) not null default 0,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint budget_periods_status_check check (status in ('draft', 'active', 'closed')),
  constraint budget_periods_date_check check (end_date >= start_date),
  constraint budget_periods_user_range_unique unique (user_id, start_date, end_date)
);

create table if not exists public.budget_allocations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  period_id uuid not null references public.budget_periods (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  planned_amount numeric(12, 2) not null default 0,
  rollover_amount numeric(12, 2) not null default 0,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint budget_allocations_amounts_check
    check (planned_amount >= 0 and rollover_amount >= 0),
  constraint budget_allocations_unique unique (period_id, category_id)
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  account_id uuid references public.financial_accounts (id) on delete set null,
  category_id uuid references public.categories (id) on delete set null,
  budget_period_id uuid references public.budget_periods (id) on delete set null,
  merchant text not null,
  description text,
  amount numeric(12, 2) not null,
  direction text not null default 'debit',
  status text not null default 'cleared',
  occurred_on date not null,
  posted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint transactions_direction_check check (direction in ('debit', 'credit', 'transfer')),
  constraint transactions_status_check check (status in ('pending', 'cleared', 'scheduled'))
);

create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  target_amount numeric(12, 2) not null,
  current_amount numeric(12, 2) not null default 0,
  target_date date,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint savings_goals_amounts_check
    check (target_amount >= 0 and current_amount >= 0 and current_amount <= target_amount),
  constraint savings_goals_status_check check (status in ('active', 'paused', 'completed'))
);

create index if not exists financial_accounts_user_id_idx on public.financial_accounts (user_id);
create index if not exists categories_user_id_idx on public.categories (user_id);
create index if not exists budget_periods_user_id_idx on public.budget_periods (user_id, start_date desc);
create index if not exists budget_allocations_user_id_idx on public.budget_allocations (user_id, period_id);
create index if not exists transactions_user_id_occurred_on_idx on public.transactions (user_id, occurred_on desc);
create index if not exists transactions_category_id_idx on public.transactions (category_id);
create index if not exists savings_goals_user_id_idx on public.savings_goals (user_id);

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger set_financial_accounts_updated_at
before update on public.financial_accounts
for each row
execute function public.set_updated_at();

create trigger set_categories_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

create trigger set_budget_periods_updated_at
before update on public.budget_periods
for each row
execute function public.set_updated_at();

create trigger set_budget_allocations_updated_at
before update on public.budget_allocations
for each row
execute function public.set_updated_at();

create trigger set_transactions_updated_at
before update on public.transactions
for each row
execute function public.set_updated_at();

create trigger set_savings_goals_updated_at
before update on public.savings_goals
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.financial_accounts enable row level security;
alter table public.categories enable row level security;
alter table public.budget_periods enable row level security;
alter table public.budget_allocations enable row level security;
alter table public.transactions enable row level security;
alter table public.savings_goals enable row level security;

create policy "Users can manage own profile"
on public.profiles
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own financial accounts"
on public.financial_accounts
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own categories"
on public.categories
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own budget periods"
on public.budget_periods
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own budget allocations"
on public.budget_allocations
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own transactions"
on public.transactions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own savings goals"
on public.savings_goals
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
