# 📁 Projects Directory

This directory contains all projects managed by TRUE agents.

## Structure

```
projects/
├── _index.json              # Global catalog
├── _templates/              # Metadata templates
├── archived/                # Completed projects
├── templates/               # Project templates
│   ├── web-app/
│   ├── data-analysis/
│   └── refactor/
└── {project-id}/           # Active projects
    ├── project.json         # Project metadata
    ├── README.md            # Project overview
    ├── context/             # Domain knowledge, constraints
    ├── personas/            # Project-specific personas
    ├── plans/               # Implementation plans
    ├── sessions/            # Execution sessions
    └── results/             # Deliverables
```

## Naming Convention

Projects use `{category}-{name}-{YYMMDD}` format:

- `web-ecommerce-250102` - Web application project
- `data-pipeline-250102` - Data analysis project
- `refactor-auth-250102` - Refactoring project

## Creating a New Project

```bash
# Using template
cp -r templates/web-app new-project-250102

# Or manually
mkdir new-project-250102/{context,personas,plans,sessions,results}
```

## See Also

- `../master.md` - Complete system reference
- `_templates/` - Metadata templates
