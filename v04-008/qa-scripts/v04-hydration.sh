#!/bin/zsh
zone=$1
label=${zone:t}
while [ ! -f screenshots/v04-008/before/graphite/report.json ] || [ ! -f screenshots/v04-008/before/iris/report.json ]; do sleep 5; done
for source_name in dev workers db; do
 case $source_name in dev) base_url=http://127.0.0.1:3005;; workers) base_url=https://9d63aeb5-tenboards.mohanadgh.workers.dev;; db) base_url=http://127.0.0.1:3001;; esac
 npm run screenshots -- --base-url "$base_url" --routes /dashboard/calendar,/dashboard/invoice,/dashboard/finance,/dashboard/finance-v1,/dashboard/productivity,/dashboard/patient-monitoring,/auth/v2/login,/auth/v2/register --output "screenshots/v04-008/hydration-$source_name-$label" --reference 2026-10-23T12:00:00.000Z --mask-live-clocks --reload --hydration-delay-ms 1500 --timezone "$zone" > "screenshots/v04-008/hydration-$source_name-$label.log" 2>&1
done
