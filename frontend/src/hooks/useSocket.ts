import { useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../lib/socket";
import { getStoredUser } from "./useAuth";
import type { ToastData } from "../components/ui/Toast";

export function useSocket(onAlertTriggered?: (data: ToastData) => void) {
  const queryClient = useQueryClient();

  const handlePricesUpdated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["stocks"] });
    queryClient.invalidateQueries({ queryKey: ["prices"] });
  }, [queryClient]);

  const handleAlertTriggered = useCallback(
    (data: ToastData) => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      onAlertTriggered?.(data);
    },
    [queryClient, onAlertTriggered],
  );

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket.id);

      const user = getStoredUser();
      if (user?.id) {
        socket.emit("join:user", user.id);
      }
    });

    socket.on("prices:updated", handlePricesUpdated);
    socket.on("alert:triggered", handleAlertTriggered);

    return () => {
      socket.off("connect");
      socket.off("prices:updated", handlePricesUpdated);
      socket.off("alert:triggered", handleAlertTriggered);
      socket.disconnect();
    };
  }, [handlePricesUpdated, handleAlertTriggered]);
}