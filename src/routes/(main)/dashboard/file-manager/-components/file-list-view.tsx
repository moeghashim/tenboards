import { useState } from "react";

import { cn } from "cn";
import { Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { type FileManagerFile, fileIcons } from "./data";
import { FileActions } from "./file-actions";

export function FileListView({ files, readOnly = false }: { files: FileManagerFile[]; readOnly?: boolean }) {
  const [listFiles, setListFiles] = useState(files);
  const toggleStar = (fileId: string) =>
    setListFiles((current) => current.map((file) => (file.id === fileId ? { ...file, starred: !file.starred } : file)));

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
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(readOnly ? files : listFiles).map((file) => {
            const FileIcon = fileIcons[file.kind];
            return (
              <TableRow key={file.id}>
                <TableCell className="pl-0">
                  <div className="flex min-w-0 items-center gap-3">
                    <FileIcon className="text-muted-foreground size-5 shrink-0" />
                    {readOnly ? (
                      <span className="w-64 [overflow-wrap:anywhere] break-words whitespace-normal">{file.name}</span>
                    ) : (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto w-64 justify-start px-0 text-left whitespace-normal"
                      >
                        <span className="[overflow-wrap:anywhere] break-words">{file.name}</span>
                      </Button>
                    )}
                    {file.shared && <Badge variant="outline">{readOnly ? "Shared sample" : "Shared"}</Badge>}
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
                    {readOnly ? (
                      <span className="text-muted-foreground text-xs">
                        {file.starred ? "Starred sample" : "Not starred"}
                      </span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-pressed={file.starred}
                        aria-label={file.starred ? `Unstar ${file.name}` : `Star ${file.name}`}
                        onClick={() => toggleStar(file.id)}
                      >
                        <Star className={cn(file.starred && "fill-current")} />
                      </Button>
                    )}
                    {!readOnly && <FileActions file={file} onToggleStar={() => toggleStar(file.id)} />}
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
