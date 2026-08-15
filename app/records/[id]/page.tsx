import { notFound } from "next/navigation";
import { records, getRecord } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { RecordDetail } from "@/components/record-detail";

export function generateStaticParams() {
  return records.map((record) => ({ id: String(record.id) }));
}

export default async function RecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = getRecord(id);
  if (!record) notFound();
  const related = records.filter((r) => r.species === record.species && r.id !== record.id).slice(0, 5);
  return <div className="site atlas"><SiteHeader /><RecordDetail record={record} related={related} /><footer className="site-footer"><span>Eliason Family Fish Records</span><span>For bragging rights only · Since 1976</span></footer></div>;
}
