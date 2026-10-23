import {
  Banknote,
  ChevronRight,
  Droplet,
  History,
  Lightbulb,
  MoreHorizontal,
  QrCode,
  SendHorizontal,
  Smartphone,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

import { DashboardCard as Card, SectionHeader } from "../../-components/dashboard/cards";

const contacts = [
  { id: 1, initials: "AR" },
  { id: 2, initials: "SC" },
  { id: 3, initials: "MJ" },
  { id: 4, initials: "ED" },
];

const shortcuts = [
  { id: 1, label: "Scan QR", icon: QrCode },
  { id: 2, label: "Transfer", icon: SendHorizontal },
  { id: 3, label: "Pay Bills", icon: Banknote },
  { id: 4, label: "History", icon: History },
  { id: 5, label: "Mobile", icon: Smartphone },
  { id: 6, label: "Electricity", icon: Lightbulb },
  { id: 7, label: "Water", icon: Droplet },
  { id: 8, label: "More", icon: MoreHorizontal },
];

export function QuickActions() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <SectionHeader
          title="Quick Transfer"
          actions={
            <div className="flex items-center gap-1">
              <div className="flex -space-x-2">
                {contacts.map((contact) => (
                  <Avatar key={contact.id} className="border-background size-7 border-2">
                    <AvatarFallback className="text-[10px]">{contact.initials}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <ChevronRight className="size-4" />
            </div>
          }
        />
        <CardContent>
          <Field orientation="horizontal">
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput aria-label="Transfer amount in USD" inputMode="decimal" placeholder="0.00" />
              <InputGroupAddon align="inline-end">
                <InputGroupText>USD</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <Button>Send</Button>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <SectionHeader title="Shortcuts" />
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {shortcuts.map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <div key={shortcut.id} className="flex flex-col items-center gap-2.5">
                  <Button aria-label={shortcut.label} variant="outline" className="size-10 rounded-md">
                    <Icon className="size-5" />
                  </Button>
                  <span className="text-muted-foreground text-center text-xs">{shortcut.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
