import axios from "axios";
import { google } from "googleapis";
import { executeSQLQuery } from "../../database";

// Helpers env
const hasZoomEnv =
  !!process.env.ZOOM_ACCOUNT_ID &&
  !!process.env.ZOOM_CLIENT_ID &&
  !!process.env.ZOOM_CLIENT_SECRET;

// ===== ZOOM =====




async function getZoomAccessToken(): Promise<string> {
  const { ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env;
  if (!ZOOM_ACCOUNT_ID || !ZOOM_CLIENT_ID || !ZOOM_CLIENT_SECRET) {
    throw new Error("Zoom env manquant (ZOOM_ACCOUNT_ID / ZOOM_CLIENT_ID / ZOOM_CLIENT_SECRET)");
  }

  const tokenUrl = "https://zoom.us/oauth/token";
  const body = new URLSearchParams({ grant_type: "account_credentials", account_id: ZOOM_ACCOUNT_ID.trim() });

  try {
    const { data } = await axios.post(tokenUrl, body.toString(), {
      auth: { username: ZOOM_CLIENT_ID, password: ZOOM_CLIENT_SECRET },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 10000,
    });
    return data.access_token as string;
  } catch (err: any) {
    console.error("[Zoom Token] Failed", { status: err?.response?.status, details: err?.response?.data });
    throw new Error(`Zoom token error ${err?.response?.status ?? ""}`);
  }
}

async function getZoomUserByEmail(token: string, email: string) {
  try {
    const { data } = await axios.get(
      `https://api.zoom.us/v2/users/${encodeURIComponent(email)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data; // { id, email, ... }
  } catch (err: any) {
    console.error("[Zoom User] Failed", { status: err?.response?.status, details: err?.response?.data });
    throw new Error("Zoom host introuvable (email invalide ou pas dans ton compte)");
  }
}

export async function createZoomMeeting(topic: string) {
  const token = await getZoomAccessToken();

  // ⚠️ ne JAMAIS logguer le token en clair
  const hostEmail = process.env.ZOOM_HOST_EMAIL;
  if (!hostEmail) throw new Error("ZOOM_HOST_EMAIL manquant");

  const host = await getZoomUserByEmail(token, hostEmail); // nécessite user:read:admin

  const body = {
    topic,
    type: 1, // instant meeting
    settings: {
      waiting_room: false,
      join_before_host: true,
      approval_type: 2,
    },
  };


  try {
    // const { data } = await axios.post(
    //   `https://api.zoom.us/v2/users/${encodeURIComponent(host.id || host.email)}/meetings`,
    //   body,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //     },
    //     timeout: 10000,
    //   }
    // );
    const { data } = await axios.post(
        `https://api.zoom.us/v2/users/${encodeURIComponent(hostEmail)}/meetings`,
        body,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
    const id = String(data.id);
    const password = data.password || "";
    const joinUrl = `https://zoom.us/wc/${id}/join?pwd=${encodeURIComponent(password)}`;
    return { id, password, joinUrl };
  } catch (err: any) {
    console.error("[Zoom Create Meeting] Failed", { status: err?.response?.status, details: err?.response?.data });
    throw new Error(`Zoom create meeting error ${err?.response?.status ?? ""}`);
  }
}

// ===== DB helpers =====
async function getBackupLinksFromDB(room: string) {
  const r = await executeSQLQuery(
    "SELECT meet_url, zoom_meeting_number, zoom_pwd, created_at FROM live_backup_links WHERE room=$1",
    [room]
  );
  return r.rows?.[0] || null;
}

async function saveBackupLinksToDB(
  room: string,
  meetUrl: string | null,
  zoomNumber: string | null,
  zoomPwd: string | null
) {
  await executeSQLQuery(
    `INSERT INTO live_backup_links (room, meet_url, zoom_meeting_number, zoom_pwd)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (room) DO UPDATE SET
       meet_url=EXCLUDED.meet_url,
       zoom_meeting_number=EXCLUDED.zoom_meeting_number,
       zoom_pwd=EXCLUDED.zoom_pwd`,
    [room, meetUrl, zoomNumber, zoomPwd]
  );
}

// ===== Service principal =====
export async function getOrCreateBackupLinks(room: string) {
  if (!room) throw new Error("room requis");

  // 1) existe déjà ?
  const existing = await getBackupLinksFromDB(room);

  if (existing) {
    return {
      meetUrl: existing.meet_url || null,
      zoomMeetingNumber: existing.zoom_meeting_number || null,
      zoomPwd: existing.zoom_pwd || null,
      createdAt: existing.created_at,
    };
  }

  // 2) créer dynamiquement (Zoom d’abord, Meet si possible)
  let meetUrl: string | null = null;
  let zoomMeetingNumber: string | null = null;
  let zoomPwd: string | null = null;
 
  // Zoom (recommandé, fiable)
  if (hasZoomEnv) {
    const zoom = await createZoomMeeting(`Backup for ${room}`);

    zoomMeetingNumber = zoom.id;
    zoomPwd = zoom.password;
  }



  await saveBackupLinksToDB(room, meetUrl, zoomMeetingNumber, zoomPwd);

  return {
    meetUrl,
    zoomMeetingNumber,
    zoomPwd,
    createdAt: new Date().toISOString(),
  };
}
