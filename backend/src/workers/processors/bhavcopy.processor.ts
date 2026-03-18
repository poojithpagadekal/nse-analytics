import axios from "axios";
import { parse } from "csv-parse";
import { Readable } from "stream";
import { prisma } from "../../config/prisma";

export type BhavcopyJobData = {
  date: string;
  url?: string;
};

const constructBhavcopyUrl = (date: string): string => {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `https://nsearchives.nseindia.com/content/cm/BhavCopy_NSE_CM_0_0_0_${yyyy}${mm}${dd}_F_0000.csv.zip`;
};

const processRow = async (
  row: Record<string, string | undefined>,
  date: Date,
) => {
  if (row["SctySrs"]?.trim() !== "EQ") return;

  const symbol = row["TckrSymb"]?.trim();
  if (!symbol) return;

  await prisma.stock.upsert({
    where: { symbol },
    update: {},
    create: { symbol, name: symbol },
  });

  const stock = await prisma.stock.findUnique({ where: { symbol } });
  if (!stock) return;

  await prisma.dailyPrice.upsert({
    where: { stockId_date: { stockId: stock.id, date } },
    update: {
      open: parseFloat(row["OpnPric"] ?? "0"),
      high: parseFloat(row["HghPric"] ?? "0"),
      low: parseFloat(row["LwPric"] ?? "0"),
      close: parseFloat(row["ClsPric"] ?? "0"),
      volume: BigInt(row["TtlTradgVol"] ?? "0"),
    },
    create: {
      stockId: stock.id,
      date,
      open: parseFloat(row["OpnPric"] ?? "0"),
      high: parseFloat(row["HghPric"] ?? "0"),
      low: parseFloat(row["LwPric"] ?? "0"),
      close: parseFloat(row["ClsPric"] ?? "0"),
      volume: BigInt(row["TtlTradgVol"] ?? "0"),
    },
  });
};

export const processBhavcopyJob = async (data: BhavcopyJobData) => {
  const url = data.url ?? constructBhavcopyUrl(data.date);
  const date = new Date(data.date);

  console.log(`Processing Bhavcopy for ${data.date}`);
  console.log("Downloading from:", url);

  const response = await axios.get(url, {
    responseType: "arraybuffer",
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const AdmZip = require("adm-zip");
  const zip = new AdmZip(Buffer.from(response.data));
  const csvEntry = zip
    .getEntries()
    .find((e: any) => e.entryName.endsWith(".csv"));
  if (!csvEntry) throw new Error("No CSV found in ZIP");
  const csvContent = csvEntry.getData().toString("utf8");

  await new Promise<void>((resolve, reject) => {
    const parser = Readable.from(csvContent).pipe(
      parse({ columns: true, trim: true, skip_empty_lines: true }),
    );

    parser.on("data", async (row) => {
      parser.pause();
      try {
        await processRow(row, date);
      } catch (err) {
        console.error("Row processing error:", err);
      } finally {
        parser.resume();
      }
    });

    parser.on("end", resolve);
    parser.on("error", reject);
  });

  console.log(`Bhavcopy processed for ${data.date}`);
};
