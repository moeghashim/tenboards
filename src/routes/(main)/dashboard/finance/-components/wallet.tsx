import { siBarclays, siBitcoin, siEthereum, siHsbc, siRevolut } from "simple-icons";

import { DashboardCard as Card, SectionHeader } from "@/components/blocks";
import { SimpleIcon } from "@/components/simple-icon";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useDashboardData } from "./data-context";

export function Wallet() {
  const walletCards = useDashboardData().walletWalletCards.map((row, index) => ({
    ...row,
    ...[{ iconColor: "fill-foreground" }, { iconColor: "fill-foreground" }, { iconColor: "fill-foreground" }][index],
    icon: { siRevolut, siHsbc, siBarclays }[row.icon as "siRevolut" | "siHsbc" | "siBarclays"],
  }));
  const cryptoAssets = useDashboardData().walletCryptoAssets.map((row) => ({
    ...row,
    icon: { siBitcoin, siEthereum }[row.icon as "siBitcoin" | "siEthereum"],
  }));

  return (
    <Card className="h-full">
      <SectionHeader title="Wallet" />
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {walletCards.map((card) => (
            <div key={card.id} className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-foreground text-sm leading-none font-medium">
                    {card.bank} • **** {card.last4}
                  </span>
                </div>
                <span className="text-muted-foreground text-sm font-normal tabular-nums">{card.balance}</span>
              </div>
              <div className="bg-background flex size-9 shrink-0 items-center justify-center rounded-md border">
                <SimpleIcon icon={card.icon} />
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          {cryptoAssets.map((asset) => (
            <div key={asset.id} className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-foreground text-sm leading-none font-medium">
                    {asset.name} • {asset.vault}
                  </span>
                </div>
                <span className="text-muted-foreground text-sm font-normal tabular-nums">
                  {asset.balance} • {asset.usdValue}
                </span>
              </div>
              <div className="bg-background flex size-9 shrink-0 items-center justify-center rounded-md border">
                <SimpleIcon icon={asset.icon} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground text-xs font-medium">
              Physical Vault: <span className="text-foreground">Ledger Nano X</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="bg-success size-1.5 rounded-full" />
            <span className="text-success text-xs font-medium">Air-Gapped</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
