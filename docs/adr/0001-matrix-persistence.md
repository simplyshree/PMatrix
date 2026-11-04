# ADR 0001: Matrix design persistence and recovery

- Status: Accepted for the current prototype
- Date: 2026-11-04
- Issue: #5

## Context

PMatrix designs currently live in browser storage. That is useful for a single-user prototype, but it does not provide multi-device access, collaboration, ownership, or a durable scientific record.

The product also needs a safe way to recover work while the long-term persistence boundary is still being decided.

## Decision

Keep browser storage as the short-term local persistence layer, but store a versioned envelope:

```json
{
  "version": 1,
  "designs": []
}
```

The store must:

- migrate the current legacy raw-array format when it is encountered;
- reject malformed or unsupported data without silently replacing it;
- expose a recoverable error state to the UI;
- listen for cross-tab `storage` updates;
- support versioned JSON export/import for individual designs.

The export format is:

```json
{
  "format": "podi-matrix-design",
  "version": 1,
  "design": {}
}
```

## Options considered

1. **Hosted database now** — best for collaboration and multi-device access, but requires authentication, ownership rules, deployment configuration, and a migration path before the product workflow is stable.
2. **File-only workflow** — easy to make portable, but weak for discovery and collaboration.
3. **Browser storage plus versioned export/import** — lowest-risk prototype step and preserves a clear migration boundary. This is the selected option.

## Follow-up

When the Flavor Studio and Library workflows are stable, revisit hosted persistence with explicit decisions for authentication, ownership, sharing, deletion, migrations, and audit history. No backend or authentication is introduced by this ADR.
