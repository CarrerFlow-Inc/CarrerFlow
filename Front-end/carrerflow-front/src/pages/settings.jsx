import React from "react";
import Card from "../components/ui/card";

export default function Settings() {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-4">Configurações</h2>
      <Card>
  <div className="type-caption">Configurações do usuário e preferências aparecerão aqui.</div>
      </Card>
    </div>
  );
}
