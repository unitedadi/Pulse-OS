# Pulse OS Project Memory

Last reviewed: 2026-06-15 15:25 +04

## Purpose

Pulse OS is a DarDoc operational dashboard for Pulse-style service workflows. It is a Next.js app used for internal/partner operations where clarity, speed, and low-friction task completion matter more than marketing presentation.

## Business Context

- Pulse OS supports operational visibility and execution for DarDoc service workflows.
- Repeated WhatsApp/CX requests should become product workflows where practical.
- This repo is part of the Mac mini Codex automation lane after Doctor Dashboard.

## Technical Shape

- Framework: Next.js + React.
- Auth: Clerk in normal usage.
- Local UI review should use a repo-specific skip-auth mode when available. If not available yet, add one before relying on screenshots.
- Default branch: `main`.
- Remote: `https://github.com/unitedadi/Pulse-OS.git`.

## Commands

- Install: `npm install`
- Dev: `npm run dev -- --hostname 0.0.0.0 --port 3002`
- Build: `npm run build`
- Lint: `npm run lint`

## Verification Rules

- Run `npm run build` after code changes.
- For UI changes, run the app, produce a targeted screenshot of the changed state, and attach it to Linear.
- Do not push/deploy/modify production data unless approved.

## Automation Rules

- Read this file before starting every task in this repo.
- Update Task History after completed code/debug/artifact/ops tasks.
- Add durable business or technical discoveries to the relevant section above.

## Task History

### 2026-06-15 15:25 +04 - Mac mini onboarding

- Source: Aditya requested adding Pulse OS to the Mac mini Codex runner.
- Added baseline project memory and runner configuration.
- Follow-up: verify build/dev behavior and add skip-auth UI review mode if missing.
