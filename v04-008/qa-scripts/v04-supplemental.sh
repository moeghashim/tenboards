#!/bin/zsh
source_name=$1
base_url=$2
group=$3
if [ "$group" = 0 ]; then finished=graphite; else finished=iris; fi
while [ ! -f "screenshots/v04-008/$source_name/$finished/report.json" ]; do sleep 5; done
route_list=$(node --experimental-strip-types --input-type=module -e "import {captureRoutes} from './scripts/screenshot-routes.ts';process.stdout.write(captureRoutes.filter((_,i)=>i%2===$group).map(r=>r.route).join(','))")
extra=()
if [ "$group" = 0 ]; then extra+=(--boundaries); fi
if [ "$source_name" = workers ]; then extra+=(--reload); fi
npm run screenshots -- --base-url "$base_url" --routes "$route_list" --output "screenshots/v04-008/interactions-$source_name-$group" --reference 2026-10-23T12:00:00.000Z --mask-live-clocks --interactions "${extra[@]}" > "screenshots/v04-008/interactions-$source_name-$group.log" 2>&1
