import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingCart } from "@/components/ui/FloatingCart";
import { ProductGrid } from "@/app/product/ProductGrid";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 300;

async function getProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, category, description, price, unit, stock_kg")
    .eq("is_active", true)
    .order("sort_order");
  return data || [];
}

export default async function ProductPage() {
  const products = await getProducts();

  const proteinCount = products.filter(
    (p) => p.category === "protein_series",
  ).length;
  const soilCount = products.filter((p) => p.category === "soil_series").length;

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        {/* ── Hero ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-gold-50 border border-gold-200 text-gold-700 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                Produk hasil biokonversi BSF
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-stone-900 mb-4 tracking-tight leading-tight">
                Dari limbah organik
                <br />
                <span className="text-gold-500">menjadi produk bernilai</span>
              </h1>
              <p className="text-stone-500 leading-relaxed mb-4">
                Setiap produk ESALOKA adalah hasil transformasi nyata — limbah
                organik HoReCa diubah menjadi protein hewani dan nutrisi tanah
                berkualitas tinggi.
              </p>
              <p className="text-sm text-stone-400">
                Satuan 1 kg/pack · Pengiriman dikonfirmasi via WhatsApp
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3 shrink-0">
              <div className="bg-gold-50 border border-gold-200 rounded-2xl px-5 py-4 text-center">
                <p className="text-2xl font-bold text-gold-600">
                  {proteinCount}
                </p>
                <p className="text-xs text-stone-400 mt-0.5">Protein Series</p>
              </div>
              <div className="bg-sage-50 border border-sage-200 rounded-2xl px-5 py-4 text-center">
                <p className="text-2xl font-bold text-sage-600">{soilCount}</p>
                <p className="text-xs text-stone-400 mt-0.5">Soil Series</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Product grid with filter ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <ProductGrid products={products} />
        </section>

        {/* ── Bulk CTA ── */}
        <section className="bg-stone-50 border-y border-stone-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold text-stone-800 mb-2">
                  Butuh dalam jumlah besar?
                </h3>
                <p className="text-stone-500 text-sm max-w-md leading-relaxed">
                  Tersedia pembelian bulk untuk peternak, distributor, dan
                  pelaku pertanian. Hubungi kami untuk harga khusus dan
                  pengiriman terjadwal.
                </p>
              </div>
              <Link
                href="/get-in-touch"
                className="btn-primary flex items-center gap-2 shrink-0"
              >
                Hubungi kami <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>

      {/* ── Floating cart — hanya di /product ── */}
      <FloatingCart />
    </>
  );
}
