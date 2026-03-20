import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../lib/socket";

export function useSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket.id);
    });

    socket.on("prices:updated", () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      queryClient.invalidateQueries({ queryKey: ["prices"] });
    });

    return () => {
      socket.off("prices:updated");
      socket.disconnect();
    };
  }, [queryClient]);
}
