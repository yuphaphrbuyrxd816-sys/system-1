import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Route: Sync Google Sheet server-side to prevent CORS issues 100%
  app.get("/api/sync-sheet", async (req, res) => {
    try {
      const { url, appscript } = req.query;

      // 1. If user provided an Apps Script Web App URL, try fetching from Apps Script first
      if (appscript && typeof appscript === 'string' && appscript.trim().length > 0) {
        try {
          console.log(`[Server] Fetching from Apps Script GET: ${appscript}`);
          const response = await fetch(appscript.trim(), { redirect: 'follow' });
          if (response.ok) {
            const textOrJson = await response.text();
            if (textOrJson && textOrJson.length > 5) {
              res.json({ data: textOrJson, source: 'appscript' });
              return;
            }
          }
          console.warn(`[Server] Apps Script GET returned non-ok or empty response, attempting Google Sheets CSV fallback...`);
        } catch (err) {
          console.warn('[Server] Apps Script GET error, attempting Google Sheets CSV fallback:', err);
        }
      }

      // Default URL fallback to target sheet if url is missing or empty
      const targetUrl = (url && typeof url === 'string' && url.trim().length > 0)
        ? url.trim()
        : 'https://docs.google.com/spreadsheets/d/1ZWvV2QBmnNzzrIyzUK-x6FkU6TtXhfmtRLzelzuO_NA/edit?usp=sharing';

      // Extract sheet ID
      const sheetIdMatch = targetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!sheetIdMatch || !sheetIdMatch[1]) {
        res.status(400).json({ error: 'ไม่พบ ID ของ Google Sheets ในลิงก์ที่ระบุ' });
        return;
      }
      const sheetId = sheetIdMatch[1];

      // Extract GID (default to 0 if not present)
      const gidMatch = targetUrl.match(/[?&]gid=([0-9]+)/);
      const gid = gidMatch ? gidMatch[1] : '0';

      // Primary CSV export URL
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
      const pubCsvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/pub?output=csv&gid=${gid}`;
      
      console.log(`[Server] Fetching Google Sheet: ${csvUrl}`);
      
      let csvText = '';
      try {
        const response = await fetch(csvUrl, {
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });

        if (response.ok) {
          csvText = await response.text();
        } else {
          throw new Error(`Primary export returned status ${response.status}`);
        }
      } catch (err) {
        console.warn('[Server] Primary export failed, trying pub CSV URL fallback:', err);
        const pubResponse = await fetch(pubCsvUrl, {
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        if (!pubResponse.ok) {
          throw new Error(`Google Sheets export returned status ${pubResponse.status}`);
        }
        csvText = await pubResponse.text();
      }

      res.json({ csv: csvText, source: 'google_sheets_csv' });
    } catch (err: any) {
      console.error('[Server] Google Sheets fetch error:', err);
      res.status(500).json({ error: err.message || 'Failed to fetch spreadsheet data' });
    }
  });

  // API Route: Save data to Google Sheets via Google Apps Script Web App
  app.post("/api/appscript-save", async (req, res) => {
    try {
      const { appScriptUrl, students, action } = req.body;
      
      if (!appScriptUrl || typeof appScriptUrl !== 'string') {
        res.status(400).json({ error: 'กรุณาระบุ Web App URL ของ Google Apps Script' });
        return;
      }

      console.log(`[Server] Posting data to Google Apps Script Web App: ${appScriptUrl}`);
      
      const payload = {
        action: action || 'sync_all',
        students: students || [],
        timestamp: new Date().toISOString()
      };

      const response = await fetch(appScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload),
        redirect: 'follow'
      });

      const text = await response.text();
      let responseJson: any = {};
      try {
        responseJson = JSON.parse(text);
      } catch {
        responseJson = { rawResponse: text };
      }

      if (!response.ok) {
        res.status(response.status).json({ error: 'Google Apps Script ตอบกลับด้วยสถานะข้อผิดพลาด', details: responseJson });
        return;
      }

      res.json({ success: true, response: responseJson });
    } catch (err: any) {
      console.error('[Server] AppsScript Save Error:', err);
      res.status(500).json({ error: err.message || 'ไม่สามารถบันทึกข้อมูลไปยัง Google Apps Script ได้' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
