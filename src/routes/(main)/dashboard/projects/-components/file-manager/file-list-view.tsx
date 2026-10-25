import { Star, UsersRound } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { type FileManagerFile, fileIcons } from "./data";

export function FileListView({ files }: { files: FileManagerFile[] }) {
  return (
    <div className="bg-card min-w-0 rounded-xl border p-3">
      <Table className="min-w-180">
        <TableHeader>
          <TableRow>
            <TableHead className="pl-0">Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="w-20">
              <span className="sr-only">Starred</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => {
            const FileIcon = fileIcons[file.kind];
            return (
              <TableRow key={file.id}>
                <TableCell className="pl-0">
                  <div className="flex min-w-0 items-center gap-3">
                    <FileIcon className="text-muted-foreground size-5 shrink-0" />
                    <span className="w-64 [overflow-wrap:anywhere] break-words whitespace-normal">{file.name}</span>
                    {file.shared && (
                      <UsersRound className="text-muted-foreground size-4" role="img" aria-label="Shared" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarFallback>{file.ownerInitials}</AvatarFallback>
                    </Avatar>
                    <span>{file.owner}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{file.modifiedAt}</TableCell>
                <TableCell className="text-muted-foreground">{file.size}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end">
                    <span className="text-warning">
                      {file.starred && <Star className="size-4 fill-current" role="img" aria-label="Starred" />}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
