<!--
================================================================================
SYNC IMPACT REPORT
================================================================================
Version change: 0.0.0 → 1.0.0 (MAJOR: Initial constitution creation)
Ratified: 2025-12-26
Last Amended: 2025-12-26

Modified principles:
  - N/A (Initial creation)

Added sections:
  - 8 Core Principles (Agent Architecture, Skill Reusability, Separation of Concerns,
    Evolution Strategy, Testing Standards, Code Quality, Error Handling, Spec-Driven Development)
  - Phase Evolution Roadmap
  - Technology Stack Standards
  - Governance Rules

Removed sections:
  - N/A (Initial creation)

Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ Compatible (Constitution Check section exists)
  - .specify/templates/spec-template.md: ✅ Compatible (User stories/acceptance criteria aligned)
  - .specify/templates/tasks-template.md: ✅ Compatible (Phase-based structure matches evolution)

Follow-up TODOs:
  - None (All placeholders resolved)
================================================================================
-->

# TaskFlow AI Application Constitution

This constitution governs the architecture, quality, and evolution of **TaskFlow AI**, a Next.js 16 single‑page application backed by Firebase and enhanced with Genkit-powered AI features.

## Core Principles

### I. Application Architecture

**Modular Next.js Design**
- The project uses the App Router structure; each route group encapsulates related pages, components, and server actions.
- Server components handle data fetching and business logic; client components manage interactivity and state.
- Shared UI primitives live in `components/ui/` and are styled via Tailwind.
- Code should be organized to minimize bundle size and enable selective SSR/SSG.

**Firebase Integration**
- Authentication and Firestore are configured via the `firebase/` module.
- All access to Firebase services must go through the `useFirebase` hook or context providers.
- Security rules are defined in `firestore.rules` and reviewed with every schema change.
- Emulators are used for local development; scripts for starting them are documented in `package.json`.

**AI & Genkit**
- Prompts and model interactions are centralized in `ai/genkit.ts`.
- Task extraction, suggestion, and categorization features rely on Genkit templates under `ai/`.
- Any new AI workflows must include explicit prompt versioning and deployment notes.

**Design System**
- Tailwind configuration (`tailwind.config.ts`) defines the "Midnight Navy" theme and design tokens.
- Components must be responsive and accessible (WCAG AA) by default.
- Styling should favour utility classes; custom CSS is discouraged unless global.

### II. Development Standards

**TypeScript & Linting**
- The codebase uses TypeScript with `strict` mode enabled.
- ESLint (with Next.js and Tailwind plugins) and Prettier enforce style.
- No `any` types allowed; use `unknown` and refine or add explicit interfaces.

**Testing**
- Unit tests reside alongside components or in `__tests__` folders using Jest and React Testing Library.
- Integration tests cover Firebase interactions via the emulator.
- End-to-end tests use Playwright against the running `npm run dev` server.
- Coverage threshold: 80% overall, 90% for utilities and core components.

**CI/CD**
- Workflows are defined in `.github/workflows/`; `ci.yml` runs lint, format, and tests.
- Deployments to staging/prod use separate Firebase/Vercel projects with environment gating.
- Secrets are stored in GitHub Actions; never checked into source.

### III. Data & State Management

**Firestore Schema**
- Tasks live in the `tasks` collection with a prescribed shape (see `src/firebase/` types).
- Collection references and converters must be typed to avoid runtime errors.
- Any schema change requires a migration script and updated security rules.

**Client State**
- React Context is used sparingly; prefer `useSWR` or React Query for remote data.
- Authentication state is provided by the Firebase context and exposed via `useUser`.
- Local UI state (modals, toasts) should use custom hooks in `hooks/`.

### IV. Evolution & Maintenance

**Feature Rhythm**
- New features begin with a specification in `specs/` and a corresponding task list.
- Small, incremental PRs are preferred; large refactors are broken into phases.
- Deprecation of components or patterns is announced via ADR and maintained for one major version.

**Documentation**
- README.md covers setup and high‑level architecture.
- `docs/MASTER_PROMPT.md` holds AI-related blueprint information.
- All configuration changes update the relevant section in the constitution or docs.

**Versioning & Releases**
- The project uses semantic versioning in `package.json`.
- Releases are tagged and accompanied by changelog entries.
- Hotfixes follow the same process but target the patch stream.

### V. Governance & Collaboration

**Code Reviews**
- Every PR requires at least one approval from a core maintainer.
- Reviews should focus on correctness, readability, and compliance with this constitution.

**Onboarding**
- New contributors read this constitution and the README as part of their onboarding.
- Pair programming is encouraged for complex features.

**Security & Privacy**
- Authentication tokens and API keys must never leave the secure vault.
- User data in Firestore is subject to privacy guidelines; PII must not be stored.
- Regular dependency audits and GitHub security alerts are monitored.

---

This document may be amended as the project evolves; check the repository history for the latest version.

### VI. Code Quality Requirements

All code MUST meet the following quality standards:

**Python Standards**
- Python 3.12+ required (3.13+ preferred per hackathon spec)
- Type hints on ALL functions, methods, and class attributes
- No `Any` types except when truly unavoidable (document why)
- Docstrings required for all classes, functions, and modules
- PEP 8 style guide strictly enforced (via Ruff or Black)

**Dependency Management**
- UV for package and environment management
- All dependencies pinned to specific versions in pyproject.toml
- No development dependencies in production
- Regular security audits of dependencies

**Code Organization**
- DRY principle: No code duplication; extract shared logic
- Single Responsibility: Each module/class has one purpose
- Maximum function length: 50 lines (prefer < 25)
- Maximum file length: 300 lines (prefer < 200)
- Maximum cyclomatic complexity: 10 per function

**Naming Conventions**
- snake_case for functions, variables, modules
- PascalCase for classes and type aliases
- SCREAMING_SNAKE_CASE for constants
- Descriptive names; no single-letter variables except iterators

### VII. Error Handling

Robust error handling ensures application resilience:

**Error Principles**
- Agents handle errors gracefully with clear, actionable messages
- Failed operations MUST NOT crash the application
- All errors are logged with full context (traceback, input data, timestamp)
- User-facing errors are friendly and suggest next steps

**Error Types**
- `ValidationError`: Invalid input data (return 400)
- `NotFoundError`: Resource not found (return 404)
- `AuthorizationError`: Permission denied (return 403)
- `ConflictError`: State conflict (return 409)
- `InternalError`: Unexpected errors (return 500, log full details)

**Error Propagation**
- Skills raise typed exceptions; agents catch and transform
- Agents return Result types (success or error) to orchestrator
- Orchestrator transforms errors to user-appropriate messages
- All errors include correlation ID for debugging

**Logging Requirements**
- Structured logging (JSON format in production)
- Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
- Include context: user_id, task_id, agent_name, timestamp
- Sensitive data (passwords, tokens) MUST NOT be logged

### VIII. Spec-Driven Development

All development follows the Spec-Driven Development (SDD) workflow:

**Specification First**
- Every feature starts with a specification document
- Specs live in `specs/<feature-name>/spec.md`
- No implementation without approved specification
- Spec includes user stories, acceptance criteria, and requirements

**Agent Documentation**
- Every agent has a documented purpose and interface
- Agent contracts defined before implementation
- Interface changes require spec update and approval

**Skill Documentation**
- Every skill has usage examples in docstrings
- Skill contracts include input/output schemas
- Skills reference their spec section

**Implementation Fidelity**
- Implementation follows the plan exactly
- Deviations require spec amendment and approval
- Code comments reference spec sections (e.g., `# Ref: spec.md §3.2`)
- PRs include spec compliance checklist

## Phase Evolution Roadmap

| Phase | Primary Goal | Key Technologies | Storage | Interface |
|-------|-------------|------------------|---------|-----------|
| I | Basic CRUD | Python 3.13+, UV, Click/Typer | In-memory (dict) | Console CLI |
| II | Web Platform | FastAPI, Next.js 16+, SQLModel | Neon PostgreSQL | Web UI |
| III | AI Chatbot | OpenAI Agents SDK, MCP SDK, ChatKit | PostgreSQL + Conversations | Chat UI |
| IV | Containerization | Docker, Minikube, Helm, kubectl-ai | PostgreSQL | K8s Deployed |
| V | Cloud Native | Kafka, Dapr, AKS/GKE, GitHub Actions | PostgreSQL + Events | Cloud Deployed |

## Technology Stack Standards

### Required Technologies
- **Language**: Python 3.12+ (3.13+ preferred)
- **Package Manager**: UV (not pip)
- **Type Checking**: mypy with strict mode
- **Linting**: Ruff
- **Formatting**: Black or Ruff format
- **Testing**: pytest with coverage

### Phase-Specific Technologies
- **Phase I**: Click or Typer for CLI
- **Phase II**: FastAPI (backend), Next.js 16+ (frontend), SQLModel (ORM), Neon (DB), Better Auth (auth)
- **Phase III**: OpenAI Agents SDK, MCP Python SDK, OpenAI ChatKit
- **Phase IV**: Docker, Minikube, Helm, Gordon, kubectl-ai, Kagent
- **Phase V**: Apache Kafka (or Redpanda), Dapr, Strimzi, AKS/GKE/OKE

## Project Structure

```
hackathon-todo/
├── .specify/                 # Spec-Kit configuration and templates
│   ├── memory/              # Project memory (constitution, etc.)
│   └── templates/           # Document templates
├── specs/                    # Feature specifications
│   ├── phase-1-console/
│   ├── phase-2-web/
│   ├── phase-3-chatbot/
│   ├── phase-4-k8s/
│   └── phase-5-cloud/
├── src/                      # Phase I: Source code
│   ├── agents/              # Agent implementations
│   ├── skills/              # Reusable skill modules
│   ├── models/              # Domain models (Pydantic)
│   └── cli/                 # CLI interface
├── backend/                  # Phase II+: FastAPI backend
│   ├── src/
│   │   ├── agents/
│   │   ├── skills/
│   │   ├── models/
│   │   ├── api/
│   │   └── mcp/            # Phase III: MCP tools
│   └── tests/
├── frontend/                 # Phase II+: Next.js frontend
│   ├── src/
│   └── tests/
├── k8s/                      # Phase IV+: Kubernetes manifests
│   ├── helm/
│   └── dapr/
├── tests/                    # Shared test utilities
├── history/                  # PHR and ADR records
│   ├── prompts/
│   └── adr/
├── CLAUDE.md                 # Claude Code instructions
└── README.md                 # Project documentation
```

## Governance

### Constitution Authority
- This constitution supersedes all other practices and preferences
- Constitution violations block PR merges
- All agents (Claude, Copilot, Gemini) MUST read and follow this document

### Amendment Process
1. Propose amendment via spec document
2. Document rationale and impact analysis
3. Obtain stakeholder approval
4. Update constitution with new version number
5. Update affected templates and documentation
6. Create ADR for significant architectural changes

### Versioning Policy
- **MAJOR**: Backward-incompatible principle removals or redefinitions
- **MINOR**: New principle/section added or materially expanded guidance
- **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements

### Compliance Review
- All PRs MUST verify constitution compliance
- Complexity MUST be justified against simplicity principle
- Deviations require explicit exception documentation
- Weekly review of constitution adherence in active development

### Hierarchy of Authority
When conflicts arise: **Constitution > Specify > Plan > Tasks**

**Version**: 1.0.0 | **Ratified**: 2025-12-26 | **Last Amended**: 2025-12-26
