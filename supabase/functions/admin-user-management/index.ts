import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify caller is admin
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: isAdmin } = await supabaseClient.rpc('is_admin_user', { user_id: user.id });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').filter(Boolean);
    const action = path[path.length - 1];

    // GET /list-users
    if (req.method === 'GET' && action === 'list-users') {
      const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
      if (error) throw error;

      const userIds = users.users.map(u => u.id);
      const { data: roles } = await supabaseClient
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      const usersWithRoles = users.users.map(u => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        roles: roles?.filter(r => r.user_id === u.id).map(r => r.role) || [],
      }));

      return new Response(JSON.stringify({ users: usersWithRoles }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /create-user
    if (req.method === 'POST' && action === 'create-user') {
      const { email, roles } = await req.json();

      if (!email || !roles || roles.length === 0) {
        return new Response(JSON.stringify({ error: 'Email and roles required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const tempPassword = crypto.randomUUID().slice(0, 12);

      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
      });

      if (createError) throw createError;

      // Assign roles
      const roleInserts = roles.map((role: string) => ({
        user_id: newUser.user.id,
        role,
      }));

      const { error: roleError } = await supabaseClient
        .from('user_roles')
        .insert(roleInserts);

      if (roleError) throw roleError;

      // Security logging disabled (security_logs table not in schema)

      return new Response(JSON.stringify({
        success: true,
        user: { id: newUser.user.id, email },
        tempPassword,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PATCH /update-roles/:userId
    if (req.method === 'PATCH' && path.includes('update-roles')) {
      const userId = path[path.length - 1];
      const { roles } = await req.json();

      await supabaseClient.from('user_roles').delete().eq('user_id', userId);

      const roleInserts = roles.map((role: string) => ({
        user_id: userId,
        role,
      }));

      const { error: roleError } = await supabaseClient
        .from('user_roles')
        .insert(roleInserts);

      if (roleError) throw roleError;

      // Security logging disabled (security_logs table not in schema)

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE /delete-user/:userId
    if (req.method === 'DELETE' && path.includes('delete-user')) {
      const userId = path[path.length - 1];

      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (deleteError) throw deleteError;

      // Security logging disabled (security_logs table not in schema)

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /reset-password/:userId
    if (req.method === 'POST' && path.includes('reset-password')) {
      const userId = path[path.length - 1];

      const { data: targetUser } = await supabaseAdmin.auth.admin.getUserById(userId);
      if (!targetUser) throw new Error('User not found');

      const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: targetUser.user.email!,
      });

      if (resetError) throw resetError;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
