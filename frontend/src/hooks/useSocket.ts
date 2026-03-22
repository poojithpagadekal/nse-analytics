import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../lib/socket";

export function useSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.connect();

    const onConnect = () => console.log("[Socket] Connected:", socket.id);
    const onPricesUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      queryClient.invalidateQueries({ queryKey: ["prices"] });
    };

    socket.on("connect", onConnect);
    socket.on("prices:updated", onPricesUpdated);

    return () => {
      socket.off("connect", onConnect);
      socket.off("prices:updated", onPricesUpdated);
      socket.disconnect();
    };
  }, [queryClient]);
}
