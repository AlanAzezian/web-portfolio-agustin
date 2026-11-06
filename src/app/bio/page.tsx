import BioContactView, {
  type InitialBioData,
} from "@/components/BioContactView";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bio & Contacto | Agustín Fabrizio",
};

export default async function Bio() {
  let initialBioData: InitialBioData | null = null;

  try {
    const { data, error } = await supabase
      .from("bio")
      .select("*")
      .eq("id", "main")
      .maybeSingle();

    if (!error && data) {
      initialBioData = data as InitialBioData;
    }
  } catch {
    initialBioData = null;
  }

  return (
    <main>
      <BioContactView initialBioData={initialBioData} />
    </main>
  );
}
