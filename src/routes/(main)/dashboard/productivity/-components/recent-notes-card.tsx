import { BookOpen, FileText } from "lucide-react";

import { DashboardCard as Card, SectionHeader } from "@/components/blocks";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

import { useDashboardData } from "./data-context";

const noteIcons = { FileText, BookOpen };
export function RecentNotesCard() {
  const recentNotes = useDashboardData().notes.map((note) => ({
    ...note,
    date: note.dateLabel,
    icon: noteIcons[note.icon as keyof typeof noteIcons],
  }));
  return (
    <Card>
      <SectionHeader
        title="Recent Notes"
        actions={
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            View all
          </Button>
        }
      />
      <CardContent className="flex flex-col gap-4">
        {recentNotes.map((note) => (
          <div key={note.title} className="flex items-start gap-3">
            <note.icon className="text-muted-foreground size-4 shrink-0" />
            <div className="min-w-0">
              <div className="text-sm leading-snug font-medium">{note.title}</div>
              <div className="text-muted-foreground text-xs">{note.date}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
