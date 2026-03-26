import { supabase, isSupabaseConfigured } from "@/lib/db/client";
import { seedAgents, seedMissions, seedResources, seedSkills } from "@/lib/data/seed";

export async function seedSupabase(userId: string) {
  if (!isSupabaseConfigured || !supabase) {
    return { error: "Supabase not configured" };
  }

  const { error: resourcesError } = await supabase
    .from("resources")
    .insert({ user_id: userId, ...seedResources });

  const { data: agentsData, error: agentsError } = await supabase
    .from("agents")
    .insert(
      seedAgents.map((agent) => ({
        user_id: userId,
        role: agent.role,
        name: agent.name,
        level: agent.level,
        xp: agent.xp,
        mood: agent.mood,
        summary: agent.summary,
        building_level: agent.buildingLevel,
        skill_points: agent.skillPoints
      }))
    )
    .select();

  if (agentsError || !agentsData) {
    return { error: agentsError?.message ?? "Failed to insert agents" };
  }

  const missionPayload = seedMissions.map((mission) => ({
    user_id: userId,
    agent_id: agentsData.find((agent) => agent.role.includes(mission.agentId))?.id ?? null,
    title: mission.title,
    objective: mission.objective,
    steps: mission.steps,
    status: mission.status,
    priority: mission.priority,
    created_at: mission.createdAt,
    reward_xp: mission.rewardXp,
    reward_resources: mission.rewardResources
  }));

  const skillsPayload = Object.values(seedSkills).flat();

  const { error: missionsError } = await supabase.from("missions").insert(missionPayload);
  const { error: skillsError } = await supabase.from("skills").upsert(skillsPayload);

  return {
    error: resourcesError || agentsError || missionsError || skillsError || null
  };
}
