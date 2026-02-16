"use client";

import { useState, useCallback } from "react";

const areaInfo: Record<string, { title: string; explain: string }> = {
  repos: {
    title: "Azure DevOps Repositories",
    explain: "Imagine a big bookshelf in a shared office. Each book on the shelf is a \"repository\" (repo for short) \u2014 a folder that holds all the code, configuration files, and instructions for one specific part of your data platform.\n\nWhen a developer wants to change something, they don\u2019t just edit the book directly (that would be risky \u2014 what if they make a mistake?). Instead, they make a personal copy, make their changes on the copy, and then submit a \"pull request\" (PR) \u2014 basically a formal note saying \"Hey team, I\u2019d like to merge these changes into the real book. Can someone review them first?\" A colleague reviews it, suggests fixes if needed, and then approves the merge.\n\nYour team has about 18 repos on this shelf, each responsible for a different piece of the puzzle \u2014 from data transformation logic (dbt) to deployment configs (argocd) to reusable build templates.\n\nThe arrows flowing DOWN from this area show which repos feed into the Azure Pipelines (the automated build & test system). The arrows flowing RIGHT show which repos feed into the ArgoCD production deployment system. Think of it as: books get checked out of the library and sent either to the quality inspector (CI) or to the deployment team (ArgoCD).",
  },
  pipelines: {
    title: "Azure Pipelines",
    explain: "Azure Pipelines is like an automated factory floor that sits between \"writing code\" and \"running code in the real world.\"\n\nImagine you\u2019re manufacturing a product. You wouldn\u2019t ship it straight from the designer\u2019s desk to the customer, right? It would go through quality checks, packaging, and shipping stages first. That\u2019s exactly what Azure Pipelines does for your code.\n\nIt has two main sections:\n\n\u2022 CI (Continuous Integration) \u2014 the quality inspection line at the top. Every time someone pushes code, CI automatically runs checks: Is the code formatted correctly? Do the tests pass? Are there security issues? Is it packaged properly?\n\n\u2022 CD (Continuous Delivery) \u2014 the shipping department at the bottom. Once code passes CI, CD moves it through different environments (Dev \u2192 QA \u2192 Staging \u2192 Production), like a product going from the factory floor to the warehouse to the store shelf.\n\nThe word \"Continuous\" means this happens automatically, every time someone makes a change. No one has to manually press a \"build\" button \u2014 it just happens. This catches problems early, before they reach real users.",
  },
  ci: {
    title: "CI (Continuous Integration)",
    explain: "CI is like the quality control department in a factory. Before any product (code) leaves the building, it must pass through a series of inspection stations \u2014 one after another, in a strict order.\n\nThe stations are:\n1. Lint & Format Check \u2014 \"Is the code neat and properly formatted?\" (like spell-checking a document)\n2. Unit Tests \u2014 \"Does each individual piece work correctly?\" (like testing each car part before assembly)\n3. Security Scan \u2014 \"Are there any security holes?\" (like running luggage through an airport X-ray)\n4. Then it branches into two paths:\n   \u2022 Path A: Package Creation \u2192 Artifacts (Python) \u2192 Docker Image Build (for code that produces Python libraries)\n   \u2022 Path B: Security Scan \u2192 Docker Image Build directly (for code that skips packaging, like pure Docker services)\n\nMost repos connect into CI as a whole (the arrows go to the CI box, not to individual steps). CI then decides which steps to run based on the type of code. Think of it like a hospital triage \u2014 everyone enters through the front door, but the system routes each patient to the right department.\n\nIf ANY step fails, the entire pipeline stops and the developer gets a notification. This is intentional \u2014 it\u2019s better to catch problems now than to let broken code reach your users.",
  },
  cd: {
    title: "CD (Continuous Delivery)",
    explain: "CD is the journey your code takes from \"it works on my machine\" to \"it works for real users.\" Think of it like a band preparing for a big concert:\n\n\u2022 Dev \u2014 The practice room. The band plays through their songs casually. Mistakes are fine. Nobody\u2019s watching. Developers deploy here constantly to test their changes in a real (but safe) environment.\n\n\u2022 QA/UAT \u2014 The soundcheck at the venue. QA (Quality Assurance) asks \"does it sound right?\" and UAT (User Acceptance Testing) asks \"is this what the audience actually wants to hear?\" Testers and business people verify the changes work correctly.\n\n\u2022 Staging \u2014 The dress rehearsal. The band plays the full set, in costume, with the real sound system. Staging mirrors Production as closely as possible. If the dress rehearsal goes well, you\u2019re good to go.\n\n\u2022 Production \u2014 The live concert. Real users see this. Real data flows through. Handle with extreme care.\n\nThe only explicit arrow in this zone is Staging \u2192 Production, labeled \"Tagging.\" Tagging means stamping a version number on your code (like \"v2.3.1\") before promoting it \u2014 so you always know exactly which version is running in Production, and you can roll back to a previous version if something goes wrong.\n\nBranch deployments, Service Description (nicki sp?), and UC-SYNC?? are additional items in this zone \u2014 some are still being planned (notice the question marks).",
  },
  prod: {
    title: "Prod (Production ArgoCD)",
    explain: "This is the Production deployment zone, managed by a tool called ArgoCD using a philosophy called \"GitOps.\"\n\nGitOps is a simple but powerful idea: your Git repository is the single source of truth. Whatever is written in Git is what should be running in Production. ArgoCD is like a very diligent employee who constantly reads the latest instructions from Git, compares them to what\u2019s actually running, and automatically fixes any differences.\n\nImagine a restaurant where the menu (Git) is the boss. If someone changes the menu to add a new dish, ArgoCD notices and tells the kitchen to start making it. If someone removes a dish from the menu, ArgoCD tells the kitchen to stop. The menu is always right.\n\nThere are two flow paths in this zone:\n\n1. TOP PATH (Runway): argocd repo \u2192 Runway Services/ApplicationSet \u2192 RunwayProvisioner \u2192 then branches into OCI Repositories and Kustomizations (these customize Kubernetes configs for each environment and service)\n\n2. BOTTOM PATH (Services): argocd repo \u2192 Services/ApplicationSet \u2192 branches to External Secrets (for managing passwords/keys) and Fivetran Agents/ApplicationSet (for data ingestion)\n\n\"ApplicationSet\" is an ArgoCD concept \u2014 think of it like a cookie cutter. Instead of manually creating a deployment config for each of your 20 services, the ApplicationSet is a template that automatically stamps out configs for all of them. Change the template once, and all 20 services update.",
  },
  dev: {
    title: "Dev (Development Environment)",
    explain: "Dev is the playground sandbox \u2014 a safe space where developers can experiment freely without fear of breaking anything important.\n\nThink of it like a test kitchen in a restaurant. Chefs can try new recipes, make mistakes, burn things \u2014 and no customer will ever taste the results. If something breaks, no big deal. Just try again.\n\nNotice how simple Dev is compared to the complex Prod section \u2014 it only contains Unity (Unity Catalog). That\u2019s intentional. Dev doesn\u2019t need all the complex ArgoCD deployment machinery because developers are deploying and redeploying constantly. It just needs the basics: a place to run code and a catalog to organize data.\n\nUnity Catalog here means developers can still browse and manage data assets (tables, models, etc.) in their sandbox environment, using the same system as Production.",
  },
  staging: {
    title: "Staging Environment",
    explain: "Staging is the \"dress rehearsal\" for Production. It should look, feel, and behave almost exactly like the real thing \u2014 same configurations, similar data, same tools \u2014 but it\u2019s not serving real users.\n\nThink of it like the final walkthrough before a store opens. The shelves are stocked, the registers work, the lights are on \u2014 but the doors are still locked. If anything looks wrong, you fix it now, before customers arrive.\n\nLike Dev, Staging just shows Unity (Unity Catalog) \u2014 an isolated instance of the data catalog. The key difference between Dev and Staging is intent: Dev is for experimentation, Staging is for final verification. If it works in Staging, it should work in Production.",
  },
  azpDp001: {
    title: "AZP-DP001 (Azure Data Platform 001)",
    explain: "Everything else in this diagram describes WHAT should run and HOW it should be configured. AZP-DP001 is about WHERE it actually runs \u2014 the physical (well, virtual) cloud infrastructure on Microsoft Azure.\n\nThink of it like a building. The repos are the blueprints, the pipelines are the construction process, and AZP-DP001 is the actual building where people work.\n\n\"AZP\" stands for Azure Platform, \"DP\" for Data Platform, and \"001\" means this is the first (or primary) instance. Inside this building you\u2019ll find:\n\n\u2022 AKS \u2014 A Kubernetes cluster. Think of it as a smart office building that automatically assigns desks, meeting rooms, and resources to whoever needs them. It runs your core services (Dagster, ArgoCD, Data API, Flux).\n\n\u2022 fvt-nodepool \u2014 A dedicated wing of the building reserved exclusively for Fivetran data ingestion agents. Like a VIP section \u2014 only Fivetran gets to use these servers.\n\n\u2022 AKV (Azure Key Vault) \u2014 The office safe where all passwords, API keys, and certificates are stored. Nobody writes secrets on sticky notes; they go in the vault.\n\n\u2022 Storage Accounts \u2014 The warehouse. Bulk cloud storage for raw data files, processed results, and backups.\n\n\u2022 ACR (Azure Container Registry) \u2014 The distribution center for Docker images. When CI builds a container image, it ships it to ACR. When AKS needs to run something, it orders from ACR.",
  },
  aks: {
    title: "AKS (Azure Kubernetes Service)",
    explain: "AKS is your Kubernetes cluster \u2014 but what does that mean in plain English?\n\nImagine you\u2019re running a food court with dozens of restaurants. Each restaurant (service) needs a stall, a kitchen, electricity, and water. Managing all of that manually would be a nightmare. Kubernetes is like a building manager who automatically:\n\u2022 Assigns stalls to restaurants (schedules containers on servers)\n\u2022 Turns on the lights when a restaurant opens (starts containers)\n\u2022 Reboots a restaurant\u2019s kitchen if the stove breaks (restarts crashed containers)\n\u2022 Opens more stalls when there\u2019s a rush (scales up under heavy load)\n\u2022 Closes extra stalls when things are quiet (scales down to save money)\n\nInside your AKS \"food court,\" you have four permanent restaurants:\n\u2022 Dagster \u2014 the scheduling brain that orchestrates when data pipelines run\n\u2022 ArgoCD \u2014 the deployment automation engine that keeps everything in sync with Git\n\u2022 Data API \u2014 the counter where other teams order data from your platform\n\u2022 Flux \u2014 a helper that manages Kubernetes configurations (works alongside ArgoCD)\n\nPlus \"Review App\" (in orange) \u2014 a feature for spinning up temporary preview versions of your app when someone opens a pull request, so reviewers can test the actual running code, not just read it.",
  },
  fvtNodepool: {
    title: "fvt-nodepool",
    explain: "A \"node pool\" in Kubernetes is a group of servers (nodes) that share the same configuration. The \"fvt-nodepool\" is a dedicated group of servers reserved exclusively for running Fivetran Agents.\n\nWhy give Fivetran its own dedicated servers? Imagine a shared internet connection in an apartment building. If one tenant starts downloading huge files, everyone else\u2019s internet slows down. By giving Fivetran its own \"internet connection\" (dedicated node pool), its heavy data-pulling work won\u2019t slow down Dagster, ArgoCD, or other services.\n\nFivetran Agents are programs that connect to your company\u2019s external data sources (things like Salesforce, Stripe, internal databases, Google Analytics) and pull data into your data platform. They run continuously or on a schedule, and they can be resource-intensive \u2014 hence the dedicated hardware.\n\nThe deployment arrow comes from Fivetran Agents/ApplicationSet in the Prod (ArgoCD) section above \u2014 meaning ArgoCD manages what version of the Fivetran Agents is running here.",
  },
  acr: {
    title: "ACR (Azure Container Registry)",
    explain: "ACR is a warehouse for Docker images \u2014 but what are Docker images?\n\nThink of a Docker image as a ready-to-eat frozen meal. It contains everything needed to run your application: the code, the operating system, the runtime, all the libraries \u2014 all sealed in one standardized box. Anyone can \"microwave\" (run) this meal on any \"microwave\" (server) and get the exact same result.\n\nACR is the freezer warehouse where all these frozen meals are stored. The flow works like this:\n\n1. The CI pipeline\u2019s \"Docker Image Build\" step creates the frozen meal\n2. It ships the meal to ACR (the warehouse)\n3. When AKS needs to serve a restaurant (run a service), it orders the right meal from ACR\n\nACR keeps every version, so if the latest frozen meal tastes bad (has a bug), you can quickly swap back to the previous version. This is called \"rolling back.\"",
  },
};

const nodeInfo: Record<string, { full: string; explain: string }> = {
  "uc-catalog-ent": { full: "Unity Catalog Enterprise", explain: "Think of Unity Catalog as the master phone book for your entire data platform. It knows where every table, view, ML model, and data asset lives \u2014 and crucially, who is allowed to access each one.\n\nFor example, if a marketing analyst wants to find a table called \u2018customer_segments,\u2019 they look it up in Unity Catalog. The catalog says: \u2018That table is in the Gold layer of the Finance Data Lake, it was last updated 3 hours ago, and yes, you have read access.\u2019\n\nThis repo contains the code that configures Unity Catalog at the enterprise level \u2014 permission rules, catalog structure, and governance policies. It\u2019s like the HR department maintaining the company directory: they don\u2019t do the actual work, but everyone depends on them to know who\u2019s who and who can access what.\n\nConnects to: CI (its code goes through the build pipeline for testing)." },
  "datahub-projen": { full: "DataHub Project Generator (Hub Repo)", explain: "This is the \u2018parent\u2019 repo \u2014 the master template that generates the folder structure, configuration, and scaffolding for other repos. Think of it like a franchise headquarters that sends the same store layout, branding guide, and operational manual to every new franchise location.\n\nWhen someone creates a new data project, they don\u2019t start from scratch. datahub-projen stamps out a pre-configured project that already follows all the team\u2019s standards \u2014 like a cookie cutter for code projects.\n\nConnects to (feeds these repos):\n\u2022 fivetran-connection\n\u2022 datahub-data-platform (dbt)\n\u2022 data-transformation\n\u2022 data-contracts\n\nImportant: datahub-projen does NOT connect directly to CI. Instead, the \u2018child\u2019 repos it generates are the ones that individually go through CI. The parent sets the rules; the children follow them." },
  plt: { full: "Platform (Core)", explain: "The foundation that everything else is built on. Like the concrete slab under a house \u2014 you don\u2019t see it, but if it cracks, everything above it has problems.\n\nplt contains shared Python libraries, utility functions, and core configurations that many other projects import and depend on. For example, if every project needs a standard way to connect to the database or format log messages, that shared code lives in plt.\n\nConnects to:\n\u2022 mdf (the metadata framework uses platform utilities)\n\u2022 CI (plt\u2019s own code needs to be tested and built)\n\nReceives from:\n\u2022 datahub-projen (gets its project structure from the generator)\n\u2022 data-contracts (the contracts define rules that plt\u2019s code enforces)" },
  "data-contracts": { full: "Data Contracts", explain: "Imagine you\u2019re a restaurant that orders ingredients from a supplier. A \u2018data contract\u2019 is like the agreement: \u2018You will deliver 50 lbs of tomatoes every Monday. They must be organic, red, and free of bruises. If they don\u2019t meet these standards, I\u2019m sending them back.\u2019\n\nIn data terms, a contract says: \u2018This table will have these specific columns, in these data types, refreshed at this frequency.\u2019 If the data doesn\u2019t match the contract, the system raises an alert before bad data pollutes downstream reports.\n\nConnects to:\n\u2022 plt (the platform code enforces these contracts)\n\u2022 datahub-data-platform / dbt (dbt uses contracts to validate data transformations)\n\nReceives from: datahub-projen (gets its project structure)" },
  argocd: { full: "ArgoCD Configuration", explain: "This repo is the \u2018instruction manual\u2019 that tells ArgoCD how to deploy everything in Production. If ArgoCD is a diligent robot that sets up your servers, this repo is the blueprint the robot reads.\n\nChange a file in this repo, and ArgoCD automatically notices and updates the real running system to match. No one needs to SSH into a server or click buttons \u2014 the code IS the deployment.\n\nConnects to (the bridge from code to live systems):\n\u2022 Runway Services/ApplicationSet (top Prod path \u2014 manages core service deployments)\n\u2022 Services/ApplicationSet (bottom Prod path \u2014 manages secrets and Fivetran)\n\nThese two arrows are perhaps the most important in the whole diagram \u2014 they\u2019re the bridge from \u2018code in a repo\u2019 to \u2018software running in Production.\u2019" },
  "data-api": { full: "Data API", explain: "Think of a restaurant menu. Customers (other teams, external systems) don\u2019t walk into the kitchen and grab ingredients themselves. Instead, they look at the menu (API), place an order (\u2018give me all sales data for Q3\u2019), and the kitchen (Data API) prepares and serves the response.\n\nAPIs let other systems access your data in a controlled, secure way \u2014 without giving everyone direct database access (which would be like letting customers roam the kitchen).\n\nConnects to: Docker Image Build directly (bypasses Lint, Unit Tests, Security Scan, and Package Creation). It\u2019s a standalone service that just needs to be containerized \u2014 like a fully cooked dish that only needs plating." },
  "fivetran-connection": { full: "Fivetran Connection Config", explain: "Fivetran is a tool that automatically pulls data from external sources \u2014 like a vacuum cleaner that sucks data from Salesforce, Stripe, Google Analytics, databases, and dozens of other systems into your data lake.\n\nThis repo manages the CONNECTION configurations \u2014 which sources to connect to, how often to sync, which tables to pull, and what credentials to use. It\u2019s like programming the vacuum cleaner: \u2018Clean the living room at 6am, the kitchen at 7am, skip the garage.\u2019\n\nConnects to: CI (configuration changes get tested)\nReceives from: datahub-projen (generated project structure)" },
  "dp-aks-fivetran-agents": { full: "DP AKS Fivetran Agents", explain: "While fivetran-connection defines WHAT data to pull, this repo defines WHERE the Fivetran software itself runs \u2014 it manages the Fivetran Agent deployments inside your AKS Kubernetes cluster.\n\nFivetran Agents are needed when your data sources are behind a firewall (like an on-premises database). The agent runs inside your own infrastructure and creates a secure tunnel, rather than Fivetran connecting from the outside. Like hiring a trusted courier who works inside your building.\n\nConnects to: CI (deployment configs are tested)" },
  mdf: { full: "Metadata Framework", explain: "Metadata means \u2018data about data.\u2019 If your data is a library of books, metadata is the card catalog: the title, author, when it was added, how popular it is, and where to find it.\n\nThe mdf repo tracks things like: What tables exist? When was each one last updated? Who owns it? What other tables depend on it? As your platform grows to hundreds of tables, nobody can keep track of everything in their head. mdf is the system of record.\n\nConnects to: ldti / Databricks jobs (the metadata informs which processing jobs need to run)\nReceives from: plt (uses core platform utilities)" },
  "datahub-data-platform": { full: "DataHub Data Platform (dbt)", explain: "Probably the most frequently changed repo on the team! It contains dbt (data build tool) transformations \u2014 SQL recipes that turn raw, messy data into clean, organized tables that business users can actually work with.\n\nImagine raw data as crude oil. dbt is the refinery that processes it into gasoline, jet fuel, and plastics. Example SQL transformations:\n\u2022 \u2018Take the raw sales table, filter out test orders, join with customer data, create a clean sales_summary\u2019\n\u2022 \u2018Calculate monthly recurring revenue by combining subscription and payment data\u2019\n\nConnects to: CI (every SQL change is tested before touching real data)\nReceives from: datahub-projen AND data-contracts (validates outputs match contracts)" },
  "data-transformation": { full: "Data Transformation", explain: "While datahub-data-platform uses dbt (SQL-based), this repo handles transformations in Python or Spark \u2014 for when SQL isn\u2019t powerful enough.\n\nSome tasks need Python\u2019s muscle: training ML models, processing images or text, running complex statistics, or handling streaming data. Think of dbt as a food processor (great for slicing and mixing) and data-transformation as a full industrial kitchen (handles anything, more complex to operate).\n\nConnects to: CI (code changes are tested)\nReceives from: datahub-projen (project structure)" },
  "dp-service-catalog": { full: "DP Service Catalog", explain: "A directory listing every service on the data platform \u2014 what each one does, who maintains it, how to access it, and its current status. Like the building directory in a shopping mall: \u2018Data API \u2014 Floor 2, Dagster \u2014 Floor 3, Fivetran \u2014 Basement Level 1.\u2019\n\nHas NO outgoing connections \u2014 it doesn\u2019t feed into other systems. It exists as a reference for humans, not as a code dependency. It\u2019s the map on the wall, not a hallway you walk through." },
  "Notebooks & Scripts": { full: "Notebooks & Scripts", explain: "Databricks notebooks are interactive documents where data scientists write code, run it, and see results immediately \u2014 like a lab journal where you can write an experiment AND run it on the same page.\n\nUsed for exploration (\u2018let me check what this data looks like\u2019), prototyping (\u2018can I build a model that predicts churn?\u2019), and ad-hoc analysis (\u2018the CEO wants a quick number on last week\u2019s signups\u2019).\n\nConnects to: CI (even experimental notebooks go through quality checks)" },
  ldti: { full: "LDTI (Databricks Jobs)", explain: "Heavy-duty data processing jobs that run on Databricks on a set schedule or when triggered \u2014 like factory machines running by themselves through the night.\n\nWhile Notebooks & Scripts are for interactive, hands-on work (a person at the controls), ldti is for automated batch processing. Example: \u2018Every night at 2am, process all of yesterday\u2019s raw event data into summary tables.\u2019\n\nHas no outgoing connections \u2014 it\u2019s a leaf node (an endpoint). The processed results go into your data lake, but that relationship isn\u2019t shown as an arrow here.\nReceives from: mdf (the metadata framework tells it what needs processing)" },
  "Delta Tables": { full: "Delta Tables", explain: "The storage format for your data lake \u2014 like high-tech filing cabinets with superpowers.\n\nRegular data files are like stacking papers in a pile \u2014 adding is easy but finding or changing anything is messy. Delta Tables add:\n\u2022 Time travel \u2014 \u2018Show me what this table looked like last Tuesday at 3pm\u2019\n\u2022 ACID transactions \u2014 changes are all-or-nothing (no half-finished writes)\n\u2022 Schema enforcement \u2014 prevents accidentally inserting text into a number column\n\nThis repo manages Delta Table definitions and configurations.\nConnects to: CI (table definitions are tested)" },
  "ML Models": { full: "ML Models", explain: "Machine learning model code \u2014 algorithms trained to find patterns and make predictions. For example: a model predicting which customers are likely to cancel, or one recommending products based on browsing history.\n\nBuilding an ML model is like training a dog: you show it thousands of examples (\u2018this is spam, this is not spam\u2019), and eventually it learns to recognize patterns on its own. This repo holds the training code, model configs, and evaluation scripts.\n\nConnects to: CI (model code is tested and built)" },
  "dg-build-templates": { full: "Dagster Build Templates", explain: "Pre-made CI/CD pipeline recipes specifically for Dagster projects. Instead of every Dagster project writing its pipeline from scratch, they all share these templates. Like a franchise operations manual: \u2018Here\u2019s exactly how to build and deploy a Dagster project \u2014 step 1, step 2, step 3.\u2019\n\nConnects to: CI (the templates themselves are tested)" },
  "build-templates": { full: "Build Templates (General)", explain: "General-purpose templates used by ALL project types (not just Dagster). They define shared CI/CD steps like \u2018how to run lint checks,\u2019 \u2018how to build a Docker image,\u2019 or \u2018how to publish a Python package.\u2019\n\nThink of these as the company\u2019s standard operating procedures. Individual projects follow the established playbook instead of reinventing the wheel.\n\nConnects to: CI (templates are tested)" },
  "Lint & Format Check": { full: "Lint & Format Check", explain: "The very first checkpoint in CI. \u2018Linting\u2019 checks your code for mistakes and style violations \u2014 like a proofreader catching typos, inconsistent spacing, and grammar errors.\n\nExamples of what it catches: \u2018You declared a variable but never used it,\u2019 \u2018This line is 200 characters long \u2014 break it up,\u2019 or \u2018You used tabs in some places and spaces in others.\u2019\n\nWhy bother? Messy code leads to bugs, and consistent formatting makes code easier for teammates to read. Takes seconds and catches easy stuff before expensive checks run.\n\nConnects to: Unit Tests (if formatting passes, move to the next station)" },
  "Unit Tests": { full: "Unit Tests", explain: "Tests that verify each small, individual piece of code works correctly in isolation \u2014 like testing each ingredient before cooking.\n\nExample: if you have a function called calculate_tax(price, rate), tests might verify:\n\u2022 calculate_tax(100, 0.1) returns 10\n\u2022 calculate_tax(0, 0.1) returns 0\n\u2022 calculate_tax(-5, 0.1) raises an error\n\nIf any test fails, the pipeline stops immediately. The developer gets told \u2018Your code broke this specific thing,\u2019 so they can fix it before damage spreads.\n\nConnects to: Security Scan / Checkmarx" },
  "Security Scan": { full: "Security Scan (Checkmarx)", explain: "Checkmarx is a security scanning tool \u2014 like an airport X-ray machine for your code. It searches for vulnerabilities like:\n\u2022 Hardcoded passwords (\u2018oops, someone left a database password in the code\u2019)\n\u2022 SQL injection risks (where a hacker could manipulate your database)\n\u2022 Outdated libraries with known security holes\n\nSecurity problems are much cheaper to fix during development than after hackers find them in production.\n\nConnects to TWO paths (this is where the pipeline branches):\n\u2022 Package Creation \u2014 standard path for code that produces Python libraries\n\u2022 Docker Image Build \u2014 bypass path for code that only needs to be containerized (skip packaging)" },
  "Package Creation": { full: "Package Creation", explain: "Bundles your Python code into a distributable package \u2014 like shrink-wrapping a product so it can be shipped and installed elsewhere.\n\nA Python package is a standardized bundle (.whl or .tar.gz) that others can install with \u2018pip install\u2019. Example: if plt is a package, other projects do \u2018pip install plt\u2019 to use its utilities.\n\nConnects to: Artifacts (Python) \u2014 the finished package is published to the artifact repository\n\nNote: does NOT connect directly to Docker Image Build. It goes through Artifacts first. Think of it as: bake the bread (Package Creation), put it on the store shelf (Artifacts), then the sandwich shop (Docker) picks it up from the shelf." },
  "Docker Image Build": { full: "Docker Image Build", explain: "Creates a Docker image \u2014 a self-contained \u2018lunchbox\u2019 that has everything your application needs to run: code, operating system, runtime, libraries, and configuration. Like a frozen TV dinner \u2014 microwave it on any machine and you get the same result.\n\nWithout Docker, deploying code means fighting \u2018it works on my machine!\u2019 problems. With Docker, the image is identical everywhere \u2014 Dev, Staging, and Production all run the exact same lunchbox.\n\nConnects to: ACR (the built image is pushed to the container registry warehouse)\n\nReceives from three sources:\n\u2022 Security Scan (bypass path \u2014 code that skips packaging)\n\u2022 Artifacts (Python) (published packages used as dependencies)\n\u2022 data-api repo (directly, standalone containerized service)" },
  "Artifacts (Python)": { full: "Artifacts (Python)", explain: "A private \u2018app store\u2019 for your team\u2019s Python packages. When Package Creation bundles code into a package, it publishes here. Other projects can then install these packages as dependencies.\n\nExample: if plt is published to Artifacts, then when Docker Image Build creates an image for a service, it can \u2018pip install plt\u2019 from Artifacts to include platform utilities inside the Docker image.\n\nConnects to: Docker Image Build (Docker images pull published packages as dependencies)\n\nThis creates the key chain: Package Creation \u2192 Artifacts \u2192 Docker Image Build. Like a bakery that makes bread (Package Creation), stocks it on a shared shelf (Artifacts), and restaurants (Docker builds) take bread from that shelf to make sandwiches." },
  Dev: { full: "Dev Environment", explain: "The playground sandbox \u2014 a safe space where developers deploy and test freely without worrying about breaking anything that matters.\n\nImagine a sketchpad vs. a published book. Dev is the sketchpad. Scribble, erase, try wild ideas, make a mess. If something breaks, no customer is affected. Just fix it and try again.\n\nDevelopers deploy here constantly \u2014 sometimes dozens of times a day \u2014 to test features, debug issues, and verify changes work in a real (but isolated) environment.\n\nNo outgoing arrows \u2014 Dev is a destination, not a waypoint." },
  "QA/UAT": { full: "QA / User Acceptance Testing", explain: "Two types of testing happen here:\n\nQA (Quality Assurance): Technical testers ask \u2018Does it work correctly?\u2019 They click every button, test edge cases, try to break things on purpose. Like a food safety inspector checking health codes.\n\nUAT (User Acceptance Testing): Business stakeholders ask \u2018Is this what we actually asked for? Does it solve our problem?\u2019 Like a restaurant owner tasting new menu items before adding them.\n\nBoth must pass before code moves toward Staging. No explicit outgoing arrows shown." },
  "Staging-cd": { full: "Staging", explain: "The dress rehearsal. Staging mimics Production as closely as possible \u2014 same configs, similar data volumes, same infrastructure \u2014 but not serving real users.\n\nLike a band\u2019s final rehearsal at the actual concert venue: real stage, real sound system, real lights \u2014 but the doors aren\u2019t open. If anything sounds off, fix it now, not during the show.\n\nConnects to: Production (labeled \u2018Tagging\u2019 \u2014 stamping a version number like v2.3.1 before promoting, so you always know exactly which version is running and can roll back quickly)" },
  Production: { full: "Production", explain: "The live concert. Real users are watching. Real data is flowing. This is where your platform delivers actual business value.\n\nEverything upstream \u2014 all the repos, CI checks, CD environments, security scans \u2014 exists to protect this one environment. A bug in Production can mean lost revenue, broken reports, incorrect decisions, or angry customers.\n\nThat\u2019s why the arrow from Staging has \u2018Tagging\u2019 on it: only tested, reviewed, version-stamped code gets here. No shortcuts.\n\nNo outgoing arrows \u2014 Production is the final destination." },
  "Branch dep": { full: "Branch Deployments", explain: "Temporary pop-up environments for specific feature branches. When a developer opens a pull request, the system can spin up a short-lived copy so reviewers can interact with running code, not just read it.\n\nLike a pop-up shop: it appears, lets people try the product, collects feedback, and disappears once the feature is merged or rejected.\n\nNo outgoing arrows." },
  "Service Desc": { full: "Service Description (nicki sp?)", explain: "A step for documenting services as they\u2019re deployed. The \u2018(nicki sp?)\u2019 suggests this might be assigned to a team member named Nicki \u2014 and \u2018sp?\u2019 could stand for \u2018service principal\u2019 or be a question about the right approach.\n\nStill being defined \u2014 a sticky note with a question, not a fully baked process yet.\n\nNo outgoing arrows." },
  "UC-SYNC??": { full: "Unity Catalog Sync", explain: "A planned future step that would automatically sync deployment info with Unity Catalog after code reaches Production. The \u2018??\u2019 means still in brainstorming.\n\nThe idea: when you deploy a new data transformation, Unity Catalog should automatically know about new tables, updated schemas, and changed permissions. Right now that sync may be manual; UC-SYNC would automate it.\n\nNo outgoing arrows \u2014 future feature, not yet built." },
  "Runway Services": { full: "Runway Services/ApplicationSet", explain: "First stop in the top Prod deployment path. An \u2018ApplicationSet\u2019 is an ArgoCD concept \u2014 think of it as a cookie cutter.\n\nInstead of manually creating a deployment config for each of your 20+ services (tedious and error-prone), the ApplicationSet is a template that automatically stamps out configs for all of them. Write the template once, every service gets its own deployment \u2014 automatically.\n\nConnects to: RunwayProvisioner/ApplicationSet\nReceives from: argocd repo" },
  RunwayProv: { full: "RunwayProvisioner/ApplicationSet", explain: "After Runway Services identifies which services exist, RunwayProvisioner sets up the infrastructure each service needs \u2014 like a contractor who takes the architect\u2019s plans and builds the rooms.\n\nFor each service, it provisions: networking, permissions, storage, and Kubernetes resources.\n\nConnects to (branches into two paths):\n\u2022 OCI Repository/Inventory \u2014 where Kubernetes instruction files are stored\n\u2022 Kustomization/Inventory \u2014 where environment-specific customizations are stored\n\nReceives from: Runway Services/ApplicationSet" },
  "OCI Repo Inv": { full: "OCI Repository/Inventory", explain: "OCI (Open Container Initiative) is a standardized format \u2014 like PDF for documents, but for container configs. This stores your Kubernetes deployment files in that universal format.\n\n\u2018Inventory\u2019 means it\u2019s the master list \u2014 the base configs that apply to all environments. Like the default recipe, before any customization.\n\nConnects to: Kustomization/Inventory (base configs get fed into the customization engine)\nReceives from: RunwayProvisioner" },
  "Kust Inv": { full: "Kustomization/Inventory", explain: "Kustomize takes base Kubernetes configs and applies environment-specific tweaks \u2014 like taking a standard recipe and adjusting portions for a large party vs. a small dinner.\n\nExample: base config says \u2018run 2 copies of this service.\u2019 Kustomize for Production overrides to \u201810 copies,\u2019 while Dev keeps \u20182.\u2019\n\nConnects to:\n\u2022 OCI Repository/service (final per-service configs)\n\u2022 Kustomization/service (final per-service customizations)\n\nReceives from: RunwayProvisioner AND OCI Repository/Inventory" },
  "OCI Repo Svc": { full: "OCI Repository/service", explain: "The final, per-service Kubernetes deployment files \u2014 fully customized and ready to deploy. Each service gets its own set of instructions that ArgoCD reads.\n\nLike the final printed work orders handed to each team on the factory floor: \u2018Here\u2019s exactly what to build, how many, and where to put them.\u2019\n\nNo outgoing connections \u2014 ArgoCD reads these and deploys accordingly.\nReceives from: Kustomization/Inventory" },
  "Kust Svc": { full: "Kustomization/service", explain: "Per-service Kustomize overlays \u2014 the final layer of customization for each individual service. While Kustomization/Inventory handles broad environment tweaks, this handles service-specific details like CPU limits, memory allocation, environment variables, and scaling rules.\n\nLike individual adjustments for each musician in an orchestra: the violinist gets these markings, the drummer gets those settings.\n\nNo outgoing connections.\nReceives from: Kustomization/Inventory" },
  "Services AppSet": { full: "Services/ApplicationSet", explain: "Entry point for the bottom path in Prod. While the top path (Runway) handles core service deployments, this bottom path handles supporting infrastructure \u2014 secrets and data ingestion.\n\nAnother cookie-cutter ApplicationSet template that generates configs for supporting services.\n\nConnects to:\n\u2022 External Secrets/ApplicationSet (manages passwords and API keys)\n\u2022 Fivetran Agents/ApplicationSet (manages data ingestion agents)\n\nReceives from: argocd repo" },
  ExtSecrets: { full: "External Secrets/ApplicationSet", explain: "Your applications need passwords, API keys, and certificates to connect to databases and services. But you can\u2019t hardcode \u2018password123\u2019 in your code (massive security risk!).\n\nExternal Secrets solves this by automatically syncing secrets from Azure Key Vault (the digital safe) into Kubernetes. Like a librarian who takes documents from the locked vault and delivers them \u2014 securely \u2014 to the people who need them.\n\nExample: the Data API needs a database password. External Secrets fetches it from AKV and injects it into the container, so the code just references \u2018DATABASE_PASSWORD\u2019 without knowing the actual value.\n\nNo outgoing connections.\nReceives from: Services/ApplicationSet" },
  "FTA AppSet": { full: "Fivetran Agents/ApplicationSet", explain: "Manages the deployment of Fivetran Agents \u2014 the programs that pull data from external sources. It\u2019s the ArgoCD template that says \u2018deploy these agents to the fvt-nodepool.\u2019\n\nWhen the team adds a new data source: update argocd repo \u2192 Services/ApplicationSet picks it up \u2192 this generates the deployment \u2192 the actual agent starts running on fvt-nodepool below.\n\nConnects to: Fivetran Agents (long vertical arrow down \u2014 the connection from \u2018what should deploy\u2019 to \u2018where it actually runs\u2019)\nReceives from: Services/ApplicationSet" },
  "Entra???": { full: "Entra ID (Azure AD) \u2014 Planned", explain: "Microsoft Entra ID (formerly Azure Active Directory) handles who can log in to what. The \u2018???\u2019 means this integration is still being planned.\n\nThe likely plan: use Entra for authenticating users and services \u2014 \u2018only Data Engineering team members can access Production dashboards,\u2019 or \u2018only this service account can write to the data lake.\u2019\n\nNo connections yet \u2014 future item on the roadmap." },
  Unity: { full: "Unity Catalog", explain: "Databricks\u2019 unified governance layer for data and AI assets \u2014 the master catalog, access control system, and lineage tracker in one.\n\nLike the librarian for your entire data lake: knows every book (table), who checked it out (access logs), where it came from (lineage), and who\u2019s allowed to read it (permissions).\n\nAppears in three places (Prod, Dev, Staging) because each environment needs its own isolated instance. A developer in Dev can\u2019t accidentally modify Production\u2019s catalog.\n\nNo outgoing connections." },
  Dagster: { full: "Dagster (Data Pipeline Orchestrator)", explain: "The air traffic controller for data pipelines. Doesn\u2019t move data itself \u2014 decides WHEN and in WHAT ORDER jobs run, monitors progress, and alerts the team if something fails.\n\nExample: \u2018At 2am, run the Fivetran sync to pull raw data. When that finishes, trigger dbt. When that finishes, refresh the ML model. If any step fails, send a Slack alert and stop.\u2019\n\nDagster\u2019s web UI (visible in earlier screenshots) shows 125 assets with health status \u2014 like a dashboard showing every flight at an airport.\n\nRuns inside AKS. No outgoing connections shown." },
  ArgoCD: { full: "ArgoCD (Running Instance)", explain: "The actual running ArgoCD server \u2014 the robot reading deployment blueprints from Git and making the real Kubernetes cluster match.\n\nThe argocd REPO (up in Repos) is the instruction manual. This box (inside AKS) is the robot executing those instructions.\n\nContinuously monitors: \u2018Does what\u2019s running match what\u2019s in Git? No? Let me fix that.\u2019 This loop runs every few minutes, automatically healing any drift.\n\nRuns inside AKS. Powers everything in the Prod ArgoCD section above." },
  "Data API aks": { full: "Data API (Running Instance)", explain: "The live, running Data API server handling real requests inside AKS. While data-api REPO (up in Repos) contains the source code, this is the actual server processing requests.\n\nWhen someone sends \u2018GET /api/v1/sales?quarter=Q3\u2019, this is the service that receives, processes, and responds.\n\nRuns inside AKS. No outgoing connections shown." },
  Flux: { full: "Flux (GitOps Co-Pilot)", explain: "Another GitOps tool working alongside ArgoCD. While ArgoCD handles application deployments, Flux often handles cluster-level configs \u2014 Helm charts (pre-packaged Kubernetes apps) and Kustomize overlays.\n\nThink of ArgoCD as the pilot who flies the plane, and Flux as the co-pilot managing navigation and communication. They work together to keep the cluster smooth.\n\nRuns inside AKS. No outgoing connections shown." },
  "Review App": { full: "Review App (PR Preview)", explain: "When a developer opens a pull request, Review App spins up a temporary live version with those changes \u2014 so reviewers can click around and test running code, not just read it on screen.\n\nLike a movie studio creating a quick trailer before committing to the full film. The reviewer watches the trailer, gives feedback, the director adjusts.\n\nThe orange color marks it as a notable or relatively new feature.\n\nRuns inside AKS. No outgoing connections shown." },
  "Fivetran Agents": { full: "Fivetran Agents (Running)", explain: "The actual Fivetran Agent programs running on dedicated fvt-nodepool servers. These workers connect to your company\u2019s data sources and pull data into the platform.\n\nEach agent typically handles one source: one pulls from Salesforce, another from an on-premises SQL database, another from Google Analytics. They run on dedicated servers so they don\u2019t compete with other services for resources.\n\nNo outgoing connections.\nReceives deployment from: Fivetran Agents/ApplicationSet in Prod (the long vertical arrow from above)" },
  AKV: { full: "Azure Key Vault", explain: "A digital safe deposit box on Azure. Stores your most sensitive secrets \u2014 database passwords, API keys, encryption certificates \u2014 and strictly controls who can access them.\n\nInstead of putting passwords in config files (risky!), apps request secrets from AKV at runtime. Only authorized services can read specific secrets, and every access is logged.\n\nLike a hotel safe: each guest (service) gets their own code, and the hotel (AKV) records every time it\u2019s opened.\n\nNo connections shown in this diagram, but External Secrets (in Prod) syncs secrets FROM here into Kubernetes." },
  "Storage Accounts": { full: "Azure Storage Accounts", explain: "Bulk cloud storage \u2014 an infinitely expandable warehouse for any kind of data: raw files, processed results, backups, logs, images, CSVs, Parquet files, and more.\n\nYour data lake\u2019s underlying files (including Delta Tables) are stored here. Think of it as the land your buildings sit on \u2014 all other services read from and write to these accounts.\n\nDifferent storage types (Blob, Data Lake Gen2, Table, Queue) serve different purposes, but they all live under \u2018Storage Accounts.\u2019\n\nNo connections shown in this diagram, but virtually every other service depends on it behind the scenes." },
};

const CW = 1580;
const CH = 950;

const areas = [
  { id: "repos",      x: 16,  y: 30,  w: 620, h: 395, label: "Azure DevOps Repositories", blue: false },
  { id: "pipelines",  x: 16,  y: 440, w: 620, h: 500, label: "Azure Pipelines", blue: false },
  { id: "ci",         x: 26,  y: 470, w: 600, h: 165, label: "CI", blue: false },
  { id: "cd",         x: 26,  y: 650, w: 600, h: 100, label: "CD", blue: true },
  { id: "prod",       x: 656, y: 30,  w: 550, h: 395, label: "Prod", blue: false },
  { id: "dev",        x: 1226,y: 30,  w: 130, h: 195, label: "Dev", blue: false },
  { id: "staging",    x: 1226,y: 245, w: 130, h: 180, label: "Staging", blue: false },
  { id: "azpDp001",   x: 656, y: 440, w: 550, h: 500, label: "AZP-DP001", blue: false },
  { id: "aks",        x: 676, y: 490, w: 260, h: 220, label: "AKS", blue: false },
  { id: "fvtNodepool",x: 956, y: 490, w: 130, h: 220, label: "fvt-nodepool", blue: false },
  { id: "acr",        x: 676, y: 730, w: 400, h: 55,  label: "ACR", blue: false },
];

interface NodePosition { x: number; y: number; w: number; h: number }

const N: Record<string, NodePosition> = {
  "uc-catalog-ent":        { x: 30,  y: 58,  w: 98,  h: 40 },
  "datahub-projen":        { x: 180, y: 58,  w: 105, h: 40 },
  plt:                     { x: 370, y: 58,  w: 65,  h: 40 },
  "data-contracts":        { x: 480, y: 58,  w: 98,  h: 40 },
  argocd:                  { x: 555, y: 120, w: 72,  h: 38 },
  "data-api":              { x: 480, y: 120, w: 68,  h: 34 },
  "fivetran-connection":   { x: 48,  y: 175, w: 104, h: 40 },
  "dp-aks-fivetran-agents":{ x: 165, y: 175, w: 104, h: 40 },
  mdf:                     { x: 282, y: 175, w: 62,  h: 40 },
  "datahub-data-platform": { x: 358, y: 168, w: 115, h: 50 },
  "data-transformation":   { x: 490, y: 175, w: 104, h: 40 },
  "dp-service-catalog":    { x: 30,  y: 280, w: 104, h: 40 },
  "Notebooks & Scripts":   { x: 165, y: 280, w: 104, h: 40 },
  ldti:                    { x: 282, y: 280, w: 92,  h: 40 },
  "Delta Tables":          { x: 390, y: 280, w: 88,  h: 40 },
  "ML Models":             { x: 492, y: 280, w: 88,  h: 40 },
  "dg-build-templates":    { x: 422, y: 348, w: 98,  h: 38 },
  "build-templates":       { x: 530, y: 348, w: 92,  h: 38 },
  "Lint & Format Check":   { x: 34,  y: 506, w: 92,  h: 50 },
  "Unit Tests":            { x: 138, y: 506, w: 82,  h: 50 },
  "Security Scan":         { x: 232, y: 506, w: 92,  h: 50 },
  "Package Creation":      { x: 336, y: 506, w: 92,  h: 50 },
  "Docker Image Build":    { x: 440, y: 506, w: 92,  h: 50 },
  "Artifacts (Python)":    { x: 544, y: 506, w: 76,  h: 50 },
  Dev:                     { x: 34,  y: 670, w: 60,  h: 36 },
  "QA/UAT":                { x: 106, y: 670, w: 66,  h: 36 },
  "Staging-cd":            { x: 184, y: 670, w: 60,  h: 36 },
  Production:              { x: 282, y: 670, w: 74,  h: 36 },
  "Branch dep":            { x: 366, y: 670, w: 70,  h: 36 },
  "Service Desc":          { x: 446, y: 670, w: 72,  h: 36 },
  "UC-SYNC??":             { x: 528, y: 670, w: 66,  h: 36 },
  "Runway Services":       { x: 690, y: 78,  w: 125, h: 44 },
  RunwayProv:              { x: 855, y: 78,  w: 125, h: 44 },
  "OCI Repo Inv":          { x: 925, y: 36,  w: 108, h: 34 },
  "Kust Inv":              { x: 870, y: 150, w: 108, h: 34 },
  "OCI Repo Svc":          { x: 1070,y: 100, w: 108, h: 34 },
  "Kust Svc":              { x: 1070,y: 150, w: 108, h: 34 },
  "Services AppSet":       { x: 690, y: 225, w: 115, h: 42 },
  ExtSecrets:              { x: 835, y: 225, w: 115, h: 42 },
  "FTA AppSet":            { x: 690, y: 315, w: 118, h: 42 },
  "Entra???":              { x: 850, y: 315, w: 82,  h: 40 },
  Unity_prod:              { x: 975, y: 315, w: 68,  h: 40 },
  Unity_dev:               { x: 1260,y: 102, w: 68,  h: 40 },
  Unity_stg:               { x: 1260,y: 312, w: 68,  h: 40 },
  Dagster:                 { x: 700, y: 535, w: 88,  h: 42 },
  ArgoCD:                  { x: 802, y: 535, w: 88,  h: 42 },
  "Data API aks":          { x: 700, y: 598, w: 88,  h: 42 },
  Flux:                    { x: 802, y: 598, w: 88,  h: 42 },
  "Review App":            { x: 872, y: 498, w: 58,  h: 32 },
  "Fivetran Agents":       { x: 978, y: 575, w: 92,  h: 44 },
  AKV:                     { x: 1108,y: 515, w: 80,  h: 40 },
  "Storage Accounts":      { x: 1108,y: 585, w: 80,  h: 50 },
};

interface Connection { from: string; to: string; type: string }

const connections: Connection[] = [
  { from: "datahub-projen", to: "fivetran-connection", type: "dep" },
  { from: "datahub-projen", to: "datahub-data-platform", type: "dep" },
  { from: "datahub-projen", to: "data-transformation", type: "dep" },
  { from: "datahub-projen", to: "data-contracts", type: "dep" },
  { from: "plt", to: "mdf", type: "dep" },
  { from: "plt", to: "ci-entry", type: "repo-ci" },
  { from: "data-contracts", to: "plt", type: "dep" },
  { from: "data-contracts", to: "datahub-data-platform", type: "dep" },
  { from: "data-api", to: "Docker Image Build", type: "repo-ci" },
  { from: "argocd", to: "Runway Services", type: "argo" },
  { from: "argocd", to: "Services AppSet", type: "argo" },
  { from: "mdf", to: "ldti", type: "dep" },
  { from: "uc-catalog-ent", to: "ci-entry", type: "repo-ci" },
  { from: "fivetran-connection", to: "ci-entry", type: "repo-ci" },
  { from: "dp-aks-fivetran-agents", to: "ci-entry", type: "repo-ci" },
  { from: "datahub-data-platform", to: "ci-entry", type: "repo-ci" },
  { from: "data-transformation", to: "ci-entry", type: "repo-ci" },
  { from: "Notebooks & Scripts", to: "ci-entry", type: "repo-ci" },
  { from: "Delta Tables", to: "ci-entry", type: "repo-ci" },
  { from: "ML Models", to: "ci-entry", type: "repo-ci" },
  { from: "dg-build-templates", to: "ci-entry", type: "repo-ci" },
  { from: "build-templates", to: "ci-entry", type: "repo-ci" },
  { from: "Lint & Format Check", to: "Unit Tests", type: "ci" },
  { from: "Unit Tests", to: "Security Scan", type: "ci" },
  { from: "Security Scan", to: "Package Creation", type: "ci" },
  { from: "Security Scan", to: "Docker Image Build", type: "ci-skip" },
  { from: "Package Creation", to: "Artifacts (Python)", type: "ci" },
  { from: "Artifacts (Python)", to: "Docker Image Build", type: "ci-blue" },
  { from: "Docker Image Build", to: "acr-target", type: "acr" },
  { from: "ci-area-bottom", to: "cd-area-top", type: "ci-cd" },
  { from: "Staging-cd", to: "Production", type: "cd" },
  { from: "Runway Services", to: "RunwayProv", type: "prod" },
  { from: "RunwayProv", to: "OCI Repo Inv", type: "prod" },
  { from: "RunwayProv", to: "Kust Inv", type: "prod" },
  { from: "OCI Repo Inv", to: "Kust Inv", type: "prod" },
  { from: "Kust Inv", to: "OCI Repo Svc", type: "prod" },
  { from: "Kust Inv", to: "Kust Svc", type: "prod" },
  { from: "Services AppSet", to: "ExtSecrets", type: "prod" },
  { from: "Services AppSet", to: "FTA AppSet", type: "prod" },
  { from: "FTA AppSet", to: "Fivetran Agents", type: "fvt" },
];

const ciEntryPoint = { x: 310, y: 470, w: 4, h: 4 };
const ciBottom = { x: 310, y: 635, w: 4, h: 4 };
const cdTop = { x: 310, y: 650, w: 4, h: 4 };
const acrTarget = { x: 676, y: 750, w: 10, h: 10 };

function cx(n: NodePosition) { return n.x + n.w / 2; }
function cy(n: NodePosition) { return n.y + n.h / 2; }
function bot(n: NodePosition) { return n.y + n.h; }
function top_(n: NodePosition) { return n.y; }
function right_(n: NodePosition) { return n.x + n.w; }
function left_(n: NodePosition) { return n.x; }

function getNode(id: string): NodePosition | undefined {
  if (id === "ci-entry") return ciEntryPoint;
  if (id === "ci-area-bottom") return ciBottom;
  if (id === "cd-area-top") return cdTop;
  if (id === "acr-target") return acrTarget;
  return N[id];
}

function buildPath(conn: Connection): string | null {
  const f = getNode(conn.from);
  const t = getNode(conn.to);
  if (!f || !t) return null;

  const dx = cx(t) - cx(f);
  const dy = cy(t) - cy(f);

  if (conn.type === "ci") {
    return `M${right_(f)},${cy(f)} L${left_(t)},${cy(t)}`;
  }
  if (conn.type === "ci-skip") {
    const x1 = cx(f), y1 = top_(f);
    const x2 = cx(t), y2 = top_(t);
    const arcY = y1 - 30;
    return `M${x1},${y1} C${x1},${arcY} ${x2},${arcY} ${x2},${y2}`;
  }
  if (conn.type === "ci-blue") {
    const x1 = cx(f), y1 = top_(f);
    const x2 = cx(t), y2 = top_(t);
    const arcY = y1 - 45;
    return `M${x1},${y1} C${x1},${arcY} ${x2},${arcY} ${x2},${y2}`;
  }
  if (conn.type === "ci-cd") {
    return `M${cx(f)},${cy(f)} L${cx(t)},${cy(t)}`;
  }
  if (conn.type === "cd") {
    return `M${right_(f)},${cy(f)} L${left_(t)},${cy(t)}`;
  }
  if (conn.type === "dep") {
    if (Math.abs(dy) < 15 && Math.abs(dx) > 30) {
      const x1 = dx > 0 ? right_(f) : left_(f);
      const x2 = dx > 0 ? left_(t) : right_(t);
      const mx = (x1 + x2) / 2;
      return `M${x1},${cy(f)} C${mx},${cy(f)} ${mx},${cy(t)} ${x2},${cy(t)}`;
    }
    const x1 = cx(f), y1 = bot(f);
    const x2 = cx(t), y2 = top_(t);
    const my = (y1 + y2) / 2;
    return `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
  }
  if (conn.type === "repo-ci") {
    const x1 = cx(f), y1 = bot(f);
    const x2 = cx(t), y2 = top_(t);
    const my = (y1 + y2) / 2;
    return `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
  }
  if (conn.type === "argo") {
    const x1 = right_(f), y1 = cy(f);
    const x2 = left_(t), y2 = cy(t);
    const mx = (x1 + x2) / 2;
    return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
  }
  if (conn.type === "prod") {
    if (Math.abs(dx) > Math.abs(dy) * 0.4) {
      const x1 = right_(f), y1 = cy(f);
      const x2 = left_(t), y2 = cy(t);
      const mx = (x1 + x2) / 2;
      return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
    }
    const x1 = cx(f), y1 = dy > 0 ? bot(f) : top_(f);
    const x2 = cx(t), y2 = dy > 0 ? top_(t) : bot(t);
    const my = (y1 + y2) / 2;
    return `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
  }
  if (conn.type === "fvt") {
    return `M${cx(f)},${bot(f)} L${cx(t)},${top_(t)}`;
  }
  if (conn.type === "acr") {
    const x1 = cx(f), y1 = bot(f);
    return `M${x1},${y1} L${x1},${cy(t)} L${left_(t)},${cy(t)}`;
  }
  return null;
}

const typeColors: Record<string, { stroke: string; width: number; dash?: string }> = {
  ci:        { stroke: "#16A34A", width: 2.2 },
  "ci-skip": { stroke: "#6B7280", width: 1.5, dash: "6,3" },
  "ci-blue": { stroke: "#2563EB", width: 2.2 },
  "ci-cd":   { stroke: "#6B7280", width: 1.5 },
  cd:        { stroke: "#3B82F6", width: 2 },
  dep:       { stroke: "#9CA3AF", width: 1.3 },
  "repo-ci": { stroke: "#9CA3AF", width: 1 },
  argo:      { stroke: "#DC2626", width: 1.8 },
  prod:      { stroke: "#6B7280", width: 1.5 },
  fvt:       { stroke: "#EA580C", width: 1.8 },
  acr:       { stroke: "#6B7280", width: 1.2 },
};

export default function PipelineFinal() {
  const [selected, setSelected] = useState<string | null>(null);
  const [areaPanel, setAreaPanel] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const info = selected ? nodeInfo[selected] : null;
  const area = areaPanel ? areaInfo[areaPanel] : null;
  const closePanel = useCallback(() => { setSelected(null); setAreaPanel(null); }, []);

  const hovSet = new Set<string>();
  if (hovered) {
    connections.forEach(c => {
      if (c.from === hovered || c.to === hovered) hovSet.add(`${c.from}\u2192${c.to}`);
    });
  }

  function renderNode(id: string, label: string, isSticky = true, isOrange = false) {
    const n = N[id];
    if (!n) return null;
    const isSel = selected === id;
    const isHov = hovered === id;
    const bg = isSticky ? (isOrange ? "#FDBA74" : "#FDE68A") : "#FFF";
    const bc = isSel ? "#2563EB" : isHov ? "#3B82F6" : (isSticky ? (isOrange ? "#E67E22" : "#D4A017") : "#999");
    return (
      <div key={id} style={{
        position: "absolute", left: n.x, top: n.y, width: n.w, height: n.h,
        background: bg, border: `${isSel ? 2.5 : 1.5}px solid ${bc}`,
        borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: n.w < 70 ? "7.5px" : n.w < 95 ? "8.5px" : "9px",
        fontWeight: 600, color: isSticky ? "#5C3A00" : "#1F2937",
        cursor: "pointer", padding: "2px 4px", textAlign: "center", lineHeight: 1.2,
        zIndex: 10, whiteSpace: "pre-line",
        boxShadow: isSel ? "0 0 0 2.5px #93C5FD" : isHov ? "0 2px 8px rgba(59,130,246,0.25)" : "0 1px 2px rgba(0,0,0,0.06)",
        transition: "all 0.15s", fontFamily: "inherit",
      }}
        onClick={e => { e.stopPropagation(); setSelected(isSel ? null : id); setAreaPanel(null); }}
        onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)}
      >{label}</div>
    );
  }

  return (
    <div style={{ fontFamily: "'IBM Plex Sans','Segoe UI',sans-serif", background: "#EDE9E0", minHeight: "100vh", padding: "8px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:6px;height:6px;}::-webkit-scrollbar-thumb{background:#BBB;border-radius:3px;}`}</style>

      <div style={{ textAlign: "center", marginBottom: "6px" }}>
        <h1 style={{ fontSize: "14px", fontWeight: 700, color: "#1F2937" }}>Data Platform Pipeline &mdash; Interactive Map (Corrected from Excel)</h1>
        <p style={{ fontSize: "10px", color: "#6B7280" }}>Hover to highlight connections &bull; Click any node or area label for explanations &bull; All connections verified from source spreadsheet</p>
      </div>

      <div style={{
        position: "relative", width: CW, height: CH,
        margin: "0 auto", overflow: "auto",
        background: "#F5F3EE", borderRadius: 8, border: "1px solid #D1D5DB",
      }}>
        <svg width={CW} height={CH} style={{ position: "absolute", top: 0, left: 0, zIndex: 5, pointerEvents: "none" }}>
          <defs>
            {Object.entries(typeColors).map(([type, cfg]) => (
              <marker key={type} id={`ah-${type}`} viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto-start-reverse">
                <path d="M0,0 L10,3.5 L0,7 Z" fill={cfg.stroke} />
              </marker>
            ))}
          </defs>
          {connections.map((conn, i) => {
            const path = buildPath(conn);
            if (!path) return null;
            const key = `${conn.from}\u2192${conn.to}`;
            const cfg = typeColors[conn.type] || typeColors.dep;
            const isHL = hovSet.has(key);
            const opacity = hovered ? (isHL ? 1 : 0.08) : 0.45;
            return (
              <path key={i} d={path} fill="none"
                stroke={cfg.stroke}
                strokeWidth={isHL ? cfg.width + 1 : cfg.width}
                strokeOpacity={opacity}
                strokeDasharray={cfg.dash || "none"}
                markerEnd={`url(#ah-${conn.type})`}
                style={{ transition: "stroke-opacity 0.2s, stroke-width 0.2s" }}
              />
            );
          })}
        </svg>

        {areas.map(a => (
          <div key={a.id} style={{
            position: "absolute", left: a.x, top: a.y, width: a.w, height: a.h,
            background: a.blue ? "rgba(219,234,254,0.25)" : "#FFFFFF",
            border: a.blue ? "2px solid #60A5FA" : "1.5px solid #D1D5DB",
            borderRadius: 6, zIndex: 1,
          }}>
            <button onClick={e => { e.stopPropagation(); setAreaPanel(areaPanel === a.id ? null : a.id); setSelected(null); }}
              style={{ position: "absolute", top: 3, left: 8, background: "none", border: "none",
                fontSize: "10px", fontWeight: 700, color: "#6B7280", cursor: "pointer",
                fontFamily: "inherit", display: "flex", alignItems: "center", gap: 3,
                padding: "2px 4px", borderRadius: 3,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F3F4F6")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >{a.label} <span style={{ fontSize: "7px", opacity: 0.5 }}>{"\u24D8"}</span></button>
          </div>
        ))}

        {renderNode("uc-catalog-ent", "uc-catalog-ent")}
        {renderNode("datahub-projen", "datahub-projen")}
        {renderNode("plt", "plt")}
        {renderNode("data-contracts", "data-contracts")}
        {renderNode("argocd", "argocd")}
        {renderNode("data-api", "data-api")}
        {renderNode("fivetran-connection", "fivetran-connection")}
        {renderNode("dp-aks-fivetran-agents", "dp-aks-\nfivetran-agents")}
        {renderNode("mdf", "mdf")}
        {renderNode("datahub-data-platform", "datahub-data-\nplatform (dbt)")}
        {renderNode("data-transformation", "data-\ntransformation")}
        {renderNode("dp-service-catalog", "dp-service-\ncatalog")}
        {renderNode("Notebooks & Scripts", "Notebooks\n& Scripts")}
        {renderNode("ldti", "ldti (uses\nDatabricks jobs)")}
        {renderNode("Delta Tables", "Delta Tables")}
        {renderNode("ML Models", "ML Models")}
        {renderNode("dg-build-templates", "dg-build-\ntemplates")}
        {renderNode("build-templates", "build-\ntemplates")}
        {renderNode("Lint & Format Check", "Lint &\nFormat Check")}
        {renderNode("Unit Tests", "Unit Tests")}
        {renderNode("Security Scan", "Security Scan /\nCheckmarx")}
        {renderNode("Package Creation", "Package\nCreation")}
        {renderNode("Docker Image Build", "Docker Image\nBuild")}
        {renderNode("Artifacts (Python)", "Artifacts\n(Python)")}
        {renderNode("Dev", "Dev")}
        {renderNode("QA/UAT", "QA/UAT")}
        {renderNode("Staging-cd", "Staging")}
        {renderNode("Production", "Production")}
        {renderNode("Branch dep", "Branch\ndeploy")}
        {renderNode("Service Desc", "Service Desc\n(nicki sp?)")}
        {renderNode("UC-SYNC??", "UC-SYNC??")}

        <div style={{ position: "absolute", left: 248, top: 678, fontSize: "8px", color: "#6B7280", fontStyle: "italic", zIndex: 12 }}>Tagging &rarr;</div>

        {renderNode("Runway Services", "Runway Services/\nApplicationSet", false)}
        {renderNode("RunwayProv", "RunwayProvisioner/\nApplicationSet", false)}
        {renderNode("OCI Repo Inv", "OCI Repository/\nInventory", false)}
        {renderNode("Kust Inv", "Kustomization/\nInventory", false)}
        {renderNode("OCI Repo Svc", "OCI Repository/\nservice", false)}
        {renderNode("Kust Svc", "Kustomization/\nservice", false)}
        {renderNode("Services AppSet", "Services/\nApplicationSet", false)}
        {renderNode("ExtSecrets", "External Secrets/\nApplicationSet", false)}
        {renderNode("FTA AppSet", "Fivetran Agents/\nApplicationSet", false)}
        {renderNode("Entra???", "Entra???", true)}
        {renderNode("Unity_prod", "Unity", false)}
        {renderNode("Unity_dev", "Unity", false)}
        {renderNode("Unity_stg", "Unity", false)}
        {renderNode("Dagster", "Dagster", false)}
        {renderNode("ArgoCD", "ArgoCD", false)}
        {renderNode("Data API aks", "Data API", false)}
        {renderNode("Flux", "Flux", false)}
        {renderNode("Review App", "Review App", true, true)}
        {renderNode("Fivetran Agents", "Fivetran Agents", false)}
        {renderNode("AKV", "AKV", false)}
        {renderNode("Storage Accounts", "Storage\nAccounts", false)}

        <div style={{ position: "absolute", left: 700, top: 746, fontSize: "8px", color: "#999", zIndex: 10 }}>
          Docker images pushed here from CI &rarr; pulled by AKS
        </div>
      </div>

      <div style={{ maxWidth: CW, margin: "6px auto 0", display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", fontSize: "9px", color: "#6B7280" }}>
        {[
          { color: "#16A34A", w: 2.2, label: "CI chain", dash: false },
          { color: "#6B7280", w: 1.5, label: "CI bypass (skip step)", dash: true },
          { color: "#2563EB", w: 2.2, label: "Artifacts \u2192 Docker (dep loop)", dash: false },
          { color: "#3B82F6", w: 2, label: "CD: Staging \u2192 Prod", dash: false },
          { color: "#DC2626", w: 1.8, label: "argocd \u2192 Prod", dash: false },
          { color: "#6B7280", w: 1.5, label: "Prod internal", dash: false },
          { color: "#EA580C", w: 1.8, label: "Fivetran deploy", dash: false },
          { color: "#9CA3AF", w: 1, label: "Repo dependencies / Repo \u2192 CI", dash: false },
        ].map(l => (
          <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <svg width="20" height="6"><line x1="0" y1="3" x2="20" y2="3" stroke={l.color} strokeWidth={l.w} strokeDasharray={l.dash ? "4,2" : "none"} /></svg>
            {l.label}
          </span>
        ))}
      </div>

      {(info || area) && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "#FFF", borderTop: "2.5px solid #3B82F6",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.12)",
          padding: "14px 20px 18px", zIndex: 999,
          maxHeight: "42vh", overflowY: "auto",
          animation: "slideUp 0.2s ease",
        }}>
          <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
          <button onClick={closePanel} style={{
            position: "absolute", top: 8, right: 12,
            background: "#F3F4F6", border: "none", borderRadius: "50%",
            width: 26, height: 26, cursor: "pointer", fontSize: 13,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{"\u2715"}</button>
          {info && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ background: "#FDE68A", padding: "2px 8px", borderRadius: 3, fontSize: 10, fontWeight: 700, color: "#78350F" }}>NODE</span>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1F2937" }}>{info.full}</h3>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.75, color: "#374151", maxWidth: 720, whiteSpace: "pre-line" }}>{info.explain}</p>
            </>
          )}
          {area && !info && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ background: "#DBEAFE", padding: "2px 8px", borderRadius: 3, fontSize: 10, fontWeight: 700, color: "#1D4ED8" }}>AREA</span>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1F2937" }}>{area.title}</h3>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.75, color: "#374151", maxWidth: 720, whiteSpace: "pre-line" }}>{area.explain}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
