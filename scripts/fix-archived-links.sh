#!/bin/bash

# Fix broken file:/// links in archived documentation after reorganization

echo "🔧 Fixing broken links in archived documentation..."
echo ""

# Files that need their links updated
ARCHIVE_FILES=(
  "archive/agent-reports/AGENT6_GUEST_MODE_DOCUMENTATION_REPORT.md"
  "archive/agent-reports/AGENT6_TYPE_REFACTOR_REPORT.md"
  "archive/agent-reports/AGENT7_STATE_MANAGEMENT_COMPLETION.md"
  "archive/agent-reports/AGENT_A6_STANDARDS_CHECK_REPORT.md"
  "archive/execution-logs/DEPLOYMENT_STATUS.md"
  "archive/execution-logs/SERVER_COMPONENT_MIGRATION_REPORT.md"
  "archive/execution-logs/STATE_MANAGEMENT_REPORT.md"
  "archive/task-boards/CODE_REVIEW_AUDIT.md"
)

# Link replacements (old path -> new path)
declare -A link_updates
link_updates["file:///home/cjnf/Serene-Mind-App/docs/GUEST_MODE.md"]="file:///home/cjnf/Serene-Mind-App/docs/features/GUEST_MODE.md"
link_updates["file:///home/cjnf/Serene-Mind-App/docs/GUEST_MODE_FAQ.md"]="file:///home/cjnf/Serene-Mind-App/docs/features/GUEST_MODE_FAQ.md"
link_updates["file:///home/cjnf/Serene-Mind-App/src/lib/TYPES_GUIDE.md"]="file:///home/cjnf/Serene-Mind-App/docs/architecture/TYPES_GUIDE.md"
link_updates["file:///home/cjnf/Serene-Mind-App/DATABASE_SETUP.md"]="file:///home/cjnf/Serene-Mind-App/docs/architecture/DATABASE_SETUP.md"
link_updates["file:///home/cjnf/Serene-Mind-App/NEXT_STEPS.md"]="file:///home/cjnf/Serene-Mind-App/archive/execution-logs/NEXT_STEPS.md"
link_updates["file:///home/cjnf/Serene-Mind-App/PRODUCTION_IMPROVEMENTS.md"]="file:///home/cjnf/Serene-Mind-App/archive/task-boards/PRODUCTION_IMPROVEMENTS.md"
link_updates["file:///home/cjnf/Serene-Mind-App/PROJECT_EXECUTION.md"]="file:///home/cjnf/Serene-Mind-App/archive/task-boards/PROJECT_EXECUTION.md"
link_updates["file:///home/cjnf/Serene-Mind-App/STATE_MANAGEMENT_REPORT.md"]="file:///home/cjnf/Serene-Mind-App/archive/execution-logs/STATE_MANAGEMENT_REPORT.md"
link_updates["file:///home/cjnf/Serene-Mind-App/GUEST_MODE_IMPLEMENTATION.md"]="file:///home/cjnf/Serene-Mind-App/archive/task-boards/GUEST_MODE_IMPLEMENTATION.md"
link_updates["file:///home/cjnf/Serene-Mind-App/AGENT6_TYPE_REFACTOR_REPORT.md"]="file:///home/cjnf/Serene-Mind-App/archive/agent-reports/AGENT6_TYPE_REFACTOR_REPORT.md"
link_updates["file:///home/cjnf/Serene-Mind-App/AGENT_A3_FEATURE_TEST_REPORT.md"]="file:///home/cjnf/Serene-Mind-App/archive/agent-reports/AGENT_A3_FEATURE_TEST_REPORT.md"
link_updates["file:///home/cjnf/Serene-Mind-App/AGENT_A4_BUILD_VERIFICATION_REPORT.md"]="file:///home/cjnf/Serene-Mind-App/archive/agent-reports/AGENT_A4_BUILD_VERIFICATION_REPORT.md"
link_updates["file:///home/cjnf/Serene-Mind-App/AGENT_A6_STANDARDS_CHECK_REPORT.md"]="file:///home/cjnf/Serene-Mind-App/archive/agent-reports/AGENT_A6_STANDARDS_CHECK_REPORT.md"

total_files=0
total_replacements=0

for file in "${ARCHIVE_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "⚠️  Skipping $file (not found)"
    continue
  fi
  
  file_changes=0
  ((total_files++))
  
  for old_link in "${!link_updates[@]}"; do
    new_link="${link_updates[$old_link]}"
    
    if grep -q "$old_link" "$file"; then
      sed -i "s|$old_link|$new_link|g" "$file"
      count=$(grep -c "$new_link" "$file" || true)
      ((file_changes += count))
      ((total_replacements += count))
    fi
  done
  
  if [ $file_changes -gt 0 ]; then
    echo "✅ Updated $file_changes link(s) in $(basename $file)"
  fi
done

echo ""
echo "📊 Summary:"
echo "   Files processed: $total_files"
echo "   Total links fixed: $total_replacements"
echo ""
echo "✅ Link update complete!"
