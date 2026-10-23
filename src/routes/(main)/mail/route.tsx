import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { SidebarProvider } from "@/components/ui/sidebar";
import { getValueFromCookie } from "@/server/server-actions";

import { MailComponent } from "./-components/mail";
import { DEFAULT_MAIL_LAYOUT, MAIL_LAYOUT_COOKIE } from "./-components/mail-layout-config";
import { MailSidebar } from "./-components/mail-sidebar";
import { MailProvider } from "./-components/use-mail";

const loadData = createServerFn({ method: "GET" }).handler(async () => {
  const { requestReference } = await import("@/server/request-reference.server");
  const { readMail } = await import("@/server/data/mail");
  return readMail({ renderedAt: requestReference() });
});

export const Route = createFileRoute("/(main)/mail")({
  loader: async () => {
    const [layoutCookie, data] = await Promise.all([getValueFromCookie(MAIL_LAYOUT_COOKIE), loadData()]);

    return {
      data,
      defaultLayout: layoutCookie ? JSON.parse(layoutCookie) : [...DEFAULT_MAIL_LAYOUT],
    };
  },
  component: Page,
});

function Page() {
  const { defaultLayout, data } = Route.useLoaderData();
  const mails = data.mails;

  return (
    <MailProvider data={data}>
      <div className="relative h-full">
        <SidebarProvider className="h-full min-h-0">
          <MailSidebar />
          <div className="size-full min-w-0">
            <div className="h-dvh min-h-0 overflow-hidden">
              <MailComponent mails={mails} defaultLayout={defaultLayout} />
            </div>
          </div>
        </SidebarProvider>
      </div>
    </MailProvider>
  );
}
