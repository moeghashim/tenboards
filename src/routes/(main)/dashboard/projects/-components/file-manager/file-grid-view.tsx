import { Star, UsersRound } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { type FileManagerFile, fileIcons, fileKindLabels } from "./data";

export function FileGridView({ files }: { files: FileManagerFile[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {files.map((file) => {
        const FileIcon = fileIcons[file.kind];
        return (
          <Card key={file.id} size="sm" className="group/file">
            <CardContent>
              <div className="bg-muted relative flex h-24 items-center justify-center rounded-lg">
                <FileIcon className="text-muted-foreground size-8" aria-hidden="true" />
                <span className="text-warning absolute top-2 right-2">
                  {file.starred && <Star className="size-4 fill-current" role="img" aria-label="Starred" />}
                </span>
                <div className="text-muted-foreground absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 text-xs">
                  <span>{fileKindLabels[file.kind]}</span>
                  <span>{file.size}</span>
                </div>
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle className="min-w-0 [overflow-wrap:anywhere] break-words">{file.name}</CardTitle>
              <CardDescription className="flex min-w-0 flex-col gap-1 text-xs">
                <span className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarFallback>{file.ownerInitials}</AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1 break-words">{file.owner}</span>
                  {file.shared && <UsersRound className="size-4 shrink-0" role="img" aria-label="Shared" />}
                </span>
                <span>Modified {file.modifiedAt}</span>
              </CardDescription>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
