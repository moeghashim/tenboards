import { ArrowLeft, ArrowRight, Star } from "lucide-react";

import { DashboardCard as Card } from "@/components/blocks";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useEcommerce } from "./ecommerce-context";

export function CustomerReviews() {
  const { customerInitials, review, summary } = useEcommerce();
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-foreground text-sm font-medium">Reviews</CardTitle>
        <CardDescription className="text-foreground text-xl leading-none tracking-tight tabular-nums">
          {`${summary.reviewAverage} average rating`}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2">
              <div className="text-foreground flex gap-0.5">
                {[1, 2, 3, 4, 5]
                  .filter((star) => star <= review.rating)
                  .map((star) => (
                    <Star key={star} className="size-3.5 fill-current" />
                  ))}
              </div>
              <div>
                <div className="text-sm font-medium">{review.author}</div>
                <p className="text-muted-foreground mt-2 line-clamp-3 min-h-[4.5em] text-sm">{review.body}</p>
              </div>
            </div>

            <div className="flex gap-1">
              <Button aria-label="Previous review" size="icon-xs" variant="outline">
                <ArrowLeft />
              </Button>
              <Button aria-label="Next review" size="icon-xs" variant="outline">
                <ArrowRight />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3">
          <div className="min-w-0">
            <div className="text-sm font-medium">{`${summary.reviewCount / 1000}K reviews`}</div>
            <div className="text-muted-foreground line-clamp-2 min-h-[3em] text-xs">Customers reviewed this month</div>
          </div>

          <AvatarGroup>
            {customerInitials.map((initials) => (
              <Avatar key={initials}>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            ))}

            <AvatarGroupCount>{`+${summary.reviewExtra}`}</AvatarGroupCount>
          </AvatarGroup>
        </div>
      </CardContent>
    </Card>
  );
}
