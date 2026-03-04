# Skills and Modules Guide

This guide describes the skills, automation utilities, and architectural modules used in **TaskFlow AI**, the Next.js + Firebase productivity workspace.

---

## Overview

| Type | Purpose | Location |
|------|---------|----------|
| **Skills** | Reusable guidance and automation scripts for developers | `.claude/skills/` |
| **Modules** | Core application domains and helpers | `src/` |

---

## Skills

Skills are lightweight packages that provide documentation, patterns, or scripts. They are invoked automatically based on context or can be run explicitly.

### Invoking a Skill

Run `/skill-name` from the chat interface or execute a provided script from the workspace. For example:

```
/nextjs-16-skill          # get App Router guidance
/python-best-practices    # review Python code
```

### Key Skills in This Project

#### 1. `nextjs-16-skill`
**Purpose**: Provide patterns and best practices for Next.js 16 (App Router).

**When to use**: Creating pages/route groups, using Server/Client Components, implementing Server Actions, handling authentication, and deploying on Vercel.

**Notes**: This is guidance-only; no automation scripts are included.

---

#### 2. `firebase-web-skill`
**Purpose**: Document Firebase Studio conventions used by TaskFlow AI.

**When to use**: Integrating Firestore rules, client provider setup, authentication flows, and hosting configuration.

**Location**: `src/firebase/` and `firestore.rules`.

---

#### 3. `genkit-skill`
**Purpose**: Assist with AI prompt design and Genkit integration (used for task extraction and other NLP workflows).

**When to use**: Adding or modifying prompt templates under `src/ai/`, adjusting model settings in `genkit.ts`.

---

#### 4. `tailwind-css-skill`
**Purpose**: Tailwind CSS utilities and design tokens ("Midnight Navy" theme).

**When to use**: Styling components under `src/components/` and `app/`; consult `tailwind.config.ts` for theme values.

---

#### 5. `github-actions-skill`
**Purpose**: Generate and validate CI/CD workflow files.

**Scripts**:

| Script | Usage | Description |
|--------|-------|-------------|
| `generate_workflow.py` | `python scripts/generate_workflow.py ci --path .github/workflows/` | Scaffold common pipelines |
| `validate_workflow.py` | `python scripts/validate_workflow.py --all` | Check YAML syntax and required steps |

**Common workflows**: `ci`, `deploy` (Firebase/Vercel), `docker`, `release`.

---

#### 6. `testing-patterns`
**Purpose**: Demonstrate testing conventions (Jest, React Testing Library) even though most tests live under `__tests__` in the repo.

**When to use**: Generating new test templates, running coverage scripts.

---

#### 7. `python-best-practices`
**Purpose**: General Python guidelines for any auxiliary scripts or backend tooling (used sparingly in this project).

---

## Modules

The source tree is organized into domain‑specific folders. Key modules include:

- `app/` – Next.js entry points, layouts, and pages
- `components/` – Reusable React components, with `components/ui/` holding design-system primitives
- `ai/` – Genkit helpers and prompt templates for AI features
- `firebase/` – Client provider, configuration, helpers, and Firestore listeners
- `hooks/` – Custom React hooks (e.g. `use-toast`, `use-mobile`)
- `lib/` – Utility functions and static assets (e.g. placeholder images)
- `src/` – top‑level alias used throughout imports

Each directory follows the standard Next.js conventions where applicable.

---

## Architectural Overview

TaskFlow AI is a single–page application built with Next.js 16 App Router and Firebase as the backend. The core flow is:

1. **User interface** – React components styled with Tailwind under `app/` and `components/`.
2. **State & hooks** – Custom hooks manage authentication, toasts, and responsive behaviour.
3. **AI** – `ai/genkit.ts` encapsulates prompt calls; results drive task creation and categorization.
4. **Firebase** – Auth and Firestore providers in `firebase/` handle persistence and real‑time updates.

The project does **not** use the multi-agent CLI architecture found in earlier prototypes; instead, it relies on modular React/Firebase patterns.

---

## Quick Reference

### Running Skill Scripts

Most automation lives in `.claude/skills/<skill>/scripts/`:

```bash
# Generate CI workflow
python .claude/skills/github-actions-skill/scripts/generate_workflow.py ci --path .github/workflows/

# Run Python tests if any
python .claude/skills/testing-patterns/scripts/run_tests.py --unit
```

### Build & Development

```bash
npm install            # install dependencies
npm run dev            # start Next.js dev server
npm run lint           # run ESLint
npm run format         # run Prettier
npm run build          # production build
npm run start          # serve built app
```

> **Note:** Deployment is managed via Firebase/Vercel; check `firebase.json` and `next.config.ts`.

---

## References

- `docs/MASTER_PROMPT.md` – blueprint for the AI features
- `firestore.rules` – security rules for Firestore
- `next.config.ts` and `tailwind.config.ts` – framework configuration

````}]}]}}}]}{
**When to use**: Implementing CRUD operations, validation logic, business rules

---

#### 3. `storage-handler-agent`
**Role**: Data persistence layer

**Actions Handled**:
| Action | Description |
|--------|-------------|
| `storage_save` | Save task (auto-generates ID) |
| `storage_get` | Retrieve task by ID |
| `storage_delete` | Remove task |
| `storage_list` | List all tasks |
| `storage_query` | Query with filters |

**When to use**: Implementing storage backends, handling data integrity, planning migrations

---

#### 4. `ui-controller-agent`
**Role**: Console UI with Rich library

**Actions Handled**:
| Action | Description |
|--------|-------------|
| `ui_show_menu` | Display main menu |
| `ui_show_tasks` | Show task list table |
| `ui_show_message` | Display info/error messages |
| `ui_confirm` | Yes/no confirmation prompt |
| `ui_get_input` | Text input prompt |
| `ui_get_choice` | Menu selection |

**When to use**: Building console displays, implementing user prompts, formatting output

---

#### 5. `github-workflow-agent`
**Role**: GitHub Actions CI/CD specialist

**When to use**: Setting up pipelines, automating tests, configuring deployments, managing secrets

---

#### 6. `nextjs-expert-agent`
**Role**: Next.js 16 development specialist

**When to use**: App Router patterns, Server/Client Components, Server Actions, Better Auth

---

#### 7. `ui-ux-design-agent`
**Role**: Interface design specialist

**When to use**: Designing interfaces, improving UX, accessibility, design systems

---

#### 8. `project-structure-agent`
**Role**: Codebase organization specialist

**When to use**: Setting up projects, refactoring folder structure, planning features

---

## Multi-Agent Architecture

```
                    ┌─────────────────┐
                    │  Orchestrator   │
                    │     Agent       │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  Task Manager   │ │    Storage      │ │  UI Controller  │
│     Agent       │ │    Agent        │ │     Agent       │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Message Flow

1. User request → Orchestrator
2. Orchestrator routes by action prefix:
   - `task_*` → Task Manager Agent
   - `storage_*` → Storage Agent
   - `ui_*` → UI Controller Agent
3. Agent processes and returns response
4. Orchestrator returns result to user

---

## Quick Reference

### Running Skill Scripts

All skill scripts are located in `.claude/skills/<skill-name>/scripts/`:

```bash
# Testing
python .claude/skills/testing-patterns/scripts/run_tests.py

# FastAPI
python .claude/skills/fastapi-skill/scripts/create_app.py my_app --path src/

# GitHub Actions
python .claude/skills/github-actions-skill/scripts/generate_workflow.py ci

# Skill Creation
python .claude/skills/skill-creator/scripts/init_skill.py my-skill --path .claude/skills/
```

### Skills Without Scripts

These skills provide guidance only (no automation needed):
- `python-best-practices` - Coding patterns
- `agent-communication` - Protocol patterns
- `nextjs-16-skill` - Framework patterns
- `ui-design-skill` - Design patterns
