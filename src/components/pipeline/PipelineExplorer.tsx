"use client";

import { useState } from "react";

const SECTIONS: Record<string, {
  title: string;
  icon: string;
  color: string;
  borderColor: string;
  metaphor: string;
  mapHint: string;
  details: { name: string; desc: string }[];
}> = {
  repos: {
    title: "Azure DevOps Repositories",
    icon: "\u{1F4E6}",
    color: "#FDE68A",
    borderColor: "#F59E0B",
    metaphor: "Imagine a big bookshelf in a shared office. Each book is a \"repository\" \u2014 a folder holding all the code for one part of the platform. Developers don\u2019t edit the book directly (risky!). They make a personal copy, make changes, then submit a \"pull request\" \u2014 a formal note saying \u2018Can someone review my changes before they go live?\u2019 Your team has about 18 repos.",
    mapHint: "In Pipeline Final \u2192 these are the yellow boxes in the \u2018Azure DevOps Repositories\u2019 area at the top-left.",
    details: [
      { name: "datahub-projen", desc: "The \u2018parent\u2019 repo \u2014 a master template that stamps out folder structures for other repos. Like a franchise HQ sending the same store layout to every new location. It feeds into fivetran-connection, datahub-data-platform, data-transformation, and data-contracts. But it does NOT connect to CI directly \u2014 its children do." },
      { name: "plt (Platform)", desc: "The foundation everything builds on \u2014 shared Python libraries and utilities that many projects import. Like the concrete slab under a house: invisible, but if it cracks, everything has problems. Receives from datahub-projen and data-contracts." },
      { name: "data-contracts", desc: "Agreements between data producers and consumers: \u2018This table will have these columns, these types, refreshed daily.\u2019 Like a supplier contract: \u201850 lbs of organic tomatoes every Monday, no bruises.\u2019 If data doesn\u2019t match the contract \u2192 alert fires before bad data spreads downstream." },
      { name: "datahub-data-platform (dbt)", desc: "The most frequently changed repo! Contains SQL recipes that turn raw, messy data into clean organized tables. Like a refinery turning crude oil into gasoline. Example: \u2018Take raw_sales, filter out test orders, join with customers, output sales_summary.\u2019 This is where data engineers live most of their day." },
      { name: "data-transformation", desc: "Python/Spark transformations for when SQL isn\u2019t powerful enough \u2014 ML model training, image processing, complex statistics. If dbt is a food processor (slicing, dicing, mixing), data-transformation is the full industrial kitchen that can handle anything." },
      { name: "fivetran-connection", desc: "Configures WHAT data Fivetran pulls \u2014 which external sources, how often, which tables. Like programming a robot vacuum: \u2018Living room at 6am, kitchen at 7am, skip the garage.\u2019 Separate from where Fivetran runs (that\u2019s dp-aks-fivetran-agents)." },
      { name: "dp-aks-fivetran-agents", desc: "Manages WHERE the Fivetran software runs (on dedicated AKS servers), not what it pulls. Needed when data sources are behind a firewall \u2014 like hiring a trusted courier inside your building rather than letting outside delivery in." },
      { name: "mdf (Metadata Framework)", desc: "Tracks \u2018data about data\u2019 \u2014 what tables exist, when last updated, who owns them. The card catalog for your data library. Without this, nobody can find anything in a platform with hundreds of tables." },
      { name: "argocd", desc: "The instruction manual ArgoCD reads to deploy to Production. Change a file here \u2192 ArgoCD automatically updates the live system to match. The bridge between \u2018code sitting in a repo\u2019 and \u2018software actually running in Production.\u2019" },
      { name: "Other repos", desc: "uc-catalog-ent (Unity Catalog governance config), dp-service-catalog (the mall directory \u2014 lists all services), Notebooks & Scripts (interactive Databricks work), Delta Tables, ML Models, dg-build-templates & build-templates (shared CI/CD recipe templates that multiple pipelines borrow from)." },
    ],
  },
  ci: {
    title: "CI (Continuous Integration)",
    icon: "\u{1F50D}",
    color: "#A7F3D0",
    borderColor: "#10B981",
    metaphor: "The quality control department. Before any code leaves the building, it passes through inspection stations in strict order \u2014 like a car going through a car wash. If ANY station fails, everything stops and the developer gets told what broke. The word \u2018Continuous\u2019 means this happens automatically on every code push, dozens of times per day. Nobody presses a button.",
    mapHint: "In Pipeline Final \u2192 the green \u2018CI\u2019 section inside \u2018Azure Pipelines.\u2019 Follow the left-to-right chain.",
    details: [
      { name: "Lint & Format Check", desc: "First station \u2014 spell-checking for code. Catches: unused variables (\u2018you declared this but never used it\u2019), lines too long (\u2018break this up\u2019), tabs vs spaces inconsistency. Takes seconds, catches easy problems before expensive checks run." },
      { name: "Unit Tests", desc: "Does each piece work alone? Like testing car parts before assembly. Example: calculate_tax(100, 0.1) should return 10. If it returns 11, the pipeline stops immediately and tells the developer exactly which test broke and why." },
      { name: "Security Scan (Checkmarx)", desc: "Airport X-ray for code. Hunts for: hardcoded passwords, SQL injection vulnerabilities, outdated libraries with known security holes. Way cheaper to fix now than after hackers find them in Production." },
      { name: "Branching paths after Security Scan", desc: "After Security Scan, the pipeline forks:\n\u2022 Path A: Package Creation \u2192 Artifacts (Python) \u2192 Docker Image Build \u2014 for code that first produces Python libraries\n\u2022 Path B: Security Scan \u2192 Docker Image Build directly \u2014 for standalone services\n\u2022 data-api takes its own shortcut straight to Docker Image Build\nYou can see these different arrows in Pipeline Final." },
      { name: "Package Creation \u2192 Artifacts", desc: "Shrink-wraps your code into installable Python packages (.whl files), then publishes to Artifacts \u2014 a private \u2018app store\u2019 for the team. Like a bakery stocking bread on a shelf so restaurants can grab it to make sandwiches." },
      { name: "Docker Image Build \u2192 ACR", desc: "Wraps everything into a self-contained \u2018lunchbox\u2019 (Docker image) that runs identically on any server. Then ships to ACR (Azure Container Registry) \u2014 the warehouse. Dev, Staging, Production all pull the exact same lunchbox. No \u2018works on my machine\u2019 excuses." },
    ],
  },
  cd: {
    title: "CD (Continuous Delivery)",
    icon: "\u{1F680}",
    color: "#BFDBFE",
    borderColor: "#3B82F6",
    metaphor: "Once code passes inspection (CI), CD is the delivery truck moving it through increasingly important neighborhoods. Think of a band preparing for a concert: practice room (Dev) \u2192 soundcheck (QA) \u2192 dress rehearsal (Staging) \u2192 live show (Production). Each step raises the stakes and catches different problems.",
    mapHint: "In Pipeline Final \u2192 the blue \u2018CD\u2019 row at the bottom of \u2018Azure Pipelines,\u2019 flowing left to right.",
    details: [
      { name: "Dev", desc: "The sketchpad. Developers deploy constantly, break things freely, fix them. No customers affected. Like a test kitchen where chefs experiment \u2014 burn things, make a mess, nobody tastes the results but you." },
      { name: "QA/UAT", desc: "Two separate checks: QA = \u2018Does it work correctly?\u2019 (technical testers click every button, test edge cases, try to break it). UAT = \u2018Is this what the business asked for?\u2019 (stakeholders verify requirements are met). Both must pass before proceeding." },
      { name: "Staging", desc: "The dress rehearsal \u2014 mirrors Production as closely as possible. Real stage, real sound system, real lights, but the doors aren\u2019t open yet. If anything sounds off, fix it now \u2014 not during the live show." },
      { name: "Tagging \u2192 Production", desc: "Code gets a version stamp (like v2.3.1) \u2014 this is \u2018Tagging.\u2019 Then it goes to Production: the live concert. Real users, real data, real consequences. Everything upstream exists to protect this environment. A bug here means lost revenue, broken reports, angry customers." },
      { name: "Branch Deployments", desc: "Temporary pop-up environments for feature branches. Like a pop-up shop: appears, lets people try the product, disappears after the branch is merged. Lets reviewers see actual running code, not just read it." },
      { name: "Planned: Service Desc, UC-SYNC", desc: "Marked with \u2018??\u2019 on the Mural \u2014 still being defined. Service Description and UC-SYNC are sticky notes on the roadmap, not finished features yet." },
    ],
  },
  infra: {
    title: "Infrastructure (AZP-DP001)",
    icon: "\u{1F3D7}\uFE0F",
    color: "#DDD6FE",
    borderColor: "#8B5CF6",
    metaphor: "Everything else describes WHAT should run and HOW to build it. This section is WHERE it actually runs \u2014 the real cloud building on Azure. \u2018AZP\u2019 = Azure Platform, \u2018DP\u2019 = Data Platform, \u2018001\u2019 = primary instance. Inside: a server fleet, a vault for secrets, and storage for everything.",
    mapHint: "In Pipeline Final \u2192 the purple \u2018AZP-DP001\u2019 box in the middle-right area.",
    details: [
      { name: "AKS (Azure Kubernetes Service)", desc: "A smart building manager that automatically: assigns desks to workers (schedules containers onto servers), reboots broken kitchens (restarts crashed services), opens more stalls during the lunch rush (auto-scales up), and closes extras when it\u2019s quiet (scales down to save money). Runs: Dagster, ArgoCD, Data API, Flux." },
      { name: "fvt-nodepool", desc: "Dedicated servers exclusively for Fivetran Agents \u2014 like a VIP section with its own entrance. Heavy data-pulling won\u2019t slow down Dagster, ArgoCD, or other services. Prevents the \u2018noisy neighbor\u2019 problem where one greedy app hogs all the resources." },
      { name: "Review App", desc: "Spins up temporary live previews when someone opens a PR. Reviewers can test actual running code, not just read it. Like a movie trailer before committing to the full film. Marked orange on the Mural = newer feature." },
      { name: "AKV (Azure Key Vault)", desc: "Digital safe for passwords, API keys, certificates. Apps request secrets at runtime \u2014 nobody hardcodes them. Every access is logged. Like a hotel safe: each guest (service) gets their own code, and the hotel records every time any safe is opened." },
      { name: "Storage Accounts", desc: "Infinitely expandable cloud warehouse \u2014 raw files, processed results, backups, logs, images, CSVs, Parquet files. Think of it as the land your buildings sit on. Everything reads from and writes to here." },
      { name: "ACR (Azure Container Registry)", desc: "The freezer warehouse for Docker images. CI builds a frozen meal \u2192 ships to ACR. When AKS needs to run something \u2192 orders the right meal from ACR. Keeps every version so you can easily roll back if the latest breaks." },
    ],
  },
  argocd: {
    title: "GitOps / ArgoCD (Prod)",
    icon: "\u{1F504}",
    color: "#FECACA",
    borderColor: "#EF4444",
    metaphor: "ArgoCD constantly compares your Git repo (the plan) to what\u2019s actually running (reality). If the plan changes, ArgoCD updates reality to match. Imagine a restaurant where the menu (Git) is always boss \u2014 add a dish to the menu and ArgoCD tells the kitchen to start making it. Remove a dish and ArgoCD stops serving it. The menu is the single source of truth. That\u2019s \u2018GitOps.\u2019",
    mapHint: "In Pipeline Final \u2192 the \u2018Prod\u2019 area at the top-right with the Runway / Services paths.",
    details: [
      { name: "ApplicationSet = Cookie Cutter", desc: "Instead of manually creating a deployment config for each of 20+ services (tedious, error-prone), an ApplicationSet is a template that stamps out configs for ALL of them. Write the template once \u2192 every service gets its own deployment automatically. Change the template \u2192 all services update." },
      { name: "Top Path: Runway", desc: "argocd repo \u2192 Runway Services/ApplicationSet \u2192 RunwayProvisioner \u2192 branches into OCI Repositories (Kubernetes manifests in standard OCI format) and Kustomizations (environment-specific tweaks). The \u2018Runway\u2019 name comes from the idea of a \u2018runway\u2019 to launch services." },
      { name: "Bottom Path: Services", desc: "argocd repo \u2192 Services/ApplicationSet \u2192 External Secrets (fetches passwords from AKV and injects them into Kubernetes containers securely) + Fivetran Agents/ApplicationSet (deploys Fivetran agents to the dedicated fvt-nodepool)." },
      { name: "Kustomization", desc: "Takes a base recipe and adjusts portions per environment. Base: \u2018run 2 copies.\u2019 Production override: \u2018run 10 copies.\u2019 Dev override: \u2018keep 2 and add debug logging.\u2019 Same recipe, different settings per restaurant location." },
      { name: "Dev & Staging environments", desc: "Much simpler than Prod \u2014 just a Unity Catalog box. Dev doesn\u2019t need ArgoCD\u2019s full machinery because developers redeploy constantly anyway. Staging is the simple dress rehearsal." },
      { name: "Planned: Entra???", desc: "Microsoft Entra ID (identity/access management) integration is planned but not wired up yet. The \u2018???\u2019 means it\u2019s on the roadmap but undefined." },
    ],
  },
};

// Dagster flowchart data
const dagsterNodes = [
  { id: "start", label: "Start", shape: "oval", lane: 0, col: 0 },
  { id: "dagster", label: "Dagster", shape: "box", lane: 0, col: 1 },
  { id: "build-state", label: "Build State", shape: "box", lane: 0, col: 2 },
  { id: "is-pr-1", label: "Is pull\nrequest?", shape: "diamond", lane: 1, col: 1 },
  { id: "clone", label: "Clone", shape: "box", lane: 1, col: 2 },
  { id: "is-dbt", label: "Is dbt?", shape: "diamond", lane: 2, col: 1 },
  { id: "compile-dbt", label: "Compile dbt", shape: "box", lane: 2, col: 2 },
  { id: "docker-build", label: "Docker build", shape: "box", lane: 2, col: 3 },
  { id: "docker-push", label: "Docker push", shape: "box", lane: 2, col: 4 },
  { id: "materialize", label: "Materialize in\nbranch deploy", shape: "trap", lane: 3, col: 4 },
  { id: "is-pr-2", label: "Is pull\nrequest?", shape: "diamond", lane: 4, col: 3 },
  { id: "push-loc", label: "Push location\nto Dagster", shape: "box", lane: 4, col: 2 },
  { id: "end", label: "End", shape: "oval", lane: 4, col: 4 },
];
const dagsterLanes = ["Setup", "Databricks", "Build", "Test", "Deploy"];
const dagsterEdges: [string, string, string, string?][] = [
  ["start","dagster",""], ["dagster","build-state",""], ["build-state","is-pr-1","","d"],
  ["is-pr-1","clone","Yes"], ["is-pr-1","is-dbt","No"],
  ["is-dbt","compile-dbt","Yes"], ["is-dbt","end","No","skip"],
  ["compile-dbt","docker-build",""], ["docker-build","docker-push",""],
  ["docker-push","materialize","","d"], ["materialize","is-pr-2",""],
  ["is-pr-2","push-loc","Yes"], ["is-pr-2","end","No"],
];
const dagsterInfo: Record<string, string> = {
  start: "Triggered automatically on every code push to the Dagster repository \u2014 like a doorbell ringing when someone arrives.",
  dagster: "Bundles the Dagster project and prepares the workspace (~1m 39s). Like a chef gathering all ingredients before starting to cook.",
  "build-state": "Creates a snapshot of the current build \u2014 records what\u2019s being built and which configuration applies. Like writing the date and batch number on a production log.",
  "is-pr-1": "DECISION: Is this a pull request (still being reviewed) or has it been merged to main? PRs get a special treatment: the Databricks workspace gets cloned so changes can be tested in isolation.",
  clone: "Clones the Databricks workspace so the PR\u2019s changes can run without affecting the real environment (~7s). Like photocopying a workspace so you can experiment freely.",
  "is-dbt": "DECISION: Does this code include dbt (data transformation) changes? If yes \u2192 compile and containerize it. If no \u2192 skip to End (nothing to build).",
  "compile-dbt": "Compiles dbt SQL files into an executable plan \u2014 translating a recipe from a cookbook into step-by-step machine instructions.",
  "docker-build": "Packages the compiled dbt code into a Docker image \u2014 the self-contained \u2018lunchbox.\u2019 Takes about 1 minute.",
  "docker-push": "Pushes the Docker image to ACR (the container warehouse). Now any environment can pull and run it.",
  materialize: "Actually RUNS the dbt transformations in a temporary branch deployment to verify the output data looks correct. This is the real test \u2014 does the data come out right?",
  "is-pr-2": "DECISION: Is this a pull request? If YES \u2192 tell Dagster where the branch deployment lives. If NO (merged to main) \u2192 done, go to End.",
  "push-loc": "Updates Dagster\u2019s address book with the branch deployment\u2019s location, so Dagster knows where to find the newly deployed code.",
  end: "Pipeline complete! Code has been built, tested, and deployed (or skipped if there was nothing to build).",
};

// IaC flowchart data
const iacFlows: Record<string, {
  label: string;
  desc: string;
  steps: { id: string; label: string; shape: string; lane: string }[];
}> = {
  pr: {
    label: "\u{1F50D} PR Flow \u2014 Preview Only",
    desc: "When someone opens a PR to change infrastructure. Shows what WOULD change without changing anything. Totally safe.",
    steps: [
      { id: "pr-s", label: "Start", shape: "oval", lane: "Validate" },
      { id: "pr-hcl", label: "HCL Format", shape: "box", lane: "Validate" },
      { id: "pr-val", label: "Run validate", shape: "box", lane: "Validate" },
      { id: "pr-plan", label: "Plan", shape: "box", lane: "Build" },
      { id: "pr-json", label: "Plan / Plan JSON", shape: "box", lane: "Build" },
      { id: "pr-post", label: "Post to PR", shape: "box", lane: "Build" },
      { id: "pr-scan", label: "Scan plan", shape: "box", lane: "Test" },
    ],
  },
  merge: {
    label: "\u{1F680} Merge Flow \u2014 Apply Changes",
    desc: "When code is merged to main. Actually changes real infrastructure. Requires human approval before anything is touched.",
    steps: [
      { id: "m-s", label: "Start", shape: "oval", lane: "Validate" },
      { id: "m-hcl", label: "HCL Format", shape: "box", lane: "Validate" },
      { id: "m-val", label: "Run validate", shape: "box", lane: "Validate" },
      { id: "m-dl", label: "Download plan", shape: "box", lane: "Build" },
      { id: "m-show", label: "Show plan", shape: "box", lane: "Build" },
      { id: "m-pub", label: "Publish plan", shape: "box", lane: "Build" },
      { id: "m-plan", label: "Plan", shape: "box", lane: "Build" },
      { id: "m-scan", label: "Scan plan", shape: "box", lane: "Test" },
      { id: "m-appr", label: "\u26A0\uFE0F Approve", shape: "trap", lane: "Deploy" },
      { id: "m-apply", label: "Apply", shape: "box", lane: "Deploy" },
      { id: "m-end", label: "End", shape: "oval", lane: "Deploy" },
    ],
  },
};
const iacInfo: Record<string, string> = {
  "pr-s": "Someone opens a pull request to change infrastructure code (Terraform/HCL). This triggers the safe, preview-only pipeline.",
  "pr-hcl": "Checks that HCL files are properly formatted \u2014 like spell-checking blueprints before the architect reviews them.",
  "pr-val": "Runs \u2018terraform validate\u2019 to check the config is syntactically correct. Catches things like referencing a resource that doesn\u2019t exist.",
  "pr-plan": "Runs \u2018terraform plan\u2019 \u2014 calculates what WOULD change if applied. Like a contractor saying \u2018Here\u2019s what I\u2019d build, here\u2019s what I\u2019d demolish, here\u2019s what stays the same.\u2019 Nothing actually changes.",
  "pr-json": "Converts the plan into JSON \u2014 a machine-readable format that security scanners can inspect.",
  "pr-post": "Posts the plan as a comment on the pull request so reviewers see exactly what infrastructure changes this code would cause. Full transparency.",
  "pr-scan": "Security-scans the plan for risky changes: opening ports to the internet, removing encryption, weakening access controls. Catches dangerous changes before they happen.",
  "m-s": "Code merged to main branch. This triggers the real deployment pipeline \u2014 changes WILL be applied to infrastructure.",
  "m-hcl": "Same HCL format check as PR flow \u2014 ensures code is properly formatted even after merge.",
  "m-val": "Same validation \u2014 confirms the merged code is syntactically correct.",
  "m-dl": "Downloads the previously created plan from the PR flow. Ensures you\u2019re applying the EXACT plan that was reviewed \u2014 not a new, potentially different one.",
  "m-show": "Displays the plan one more time for final verification before proceeding.",
  "m-pub": "Publishes the plan as a permanent artifact \u2014 a record of exactly what changes are about to be applied.",
  "m-plan": "Generates the final Terraform plan \u2014 the definitive version that will be applied.",
  "m-scan": "Final security scan \u2014 last chance to catch anything dangerous before real infrastructure is modified.",
  "m-appr": "\u{1F6A8} MANUAL APPROVAL GATE \u2014 a human must explicitly click \u2018Approve\u2019 before Terraform touches anything. This is the safety net. No accidental one-click disasters. The most important step in the whole pipeline.",
  "m-apply": "Terraform APPLIES the approved plan \u2014 actually creates, modifies, or destroys cloud resources. Servers spin up, networks change, databases are created. This is the real deal.",
  "m-end": "Infrastructure changes complete. The real cloud environment now matches what\u2019s defined in code.",
};

// Databricks data
const dbTeams = ["Protection/Retirement", "Platform Engineering", "APD", "Data Science", "CB", "Finance"];
const dbInfo: Record<string, string> = {
  workspaces: "Each team gets their own Databricks workspace \u2014 like separate labs in a research building. Every workspace has the same internal layout: Development (write and test code), Governance/Resources (rules and access controls), Data Products (cleaned, ready-to-use datasets), Insights (dashboards and reports), and a Data Lake (raw storage). Teams experiment freely without stepping on each other.",
  staging: "The shared quality gate where all teams\u2019 work merges before going to Production. Contains Governance, Data Products, Insights, a Data Lake, and the Data Hub \u2014 the central meeting point. The Mural note \u2018What constitutes a Spoke?\u2019 suggests the team is still defining exactly how workspaces connect to Staging.",
  production: "The live output everyone depends on. Includes: Workflows (automated scheduled jobs), Delta Sharing (securely sharing data with external partners), and the Data Intelligence Engine. Inside the engine, data flows through stages: Source Data \u2192 Derived Data \u2192 Data Products \u2192 ML Models, organized by Domain (Domain 1 through Domain N). Each domain can have its own set of data products.",
  unity: "Unity Catalog sits beneath everything \u2014 the master librarian that organizes all data across all workspaces. Knows every table, who can access it, where it came from (lineage), and its quality. Without it, governance across 6+ workspaces would be impossible.",
  delta: "Delta Lake is the storage foundation \u2014 high-tech filing cabinets with superpowers: time-travel (\u2018show me this table last Tuesday at 3pm\u2019), ACID transactions (all-or-nothing writes prevent half-updated messes), and schema enforcement (prevents someone accidentally putting text in a number column).",
  flow: "Key insight from the Mural: Data flows RIGHT to LEFT (Production data is consumed by team workspaces for analysis). Code flows LEFT to RIGHT (developers write code in workspaces that moves through Staging into Production). It\u2019s a two-way highway with different lanes for different cargo. This prevents circular dependencies while enabling teams to both produce and consume data.",
};

const TABS = [
  { id: "learn", label: "Learn", icon: "\u{1F4D6}", desc: "Concepts & metaphors" },
  { id: "dagster", label: "Dagster Pipeline", icon: "\u2699\uFE0F", desc: "DevOps flowchart" },
  { id: "iac", label: "IaC Pipeline", icon: "\u{1F3DB}\uFE0F", desc: "Terraform flowchart" },
  { id: "databricks", label: "Databricks", icon: "\u{1F48E}", desc: "Workspace architecture" },
];

function DetailItem({ item, index, color }: { item: { name: string; desc: string }; index: number; color: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)}
      style={{
        background: open ? "rgba(51,65,85,0.4)" : "rgba(30,41,59,0.3)",
        border: "1px solid rgba(71,85,105,0.3)", borderRadius: 8,
        padding: "10px 14px", cursor: "pointer", transition: "all 0.15s",
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color, fontWeight: 600, minWidth: 20 }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#F1F5F9", flex: 1 }}>{item.name}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
          style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform 0.15s", opacity: 0.4 }}>
          <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      {open && (
        <p style={{ marginTop: 8, marginLeft: 30, fontSize: 12.5, color: "#94A3B8", lineHeight: 1.7, whiteSpace: "pre-line" }}>
          {item.desc}
        </p>
      )}
    </div>
  );
}

function SectionCard({ section, isActive, onClick }: { section: { id: string; label: string; icon: string; color: string }; isActive: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{
        flex: "1 1 200px", maxWidth: 260, minWidth: 160,
        background: isActive ? `linear-gradient(135deg, ${section.color}20, ${section.color}08)` : "rgba(30,41,59,0.5)",
        border: isActive ? `2px solid ${section.color}80` : "1px solid rgba(71,85,105,0.4)",
        borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "all 0.2s ease",
        display: "flex", alignItems: "center", gap: 10, color: "#E2E8F0", fontFamily: "inherit", textAlign: "left" as const,
        boxShadow: isActive ? `0 4px 20px ${section.color}15` : "none",
      }}>
      <span style={{ fontSize: 22, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: `${section.color}18`, borderRadius: 8, flexShrink: 0 }}>
        {section.icon}
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.2px" }}>{section.label}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
        style={{ marginLeft: "auto", flexShrink: 0, opacity: 0.5, transform: isActive ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>
        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}

const FlowArrow = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4px 0" }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 4L12 20M12 20L6 14M12 20L18 14" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

function LearnTab() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionKeys = Object.keys(SECTIONS);
  const section = activeSection ? SECTIONS[activeSection] : null;

  const overviewSections = sectionKeys.map(id => ({
    id, label: SECTIONS[id].title, icon: SECTIONS[id].icon, color: SECTIONS[id].color,
  }));

  return (
    <>
      <div style={{
        background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 12, padding: "16px 20px", marginBottom: 24, maxWidth: 800, margin: "0 auto 24px",
      }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{"\u{1F4A1}"}</span>
          <p style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.7 }}>
            Think of this whole system like a food delivery company. Chefs (developers) write recipes (code) in a kitchen (repositories). The recipes get inspected for quality (CI pipeline), packaged into containers (Docker), and shipped to restaurants (Dev &rarr; Staging &rarr; Production) where customers (users) consume the final dishes (data products).
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
          <SectionCard section={overviewSections[0]} isActive={activeSection === "repos"} onClick={() => setActiveSection(activeSection === "repos" ? null : "repos")} />
        </div>
        <FlowArrow />
        <div style={{ display: "flex", gap: 12, width: "100%", justifyContent: "center", flexWrap: "wrap" }}>
          {[1,2].map(i => (
            <SectionCard key={i} section={overviewSections[i]}
              isActive={activeSection === sectionKeys[i]}
              onClick={() => setActiveSection(activeSection === sectionKeys[i] ? null : sectionKeys[i])} />
          ))}
        </div>
        <FlowArrow />
        <div style={{ display: "flex", gap: 12, width: "100%", justifyContent: "center", flexWrap: "wrap" }}>
          {[3,4].map(i => (
            <SectionCard key={i} section={overviewSections[i]}
              isActive={activeSection === sectionKeys[i]}
              onClick={() => setActiveSection(activeSection === sectionKeys[i] ? null : sectionKeys[i])} />
          ))}
        </div>
      </div>

      {section && (
        <div style={{
          maxWidth: 800, margin: "24px auto 0",
          background: "linear-gradient(135deg, rgba(30,41,59,0.95), rgba(15,23,42,0.95))",
          border: `1px solid ${section.borderColor}40`, borderRadius: 16, padding: 24,
          animation: "fadeSlideIn 0.3s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 28 }}>{section.icon}</span>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC", flex: 1 }}>{section.title}</h2>
          </div>
          <div style={{ background: `${section.borderColor}12`, border: `1px solid ${section.borderColor}30`, borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{"\u{1F3AF}"}</span>
              <p style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.7, fontStyle: "italic" }}>{section.metaphor}</p>
            </div>
          </div>
          {section.mapHint && (
            <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 8, padding: "8px 14px", marginBottom: 16, display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 13 }}>{"\u{1F5FA}\uFE0F"}</span>
              <p style={{ fontSize: 11.5, color: "#64748B", lineHeight: 1.5 }}>{section.mapHint}</p>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {section.details.map((item, i) => (
              <DetailItem key={i} item={item} index={i} color={section.borderColor} />
            ))}
          </div>
        </div>
      )}

      {!activeSection && (
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <p style={{ color: "#64748B", fontSize: 13, fontStyle: "italic" }}>{"\u{1F446}"} Tap any card to explore that part of the pipeline</p>
          <p style={{ color: "#475569", fontSize: 11, marginTop: 8 }}>
            Looking for the full architecture map with all 50 nodes and arrows? Open <strong style={{ color: "#94A3B8" }}>Pipeline Final</strong>.
          </p>
        </div>
      )}
    </>
  );
}

function DagsterTab() {
  const [sel, setSel] = useState<string | null>(null);
  const laneH = 82, colW = 130, padL = 90, padT = 40;
  const W = padL + 5 * colW + 20, H = padT + 5 * laneH + 10;

  const getPos = (node: { lane: number; col: number }) => ({ x: padL + node.col * colW + colW/2, y: padT + node.lane * laneH + laneH/2 });

  const Shape = ({ node }: { node: typeof dagsterNodes[number] }) => {
    const p = getPos(node);
    const active = sel === node.id;
    const fill = active ? "#FEF3C7" : node.shape === "diamond" ? "#1E3A5F" : "#1E293B";
    const stroke = active ? "#F59E0B" : node.shape === "diamond" ? "#3B82F6" : "#475569";
    const sw = active ? 2 : 1;
    const lines = node.label.split("\n");
    const tc = active ? "#1E293B" : "#E2E8F0";
    const tEls = lines.map((l, i) => (
      <text key={i} x={p.x} y={p.y + (i - (lines.length-1)/2) * 12 + 4} textAnchor="middle" fontSize={9.5} fontWeight={500} fill={tc}>{l}</text>
    ));
    return (
      <g onClick={() => setSel(active ? null : node.id)} style={{ cursor: "pointer" }}>
        {node.shape === "oval" && <ellipse cx={p.x} cy={p.y} rx={32} ry={17} fill={fill} stroke={stroke} strokeWidth={sw} />}
        {node.shape === "diamond" && <polygon points={`${p.x},${p.y-24} ${p.x+38},${p.y} ${p.x},${p.y+24} ${p.x-38},${p.y}`} fill={fill} stroke={stroke} strokeWidth={sw} />}
        {node.shape === "trap" && <polygon points={`${p.x-34},${p.y-17} ${p.x+34},${p.y-17} ${p.x+26},${p.y+17} ${p.x-26},${p.y+17}`} fill={fill} stroke={stroke} strokeWidth={sw} />}
        {node.shape === "box" && <rect x={p.x-38} y={p.y-18} width={76} height={36} rx={3} fill={fill} stroke={stroke} strokeWidth={sw} />}
        {tEls}
      </g>
    );
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 18 }}>
        <p style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.65 }}>
          <strong style={{ color: "#FDBA74" }}>Dagster DevOps Architecture</strong> &mdash; This pipeline runs every time someone pushes code to the Dagster repository. Think of it as an assembly line with decision forks: depending on whether it&apos;s a PR and whether it has dbt code, the product takes different paths through the factory. <strong style={{ color: "#FDE68A" }}>Click any step</strong> to learn what it does.
        </p>
        <p style={{ fontSize: 11, color: "#64748B", marginTop: 8 }}>
          {"\u23F1"} Typical total: ~10 min (Setup ~2min + Databricks ~11s + Build ~4min + Deploy ~4min) &nbsp;|&nbsp;
          {"\u{1F5FA}\uFE0F"} In Pipeline Final &rarr; &apos;Dagster&apos; is a node inside the AKS box
        </p>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", borderRadius: 10, border: "1px solid #1E293B" }}>
        <rect width={W} height={H} fill="#0F172A" rx={10} />
        <defs>
          <marker id="da" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="7" markerHeight="5" orient="auto-start-reverse">
            <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
          </marker>
        </defs>

        {dagsterLanes.map((lane, i) => (
          <g key={i}>
            <rect x={0} y={padT + i * laneH} width={W} height={laneH} fill={i % 2 === 0 ? "rgba(15,23,42,1)" : "rgba(30,41,59,0.35)"} />
            <line x1={0} y1={padT + i * laneH} x2={W} y2={padT + i * laneH} stroke="#1E293B" strokeWidth={0.5} />
            <text x={10} y={padT + i * laneH + laneH/2 + 3} fontSize={10} fontWeight={600} fill="#475569">{lane}</text>
          </g>
        ))}

        {dagsterEdges.map(([fromId, toId, label, style], i) => {
          const f = getPos(dagsterNodes.find(n => n.id === fromId)!);
          const t = getPos(dagsterNodes.find(n => n.id === toId)!);
          const dx = t.x-f.x, dy = t.y-f.y, len = Math.sqrt(dx*dx+dy*dy)||1;
          const nx = dx/len, ny = dy/len;
          const x1 = f.x+nx*28, y1 = f.y+ny*20, x2 = t.x-nx*28, y2 = t.y-ny*20;
          const isSkip = style === "skip";
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isSkip ? "#EF4444" : "#475569"} strokeWidth={1}
                strokeDasharray={style === "d" ? "4,3" : isSkip ? "6,3" : "none"}
                markerEnd="url(#da)" />
              {label && <text x={(x1+x2)/2 + (Math.abs(dy)>Math.abs(dx) ? -14 : 0)} y={(y1+y2)/2 + (Math.abs(dx)>Math.abs(dy) ? -6 : 4)}
                fontSize={8} fontWeight={600} fill={isSkip ? "#EF4444" : "#64748B"}>{label}</text>}
            </g>
          );
        })}

        {dagsterNodes.map(n => <Shape key={n.id} node={n} />)}
      </svg>

      {sel && dagsterInfo[sel] && (
        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "14px 18px", marginTop: 14, animation: "fadeSlideIn 0.25s ease" }}>
          <strong style={{ fontSize: 13, color: "#FDE68A" }}>{dagsterNodes.find(n => n.id === sel)?.label.replace("\n"," ")}</strong>
          <p style={{ fontSize: 12.5, color: "#94A3B8", lineHeight: 1.7, marginTop: 6 }}>{dagsterInfo[sel]}</p>
        </div>
      )}
    </div>
  );
}

function IaCTab() {
  const [flowKey, setFlowKey] = useState("pr");
  const [sel, setSel] = useState<string | null>(null);
  const flow = iacFlows[flowKey];
  const lanes = [...new Set(flow.steps.map(s => s.lane))];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 18 }}>
        <p style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.65 }}>
          <strong style={{ color: "#A5B4FC" }}>IaC DevOps Architecture</strong> &mdash; Instead of clicking buttons to set up servers, your team writes infrastructure as code using Terraform/HCL. Like handing blueprints to a robot &mdash; it builds exactly what&apos;s drawn. There are two flows.
        </p>
        <p style={{ fontSize: 11, color: "#64748B", marginTop: 8 }}>
          {"\u{1F5FA}\uFE0F"} Not shown in Pipeline Final &mdash; this is a separate pipeline that manages the infrastructure Final&apos;s nodes run on
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {Object.entries(iacFlows).map(([k, f]) => (
          <button key={k} onClick={() => { setFlowKey(k); setSel(null); }}
            style={{
              flex: 1, padding: "10px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
              background: flowKey === k ? (k === "pr" ? "rgba(59,130,246,0.15)" : "rgba(34,197,94,0.15)") : "rgba(30,41,59,0.4)",
              border: flowKey === k ? `2px solid ${k === "pr" ? "#3B82F6" : "#22C55E"}` : "1px solid #334155",
              color: "#E2E8F0", fontSize: 12, fontWeight: 600, transition: "all 0.15s",
            }}>
            {f.label}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 12, color: "#64748B", marginBottom: 14, fontStyle: "italic" }}>{flow.desc}</p>

      <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid #1E293B", borderRadius: 10, padding: "16px 14px" }}>
        {lanes.map(lane => {
          const laneSteps = flow.steps.filter(s => s.lane === lane);
          return (
            <div key={lane} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase" as const, letterSpacing: 1.2, marginBottom: 8 }}>{lane}</div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                {laneSteps.map((step, si) => {
                  const active = sel === step.id;
                  const isDanger = step.shape === "trap";
                  return (
                    <div key={step.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button onClick={() => setSel(active ? null : step.id)}
                        style={{
                          padding: "7px 12px",
                          borderRadius: step.shape === "oval" ? 16 : isDanger ? "6px 6px 3px 3px" : 5,
                          background: active ? "#FEF3C7" : isDanger ? "rgba(239,68,68,0.12)" : "rgba(30,41,59,0.6)",
                          border: active ? "2px solid #F59E0B" : isDanger ? "1.5px solid #EF4444" : "1px solid #334155",
                          color: active ? "#1E293B" : isDanger ? "#FCA5A5" : "#CBD5E1",
                          cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 500, transition: "all 0.15s",
                        }}>
                        {step.label}
                      </button>
                      {si < laneSteps.length - 1 && <span style={{ color: "#334155", fontSize: 12 }}>&rarr;</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {sel && iacInfo[sel] && (
        <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 10, padding: "14px 18px", marginTop: 14, animation: "fadeSlideIn 0.25s ease" }}>
          <strong style={{ fontSize: 13, color: "#A5B4FC" }}>{flow.steps.find(s => s.id === sel)?.label}</strong>
          <p style={{ fontSize: 12.5, color: "#94A3B8", lineHeight: 1.7, marginTop: 6 }}>{iacInfo[sel]}</p>
        </div>
      )}
    </div>
  );
}

function DatabricksTab() {
  const [sel, setSel] = useState<string | null>(null);

  const Workspace = ({ name }: { name: string }) => (
    <div style={{ background: "rgba(30,41,59,0.6)", border: "1px solid #334155", borderRadius: 8, padding: 8, textAlign: "center", minWidth: 105 }}>
      <div style={{ fontSize: 8, color: "#6366F1", fontWeight: 600, textTransform: "uppercase" as const, marginBottom: 4 }}>Development</div>
      <div style={{ fontSize: 7.5, color: "#475569", marginBottom: 3 }}>Governance / Resources</div>
      <div style={{ display: "flex", gap: 2, justifyContent: "center", marginBottom: 3 }}>
        <span style={{ fontSize: 7, background: "#1E293B", padding: "1px 4px", borderRadius: 2, color: "#94A3B8" }}>Data Products</span>
        <span style={{ fontSize: 7, background: "#1E293B", padding: "1px 4px", borderRadius: 2, color: "#94A3B8" }}>Insights</span>
      </div>
      <div style={{ background: "#0F172A", borderRadius: 4, padding: "2px 4px", fontSize: 7, color: "#475569" }}>Data Lake {"\u{1F30A}"}</div>
      <div style={{ fontSize: 9, fontWeight: 600, color: "#A5B4FC", marginTop: 5 }}>{name}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 18 }}>
        <p style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.65 }}>
          <strong style={{ color: "#67E8F9" }}>Databricks Workspaces & Data Flow</strong> &mdash; Your data laboratory. Each team has their own workspace. Data flows right-to-left while code flows left-to-right. <strong style={{ color: "#FDE68A" }}>Click any section</strong> to learn more.
        </p>
        <p style={{ fontSize: 11, color: "#64748B", marginTop: 8 }}>
          {"\u{1F5FA}\uFE0F"} Not shown in Pipeline Final &mdash; this is the Databricks layer that sits alongside your Azure infrastructure
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 14, fontSize: 10, color: "#475569" }}>
        <span>&larr; &larr; Data flows right to left &larr; &larr;</span>
        <span>&rarr; &rarr; Code flows left to right &rarr; &rarr;</span>
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", alignItems: "stretch", paddingBottom: 6 }}>
        <div onClick={() => setSel(sel === "workspaces" ? null : "workspaces")}
          style={{ flex: "0 0 auto", cursor: "pointer", padding: 6, borderRadius: 10, border: sel === "workspaces" ? "2px solid #6366F1" : "2px solid transparent", transition: "all 0.15s" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#6366F1", textTransform: "uppercase" as const, textAlign: "center", marginBottom: 6, letterSpacing: 1 }}>Team Workspaces</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            {dbTeams.map(t => <Workspace key={t} name={t} />)}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", color: "#334155", fontSize: 16, flexShrink: 0 }}>&rarr;</div>

        <div onClick={() => setSel(sel === "staging" ? null : "staging")}
          style={{ flex: "0 0 120px", cursor: "pointer", display: "flex", alignItems: "center", padding: 6, borderRadius: 10, border: sel === "staging" ? "2px solid #0D9488" : "2px solid transparent", transition: "all 0.15s" }}>
          <div style={{ background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.25)", borderRadius: 8, padding: 10, textAlign: "center", width: "100%" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#2DD4BF", marginBottom: 6 }}>Staging</div>
            <div style={{ fontSize: 8, color: "#475569", marginBottom: 3 }}>Governance</div>
            <div style={{ display: "flex", gap: 2, justifyContent: "center", marginBottom: 3 }}>
              <span style={{ fontSize: 6.5, background: "#0F172A", padding: "1px 3px", borderRadius: 2, color: "#64748B" }}>Products</span>
              <span style={{ fontSize: 6.5, background: "#0F172A", padding: "1px 3px", borderRadius: 2, color: "#64748B" }}>Insights</span>
            </div>
            <div style={{ fontSize: 7.5, color: "#475569" }}>Data Lake {"\u{1F30A}"}</div>
            <div style={{ fontSize: 8, color: "#2DD4BF", marginTop: 3 }}>Data Hub</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", color: "#334155", fontSize: 16, flexShrink: 0 }}>&rarr;</div>

        <div onClick={() => setSel(sel === "production" ? null : "production")}
          style={{ flex: "0 0 170px", cursor: "pointer", padding: 6, borderRadius: 10, border: sel === "production" ? "2px solid #059669" : "2px solid transparent", display: "flex", alignItems: "center", transition: "all 0.15s" }}>
          <div style={{ background: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 8, padding: 10, width: "100%" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#34D399", marginBottom: 4, textAlign: "center" }}>Production</div>
            <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 7.5, background: "rgba(5,150,105,0.12)", padding: "2px 6px", borderRadius: 8, color: "#6EE7B7" }}>Workflows</span>
              <span style={{ fontSize: 7.5, background: "rgba(5,150,105,0.12)", padding: "2px 6px", borderRadius: 8, color: "#6EE7B7" }}>Delta Sharing</span>
            </div>
            <div style={{ background: "#0F172A", borderRadius: 6, padding: 8, textAlign: "center" }}>
              <div style={{ fontSize: 8, fontWeight: 600, color: "#CBD5E1", marginBottom: 4 }}>Data Intelligence Engine</div>
              <div style={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                {["Source", "Derived", "Products", "ML Models"].map((d, i) => (
                  <span key={i} style={{ fontSize: 6.5, padding: "2px 4px", borderRadius: 2, background: i === 2 ? "rgba(59,130,246,0.2)" : "#1E293B", color: i === 2 ? "#93C5FD" : "#64748B" }}>{d}</span>
                ))}
              </div>
              <div style={{ fontSize: 7, color: "#475569", marginTop: 3 }}>Domain 1 &hellip; Domain N</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        {([["unity","Unity Catalog \u2014 Master governance"], ["delta","\u25B3 Delta Lake \u2014 Storage foundation"], ["flow","\u{1F504} Data vs Code flow direction"]] as const).map(([k, label]) => (
          <button key={k} onClick={() => setSel(sel === k ? null : k)}
            style={{
              flex: 1, padding: "7px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
              background: sel === k ? "rgba(245,158,11,0.1)" : "rgba(30,41,59,0.4)",
              border: sel === k ? "1.5px solid #F59E0B" : "1px solid #334155",
              color: sel === k ? "#FDE68A" : "#64748B", fontSize: 10, fontWeight: 500, textAlign: "center", transition: "all 0.15s",
            }}>
            {label}
          </button>
        ))}
      </div>

      {sel && dbInfo[sel] && (
        <div style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 10, padding: "14px 18px", marginTop: 14, animation: "fadeSlideIn 0.25s ease" }}>
          <p style={{ fontSize: 12.5, color: "#94A3B8", lineHeight: 1.7, margin: 0 }}>{dbInfo[sel]}</p>
        </div>
      )}
    </div>
  );
}

export default function PipelineExplorer() {
  const [tab, setTab] = useState("learn");

  return (
    <div style={{
      fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
      minHeight: "100vh",
      color: "#E2E8F0",
      padding: "24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{
          display: "inline-block", padding: "4px 16px",
          background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
          borderRadius: 20, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace",
          color: "#A5B4FC", letterSpacing: 1.5, textTransform: "uppercase" as const, marginBottom: 12,
        }}>
          Pipeline Explorer
        </div>
        <h1 style={{
          fontSize: 28, fontWeight: 700, letterSpacing: -0.5,
          background: "linear-gradient(135deg, #F8FAFC, #94A3B8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8,
        }}>
          Your Data Platform &mdash; The Textbook
        </h1>
        <p style={{ fontSize: 13, color: "#94A3B8", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
          Learn the concepts, metaphors, and workflows here. Use <strong style={{ color: "#F1F5F9" }}>Pipeline Final</strong> for the full 50-node architecture map with all connections.
        </p>
      </div>

      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 24, flexWrap: "wrap", maxWidth: 700, margin: "0 auto 24px" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              padding: "10px 16px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
              background: tab === t.id ? "rgba(99,102,241,0.15)" : "rgba(30,41,59,0.4)",
              border: tab === t.id ? "1.5px solid rgba(99,102,241,0.4)" : "1px solid rgba(51,65,85,0.4)",
              color: tab === t.id ? "#E2E8F0" : "#64748B", fontSize: 12, fontWeight: tab === t.id ? 600 : 400,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2, transition: "all 0.15s", minWidth: 110,
            }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 14 }}>{t.icon}</span>{t.label}
            </span>
            <span style={{ fontSize: 9, color: tab === t.id ? "#94A3B8" : "#475569" }}>{t.desc}</span>
          </button>
        ))}
      </div>

      {tab === "learn" && <LearnTab />}
      {tab === "dagster" && <DagsterTab />}
      {tab === "iac" && <IaCTab />}
      {tab === "databricks" && <DatabricksTab />}
    </div>
  );
}
