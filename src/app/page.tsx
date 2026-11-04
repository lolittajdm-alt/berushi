import { HomePage } from "@/components/HomePage";
import { OrderFlowProvider } from "@/context/OrderFlowContext";

export default function Home() {
  return (
    <OrderFlowProvider>
      <HomePage />
    </OrderFlowProvider>
  );
}
