import { redirect } from "next/navigation";

export default function Home() {
  redirect("/games");
  return null;
}
