import { redirect } from "next/navigation";

export default function EngineeringPipelineRedirect() {
  redirect("/engineering?tab=pipeline");
}
