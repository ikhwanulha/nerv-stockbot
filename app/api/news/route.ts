// API Berita - Menyediakan berita pasar modal Indonesia dengan sentimen
import { NextRequest, NextResponse } from "next/server";
import { NewsItem } from "@/types";

const dummyNews: NewsItem[] = [
  {
    id: "1",
    title: "IHSG Ditutup Menguat, Investor Asing Catatkan Net Buy Rp 1,2 Triliun",
    summary: "Indeks Harga Saham Gabungan (IHSG) ditutup menguat 0,85% pada perdagangan hari ini. Investor asing mencatatkan net buy sebesar Rp 1,2 triliun, terutama di sektor perbankan dan teknologi.",
    content: "Indeks Harga Saham Gabungan (IHSG) berhasil ditutup di zona hijau pada perdagangan hari ini, menguat 0,85% ke level 7.245. Penguatan ini didorong oleh aksi beli investor asing yang mencatatkan net buy sebesar Rp 1,2 triliun.\n\nSektor perbankan menjadi primadona dengan penguatan saham BBCA (+1,2%), BBRI (+0,8%), dan BMRI (+1,5%). Sementara itu, sektor teknologi juga turut mendorong indeks dengan GOTO yang naik 2,1%.\n\nAnalis memperkirakan IHSG masih berpotensi melanjutkan penguatan dalam jangka pendek, didukung oleh sentimen positif dari data ekonomi domestik dan aliran dana asing yang masih deras masuk ke pasar modal Indonesia.\n\nDisclaimer: Berita ini bersifat informatif, bukan rekomendasi investasi.",
    source: "NERV News",
    url: "#",
    sentiment: "positive",
    relatedStocks: ["BBCA", "BBRI", "BMRI", "GOTO"],
    publishedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Bank Indonesia Tahan Suku Bunga di 6,25%, Pasar Bereaksi Positif",
    summary: "BI memutuskan untuk mempertahankan suku bunga acuan di level 6,25% sesuai ekspektasi pasar. Keputusan ini diambil untuk menjaga stabilitas nilai tukar rupiah.",
    content: "Bank Indonesia (BI) dalam Rapat Dewan Gubernur terbaru memutuskan untuk mempertahankan suku bunga acuan BI-Rate di level 6,25%. Keputusan ini sesuai dengan ekspektasi pasar dan diambil untuk menjaga stabilitas nilai tukar rupiah di tengah ketidakpastian global.\n\nGubernur BI menyatakan bahwa keputusan ini juga didasarkan pada proyeksi inflasi yang masih terkendali dan pertumbuhan ekonomi yang stabil. Pasar merespons positif keputusan ini, terlihat dari penguatan IHSG dan rupiah.\n\nKe depannya, BI akan terus memantau perkembangan ekonomi global dan domestik untuk menentukan arah kebijakan moneter yang tepat.",
    source: "NERV News",
    url: "#",
    sentiment: "positive",
    relatedStocks: ["BBCA", "BBRI", "BMRI", "BBNI"],
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    title: "BBRI Catatkan Laba Bersih Rp 45 Triliun, Dividen Yield Menarik",
    summary: "PT Bank Rakyat Indonesia Tbk (BBRI) membukukan laba bersih Rp 45 triliun sepanjang tahun buku 2023. Dividen yield yang ditawarkan mencapai 6,5%.",
    content: "PT Bank Rakyat Indonesia Tbk (BBRI) mengumumkan kinerja keuangan yang solid sepanjang tahun buku 2023 dengan membukukan laba bersih sebesar Rp 45 triliun. Angka ini menunjukkan pertumbuhan yang positif dibandingkan tahun sebelumnya.\n\nYang menarik, BBRI menawarkan dividen yield yang cukup atraktif yaitu sebesar 6,5%, menjadikannya salah satu saham dengan dividen tertinggi di sektor perbankan.\n\nAnalis merekomendasikan akumulasi saham BBRI dengan target harga jangka panjang mengingat fundamental perusahaan yang kuat dan potensi pertumbuhan di segmen mikro yang menjadi niche bisnis BBRI.",
    source: "NERV News",
    url: "#",
    sentiment: "positive",
    relatedStocks: ["BBRI"],
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "4",
    title: "TLKM Hadapi Tekanan, Pendapatan Data Menurun",
    summary: "PT Telkom Indonesia Tbk (TLKM) mengalami tekanan pada harga sahamnya setelah laporan pendapatan data menunjukkan penurunan. Harga saham TLKM turun 2,3%.",
    content: "PT Telkom Indonesia Tbk (TLKM) mengalami tekanan jual pada perdagangan hari ini setelah laporan menunjukkan penurunan pendapatan dari segmen data. Harga saham TLKM ditutup turun 2,3%.\n\nPenurunan ini dipicu oleh persaingan ketat di industri telekomunikasi dan penurunan ARPU (Average Revenue Per User) akibat perang tarif antar operator.\n\nMeskipun demikian, fundamental TLKM masih tergolong kuat dengan posisi kas yang solid dan jaringan infrastruktur yang luas. Beberapa analis melihat penurunan ini sebagai peluang akumulasi bagi investor jangka panjang.",
    source: "NERV News",
    url: "#",
    sentiment: "negative",
    relatedStocks: ["TLKM", "EXCL", "ISAT"],
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: "5",
    title: "ADRO dan BYAN Tertekan, Harga Batu Bara Global Turun",
    summary: "Harga saham emiten batu bara seperti ADRO dan BYAN tertekan akibat penurunan harga komoditas batu bara global. ADRO turun 3,1% dan BYAN turun 2,8%.",
    content: "Saham-saham emiten batu bara mengalami tekanan signifikan pada perdagangan hari ini. ADRO ditutup turun 3,1% sementara BYAN turun 2,8%. Pelemahan ini sejalan dengan penurunan harga batu bara global yang disebabkan oleh melemahnya permintaan dari China dan India.\n\nMeskipun demikian, secara fundamental emiten batu bara Indonesia masih mencatatkan kinerja yang solid dengan laba bersih yang tinggi. Namun, volatilitas harga komoditas tetap menjadi risiko utama bagi sektor ini.\n\nAnalis menyarankan investor untuk mencermati perkembangan harga komoditas global dan kebijakan energi di negara-negara tujuan ekspor sebelum mengambil keputusan investasi.",
    source: "NERV News",
    url: "#",
    sentiment: "negative",
    relatedStocks: ["ADRO", "BYAN", "PTBA", "ITMG"],
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "6",
    title: "GOTO Umumkan Strategi Baru Menuju Profitabilitas",
    summary: "PT GoTo Gojek Tokopedia Tbk (GOTO) mengumumkan strategi baru untuk mencapai profitabilitas pada akhir tahun fiskal. Saham GOTO merespons positif.",
    content: "PT GoTo Gojek Tokopedia Tbk (GOTO) mengumumkan strategi baru yang bertujuan untuk mencapai profitabilitas pada akhir tahun fiskal 2024. Strategi ini mencakup efisiensi biaya operasional dan optimalisasi pendapatan dari ekosistem yang terintegrasi.\n\nManajemen GOTO optimis dengan target ini mengingat perbaikan unit ekonomi yang terus menunjukkan tren positif dalam beberapa kuartal terakhir.\n\nPasar merespons positif pengumuman ini dengan harga saham GOTO yang naik 2,1%. Beberapa analis memberikan rekomendasi beli dengan target harga yang lebih tinggi.",
    source: "NERV News",
    url: "#",
    sentiment: "positive",
    relatedStocks: ["GOTO"],
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: "7",
    title: "Pemerintah Umumkan Insentif Pajak untuk Sektor Properti",
    summary: "Pemerintah mengumumkan insentif pajak baru untuk sektor properti, mendorong penguatan saham-saham properti seperti PWON, CTRA, dan BSDE.",
    content: "Pemerintah melalui Kementerian Keuangan mengumumkan paket insentif pajak baru untuk sektor properti. Insentif ini mencakup pembebasan PPN untuk rumah dengan harga di bawah Rp 2 miliar dan kemudahan perizinan.\n\nPengumuman ini mendorong penguatan saham-saham properti. PWON naik 3,5%, CTRA naik 2,8%, dan BSDE naik 2,2%. Sektor properti menjadi salah satu sektor dengan performa terbaik hari ini.\n\nInsentif ini diharapkan dapat mendorong pertumbuhan sektor properti yang selama ini tertekan oleh tingginya suku bunga.",
    source: "NERV News",
    url: "#",
    sentiment: "positive",
    relatedStocks: ["PWON", "CTRA", "BSDE", "LPKR"],
    publishedAt: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: "8",
    title: "Nilai Tukar Rupiah Melemah ke Rp 16.200 per USD",
    summary: "Rupiah melemah ke level Rp 16.200 per dolar AS dipengaruhi oleh penguatan dolar AS dan ketidakpastian global. Saham-saham impor tertekan.",
    content: "Nilai tukar rupiah terhadap dolar AS melemah ke level Rp 16.200 per USD, terendah dalam beberapa bulan terakhir. Pelemahan ini dipicu oleh penguatan indeks dolar AS dan meningkatnya ketidakpastian global terkait kebijakan suku bunga The Fed.\n\nPelemahan rupiah ini memberikan tekanan pada saham-saham yang memiliki utang dalam dolar AS dan perusahaan yang bergantung pada impor. Namun, saham-saham eksportir seperti emiten batu bara dan CPO justru diuntungkan.\n\nBI terus melakukan intervensi di pasar untuk menstabilkan nilai tukar rupiah.",
    source: "NERV News",
    url: "#",
    sentiment: "negative",
    relatedStocks: ["ADRO", "ITMG", "UNVR", "HMSP"],
    publishedAt: new Date(Date.now() - 25200000).toISOString(),
  },
  {
    id: "9",
    title: "ASII Berencana Spin Off Bisnis Alat Berat",
    summary: "PT Astra International Tbk (ASII) berencana melakukan spin off bisnis alat berat untuk meningkatkan nilai pemegang saham. Saham ASII naik tipis.",
    content: "PT Astra International Tbk (ASII) mengumumkan rencana untuk melakukan spin off pada divisi alat beratnya. Langkah ini diambil untuk meningkatkan fokus bisnis dan nilai pemegang saham.\n\nSpin off ini akan menjadikan United Tractors (UNTR) sebagai entitas yang lebih mandiri dengan potensi pertumbuhan yang lebih tinggi. ASII sendiri akan tetap menjadi pemegang saham utama.\n\nPasar merespons positif rencana ini dengan harga saham ASII yang naik tipis 0,5%. Analis melihat langkah ini sebagai katalis positif jangka panjang bagi ASII.",
    source: "NERV News",
    url: "#",
    sentiment: "neutral",
    relatedStocks: ["ASII", "UNTR"],
    publishedAt: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: "10",
    title: "IPO BREN dan MBMA Menjadi Sentimen Positif Pasar",
    summary: "Initial Public Offering (IPO) BREN dan MBMA yang oversubscribed menjadi sentimen positif bagi pasar modal Indonesia. Investor antusias menyambut emiten baru.",
    content: "Pasar modal Indonesia mencatatkan kesuksesan dengan IPO BREN (Barito Renewables Energy) dan MBMA (Merdeka Battery Materials) yang oversubscribed. Kedua emiten baru ini mendapat sambutan hangat dari investor.\n\nBREN yang bergerak di sektor energi terbarukan mencatatkan kelebihan permintaan hingga 5 kali lipat, sementara MBMA yang bergerak di sektor baterai kendaraan listrik oversubscribed 3 kali lipat.\n\nKesuksesan ini menunjukkan minat investor yang tinggi terhadap sektor energi baru terbarukan dan kendaraan listrik di Indonesia.",
    source: "NERV News",
    url: "#",
    sentiment: "positive",
    relatedStocks: ["BREN", "MBMA"],
    publishedAt: new Date(Date.now() - 32400000).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const sentiment = searchParams.get("sentiment");
  const stock = searchParams.get("stock");
  const limit = parseInt(searchParams.get("limit") || "10");

  let filtered = [...dummyNews];

  // Filter by sentiment
  if (sentiment && sentiment !== "all") {
    filtered = filtered.filter((n) => n.sentiment === sentiment);
  }

  // Filter by related stock
  if (stock) {
    const stockUpper = stock.toUpperCase();
    filtered = filtered.filter((n) =>
      n.relatedStocks.some((s) => s === stockUpper)
    );
  }

  // Limit
  filtered = filtered.slice(0, limit);

  // Sort by date (newest first)
  filtered.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return NextResponse.json(filtered);
}
