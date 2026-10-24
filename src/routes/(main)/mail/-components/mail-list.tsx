import { cn } from "cn";
import { differenceInDays } from "date-fns/differenceInDays";
import { format } from "date-fns/format";
import { formatDistance } from "date-fns/formatDistance";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { Mail } from "./data";
import { useMail, useMailData } from "./use-mail";

type MailGroup = {
  id: string;
  title: string;
  items: Mail[];
};

interface MailListProps {
  groups: MailGroup[];
  onSelectMail?: (mail: Mail) => void;
}

export function MailList({ groups, onSelectMail }: MailListProps) {
  const [mail, setMail] = useMail();
  const { renderedAt } = useMailData();

  return (
    <ScrollArea className="**:data-[slot=scroll-area-viewport]:scroll-fade min-h-0 flex-1">
      <div className="flex flex-col gap-1.5 pt-0">
        {groups.map((group) => (
          <section key={group.id} className="flex flex-col gap-1.5">
            <div className="text-muted-foreground mx-3 pt-2 text-xs font-medium">
              {group.title} ({group.items.length})
            </div>

            <div className="flex flex-col">
              {group.items.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={cn(
                    "group border-border relative w-full border-b p-3 text-left transition-colors",
                    "hover:bg-muted",
                    mail.selected === item.id && "bg-muted",
                  )}
                  aria-pressed={mail.selected === item.id}
                  data-mail-id={item.id}
                  onClick={() => {
                    setMail({
                      ...mail,
                      selected: item.id,
                    });
                    onSelectMail?.(item);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="size-9 after:rounded-sm">
                      <AvatarFallback className="bg-background rounded-sm">{item.from.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div
                            className={cn(
                              "flex flex-wrap items-center gap-2 text-sm font-normal",
                              !item.isRead && "font-medium",
                            )}
                          >
                            {item.from.name}
                            {!item.isRead && <span className="text-primary text-xs">Unread</span>}
                          </div>
                          <div
                            className={cn(
                              "text-foreground truncate text-sm font-medium",
                              item.isRead && "text-muted-foreground font-normal",
                            )}
                          >
                            {item.subject}
                          </div>
                        </div>

                        <div
                          className={cn(
                            "text-muted-foreground shrink-0 text-xs",
                            mail.selected === item.id && "text-foreground",
                          )}
                        >
                          {formatMailDate(item.receivedAt, renderedAt)}
                        </div>
                      </div>

                      <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-5">{item.body}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </ScrollArea>
  );
}

function formatMailDate(date: string, renderedAt: string) {
  const mailDate = new Date(date);

  if (differenceInDays(new Date(renderedAt), mailDate) <= 3) {
    return formatDistance(mailDate, new Date(renderedAt), { addSuffix: true });
  }

  return format(mailDate, "d MMM yyyy");
}
