import { create } from "zustand";
import { seedAgents, seedMissions, seedResources, seedSkills } from "@/lib/data/seed";

export type ResourceState = typeof seedResources;

export type MissionStatus = "Active" | "Completed" | "Archived";

export type Mission = (typeof seedMissions)[number];

export type Agent = (typeof seedAgents)[number];

export type SkillNode = (typeof seedSkills)["marketing"][number];

type StoreState = {
  agents: Agent[];
  missions: Mission[];
  resources: ResourceState;
  skills: typeof seedSkills;
  levelUpToast: { agentId: string; level: number } | null;
  addMission: (mission: Mission) => void;
  updateMission: (missionId: string, updates: Partial<Mission>) => void;
  completeMission: (missionId: string) => void;
  spendResources: (updates: Partial<ResourceState>) => void;
  levelUpAgent: (agentId: string, xpGain: number) => void;
  clearLevelUpToast: () => void;
  upgradeBuilding: (agentId: string) => void;
};

const XP_SCALE = 100;
const XP_EXPONENT = 1.2;

const xpNeeded = (level: number) => Math.floor(XP_SCALE * Math.pow(level, XP_EXPONENT));

export const useStore = create<StoreState>((set, get) => ({
  agents: seedAgents,
  missions: seedMissions,
  resources: seedResources,
  skills: seedSkills,
  levelUpToast: null,
  addMission: (mission) =>
    set((state) => ({ missions: [mission, ...state.missions] })),
  updateMission: (missionId, updates) =>
    set((state) => ({
      missions: state.missions.map((mission) =>
        mission.id === missionId ? { ...mission, ...updates } : mission
      )
    })),
  completeMission: (missionId) => {
    const mission = get().missions.find((item) => item.id === missionId);
    if (!mission || mission.status === "Completed") return;

    set((state) => ({
      missions: state.missions.map((item) =>
        item.id === missionId ? { ...item, status: "Completed" } : item
      ),
      resources: {
        coins: state.resources.coins + mission.rewardResources.coins,
        focus: state.resources.focus + mission.rewardResources.focus,
        intel: state.resources.intel + mission.rewardResources.intel,
        reputation: state.resources.reputation + mission.rewardResources.reputation
      }
    }));

    get().levelUpAgent(mission.agentId, mission.rewardXp);
  },
  spendResources: (updates) =>
    set((state) => ({
      resources: {
        coins: state.resources.coins - (updates.coins ?? 0),
        focus: state.resources.focus - (updates.focus ?? 0),
        intel: state.resources.intel - (updates.intel ?? 0),
        reputation: state.resources.reputation - (updates.reputation ?? 0)
      }
    })),
  levelUpAgent: (agentId, xpGain) =>
    set((state) => {
      let toast: { agentId: string; level: number } | null = null;
      const nextAgents = state.agents.map((agent) => {
        if (agent.id !== agentId) return agent;
        const nextXp = agent.xp + xpGain;
        const required = xpNeeded(agent.level);
        if (nextXp >= required) {
          toast = { agentId, level: agent.level + 1 };
          return {
            ...agent,
            xp: nextXp - required,
            level: agent.level + 1,
            skillPoints: agent.skillPoints + 1,
            status: "Idle"
          };
        }
        return { ...agent, xp: nextXp };
      });
      return { agents: nextAgents, levelUpToast: toast ?? state.levelUpToast };
    }),
  clearLevelUpToast: () => set({ levelUpToast: null }),
  upgradeBuilding: (agentId) =>
    set((state) => {
      const costCoins = 50;
      const costFocus = 6;
      if (state.resources.coins < costCoins || state.resources.focus < costFocus) {
        return state;
      }
      return {
        resources: {
          ...state.resources,
          coins: state.resources.coins - costCoins,
          focus: state.resources.focus - costFocus
        },
        agents: state.agents.map((agent) =>
          agent.id === agentId
            ? { ...agent, buildingLevel: Math.min(agent.buildingLevel + 1, 10) }
            : agent
        )
      };
    })
}));

export { xpNeeded };
