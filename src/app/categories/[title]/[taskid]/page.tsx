'use client'

import AppTemplate from "@/templates/app-template";

export default function Page({ params }: { params: {taskid: string}}) {
  return (
    <AppTemplate>
      <h1>Page this {params.taskid}</h1>
    </AppTemplate>
  );
}