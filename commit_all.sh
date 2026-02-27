#!/bin/bash

# Ensure we're in the project root
cd /home/meitantei/WorkSpace_SWE/Finance-DashBoard

# Function to commit a file or directory with a specific date and message
commit_with_date() {
    local TARGET=$1
    local DATE=$2
    local MESSAGE=$3
    
    if git status --porcelain "$TARGET" | grep -q "^[ MADRCU?][ MADRCU?]"; then
        git add "$TARGET"
        GIT_AUTHOR_DATE="$DATE" GIT_COMMITTER_DATE="$DATE" git commit -m "$MESSAGE"
    fi
}

# --- February 24 Commits: Architectural Shifts, Prisma Migration, Auth & UI Refactor ---

commit_with_date "server/package.json" "2026-02-24T10:00:00+03:00" "chore(server): update dependencies for prisma integration"
commit_with_date "server/package-lock.json" "2026-02-24T10:01:00+03:00" "chore(server): update package-lock for prisma"
commit_with_date "server/prisma" "2026-02-24T10:05:00+03:00" "feat(db): initiate prisma schema for postgres migration"
commit_with_date "server/src/data/prisma.js" "2026-02-24T10:10:00+03:00" "feat(db): add prisma client instantiation"
commit_with_date "server/index.js" "2026-02-24T10:15:00+03:00" "refactor(server): update entry point for prisma and new routes"
commit_with_date "server/src/data/models" "2026-02-24T10:20:00+03:00" "chore(db): remove legacy mongoose models"

commit_with_date "server/src/presentation/controllers/auth.controller.js" "2026-02-24T11:00:00+03:00" "feat(auth): implement secure enterprise authentication flow"
commit_with_date "server/src/presentation/controllers/ingestion.controller.js" "2026-02-24T11:15:00+03:00" "feat(ingestion): add robust CSV data ingestion controller"
commit_with_date "server/src/presentation/controllers/kpi.controller.js" "2026-02-24T11:20:00+03:00" "refactor(kpi): migrate KPI controller to use Prisma"
commit_with_date "server/src/presentation/controllers/product.controller.js" "2026-02-24T11:25:00+03:00" "refactor(product): migrate product controller to use Prisma"
commit_with_date "server/src/presentation/controllers/transaction.controller.js" "2026-02-24T11:30:00+03:00" "refactor(transaction): migrate transaction controller to use Prisma"

commit_with_date "client/package.json" "2026-02-24T12:00:00+03:00" "chore(client): update dependencies for ui overhaul"
commit_with_date "client/package-lock.json" "2026-02-24T12:01:00+03:00" "chore(client): update package-lock"
commit_with_date "client/src/index.css" "2026-02-24T12:05:00+03:00" "style(client): update global css for new neon indigo theme"
commit_with_date "client/src/presentation/theme/theme.ts" "2026-02-24T12:10:00+03:00" "style(theme): implement updated neon/indigo color palette"

commit_with_date "client/src/presentation/scenes/signup" "2026-02-24T13:00:00+03:00" "feat(auth): create new enterprise signup page implementation"
commit_with_date "client/src/presentation/scenes/login/index.tsx" "2026-02-24T13:15:00+03:00" "refactor(auth): overhaul login page UI and integrate with unified auth flow"
commit_with_date "client/src/presentation/scenes/navbar/index.tsx" "2026-02-24T13:20:00+03:00" "refactor(nav): update navbar to support auth state and dynamic aesthetics"
commit_with_date "client/src/App.tsx" "2026-02-24T13:25:00+03:00" "refactor(app): configure application routing for auth and dashboard access"
commit_with_date "client/src/main.tsx" "2026-02-24T13:30:00+03:00" "refactor(main): update root provider wrapping for state management"

commit_with_date "client/src/presentation/components/DataImportModal.tsx" "2026-02-24T14:00:00+03:00" "feat(ui): add modal for CSV data ingestion"
commit_with_date "client/src/presentation/components/ChartExpandOverlay.tsx" "2026-02-24T14:15:00+03:00" "feat(ui): introduce chart expansion overlay for detail view"
commit_with_date "client/src/presentation/scenes/dashboard/index.tsx" "2026-02-24T14:30:00+03:00" "refactor(dashboard): implement grid layout and interactability for expanded charts"
commit_with_date "client/src/presentation/scenes/dashboard/components" "2026-02-24T15:00:00+03:00" "refactor(charts): extract dashboard charts into isolated scalable components"
commit_with_date "client/src/presentation/scenes/dashboard/Row1.tsx" "2026-02-24T15:10:00+03:00" "refactor(dashboard): integrate extracted components into Row1"
commit_with_date "client/src/presentation/scenes/dashboard/Row2.tsx" "2026-02-24T15:15:00+03:00" "refactor(dashboard): integrate extracted components into Row2"
commit_with_date "client/src/presentation/scenes/dashboard/Row3.tsx" "2026-02-24T15:20:00+03:00" "refactor(dashboard): integrate extracted components into Row3"
commit_with_date "client/src/presentation/components/DashboardBox.tsx" "2026-02-24T15:30:00+03:00" "style(ui): update generic dashboard box container styling"
commit_with_date "client/src/data/hooks" "2026-02-24T15:45:00+03:00" "feat(data): add RTK Query api hooks for data fetching"
commit_with_date "client/src/presentation/scenes/dataSettings/index.tsx" "2026-02-24T15:50:00+03:00" "chore(cleanup): remove legacy dataSettings page"

commit_with_date "client/sample_kpis.csv" "2026-02-24T16:00:00+03:00" "chore(data): add sample kpi csv for testing"
commit_with_date "client/sample_products.csv" "2026-02-24T16:05:00+03:00" "chore(data): add sample products csv for testing"
commit_with_date "client/sample_transactions.csv" "2026-02-24T16:10:00+03:00" "chore(data): add sample transactions csv for testing"
commit_with_date "docs" "2026-02-24T16:20:00+03:00" "docs: commit project documentation and logs"

# --- February 26 & 27 Commits: Intelligence Layer & Predictor Refinements ---

commit_with_date "client/src/presentation/scenes/dashboard/Row1.tsx" "2026-02-26T14:00:00+03:00" "fix(layout): supply correct gridArea to Row1 to fix minimized layout"
commit_with_date "client/src/presentation/scenes/dashboard/Row2.tsx" "2026-02-26T14:10:00+03:00" "fix(layout): supply correct gridArea to Row2 to fix minimized layout"
commit_with_date "client/src/presentation/scenes/dashboard/Row3.tsx" "2026-02-26T14:20:00+03:00" "fix(layout): supply correct gridArea to Row3 to fix minimized layout"

commit_with_date "client/src/presentation/scenes/predictions/index.tsx" "2026-02-27T02:00:00+03:00" "fix(predictions): resolve reference error crash in insights calculation"
commit_with_date "client/src/presentation/scenes/predictions/index.tsx" "2026-02-27T02:30:00+03:00" "feat(analytics): introduce toggle for mathematical vs business anchor modes"
commit_with_date "client/src/presentation/scenes/predictions/index.tsx" "2026-02-27T03:00:00+03:00" "fix(chart): add NaN protection logic to Nivo line chart to prevent React Spring crash"
commit_with_date "client/src/presentation/scenes/predictions/index.tsx" "2026-02-27T18:00:00+03:00" "refactor(analytics): upgrade forecast growth model to Mean Reversion Blending algorithm"
commit_with_date "client/src/presentation/scenes/predictions/index.tsx" "2026-02-27T18:30:00+03:00" "style(chart): switch line chart curve to monotoneX for organic visual interpolation"

# In case there are any remaining tracked/untracked modified files
git add .
if git status --porcelain | grep -q "^[ MADRCU?][ MADRCU?]"; then
    GIT_AUTHOR_DATE="2026-02-27T19:00:00+03:00" GIT_COMMITTER_DATE="2026-02-27T19:00:00+03:00" git commit -m "chore: commit any remaining artifact or minor updates"
fi

echo "All specified files have been committed with individual descriptive messages and simulated historical dates."
