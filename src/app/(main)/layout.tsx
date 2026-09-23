import { Shell } from "@/components/layout/shell";
import { RwaProvider } from "@/providers/rwa-provider";
import { Web3Provider } from "@/providers/web3-provider";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <Web3Provider>
      <RwaProvider>
        <Shell>{children}</Shell>
      </RwaProvider>
    </Web3Provider>
  );
}
