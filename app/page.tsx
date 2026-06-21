// Landing page - redirect ke dashboard atau login
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
