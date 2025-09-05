# GitHub Configuration

## Workflows Status

**Status:** ⏸️ DISABLED (Temporarily)

### Disabled Workflows
The workflows have been temporarily disabled by renaming the folder from `workflows/` to `workflows-disabled/`.

**Disabled workflows:**
- `ci.yml` - CI/CD pipeline for testing across Node.js versions
- `deploy-pages.yml` - GitHub Pages deployment workflow
- `static.yml` - Static content deployment to Pages

### To Re-enable Workflows
When ready to re-enable GitHub Actions:
```bash
mv workflows-disabled workflows
```

This will restore all workflow files and re-enable automated CI/CD and deployment.

---

*Workflows disabled on September 5, 2025*
