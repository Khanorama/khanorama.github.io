"use client";

import { useEffect, useState } from "react";
import { firestoreModule, loadFirestore } from "@/lib/firebase/client";
import { useAuth } from "@/lib/auth/AuthProvider";

export type OrganizerStatus = "checking" | "yes" | "no";

/**
 * Whether this account may read the roster.
 *
 * Answered by looking for a document at admins/{uid}, which only somebody
 * with console access to the Firebase project can create. The rules let an
 * account read its own row and nobody else's, so a student checking this
 * gets a plain "does not exist" rather than a permission error, and the
 * collection cannot be enumerated to find out who the organizers are.
 *
 * This is a convenience, not a gate. It decides whether to render the page,
 * and rendering is not what protects anything: the rules refuse the
 * underlying read to everyone else regardless of what the UI does. Treat a
 * "yes" here as "show the roster", never as "this data is safe to hand out".
 */
export function useIsOrganizer(): OrganizerStatus {
  const { status, user } = useAuth();
  const [organizer, setOrganizer] = useState<OrganizerStatus>("checking");

  useEffect(() => {
    if (status === "loading") {
      setOrganizer("checking");
      return;
    }
    if (status !== "signedIn" || !user) {
      setOrganizer("no");
      return;
    }

    let canceled = false;

    (async () => {
      try {
        const [{ doc, getDoc }, db] = await Promise.all([
          firestoreModule(),
          loadFirestore(),
        ]);
        const snapshot = await getDoc(doc(db, "admins", user.uid));
        if (!canceled) setOrganizer(snapshot.exists() ? "yes" : "no");
      } catch {
        // Offline, unconfigured, or refused. Every one of those means the
        // roster cannot be shown, and none of them is worth an error message
        // on a page the person was not looking for.
        if (!canceled) setOrganizer("no");
      }
    })();

    return () => {
      canceled = true;
    };
  }, [status, user]);

  return organizer;
}
