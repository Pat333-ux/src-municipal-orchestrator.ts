// Beast-System-3-Municipal/src/municipal-orchestrator.ts

export interface CivicTask {
  id: string;
  type: string;
  priority: number; // 0–1
  ministry: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface CivicActor {
  id: string;
  name: string;
  role: string;
  capacity: number; // 0–1
  traumaWeight: number; // 0–1
  lucrWeight: number; // 0–1
}

export interface RoutingDecision {
  id: string;
  taskId: string;
  actorId: string;
  score: number;
  traumaScore: number;
  lucrScore: number;
  createdAt: string;
}

export interface PolicyHarmonization {
  id: string;
  localPolicy: string;
  globalPolicy: string;
  alignmentScore: number;
  createdAt: string;
}

export class MunicipalOrchestrator {
  private actors: CivicActor[] = [];

  public registerActor(actor: CivicActor): void {
    this.actors.push(actor);
  }

  public listActors(): CivicActor[] {
    return [...this.actors];
  }

  // Core routing logic: trauma-preventive + LUCR-aligned + capacity-aware
  public routeTask(task: CivicTask): RoutingDecision {
    let bestScore = -1;
    let bestActor: CivicActor | null = null;

    for (const actor of this.actors) {
      const traumaScore = actor.traumaWeight * task.priority;
      const lucrScore = actor.lucrWeight * task.priority;
      const capacityScore = actor.capacity;

      const totalScore = (traumaScore + lucrScore + capacityScore) / 3;

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestActor = actor;
      }
    }

    if (!bestActor) {
      throw new Error(`No available civic actors to route task ${task.id}`);
    }

    return {
      id: `routing_${task.id}_${bestActor.id}`,
      taskId: task.id,
      actorId: bestActor.id,
      score: bestScore,
      traumaScore: bestActor.traumaWeight,
      lucrScore: bestActor.lucrWeight,
      createdAt: new Date().toISOString(),
    };
  }

  // Policy harmonization: local → global alignment
  public harmonizePolicy(localPolicy: string, globalPolicy: string): PolicyHarmonization {
    const alignmentScore =
      localPolicy === globalPolicy
        ? 1
        : this.computeAlignment(localPolicy, globalPolicy);

    return {
      id: `harmonization_${Date.now()}`,
      localPolicy,
      globalPolicy,
      alignmentScore,
      createdAt: new Date().toISOString(),
    };
  }

  // Simple alignment calculator (placeholder for full semantic engine)
  private computeAlignment(local: string, global: string): number {
    const l = local.toLowerCase();
    const g = global.toLowerCase();

    if (l.includes(g) || g.includes(l)) return 0.75;
    if (l.split(" ").some(word => g.includes(word))) return 0.5;

    return 0.25;
  }
}

// Example bootstrap
export function createDefaultMunicipalOrchestrator(): MunicipalOrchestrator {
  const orchestrator = new MunicipalOrchestrator();

  orchestrator.registerActor({
    id: "actor_city_admin",
    name: "City Administration",
    role: "Municipal Governance",
    capacity: 0.9,
    traumaWeight: 0.8,
    lucrWeight: 0.7,
  });

  orchestrator.registerActor({
    id: "actor_public_health",
    name: "Public Health Ministry",
    role: "Health Services",
    capacity: 0.85,
    traumaWeight: 1.0,
    lucrWeight: 0.9,
  });

  return orchestrator;
}
