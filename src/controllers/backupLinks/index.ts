import { getOrCreateBackupLinks } from "../../services/backupLinks";

export const getBackupLinkController = async (req: any, res: any) => {
  try {
    const roomId = String(req.query.roomId || req.body.roomId || "").trim();
    if (!roomId) return res.status(400).json({ error: "roomId requis" });

    const links = await getOrCreateBackupLinks(roomId);
    return res.json(links);
  } catch (e: any) {
    console.error("[getBackupLinkController] error:", e?.message || e);
    return res.status(500).json({ error: "Erreur création liens de secours" });
  }
};