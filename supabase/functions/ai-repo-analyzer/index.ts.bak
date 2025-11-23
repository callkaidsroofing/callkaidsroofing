import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const GITHUB_ACCESS_TOKEN = Deno.env.get('GITHUB_ACCESS_TOKEN');
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { action = 'analyze_repository', repoOwner, repoName, branch, paths = [] } = await req.json();

    if (!repoOwner || !repoName) {
      return new Response(JSON.stringify({ error: 'Missing repoOwner or repoName' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!GITHUB_ACCESS_TOKEN) {
      console.error('Missing GITHUB_ACCESS_TOKEN secret');
      return new Response(JSON.stringify({ error: 'GitHub token not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ghHeaders = {
      'Authorization': `Bearer ${GITHUB_ACCESS_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    } as Record<string, string>;

    // Fetch basic repo info
    const repoResp = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}`,{ headers: ghHeaders });
    if (!repoResp.ok) {
      const txt = await repoResp.text();
      console.error('GitHub repo fetch error', repoResp.status, txt);
      return new Response(JSON.stringify({ error: 'Failed to fetch repository', status: repoResp.status }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const repoInfo = await repoResp.json();
    const targetBranch = branch || repoInfo.default_branch || 'main';

    // Helper to fetch a file via GitHub contents API
    async function fetchFile(path: string): Promise<string | null> {
      const r = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(targetBranch)}`, { headers: ghHeaders });
      if (!r.ok) return null;
      const meta = await r.json();
      if (meta && meta.download_url) {
        const raw = await fetch(meta.download_url);
        if (!raw.ok) return null;
        return await raw.text();
      }
      if (meta && meta.content && meta.encoding === 'base64') {
        try {
          return new TextDecoder().decode(Uint8Array.from(atob(meta.content), c => c.charCodeAt(0)));
        } catch { return null; }
      }
      return null;
    }

    // Determine which files to pull
    const defaultPaths = [
      'package.json',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
      'Dockerfile',
      '.dockerignore',
    ];

    const workflowDir = `.github/workflows`;
    const wanted = Array.from(new Set([...(paths || []), ...defaultPaths]));

    // Try list workflows
    let workflowFiles: string[] = [];
    const wfListResp = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${encodeURIComponent(workflowDir)}?ref=${encodeURIComponent(targetBranch)}`, { headers: ghHeaders });
    if (wfListResp.ok) {
      const wfList = await wfListResp.json();
      if (Array.isArray(wfList)) {
        workflowFiles = wfList
          .filter((f: any) => f.type === 'file' && /\.ya?ml$/i.test(f.name))
          .map((f: any) => `${workflowDir}/${f.name}`);
      }
    }

    const files: Record<string, string> = {};
    for (const p of [...wanted, ...workflowFiles]) {
      try {
        const content = await fetchFile(p);
        if (content) {
          files[p] = content.length > 20000 ? content.slice(0, 20000) + '\n<!-- truncated -->' : content;
        }
      } catch (e) {
        console.warn('Failed to fetch file', p, e);
      }
    }

    // Build prompt for analysis (Lovable AI gateway)
    let analysisText = 'No AI analysis run (LOVABLE_API_KEY not configured).';
    if (LOVABLE_API_KEY) {
      const systemPrompt = `You are a senior DevOps and security engineer. Analyze a GitHub repository snapshot and return:
- Key risks and misconfigurations (CI, secrets, Docker, dependency hygiene)
- Concrete remediation steps (bullet points)
- Quick wins vs. long-term fixes
- Roof business context: prefer reliability and maintainability over novelty.`;

      const userContent = JSON.stringify({
        repoMeta: {
          name: repoInfo.full_name,
          visibility: repoInfo.private ? 'private' : 'public',
          default_branch: targetBranch,
          archived: repoInfo.archived,
          has_issues: repoInfo.has_issues,
          pushed_at: repoInfo.pushed_at,
          size: repoInfo.size
        },
        files: Object.fromEntries(Object.entries(files).slice(0, 15)) // cap
      });

      const aiResp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent },
          ],
        }),
      });

      if (!aiResp.ok) {
        const t = await aiResp.text();
        console.error('AI gateway error', aiResp.status, t);
        if (aiResp.status === 429) {
          analysisText = 'Rate limit exceeded. Please retry later.';
        } else if (aiResp.status === 402) {
          analysisText = 'Payment required for AI usage. Please top up workspace credits.';
        } else {
          analysisText = 'AI analysis failed due to gateway error.';
        }
      } else {
        const data = await aiResp.json();
        analysisText = data.choices?.[0]?.message?.content ?? 'No analysis content returned.';
      }
    }

    // Persist results
    const findings = {
      analysis_text: analysisText,
      repo_meta: {
        owner: repoOwner,
        name: repoName,
        branch: targetBranch,
      },
      files_included: Object.keys(files),
    } as Record<string, unknown>;

    const { error: scanErr } = await supabase
      .from('security_scan_results')
      .insert({
        repo_owner: repoOwner,
        repo_name: repoName,
        branch: targetBranch,
        scan_type: 'repo_analysis',
        findings,
      });
    if (scanErr) console.error('security_scan_results insert error', scanErr);

    const { error: cacheErr } = await supabase
      .from('ai_analysis_cache')
      .upsert({
        repo_owner: repoOwner,
        repo_name: repoName,
        branch: targetBranch,
        path: null,
        analysis_type: 'repository',
        result: findings,
      }, { onConflict: 'cache_key' });
    if (cacheErr) console.error('ai_analysis_cache upsert error', cacheErr);

    const { error: logErr } = await supabase
      .from('github_deployment_log')
      .insert({
        repo_owner: repoOwner,
        repo_name: repoName,
        branch: targetBranch,
        action: 'ANALYZE',
        status: 'success',
        details: { files: Object.keys(files).length },
      });
    if (logErr) console.error('github_deployment_log insert error', logErr);

    return new Response(JSON.stringify({
      success: true,
      repo: { owner: repoOwner, name: repoName, branch: targetBranch },
      filesAnalyzed: Object.keys(files),
      analysis: analysisText,
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('ai-repo-analyzer error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});