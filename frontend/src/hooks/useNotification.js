import React from "react";
import { useNotification } from "@web3uikit/core";

function useNotificationHook({
  notifyType,
  notifyMessage,
  notifyTitle,
  icon,
  position,
}) {
  const dispatch = useNotification();

  const handleNewNotification = () => {
    dispatch({
      type: notifyType,
      message: notifyMessage,
      title: notifyTitle,
      icon: icon || "info",
      position: position || "topR",
    });
  };
  return handleNewNotification;
}

export default useNotificationHook;
